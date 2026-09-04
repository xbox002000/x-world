# 04 — X API Cost Model (Pay-per-use)

**Phase:** 0 (research only)  
**Retrieved / cited as of:** 2026-09-04 (Asia/Taipei)  
**Primary official source:** [X API pay-per-usage pricing and credits](https://docs.x.com/x-api/getting-started/pricing) (`https://docs.x.com/x-api/getting-started/pricing`)  
**Console / purchase UI:** [developer.x.com pricing](https://developer.x.com/#pricing), [console.x.com](https://console.x.com)  
**Related:** [Rate limits](https://docs.x.com/x-api/fundamentals/rate-limits)

> Prices change. Always re-check Developer Console before committing budget. This doc snapshots **official docs.x.com** content as of **2026-09-04**.

---

## 1. Billing model summary

| Fact | Official position (2026-09-04) |
|------|--------------------------------|
| Model | **Pay-per-usage** credits — **no subscriptions** for new apps |
| Unit | Reads charged **per resource returned**; writes/actions **per request** |
| Cap | Pay-per-usage capped at **3 million Post reads / monthly billing cycle** (above → Enterprise) |
| Dedup | Same resource charged once per **24-hour UTC day** (soft guarantee) |
| Owned Reads | Selected “own data” endpoints at **$0.001 / resource** when `{id}` is the authenticated user **and** that user is the **owner of the developer app** |
| Controls | Credit balance, auto-recharge, **spending limits** in Developer Console |

**Uncertainty note:** Some third-party 2026 blogs cite a **2M** Post-read monthly cap or slightly different owned-read eligibility. This Phase 0 model uses the **official 3M** figure from docs.x.com. Reconcile against live Console before Phase 1 spend.

---

## 2. Current unit prices (official categories)

### 2.1 Read operations (per resource)

| Category | Unit cost | Notes for X WORLD |
|----------|-----------|-------------------|
| **User: Read** | **$0.010** | Profile / user lookup |
| **Posts: Read** | **$0.005** | Post / tweet objects returned |
| **Following/Followers: Read** | **$0.010** | Each follower/following **user id resource** in the page |
| **DM Event: Read** | **$0.010** | Avoid in MVP unless product requires |
| **List / Space / Community / Note: Read** | **$0.005** | |
| **Like / Mute / Block: Read** | **$0.001** | |
| **Profile Update: Read** | **$0.005** | |
| **Owned Reads** (qualified endpoints only) | **$0.001** | Own posts, mentions, likes, bookmarks, followers, following, blocks, mutes, lists — **only** if app owner == authenticated user |

### 2.2 Write / action (per request) — selected

| Action | Unit cost |
|--------|-----------|
| Post: Create | $0.015 |
| Post: Create (with URL) | **$0.200** |
| Post: Create (summoned) | $0.010 |
| User / DM Interaction: Create | $0.015 |
| Interaction: Delete | $0.010 |
| Counts: Recent / All | $0.005 / $0.010 |
| **Trends** | **$0.010** per request |

**Uncertainty:** Official table lists **Trends** under “Write operations” even though product-wise it is a read. Treat as **Trend Read = $0.010 / request** until Console taxonomy says otherwise.

### 2.3 Webhooks (Activity API)

Billable per event (same 24h dedup window), e.g. `post.create` $0.005, `follow.follow` / `follow.unfollow` $0.010. Useful later for Lazy Graph invalidation; not in MVP scenario math.

---

## 3. Scenario assumptions (label clearly)

**Workload per active user / day (given):**

| Call type | Count / user / day | Price mapping |
|-----------|--------------------|---------------|
| User lookup (ego / self) | 1 | User: Read @ $0.010 |
| Creator lookups | 20 | User: Read @ $0.010 |
| Post reads | 20 | Posts: Read @ $0.005 |
| Relationship reads | 10 | Following/Followers: Read @ $0.010 |

**Pricing assumptions:**

1. All reads are **non-Owned** (multi-tenant app: end users OAuth in; **X WORLD owns the developer app** → Owned Read $0.001 **does not apply** to end-user graphs).  
2. Each “relationship read” = **one** billed follower/following **resource**, not a full page of 100.  
3. All resources are **unique within the UTC day** (no 24h dedup savings).  
4. **No** writes, Trends, DMs, webhooks, search, or media.  
5. Month ≈ **30 days**; users are **daily-active** every day (upper bound).  
6. Post-read monthly cap check uses official **3,000,000**.

**Per-user daily cost:**

```
1×$0.010 + 20×$0.010 + 20×$0.005 + 10×$0.010
= $0.01 + $0.20 + $0.10 + $0.10
= $0.41 / user / day
```

| Component | $/user/day | Share |
|-----------|------------|-------|
| Creator User: Read (20) | $0.20 | **48.8%** |
| Relationship reads (10) | $0.10 | 24.4% |
| Post reads (20) | $0.10 | 24.4% |
| Ego user lookup (1) | $0.01 | 2.4% |
| **Total** | **$0.41** | 100% |

---

## 4. Scenario A–D daily cost table

| Scenario | Active users | Daily API cost | ≈ Monthly (×30) | Post reads / month | Cap risk (3M) |
|----------|-------------:|---------------:|----------------:|-------------------:|---------------|
| **A** | 100 | **$41** | **~$1,230** | 60,000 | OK |
| **B** | 1,000 | **$410** | **~$12,300** | 600,000 | OK |
| **C** | 10,000 | **$4,100** | **~$123,000** | 6,000,000 | **EXCEEDS 3M** → Enterprise or cut reads |
| **D** | 100,000 | **$41,000** | **~$1,230,000** | 60,000,000 | **Far over cap** |

**Sensitivity (same assumptions):** if Creator lookups drop from 20 → 5 via Lazy Graph + cache, per-user/day falls to  
`$0.01 + $0.05 + $0.10 + $0.10 = $0.26` (−37%).

**If Owned Reads wrongly assumed for end-user following/followers:** relationship line would be $0.001 not $0.010 — **do not plan on this** for multi-tenant unless BYO-app architecture is proven.

---

## 5. Cost black holes (ranked)

| Rank | Black hole | Why it explodes | Mitigations |
|------|------------|-----------------|-------------|
| **#1** | **Eager Following/Followers expansion** | $0.010 **per user id** in the edge list. A 5k-follower pull = **$50** before any profiles/posts. | Cap pages; expand on click; never “sync all followers” job |
| **#2** | **Repeated User: Read on creators** | $0.010 each; 20/day dominates base scenario (~49%) | 24h server cache; TTL snapshots; batch only visible nodes |
| **#3** | **Per-creator post timelines** | $0.005 × N posts × M creators; hits **3M Post-read cap** at scale C+ | Fetch top-K posts for **focused** nodes only |
| **#4** | **Post: Create with URL** | $0.200 / request if product auto-posts links | Prefer URL-less drafts; user confirm; avoid growth-spam |
| **#5** | **Webhook / Activity fan-out without filters** | follow.* events at $0.010 each | Subscribe narrowly; ignore noise |

**#1 cost black hole for X WORLD:** **full-universe / full-follower-graph pulls** (Following/Followers Read at $0.010/resource), especially when chained with profile + tweet hydration.

---

## 6. Eager full-universe fetch vs Lazy Graph Expansion

| Dimension | Eager full-universe | **Lazy Graph Expansion (recommended)** |
|-----------|---------------------|----------------------------------------|
| First login | Pull all followers/following + every profile + every tweet + metrics | Ego + seed neighborhood (page 1 / subscriptions) |
| Cost shape | Front-loaded spike; scales with **degree**, not with UX value | Scales with **attention** (nodes user opens) |
| Rate limits | Followers/following **300 req / 15 min** → multi-hour sync for large graphs | Stay inside interactive budgets |
| Storage | Forever-growing raw X blobs | Tier B snapshots + Tier C derived scores |
| Compliance | Large deletion/scrub surface; redistribution risk | Smaller retained set; easier batch compliance |
| Product fit | Analytics dump | **Next Best Action / Interactive World** |

**Recommendation:** **Lazy Graph Expansion only** for MVP and beyond. Architecture already states: never “sync my 50k followers” as a background job (`06-system-architecture.md`).

---

## 7. DATA ANTI-PATTERNS (spike)

### Anti-pattern: Login → fetch all followers → each profile → each tweets → each metrics → store forever

```
login
  → GET followers (all pages)          # $0.010 / id
  → for each follower: GET user        # $0.010 / user
  → for each user: GET tweets (N)      # $0.005 / post
  → expand metrics / liking_users…     # more $0.001–$0.010
  → INSERT forever, no TTL / compliance job
```

#### Worked estimate (illustrative mid-tier creator)

**Assumptions:** target account has **5,000 followers**; hydrate **20 posts** each; store ~**2 KB**/profile + ~**4 KB**/post; user-context rate limits as published 2026-09-04.

| Step | Volume | Unit $ | Cost |
|------|--------|--------|------|
| Followers Read | 5,000 ids | 0.010 | **$50** |
| User: Read | 5,000 | 0.010 | **$50** |
| Posts: Read | 5,000 × 20 = 100,000 | 0.005 | **$500** |
| **First sync total** | | | **~$600 / login event** |

| Risk | Estimate |
|------|----------|
| **Storage** | ~5k×2KB + 100k×4KB ≈ **~410 MB** raw JSON **per such user**, retained forever → multi-TB at thousands of creators |
| **Rate limit** | Followers **300/15min** (~100 ids/page ⇒ ~50 pages ⇒ **≥1 window**); user lookup **900/15min** user-context; user tweets **900/15min** — multi-hour wall clock + retry storms |
| **Monthly Post reads** | One sync alone = **100k** Post reads; **30** such syncs = **3M** → **hits hard cap** |
| **Compliance** | Must delete within **24h** on X/user deletion request; forever store ⇒ **missed scrub = policy breach**; redistribution limits (≤1.5M Post IDs / 30d; ≤50k hydrated Posts/Users / recipient / day) |
| **Money** | At Scenario C, if even **1%** of 10k users trigger a 5k-follower sync/day → 100 × $600 = **$60,000/day** on top of baseline |

#### Better approach: Lazy Graph

1. On login: `users/me` + Owned/available ego slice only (capped following page).  
2. Seed World with **subscriptions + top opportunities**, not full degree.  
3. On node expand: fetch **one page** of edges / **K** posts; upsert Tier B snapshot with **TTL**.  
4. Derive Tier C scores; **do not** keep every raw metric forever.  
5. Run **Batch Compliance** / streams on retained IDs; hard-delete on events.  
6. Enforce **per-user daily credit budget** in Compliance Layer.

See also: `research/spikes/data-tiers.md`, `08-graph-model.md` (Lazy Graph).

---

## 8. Operational controls (must-have)

1. Console **spending limit** + alerts before auto-recharge.  
2. App-level **per-user / per-day credit budget** in Compliance Layer.  
3. Server-side **24h dedup cache** aligned with X billing window (still don’t rely on soft guarantee alone).  
4. Feature-flag **Trends / search / DM** until budgeted.  
5. Prefer **MockProvider** for concept demos (`PROVIDER_MODE=mock`).

---

## 9. Sources

| Source | URL | Date |
|--------|-----|------|
| Official pricing | https://docs.x.com/x-api/getting-started/pricing | 2026-09-04 |
| Developer Console pricing anchor | https://developer.x.com/#pricing | 2026-09-04 |
| Rate limits | https://docs.x.com/x-api/fundamentals/rate-limits | 2026-09-04 |
| Batch compliance (deletion/status) | https://docs.x.com/x-api/compliance/batch-compliance/introduction | 2026-09-04 |

Third-party blogs (Blotato, Bundle.social, SocialCrawl, SocialRails) were used only as **cross-checks**; where they disagree with docs.x.com (e.g. 2M vs 3M Post-read cap), **docs.x.com wins**.
