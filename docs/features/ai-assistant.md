# AI assistant

Purpose: Premium-tier chat for menu Q&A and conversational add-to-cart.

Paths: `src/components/AIAssistant.tsx`, `api/ai-chat.ts`

Deps: `features.canUseAI`, `OPENAI_API_KEY` (optional; rule-based fallback without it)

## Flow

1. Floating button on Storefront (Premium only)
2. POST messages + menu snapshot to `/api/ai-chat`
3. Reply may include `[ADD_CART:itemId:optionId:qty]` tags
4. Parsed actions call `onAddToCart` on Storefront

## Gotchas

- Only recommends in-stock menu items from payload
- Without OpenAI key, heuristic fallback responses
- Keep prompts/menu payload small for cost

See also: [features/plans-tiers.md](./plans-tiers.md), [components/ai-assistant.md](../components/ai-assistant.md)
