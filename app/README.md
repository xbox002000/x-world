# X WORLD — Phase 1 Interactive Concept Prototype

**Status:** MockProvider only. No X API / OAuth / billing / real social actions.

Interactive growth world for X: explore a spatial graph, click entities, see WHY + NEXT MOVE, act (mock), world and XP evolve.

## How to run

```
cd /workspace/x-world/app
# install dependencies, then:  run  scripts/dev from package.json
# package scripts:  "dev", "build", "start"
```

Open http://localhost:3000

## Demo flow

1. Landing `/` — Build Your World / Enter Demo (no login).
2. `/world` generative loading then R3F force graph.
3. Click a creator / topic / post — Context Panel (WHY + NEXT MOVE).
4. Do it (or Todays 3 Moves) — MockProvider mutates relationships / XP / quests.
5. Growth strip updates (LEVEL / XP / this week). Graph edges and node sizes change.
6. Optional: Cinematic mode — scripted scenes — tagline KNOW YOUR NEXT MOVE.
7. Share My World — shareable card modal (fake card).

## Architecture

UI (App Router) -> Domain (types, events, quests) -> SocialDataProvider -> MockProvider (Phase 1)

Key paths:

- `lib/domain/types.ts` — User, Entity, Relationship, Post, Opportunity, Quest, NextMove
- `lib/domain/events.ts` — track() console + in-memory analytics
- `lib/domain/quests.ts` — Daily moves, XP / level helpers
- `lib/providers/types.ts` — SocialDataProvider interface
- `lib/providers/mock/MockProvider.ts` — In-memory world + mock actions
- `lib/providers/mock/demo-world.json` — Seed data
- `lib/providers/index.ts` — getProvider() mock only
- `components/world/*` — R3F canvas, force layout, loader, cinematic
- `components/ui/*` — Growth strip, moves, context panel, share card
- `app/page.tsx` — Landing
- `app/world/page.tsx` — Main experience

## Provider / future X API swap

`NEXT_PUBLIC_PROVIDER_MODE=mock` (default). Phase 1 always returns MockProvider.

Swap point: `lib/providers/index.ts` — later add XApiProvider implementing the same SocialDataProvider (OAuth 2.0 PKCE + official X API v2). UI and domain must not call X directly.

See `/workspace/x-world/docs/07-provider-interface.md`.

## Design

Premium / futuristic / calm / spatial. Dark editorial. No neon casino, no dashboard tables.


## Language toggle

Top-right **EN · 简体中文** / **中文 · EN** control on landing and world (also during loader).

- Default: English
- Persists in `localStorage` key `xworld.locale` (`en` | `zh-CN`)
- Covers chrome/UI strings (landing, loader, context panel, moves, growth strip, share card, cinematic, buttons). Demo entity proper names stay English; ego label lightly localizes YOU → 你.
- Implementation: `lib/i18n/` (`locales/en.ts`, `locales/zh-CN.ts`, `I18nProvider.tsx`, `useI18n()`)

## Stack

Next.js App Router, TypeScript, Tailwind, Three.js, @react-three/fiber, @react-three/drei, d3-force, framer-motion

## Success checklist (A-J)

A Demo no login — Yes
B Interactive world — Yes
C Click entities — Yes
D Context panel — Yes
E Next Move — Yes
F Quest — Yes
G XP / Level — Yes
H Visible world change — Yes
I Cinematic — Yes
J Share card — Yes

## Exact commands

From `/workspace/x-world/app`:

1. Install: `npm install`
2. Dev: `npm run dev`
3. Build: `npm run build`

Then open http://localhost:3000
