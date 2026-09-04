# 15 — Open Questions & Risks

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)

Unresolved items that can reshape MVP scope, pricing, or compliance posture. Revisit before Phase 1 build freeze.

---

## 1) API pricing volatility

X API moved toward pay-per-use for new developers in 2026; legacy Basic/Pro closed or migrating (third-party summaries Feb–Aug 2026: bundle.social, blotato, twitterapi.io blogs — **not** primary official docs; verify on developer.x.com before budgeting).

**Risk:** Per-read costs make eager graph hydration insolvent.  
**Mitigation:** Mock-first; Lazy Graph; Tier D refusal; hard budget meters in Compliance; subscriptions priced with API COGS headroom.

**Open:** What is the official rate card + monthly caps on developer.x.com *this week*? Who owns weekly price checks?

## 2) Archive / search access tiers

`search/all` and historical depth often sit behind higher access (llms.txt notes Academic/legacy framing; 2026 commentary says full-archive gravitates to Enterprise).

**Open:** Does MVP ever need archive, or is `search/recent` enough for discovery quests?

## 3) AI reply approval UX

Draft replies via rules or later LLM assist must stay user-gated.

**Open:** Inline edit + single Confirm enough, or require second confirm for first N sends? Store drafts how long?

## 4) OAuth scopes vs trust

More scopes → better product; also higher user fear and review scrutiny.

**Open:** Minimal scope set for Phase 1 read-only demo vs write-enabled MVP?

## 5) Follower graph depth vs cost/policy

Even paginated following/followers burns read budget and can look automative if misused.

**Open:** Hard cap on pages per day per user? Only expand tracked nodes?

## 6) Mutual / relationship inference accuracy

MUTUAL and warmth scores from partial data may be wrong.

**Open:** Show confidence labels? Only assert MUTUAL when both edges observed?

## 7) Topic graph provenance

Topics are app-curated vs inferred from posts.

**Open:** Who curates seed topics for Concept Demo vs production? Any NLP in v1 or pure manual tags?

## 8) Automation policy boundaries

X Developer Policy / automation rules constrain like/follow cadence and bots.

**Open:** Exact allowlist of Provider write methods for v1; legal/policy review owner?

## 9) Multiplayer / “world” expectations

“World” metaphor may imply shared space.

**Open:** MVP is personal ego-world only — correct? Any shared community nodes that leak social graph data?

## 10) Monetization vs COGS

If API is variable cost, flat SaaS pricing can margin-crush power users.

**Open:** Metered plans, action packs, or waitlist-only until Enterprise partnership?

## 11) Brand claim language

Sales/marketing may drift into “algorithm” claims.

**Open:** Who enforces the NEVER decode-algorithm rule in copy review?

## 12) Graph UX performance on low-end devices

R3F + force layout may jank on mobile.

**Open:** Desktop-first MVP? 2D fallback?

---

## Priority ordering (suggested)

1. Official API price/capability verify  
2. Scope + write allowlist  
3. Lazy Graph budget caps  
4. AI/reply approval UX  
5. Monetization vs COGS model  
