import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MenuItemPayload {
  id: string;
  name: string;
  description?: string;
  options: Array<{ id: string; label: string; price: number; available?: boolean }>;
  available?: boolean;
}

function buildMenuContext(items: MenuItemPayload[]): string {
  return items
    .filter(i => i.available !== false)
    .map(item => {
      const opts = item.options
        .filter(o => o.available !== false)
        .map(o => `  - optionId:${o.id} "${o.label}" $${o.price}`)
        .join('\n');
      return `itemId:${item.id} "${item.name}"${item.description ? ` — ${item.description}` : ''}\n${opts}`;
    })
    .join('\n\n');
}

function parseActions(text: string): Array<{ type: 'add_to_cart'; itemId: string; optionId: string; qty: number }> {
  const actions: Array<{ type: 'add_to_cart'; itemId: string; optionId: string; qty: number }> = [];
  const regex = /\[ADD_CART:([^:]+):([^:]+):(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    actions.push({
      type: 'add_to_cart',
      itemId: match[1],
      optionId: match[2],
      qty: parseInt(match[3], 10) || 1,
    });
  }
  return actions;
}

function stripActionTags(text: string): string {
  return text.replace(/\[ADD_CART:[^\]]+\]/g, '').trim();
}

function fallbackReply(
  messages: ChatMessage[],
  menuItems: MenuItemPayload[],
  settings: { brandName?: string; address?: string; whatsapp?: string },
): string {
  const last = messages[messages.length - 1]?.content.toLowerCase() ?? '';
  const available = menuItems.filter(i => i.available !== false);

  if (last.includes('hora') || last.includes('abierto') || last.includes('cerrado')) {
    return `Consultá nuestros horarios en la tienda o escribinos por WhatsApp${settings.whatsapp ? ` al ${settings.whatsapp}` : ''}.`;
  }

  if (last.includes('recomend') || last.includes('popular') || last.includes('suger')) {
    const pick = available.slice(0, 2);
    if (pick.length === 0) return 'Hoy no tenemos platos disponibles en el menú.';
    return `Te recomiendo: ${pick.map(p => p.name).join(' y ')}. ¿Querés que los agregue al carrito?`;
  }

  if (last.includes('precio') || last.includes('cuánto') || last.includes('cuanto')) {
    const item = available[0];
    if (!item) return 'No encontré productos disponibles.';
    const opt = item.options.find(o => o.available !== false);
    return opt
      ? `${item.name} (${opt.label}) sale $${opt.price.toLocaleString('es-AR')}.`
      : `${item.name} está en el menú — elegí una variante en la carta.`;
  }

  return `Soy el asistente de ${settings.brandName || 'la tienda'}. Puedo recomendar platos, contarte precios o ayudarte a pedir. ¿Qué te gustaría comer?`;
}

async function callOpenAI(
  systemPrompt: string,
  messages: ChatMessage[],
  apiKey: string,
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.6,
      max_tokens: 500,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI request failed');
  return data.choices?.[0]?.message?.content || '';
}

function setCors(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    setCors(res);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, menuItems, settings, language } = req.body as {
      messages: ChatMessage[];
      menuItems: MenuItemPayload[];
      settings: { brandName?: string; address?: string; whatsapp?: string };
      language?: string;
    };

    if (!messages?.length) {
      setCors(res);
      return res.status(400).json({ error: 'messages required' });
    }

    const menuContext = buildMenuContext(menuItems || []);
    const systemPrompt = `Eres un asistente amable de un negocio de comida (${settings?.brandName || 'restaurante'}).
Idioma: ${language || 'es'}.
Solo recomendá productos del menú actual (disponibles).
Para agregar al carrito del cliente, incluí al final del mensaje tags exactos: [ADD_CART:itemId:optionId:qty]
Menú disponible:
${menuContext}
Dirección: ${settings?.address || 'consultar'}
WhatsApp: ${settings?.whatsapp || 'consultar'}
Sé breve, útil y orientado a ventas sin inventar productos.`;

    const apiKey = process.env.OPENAI_API_KEY;
    let rawReply: string;

    if (apiKey) {
      rawReply = await callOpenAI(systemPrompt, messages, apiKey);
    } else {
      rawReply = fallbackReply(messages, menuItems || [], settings || {});
    }

    const actions = parseActions(rawReply);
    const reply = stripActionTags(rawReply);

    setCors(res);
    return res.status(200).json({ reply, actions });
  } catch (error) {
    console.error('AI chat error:', error);
    setCors(res);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'AI chat failed',
    });
  }
}
