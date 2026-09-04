# 05 — Data Model (Minimal Schema)

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)  
**Goal:** Smallest evolvable relational schema that can *project* a graph UI — without premature polymorphism or a graph database.

---

## Recommendation: **Postgres relational + explicit edge table** (not a graph DB)

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Relational (Supabase/Postgres) + `relationships` table** | Simple, cheap, RLS, migrations, joins for quests/subs; Vercel-friendly | Multi-hop queries need care; not “native graph” | **MVP choice** |
| Graph DB (Neo4j, etc.) | Natural traversals | Ops cost, another system, overkill for Lazy Graph MVP | **Forbid for MVP** |
| Document-only (JSON blob world) | Fast for demo | Hard subscriptions, quests, RLS, evolution | Mock only |
| “Polymorphic everything” (`entity_links` mega-table) | Feels flexible | Opaque queries, weak constraints, AI-hostile schema | **Avoid early** |

**Rule:** Prefer **typed columns + enums** and a small set of tables. Add polymorphism only when a second concrete use case forces it.

---

## Entity types (nodes)

| Type | Meaning | Source |
|------|---------|--------|
| `Person` | X user / creator (may or may not be connected) | X user object / mock |
| `Topic` | Curated or inferred theme (e.g. “AI agents”, “SaaS pricing”) | App-defined + signals |
| `Post` | An X post (tweet) | X posts API / mock |
| `Community` | List, Space-adjacent cluster, or curated circle | App-defined (MVP: curated) |

---

## Relationship types (edges)

Canonical MVP set (extend carefully):

| Type | From → To | Notes |
|------|-----------|-------|
| `FOLLOW` | Person → Person | Directed |
| `MUTUAL` | Person ↔ Person | Derived or stored convenience |
| `ENGAGED_WITH` | Person → Post | Like/reply/repost signals (tiered) |
| `AUTHORED` | Person → Post | |
| `ABOUT` | Post → Topic | |
| `INTERESTED_IN` | Person → Topic | User goal or inferred |
| `MEMBER_OF` | Person → Community | |
| `TRACKS` | User (app) → Entity | Subscription / watchlist |

Do **not** invent 40 edge types on day one. Derive display labels in the UI layer.

---

## Tier classification (data freshness / cost)

Used by Provider + Compliance + Lazy Graph to decide fetch budget.

| Tier | Meaning | Examples | Fetch policy |
|------|---------|----------|--------------|
| **A** | Critical, user-owned, session-hot | Authenticated user profile, NBA card, open node detail | Always fresh enough; cache short TTL |
| **B** | High-value neighborhood | 1-hop follows (paginated), recent posts of tracked people | Lazy on expand; medium TTL |
| **C** | Contextual / exploratory | Topic membership, community suggestions, older posts | On demand; longer TTL; may be mock-enriched |
| **D** | Expensive / gated / archive | Full-archive search, deep follower crawl, heavy timelines | **MVP: avoid or stub**; flag as Enterprise/pay-per-use risk |

---

## Minimal tables

### `users`
App identity (Supabase Auth).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `email` | text | |
| `display_name` | text | |
| `created_at` | timestamptz | |

### `x_accounts`
Linked X identity for a user (OAuth tokens stored securely — never in client).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `x_user_id` | text unique | X snowflake id |
| `username` | text | |
| `scopes` | text[] | OAuth scopes granted |
| `token_ref` | text | Pointer to vault/secret store — not raw token in plain table if avoidable |
| `linked_at` | timestamptz | |

### `entities`
Unified node registry (**controlled** polymorphism via `entity_type` enum — not free-form JSON bags).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `entity_type` | enum(`person`,`topic`,`post`,`community`) | |
| `external_id` | text nullable | X id for person/post; slug for topic/community |
| `handle` | text nullable | @username for people |
| `title` | text | Display name / topic label / post excerpt title |
| `summary` | text nullable | Short bio or topic blurb |
| `tier` | enum(`A`,`B`,`C`,`D`) | Default fetch tier |
| `meta` | jsonb | **Small** typed extras only (avatar_url, metrics snapshot ids) |
| `created_at` / `updated_at` | timestamptz | |

**Warning:** `meta` is not a dumping ground. Prefer new columns when a field is queried often.

### `relationships`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `from_entity_id` | uuid FK | |
| `to_entity_id` | uuid FK | |
| `rel_type` | enum(...) | See list above |
| `weight` | real default 1 | Soft score / strength |
| `observed_at` | timestamptz | Last confirmed from provider |
| `source` | text | `x_api` \| `derived` \| `user` \| `mock` |
| Unique | `(from, to, rel_type)` | |

### `posts`
Optional normalized post body when `entities.entity_type = post` needs searchable text.

| Column | Type | Notes |
|--------|------|-------|
| `entity_id` | uuid PK/FK → entities | |
| `author_entity_id` | uuid FK | |
| `text` | text | |
| `posted_at` | timestamptz | |
| `metrics` | jsonb | likes, replies, reposts (snapshot) |
| `lang` | text nullable | |

### `snapshots`
Point-in-time captures for growth / world evolution (counts, scores).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `subject_entity_id` | uuid FK nullable | Or user_id for app-level |
| `user_id` | uuid FK nullable | |
| `snapshot_type` | text | e.g. `followers_count`, `opportunity_score` |
| `payload` | jsonb | |
| `captured_at` | timestamptz | |

### `quests`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `quest_type` | enum(`discovery`,`relationship`,`content`,`engagement`,`growth`) | |
| `title` | text | |
| `description` | text | |
| `target_entity_id` | uuid nullable | |
| `nba_action` | enum(`FOLLOW`,`READ`,`REPLY`,`TRACK`,`SUBSCRIBE`,`CREATE_POST`) | |
| `status` | enum(`suggested`,`accepted`,`completed`,`dismissed`,`expired`) | |
| `score` | real | Opportunity score at mint time |
| `payload` | jsonb | Rationale factors |
| `created_at` / `expires_at` | timestamptz | |

### `quest_events`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `quest_id` | uuid FK | |
| `event_type` | text | `viewed`,`accepted`,`action_confirmed`,`skipped` |
| `at` | timestamptz | |
| `meta` | jsonb | |

### `user_subscriptions`
Watchlist / TRACK / SUBSCRIBE targets (drives Tier B refreshes).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `entity_id` | uuid FK | |
| `sub_type` | enum(`track`,`subscribe_topic`,`community`) | |
| `created_at` | timestamptz | |
| Unique | `(user_id, entity_id, sub_type)` | |

---

## Graph projection

UI graph = query:

1. Ego `Person` (YOU) + subscribed entities  
2. 1-hop `relationships` for visible nodes  
3. On node expand → Provider fetch → upsert entities/relationships → return delta  

No need to store a separate “graph document” for MVP.

---

## Anti-patterns

- Polymorphic `object_type` + `object_id` without FKs for every association.  
- Storing raw OAuth access tokens in client-visible tables.  
- Mirroring entire follower graphs (cost + policy + Tier D).  
- Graph DB “because the UI is a graph.”

---

## Evolution path

Phase 1: tables above + MockProvider seed.  
Phase 2: materialized views for ego neighborhood.  
Phase 3+: consider recursive CTEs or read replicas — still not a graph DB until multi-hop product need is proven.
