# 06 — System Architecture (MVP)

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)  
**Stack:** Next.js + TypeScript + Tailwind + React Three Fiber (R3F) + Three.js + Supabase/Postgres + X OAuth PKCE + X API v2 + Vercel

---

## Non-negotiable shape

```
UI (Next.js / R3F World)
   ↓
Domain Layer (NBA, Quests, Graph projection, Scoring)
   ↓
Repository Layer (Postgres via Supabase)
   ↓
Provider Interface  ←── Compliance Layer (wraps / gates providers)
   ├── MockProvider
   └── XApiProvider (OAuth PKCE user context + app bearer where allowed)
```

**Explicitly forbid for MVP:** Kubernetes, microservices mesh, Kafka, Redis cluster, Neo4j/other graph DB, heavy ML training/serving, unofficial scrapers, cookie/GraphQL browser automation as production data.

**Also forbid:** UI components calling X API directly. All X I/O goes through **Provider Interface** behind Compliance.

---

## Layers

### 1. UI
- App Router (Next.js), Tailwind for 2D chrome (NBA card, quest sheet, auth).  
- **R3F** Canvas for the Interactive World (preferred over raw Three.js for AI maintainability — see `08-graph-model.md`).  
- Client state: visible subgraph + selected node + active NBA.  
- Server Actions / Route Handlers only talk to Domain, never to `api.x.com` ad hoc.

### 2. Domain layer
Pure(ish) TypeScript modules:

- `OpportunityScorer` (Rule+Score v1)  
- `QuestEngine` (mint / complete / dismiss)  
- `NextBestActionResolver` → enum actions  
- `GraphProjector` (DB rows → nodes/edges for R3F)  
- `WorldEvolver` (apply quest_events → snapshots / edge weights)

No React imports in domain.

### 3. Repository layer
- Supabase client with RLS keyed by `users.id`.  
- Tables per `05-data-model.md`.  
- Idempotent upserts on `external_id` for X entities.

### 4. Provider Interface
See `07-provider-interface.md`. Single contract for:

- `getMe`, `getUser`, `getFollowingPage`, `getFollowersPage` (capped)  
- `getUserPosts`, `getPost`, `searchRecent` (Tier C; budgeted)  
- `like` / `follow` / `reply` / `createPost` — **user-gated**, never batch-spam  

### 5. Compliance Layer
Cross-cutting wrapper around Provider:

- Rate-limit & cost budget counters (pay-per-use awareness)  
- Automation policy checks (no bulk farm quests)  
- Scope checks before write methods  
- Audit log of write intents  
- Tier D refusal stubs with clear UX copy  

### 6. Auth
- Supabase Auth for app session.  
- **X OAuth 2.0 PKCE** for user-context API (official samples: `xdevplatform/samples`).  
- Tokens server-side only; refresh handled in XApiProvider.

### 7. Deploy
- **Vercel** for Next.js.  
- **Supabase** managed Postgres.  
- Env: `X_CLIENT_ID`, secrets, `PROVIDER_MODE=mock|xapi`.

---

## Lazy Graph (architecture implication)

- Initial payload: ego + seed neighborhood (subscriptions + mock/API page 1).  
- Expand node → Domain requests Provider page → Repository upsert → UI merges delta.  
- Never “sync my 50k followers” as a background job in MVP.

---

## Data flow: Next Best Action

1. User opens world / completes quest event.  
2. Domain loads ego graph slice + open quests + subscriptions.  
3. Scorer computes Opportunity Scores (rules).  
4. Resolver emits one primary NBA (+ 2 alternates).  
5. UI shows NBA card; user confirms → Compliance → Provider write (if any) → `quest_events` → World evolves.

---

## Forbidden / deferred components

| Item | Why deferred |
|------|----------------|
| K8s / microservices | Zero ops benefit at one app |
| Kafka / event bus | Quests don’t need streaming backbone |
| Redis cluster | Use Postgres + short HTTP cache / Vercel if needed |
| Graph DB | Relational edge table enough |
| Heavy ML | Rule+Score v1; LLM optional later for copy assist only, behind approval |
| Scraper pipeline | Policy + reliability + brand risk |

---

## Environment modes

| Mode | Provider | Use |
|------|----------|-----|
| `concept` | MockProvider + `mock/sample-world.json` | Video / interactive demo |
| `dev` | Mock default; optional XApi sandbox user | Local |
| `prod` | XApiProvider + Compliance | Real users |

---

## Sources

- Stack constrained by Phase 0 brief (`PHASE0_BRIEF.md`).  
- X auth patterns: [xdevplatform/samples](https://github.com/xdevplatform/samples) `llms.txt` (fetched 2026-09-04) — OAuth 2.0 PKCE for user actions; Bearer for app-only reads.

---

## Chapter: OAuth 2.0 Authorization Code + PKCE

> **Referenced spike (full detail):** `/workspace/x-world/research/spikes/oauth-pkce.md`  
> **Official:** https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code (retrieved 2026-09-04)

This chapter is the architecture-facing contract for auth. Implementers should treat the spike as normative for edge cases.

### Goals

- User-context X API access for Lazy Graph + confirmed writes.  
- Multi-user: many app users, one X WORLD developer app, isolated tokens.  
- Tokens **never** in `localStorage` / `sessionStorage` / client bundles.

### Flow (summary)

1. **Login** — Server creates `state` + PKCE `code_verifier` (S256 challenge); redirect to `https://x.com/i/oauth2/authorize`.  
2. **Callback** — Validate `state`; exchange `code` + `code_verifier` at `POST https://api.x.com/2/oauth2/token` within **30s**.  
3. **Bind** — `GET /2/users/me` → store **X User ID** linked to **User ID**.  
4. **Access** — Access token ~**2 hours**; refresh via **`offline.access`** refresh token (rotate/persist carefully).  
5. **Logout** — End **Session ID**; optionally keep encrypted refresh if “stay connected”.  
6. **Disconnect** — Revoke/delete access + refresh; stop XApiProvider; Compliance scrub as needed.

### Scopes (MVP baseline)

| Scope | Required |
|-------|----------|
| `users.read` | Yes |
| `tweet.read` | Yes |
| `follows.read` | Yes (graph edges) |
| `offline.access` | Yes (production refresh) |
| `tweet.write` / `like.write` / `follows.write` | Opt-in when user enables write features; still **confirm-to-send** |

### Secure storage

- Encrypt tokens at rest (server / Vault).  
- Service-role only for ciphertext reads.  
- Client Secret only in server env (`X_CLIENT_ID`, `X_CLIENT_SECRET`).  
- **Forbidden:** tokens in localStorage.

### Identity map (canonical)

```
User ID  ↔  X User ID  ↔  Session ID  ↔  OAuth Access Token  ↔  Refresh Token
```

| Key | Meaning |
|-----|---------|
| **User ID** | App account PK (Supabase Auth) |
| **X User ID** | X snowflake from `users/me` |
| **Session ID** | App browser/session cookie |
| **OAuth Access Token** | Bearer for user-context API (~2h) |
| **Refresh Token** | Issued only with `offline.access`; rotate on use |

### Must-dos (architecture gate)

1. PKCE **S256** + exact-match redirect URI.  
2. `offline.access` in production.  
3. Server-only token vault; **no localStorage**.  
4. Single-flight refresh per user; persist new refresh **before** use.  
5. Disconnect path deletes tokens and invalidates Provider.  
6. Writes require scope **and** explicit user confirmation (AI drafts do not auto-send — see `03-x-policy-compliance.md`).  
7. Protected-account content stays inside the owning user session.

### Relation to Compliance Layer

OAuth issues credentials; Compliance Layer **gates** their use (budgets, scopes, confirm tokens, revoke-on-401). See `03-x-policy-compliance.md`.
