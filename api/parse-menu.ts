import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ParsedMenuResult } from '../src/types/menuCategory.js';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function setCors(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : trimmed;
}

function validateParsed(data: unknown): { ok: true; data: ParsedMenuResult; warnings: string[] } | { ok: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { ok: false, error: 'Respuesta inválida del modelo' };
  }

  const obj = data as Record<string, unknown>;
  const warnings: string[] = [];

  if (!Array.isArray(obj.categories)) {
    return { ok: false, error: 'Falta array categories' };
  }

  const categories = obj.categories.map((cat, ci) => {
    const c = cat as Record<string, unknown>;
    const name = String(c.name ?? `Sección ${ci + 1}`).trim();
    const itemsRaw = Array.isArray(c.items) ? c.items : [];
    const items = itemsRaw
      .map(item => {
        const it = item as Record<string, unknown>;
        const itemName = String(it.name ?? '').trim();
        const price = Math.round(Number(it.price) || 0);
        if (!itemName || price <= 0) return null;
        const variants = Array.isArray(it.variants)
          ? it.variants
              .map(v => {
                const vr = v as Record<string, unknown>;
                const vName = String(vr.name ?? '').trim();
                if (!vName) return null;
                return {
                  name: vName,
                  price: vr.price != null ? Math.round(Number(vr.price)) : undefined,
                };
              })
              .filter(Boolean)
          : undefined;
        return {
          name: itemName,
          description: it.description ? String(it.description).trim() : undefined,
          price,
          variants: variants?.length ? variants : undefined,
        };
      })
      .filter(Boolean);
    return { name, items };
  }).filter(c => c.items.length > 0);

  if (categories.length === 0) {
    return { ok: false, error: 'No se detectaron productos con precio' };
  }

  let businessInfo: ParsedMenuResult['businessInfo'];
  if (obj.businessInfo && typeof obj.businessInfo === 'object') {
    const b = obj.businessInfo as Record<string, unknown>;
    businessInfo = {
      name: b.name ? String(b.name) : undefined,
      hours: b.hours ? String(b.hours) : undefined,
      phone: b.phone ? String(b.phone) : undefined,
      instagram: b.instagram ? String(b.instagram) : undefined,
    };
  }

  if (categories.length < 3) {
    warnings.push('Pocas categorías detectadas — revisá la foto antes de importar');
  }

  return { ok: true, data: { categories, businessInfo }, warnings };
}

async function callVisionParse(
  imageBase64: string,
  mimeType: string,
  apiKey: string,
): Promise<string> {
  const systemPrompt = `Sos un extractor de menús impresos de cafés/restaurantes en Argentina.
Devolvé SOLO JSON válido (sin markdown) con esta forma:
{
  "categories": [
    {
      "name": "CAFETERÍA",
      "items": [
        { "name": "Latte", "description": "opcional", "price": 4800, "variants": [{ "name": "Vainilla" }, { "name": "Caramel" }] }
      ]
    }
  ],
  "businessInfo": { "name": "", "hours": "", "phone": "", "instagram": "" }
}
Reglas:
- Precios en ARS como enteros (sin $ ni puntos de miles)
- Encabezados de sección → categories[].name
- Notas al pie → description del ítem, no ítem aparte
- Variantes con mismo precio → variants[]; precios distintos → ítems separados
- Ignorá logos decorativos`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extraé el menú completo de esta imagen.' },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI vision request failed');
  return data.choices?.[0]?.message?.content || '';
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    setCors(res);
    return res.status(500).json({ error: 'Configurá OPENAI_API_KEY en Vercel para importar menús' });
  }

  try {
    const { imageBase64, mimeType } = req.body as {
      imageBase64?: string;
      mimeType?: string;
    };

    if (!imageBase64?.trim()) {
      setCors(res);
      return res.status(400).json({ error: 'imageBase64 required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
    const bytes = Buffer.byteLength(cleanBase64, 'base64');
    if (bytes > MAX_IMAGE_BYTES) {
      setCors(res);
      return res.status(400).json({ error: 'Imagen muy grande (máx 4MB)' });
    }

    const raw = await callVisionParse(cleanBase64, mimeType || 'image/jpeg', apiKey);
    let parsed: unknown;
    try {
      parsed = JSON.parse(stripCodeFence(raw));
    } catch {
      setCors(res);
      return res.status(422).json({ error: 'No se pudo parsear JSON del menú', raw: raw.slice(0, 500) });
    }

    const validated = validateParsed(parsed);
    if (validated.ok === false) {
      setCors(res);
      return res.status(422).json({ error: validated.error });
    }

    setCors(res);
    return res.status(200).json({
      ok: true,
      data: validated.data,
      warnings: validated.warnings,
    });
  } catch (error) {
    console.error('parse-menu error:', error);
    setCors(res);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'parse-menu failed',
    });
  }
}
