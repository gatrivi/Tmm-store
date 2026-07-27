# AI assistant

Purpose: Premium-tier chat for menu Q&A and conversational add-to-cart.

Paths: `src/components/AIAssistant.tsx`, `api/ai-chat.ts`, `api/menuMatch.ts`

Deps: `features.canUseAI`, provider keys (optional; catalog matcher works without)

## Flow

1. Floating button on Storefront (Premium only) — demo: `/demo`
2. POST messages + menu snapshot to `/api/ai-chat`
3. **Catalog match first** (`menuMatch`) — “bondiola” / “dame 2 muzza” → `[ADD_CART:…]` without LLM
4. Else LLM via `AI_PROVIDER` (`openai` | `anthropic` | `gemini`)
5. Else keyword fallback listing menu names
6. Client parses `actions` → `onAddToCart`

## Env (Vercel)

| Var | Notes |
|-----|--------|
| `AI_PROVIDER` | default `openai` |
| `OPENAI_API_KEY` | OpenAI Chat Completions |
| `ANTHROPIC_API_KEY` | Claude Messages API |
| `GEMINI_API_KEY` | Google Generative Language |
| `OPENAI_MODEL` / `ANTHROPIC_MODEL` / `GEMINI_MODEL` | optional overrides |

## Check

```bash
npm run check:ai
```

## Gotchas

- Tiny menus must not depend on the LLM — matcher is source of truth for named items
- Without any API key, catalog + fallback still answer product names
- Keep prompts/menu payload small for cost

See also: [features/plans-tiers.md](./plans-tiers.md)
