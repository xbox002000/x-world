# 09 — Quest Engine

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)

---

## Role

Quests package a **Next Best Action** into a time-bounded, completable unit so growth feels intentional and the world evolves when the user acts.

Quests are **not** a cover for engagement farming.

## Quest types

| Type | Intent | Typical NBA |
|------|--------|-------------|
| `discovery` | Find relevant people/topics/posts not yet tracked | `READ`, `TRACK`, `FOLLOW` |
| `relationship` | Deepen a high-value edge (mutuals, warm intros) | `REPLY`, `FOLLOW`, `TRACK` |
| `content` | Create or refine a post aligned to a topic opportunity | `CREATE_POST`, `READ` |
| `engagement` | Meaningful single-target interaction (not volume spam) | `REPLY`, `READ` |
| `growth` | Meta: goals, subscriptions, weekly review | `SUBSCRIBE`, `TRACK` |

## Lifecycle

`suggested` → `accepted` → `completed` | `dismissed` | `expired`

Events in `quest_events`: `viewed`, `accepted`, `action_confirmed`, `skipped`.

Completion requires **user confirmation** (and Provider write when applicable).

## Example quests (allowed)

1. **Discovery — Map a new topic moon**  
   Track topic *AI Agents*; read 2 seed posts; optionally follow 1 Tier-B person strongly ABOUT that topic.

2. **Relationship — Warm the mutual**  
   Person is MUTUAL and posted about a tracked topic → `READ` then draft `REPLY` (user sends).

3. **Content — Answer the open question**  
   Cluster of posts asking the same question → `CREATE_POST` with user-edited draft.

4. **Engagement — One high-signal reply**  
   Single post from a tracked creator with high opportunity score → `REPLY` once.

5. **Growth — Subscribe to a community ring**  
   Track a Community node (curated operators circle) → `SUBSCRIBE` / `TRACK`.

## MUST NOT (hard product rules)

- Volume follow / mass-unfollow quests.
- Volume like / engage-many-posts spam quests.
- Auto-DM / auto-reply without explicit per-message approval.
- Quests that require unofficial data collection APIs.
- Quests that incentivize bot-like cadence (e.g. twenty follows per hour).
- Silent Provider writes from quest minting alone.

If a quest design needs those behaviors, **delete the quest** — do not soften the copy.

## Minting (v1)

Rule+Score engine proposes ≤3 quests; user sees 1 primary. Mint stores `score` + `payload.rationale[]`. Expiry default 72h.

## World evolution on complete

- Bump edge `weight` or add `ENGAGED_WITH` / `TRACKS`.
- Write `snapshots` (e.g. quests_completed_week).
- Refresh NBA.
