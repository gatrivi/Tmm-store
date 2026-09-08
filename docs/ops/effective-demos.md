# Effective demos for selling web development

Direction: 2026-09-07. Owner wants to sell web development to pymes in Buenos Aires and Vicente López; only the first two portfolio projects meet their taste. This is the current brief for portfolio/demo work. Older store-only sales plans remain implementation history, not the positioning to follow.

## Diagnosis and decision

Source review, not a browser visual audit: `LandingPage.tsx` leads with food imagery, catalogs, carts and a three-day store offer. `/demos` uses `DemosGalleryPageV2.tsx`; its first two entries are **Ricardo Hombres** and **El Puestito del Tío**. These are the assumed approved references. The homepage currently features different projects. Existing docs describe a white-label ordering product: future agents must not mistake that for the whole business.

Recommendation: present a local web-development service with two strong published projects and, initially, one excellent complementary concept. Keep the commerce engine as a delivery option. A large gallery of weaker examples makes the service harder to sell.

Proposed homepage sequence: clear offer → two real project previews → three service outcomes → simple process → contact. Suggested headline: **“Sitios web para pymes de Buenos Aires y Vicente López.”** Supporting line: **“Mostrá lo que hacés, recibí consultas y facilitá los pedidos.”** Main CTA: **“Contame sobre tu negocio.”** Secondary: **“Ver trabajos.”** Confirm public brand/domain before implementing: code currently mixes Gatrivi and ZengaSoft references. Avoid guaranteed sales, rankings or delivery dates unsupported by scope.

Proposed portfolio cleanup: feature the approved two; remove other projects from prominent sales placement until reviewed. Preserve routes and existing work. Use actual desktop/mobile screenshots as project thumbnails, with business problem, delivered solution and a link. Label concepts **“Demo conceptual”**; never imply an invented project is a client or invent results/testimonials.

## What to build next

These are sales hypotheses, not local market research. Pick based on an actual prospect conversation when available.

| Priority | Example | Customer task | Distinct visual direction |
|---|---|---|---|
| 1 | Fictional air-conditioning installer in Vicente López | Choose installation/repair, enter neighborhood and need, preview a WhatsApp inquiry | Useful local service site; strong work photography, clean type, visible service area |
| 2 | Boutique/showroom in Olivos | Browse a small collection, choose size, ask about that exact item | Editorial photography, generous spacing, product detail; Ricardo is the quality reference |
| 3 | Café/pastelería in Florida | Choose an item/occasion and pickup date; preview an order inquiry | Warm photography, readable menu and a short ordering flow; Puestito is the clarity reference |

Build **one** first. Existing work already covers food and retail; the service demo demonstrates a missing capability. Do not start three new sites or build a booking backend just to demonstrate inquiries.

## Repeatable agent workflow

1. **Read narrowly.** This file, `docs/README.md`, the target route/page, and relevant data/helpers. Inspect `git status`; preserve unrelated edits. Do not read the entire roadmap or install a new stack.
2. **Write a tiny brief** in `docs/demos/<slug>/brief.md`: audience, business offer, neighborhood, primary customer action, section order, two references with the specific pattern to learn, asset list, missing facts and definition of done. State assumptions and proceed on reversible choices.
3. **Gather content before styling.** Use a clear business name, 3–6 services or 6–10 products, short specific descriptions, realistic demo values and one consistent photographic set. For real businesses, verify contact, service area and hours from owner material or their official channels; mark unknowns. Never fill gaps with invented credentials, reviews or addresses.
4. **Choose art direction.** Record two fonts at most, a neutral palette plus one accent, spacing scale, image crops and button style. Each business needs a deliberate composition; changing the logo/color on the same cards is insufficient. Reuse logic, accessibility and controls where useful.
5. **Build one complete journey.** Start with the mobile opening screen and primary action, then build supporting sections and desktop. The first screen must answer who this is, what they offer, where they operate and what to do next. Show a useful detail view and a finished inquiry/order summary. Include validation, empty states, back/edit and reset. “Solicitud preparada” is appropriate for a simulation; “Reserva confirmada” requires a real confirmation.
6. **Inspect and fix.** Open the route at 390 px and 1440 px; also check 320 px for overflow. Capture the opening screen and completed journey. Compare with the chosen references for image quality, hierarchy, spacing and specificity. Fix the three largest weaknesses; allow one focused refinement pass rather than endless redesign.
7. **Deliver evidence.** Record route, changed files, screenshots, checks, asset sources, simulated functionality and remaining gaps in `docs/demos/<slug>/review.md`. Add to the public gallery only when the gate below passes.

## Tools, skills and sources

Use the installed **React/Vite/TypeScript/Tailwind** stack and existing Lucide icons. No framework migration, new UI kit or backend is needed for the first demo. Existing commerce demos can reuse `src/utils/demoRegistry.ts`, `src/data/demos/`, and order/contact helpers; inspect their contracts before integration. A service page need not inherit the storefront cart. Routes live in `src/App.tsx` and `src/CommerceApp.tsx`.

Load only the skill needed for the current step, if available in the agent's environment:

| Need | Skill/use |
|---|---|
| Inspect references and test the finished page | `vercel:agent-browser`; apply its verification companions when starting a dev server |
| Missing conceptual illustration or background | `imagegen`; use only for a specific asset gap, not as the default for every photo |
| Changes across multiple React components | `vercel:react-best-practices` before delivery |
| User explicitly wants Figma | Relevant Figma skills; otherwise implement directly in this repo |

No skill installation is required. Read each selected skill's actual instructions; availability and procedures may differ across agents. A small explicit brief plus screenshot review matters more than collecting skills. Avoid adding chatbots, animation systems or design tooling without a concrete benefit to this demo.

Reference sources checked 2026-09-07:

- [Ricardo Hombres](https://www.ricardohombres.com.ar/): business-specific material descriptions, collection categories, sizing proposition and local contact information. Learn specificity and brand consistency; inspect visually before borrowing layout patterns.
- [El Puestito del Tío](https://elpuestitodeltio.com/menu/): visible menu prices, explicit combo/completo explanations and dish details. Learn how to answer purchase questions. Do not copy its prices into another business.
- [web.dev image guidance](https://web.dev/learn/images): responsive image sizing and delivery. Use appropriately sized local assets, explicit dimensions and lazy loading below the fold.
- [W3C page structure tutorial](https://www.w3.org/WAI/tutorials/page-structure/): meaningful headings and regions for understandable, accessible pages.

Asset order: owner-provided originals → existing repo assets with known provenance → licensed stock → generated conceptual assets. Reference-site images are not automatically reusable. Record source URL/file, permission or license status and intended crop in the brief. Do not hotlink random images, mix illustration placeholders with premium photos, or present generated premises/staff/work as a real business's evidence.

## Acceptance gate

- A visitor can identify the business, area and next action from the opening screen; copy uses natural Rioplatense Spanish (`pedí`, `consultá`, `elegí`). Format demo prices with `es-AR`, identify currency, and label sample pricing.
- One end-to-end customer task works, including required choices, correction and a useful result. Demo interactions use isolated state and clearly simulated submissions. Do not send test orders/messages to real businesses or charge money. Inspect the prepared WhatsApp text and destination without sending.
- No broken images, dead buttons, horizontal overflow, obscured CTA, unreadable text or console errors. Keyboard access, labels, visible focus and reduced-motion behavior work. Touch controls should be comfortably sized; target 44 px.
- Photography, typography and section composition look intentional on both viewport sizes. No generic filler, repeated irrelevant feature cards or animations delaying access to content.
- Run `npm run build`; run existing relevant checks when changing shared logic. For commerce/registry changes use `npm run check:demo` and the applicable Playwright spec. Record failures honestly; a successful build alone does not prove visual or functional quality.
- Deliver a 30-second walkthrough: business need → customer action → finished inquiry → benefit for the owner. Use observed behavior, not invented conversion statistics.

## Copy/paste assignment

> Read `docs/ops/effective-demos.md`. Build ONE fictional local-service demo for an air-conditioning installer in Vicente López, using the current stack. First create the brief with two inspected references and an asset plan. Implement service selection → neighborhood and need → editable WhatsApp inquiry preview, with no real submission. Make mobile and desktop visually deliberate. Preserve unrelated changes. Load only applicable skills. Verify the complete flow, save screenshots and a short review with commands/results. Keep the concept out of the featured portfolio until it passes the acceptance gate. No deployment or outreach is part of this assignment.

After the first demo passes, show it to a few relevant owners in user-authorized outreach. Ask what they think the site helps customers do and what is missing before they would use it. Track replies, qualified inquiries and proposals; use that feedback to choose the next demo.
