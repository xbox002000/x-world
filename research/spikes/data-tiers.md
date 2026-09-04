# Spike: Data Classification Tiers (A–D)

**Phase:** 0  
**Date:** 2026-09-04 (Asia/Taipei)  
**Consumers:** `04-x-api-cost-model.md`, `03-x-policy-compliance.md`, `05-data-model.md`, `08-graph-model.md`

---

## Tier overview

| Tier | Name | Origin | Freshness | Cost / risk | Retention default |
|------|------|--------|-----------|-------------|-------------------|
| **A** | Live X | Official X API / webhooks right now | Seconds–minutes | Pay-per-use + rate limits; highest compliance sensitivity | Ephemeral / request-scoped; promote to B only if needed |
| **B** | Snapshots | Cached copies of X resources we already paid for | TTL (e.g. 15m–24h aligned with billing dedup) | Storage + deletion SLA | TTL + compliance scrub |
| **C** | Derived | **Our** scores, ranks, embeddings-lite, NBA labels | Recompute on B change | Low API cost; must not leak deleted source content | Tombstone when source deleted |
| **D** | Product state | Quests, settings, confirmations, UI prefs | App truth | No X redistribution issue if stripped of raw Content | Account lifetime / user delete |

---

## Tier A — Live X

**Examples:**

- `GET /2/users/me` during login  
- `GET /2/users/:id/followers` page on node expand  
- `GET /2/tweets/:id` when user opens a post card  
- Activity webhook `follow.follow` event (if enabled)  
- Rate-limit headers on the in-flight response  

**Rules:** Never expose raw Tier A from the browser to third parties. All calls via Provider + Compliance. Prefer not to “live fan-out” without a user gesture.

---

## Tier B — Snapshots

**Examples:**

- `x_users` row: id, username, name, bio, metrics_at, raw_json compact, `fetched_at`, `ttl_expires_at`  
- `x_posts` snapshot for last K posts of a focused creator  
- `graph_edges` page cursor + neighbor ids from a followers page  
- Dedup cache key `(resource_type, resource_id, utc_day)` for cost control  

**Rules:** Subject to **24h deletion** on compliance events. Cap size (Lazy Graph). Do not treat as training data.

---

## Tier C — Derived (our scores)

**Examples:**

- Opportunity Score / Rule+Score v1 outputs  
- Next Best Action enum + rationale ids  
- Edge weights in World projection  
- Quest difficulty estimates  
- “Stale graph” warnings  

**Rules:** Must be reproducible from Tier B (+ D). If source Post/User deleted → delete or null out fields that embed Content. Safe to keep aggregate anonymous stats if policy allows.

---

## Tier D — Product state

**Examples:**

- App `users.id`, email (if any), plan  
- OAuth connection status (not the token plaintext)  
- Quest definitions progress, dismissals, confirm tokens  
- Feature flags, spending budget prefs  
- MockProvider seed selection  

**Rules:** Survives temporary X outages. On Disconnect X, keep D that doesn’t require live Content; clear X-linked foreign keys as needed.

---

## Cross-tier flows (Lazy Graph)

```
User expands node
  → Compliance budget check
  → Tier A fetch (Provider)
  → Upsert Tier B snapshot (TTL)
  → Recompute Tier C scores
  → UI reads B+C (+ D quests)
```

Anti-pattern (forbidden): Login → hydrate entire follower universe into Tier B forever (see `04` §7).

---

## Mapping to storage (sketch)

| Table / object | Tier |
|----------------|------|
| `oauth_tokens` (ciphertext) | Special — secrets, not Content; still wipe on disconnect |
| `x_users`, `x_posts` | B |
| `opportunity_scores`, `nba_suggestions` | C |
| `quests`, `quest_events`, `user_settings` | D |
| In-memory Provider response | A |

---

## Open questions

1. Exact TTLs per entity type (user profile vs post vs edge page).  
2. Whether Tier C rationale text may quote Tier B Content in exports (lean **no** for MVP).  
3. Backup/DR: encrypted B snapshots in backups still need scrub tooling.
