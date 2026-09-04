# Spike: Reply / AI Reply Policy (X API v2)

**Project:** X WORLD  
**Access date:** 2026-09-04  
**Also summarized in:** [`../../docs/02-x-api-capability-map.md`](../../docs/02-x-api-capability-map.md) §6 · [`../../docs/03-x-policy-compliance.md`](../../docs/03-x-policy-compliance.md)

---

## 1. Can we create a reply via API?

**Yes.** Create a Post with reply metadata:

```http
POST /2/tweets
Authorization: Bearer <USER_ACCESS_TOKEN>
Content-Type: application/json

{
  "text": "…",
  "reply": { "in_reply_to_tweet_id": "<id>" }
}
```

**Scopes:** `tweet.write`, `tweet.read`, `users.read` (OpenAPI on create-post).  
**Cite:** [Manage Posts](https://docs.x.com/x-api/posts/manage-tweets/introduction), [Create Post](https://docs.x.com/x-api/posts/create-post) — accessed 2026-09-04.

---

## 2. Restrictions (self-serve / PPU)

From official Manage Posts docs (2026-09-04):

> **Self-serve customers:** Replies are only permitted if the original post's author has explicitly **summoned** the replying account by **@mentioning** them or **quoting** one of their posts.

Also:

- Self-serve posts limited to **max 1 cashtag** per post (same page).
- **Quote-posting** (`quote_tweet_id`) requires **Enterprise** (Create Post warning) — not available on self-serve PPU.

---

## 3. Automation rules for replies / mentions

From [X Automation rules](https://help.x.com/en/rules-and-policies/x-automation) (updated **April 2026**) and [Developer Guidelines — Automation](https://docs.x.com/developer-guidelines):

| Rule | Requirement |
| --- | --- |
| Unsolicited mass replies/mentions | **Not permitted** (abuse of reply/mention) |
| Keyword-search auto-replies | **Not permitted** as sole trigger |
| Allowed auto-reply | Recipient **opted in** / clearly indicated intent; **easy opt-out**; **one automated reply per user interaction**; prefer reply-to original post |
| Following alone | **Not** sufficient consent for auto-response |
| OAuth alone | **Not** sufficient consent for automated actions through a user’s account — need clear description + express consent + honor opt-out |
| Advertiser/brand campaigns | May need extra X approval |

Developer Guidelines table: **Reply to users** = conditional — only if user engaged first; max **1 reply per interaction**.

---

## 4. AI automated replies — extra limits

Official positions (accessed 2026-09-04):

1. **Automation Rules §II.B.3 — AI-Powered Automated Replies:** AI reply bots that generate dynamic responses are conceptually allowed **only with prior written and explicit approval from X**. Request via dedicated PoC or developer portal review.
2. **Developer Guidelines — “AI-Generated Content & Replies”:** Requires **prior approval from X** before deployment; still must follow all rules; contact via Policy Support form; cannot impersonate humans. Deploying AI-generated replies **without approval is a violation**, even if “helpful.”

**Implication:** An always-on “AI auto-reply” product feature is **out of policy** until X grants written approval.

---

## 5. Product rule for X WORLD MVP

| Stage | Allowed? |
| --- | --- |
| Model generates a **draft** reply offline / in-app | Yes (local UX; do not post automatically) |
| **USER reviews** draft | Required |
| **USER sends** (explicit click → API `POST /2/tweets`) | Required |
| Server/cron **auto-posts** AI replies | **No** for MVP |
| Auto-like / engagement farming tied to replies | **No** |

**One-liner:** **AI drafts → USER reviews → USER sends (not auto-reply MVP).**

This keeps the product inside:

- User-initiated write actions,
- Self-serve summon constraints (user chooses when/where to reply),
- Avoidance of AI auto-reply approval gate until later.

---

## 6. Related write risks

| Action | Note |
| --- | --- |
| Automated likes | **Prohibited** (“may not like posts … in an automated manner”) |
| Bulk follow | **Prohibited** |
| Non-API automation / scraping | Permanent suspension risk |

---

## Citations

- https://docs.x.com/x-api/posts/manage-tweets/introduction — 2026-09-04  
- https://docs.x.com/x-api/posts/create-post — 2026-09-04  
- https://help.x.com/en/rules-and-policies/x-automation — 2026-09-04  
- https://docs.x.com/developer-guidelines — 2026-09-04  
