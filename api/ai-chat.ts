import type { VercelRequest, VercelResponse } from '@vercel/node';
import { catalogReplyWithTag, type MenuItemPayload } from './menuMatch';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type Provider = 'openai' | 'anthropic' | 'gemini';

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

function resolveProvider(): Provider {
  const raw = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  if (raw === 'anthropic' || raw === 'gemini' || raw === 'openai') return raw;
  return 'openai';
}

function fallbackReply(
  messages: ChatMessage[],
  menuItems: MenuItemPayload[],
  settings: { brandName?: string; address?: string; whatsapp?: string },
): string {
  const last = messages[messages.length - 1]?.content ?? '';
  const catalog = catalogReplyWithTag(last, menuItems);
  if (catalog) return catalog;

  const lower = last.toLowerCase();
  const available = menuItems.filter(i => i.available !== false);

  if (lower.includes('hora') || lower.includes('abierto') || lower.includes('cerrado')) {
    return `Consultá nuestros horarios en la tienda o escribinos por WhatsApp${settings.whatsapp ? ` al ${settings.whatsapp}` : ''}.`;
  }

  if (lower.includes('recomend') || lower.includes('popular') || lower.includes('suger') || lower.includes('hay')) {
    const pick = available.slice(0, 3);
    if (pick.length === 0) return 'Hoy no tenemos platos disponibles en el menú.';
    return `En el menú tenés: ${pick.map(p => p.name).join(', ')}${available.length > 3 ? '…' : ''}. ¿Cuál te copa?`;
  }

  const names = available.slice(0, 5).map(p => p.name).join(', ');
  return `Soy el asistente de ${settings.brandName || 'la tienda'}. Ahora mismo: ${names || 'sin stock'}. Pedime por nombre (ej. bondiola) y te lo sumo.`;
}

async function callOpenAI(systemPrompt: string, messages: ChatMessage[], apiKey: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.2,
      max_tokens: 400,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI request failed');
  return data.choices?.[0]?.message?.content || '';
}

async function callAnthropic(systemPrompt: string, messages: ChatMessage[], apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      temperature: 0.2,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Anthropic request failed');
  const block = data.content?.find((b: { type: string }) => b.type === 'text');
  return block?.text || '';
}

async function callGemini(systemPrompt: string, messages: ChatMessage[], apiKey: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
      }),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gemini request failed');
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callLlm(
  provider: Provider,
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<string | null> {
  if (provider === 'anthropic') {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return null;
    return callAnthropic(systemPrompt, messages, key);
  }
  if (provider === 'gemini') {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) return null;
    return callGemini(systemPrompt, messages, key);
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return callOpenAI(systemPrompt, messages, key);
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

    const items = menuItems || [];
    const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';

    // 1) Deterministic catalog hit — fixes “bondiola” on tiny menus without LLM
    const local = catalogReplyWithTag(lastUser, items);
    if (local && /\[ADD_CART:/.test(local)) {
      setCors(res);
      return res.status(200).json({
        reply: stripActionTags(local),
        actions: parseActions(local),
        source: 'catalog',
      });
    }

    const menuContext = buildMenuContext(items);
    const systemPrompt = `Eres un asistente de pedidos de (${settings?.brandName || 'restaurante'}).
Idioma: ${language || 'es'}.
REGLAS:
- Solo productos del menú listado. Si piden algo que está en el menú (aunque escriban mal), usalo.
- Nunca inventes platos.
- Para agregar al carrito, al FINAL del mensaje poné tags exactos: [ADD_CART:itemId:optionId:qty]
- Sé breve.
Menú:
${menuContext}
Dirección: ${settings?.address || 'consultar'}
WhatsApp: ${settings?.whatsapp || 'consultar'}`;

    const provider = resolveProvider();
    let rawReply: string;
    let source: string = provider;

    try {
      const llm = await callLlm(provider, systemPrompt, messages);
      if (llm) {
        rawReply = llm;
      } else if (local) {
        rawReply = local;
        source = 'catalog';
      } else {
        rawReply = fallbackReply(messages, items, settings || {});
        source = 'fallback';
      }
    } catch (err) {
      console.error('LLM error, falling back:', err);
      rawReply = local || fallbackReply(messages, items, settings || {});
      source = local ? 'catalog' : 'fallback';
    }

    setCors(res);
    return res.status(200).json({
      reply: stripActionTags(rawReply),
      actions: parseActions(rawReply),
      source,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    setCors(res);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'AI chat failed',
    });
  }
}
