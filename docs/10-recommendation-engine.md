# 10 — Recommendation Engine (Rule+Score v1)

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)  
**Constraint:** No ML for MVP. Deterministic rules + weighted score.

---

## Output

Primary artifact: **Next Best Action** enum:

`FOLLOW | READ | REPLY | TRACK | SUBSCRIBE | CREATE_POST`

Plus: target entity id, rationale bullets, opportunity score (0–100), optional draft text (never auto-sent).

---

## Opportunity Score factors (v1)

| Factor | Weight (starter) | Signal |
|--------|------------------|--------|
| Topic overlap | 0.25 | Shared INTERESTED_IN / ABOUT with user goals |
| Relationship warmth | 0.20 | MUTUAL, prior ENGAGED_WITH, reciprocal replies |
| Recency | 0.15 | Post age / last interaction freshness |
| Reach-without-noise | 0.15 | Mid-tier audience; penalize mega-celebrity cold outreach |
| Goal fit | 0.15 | Matches user-stated growth goal (audience, authority, leads) |
| Cost / tier penalty | 0.10 | Prefer Tier A/B; penalize Tier D / expensive fetches |

Score = 100 * sum(weight_i * normalized_i), clamped 0–100.  
All inputs from graph slice + snapshots + mock/API DTOs — **not** claimed ranking-algorithm internals.

---

## Action selection rules

Given top-scoring candidates:

1. If unread high-score **Post** from tracked person → prefer `READ` then maybe `REPLY`.  
2. If high topic overlap **Person** not followed and not cold mega → `FOLLOW` or `TRACK` (TRACK if uncertain).  
3. If **Topic** not subscribed but many ABOUT edges in neighborhood → `SUBSCRIBE` / `TRACK`.  
4. If recurring question cluster → `CREATE_POST`.  
5. If MUTUAL posted and user silent → `REPLY`.  
6. Never emit volume actions; never emit sends without user gate.

Tie-break: higher score → lower cost tier → prefer actions that evolve the world (TRACK/SUBSCRIBE) over pure vanity.

---

## User-gated sends

- `REPLY` and `CREATE_POST` always show editable draft + Confirm.  
- `FOLLOW` / like-like writes: confirm modal with target identity.  
- No background queue that publishes without confirm.  
- ComplianceLayer logs intent before Provider write.

---

## NBA card payload (UI)

```json
{
  "action": "REPLY",
  "score": 82,
  "targetEntityId": "post_…",
  "rationale": ["Mutual who posted about AI Agents", "Post < 6h old", "You have not replied this week"],
  "draft": "optional text",
  "questId": "optional"
}
```

---

## Explicit non-goals (v1)

- Learned ranking models  
- Embedding search clusters (optional later)  
- Predicting virality / “decode the algorithm”  
- Auto-scheduling without user approval
