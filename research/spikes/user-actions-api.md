# Spike: User Actions API Matrix (X API v2)

**Project:** X WORLD  
**Access date:** 2026-09-04  
**Merged into:** [`../../docs/02-x-api-capability-map.md`](../../docs/02-x-api-capability-map.md) §5  

Official sources: [docs.x.com](https://docs.x.com/x-api/llms.txt), OpenAPI on action pages (v2.168), [Developer Guidelines](https://docs.x.com/developer-guidelines), [Automation rules](https://help.x.com/en/rules-and-policies/x-automation) (updated April 2026).

---

## Design constraints (non-negotiable for X WORLD)

1. **NO bulk / aggressive follow** — Automation Rules + Developer Guidelines prohibit bulk/aggressive/indiscriminate following.
2. **Likes must be user-initiated** — “You may not like posts … in an automated manner.” Auto-like / bulk like / selling likes = prohibited. **No auto-like core.**
3. Prefer **user-confirm** UX for all write engagement.
4. Official API only — **no scrapers**.

---

## Matrix

| Action | Can API? | Endpoint | OAuth2 scopes (OpenAPI) | User auth required? | User-initiated? | Automation restrictions | Policy risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Follow | Yes | `POST /2/users/{id}/following` | `follows.write`, `users.read`, `tweet.read` | Yes | **Yes for SAFE use** | No bulk/aggressive/automated follow | **UNSAFE** auto/bulk · **SAFE** explicit user action |
| Unfollow | Yes | `DELETE /2/users/{source}/following/{target}` | `follows.write`, `users.read`, `tweet.read` | Yes | Yes | No bulk aggressive unfollow | **UNSAFE** bulk · **SAFE** user-driven |
| Like | Yes | `POST /2/users/{id}/likes` | `like.write`, `users.read`, `tweet.read` | Yes | **Required** | Auto-like prohibited | **UNSAFE** if automated · **SAFE** only user-initiated |
| Unlike | Yes | `DELETE /2/users/{id}/likes/{tweet_id}` | `like.write`, `users.read`, `tweet.read` | Yes | Yes | — | **SAFE** user-driven |
| Repost | Yes | `POST /2/users/{id}/retweets` | `tweet.write`, `users.read`, `tweet.read` | Yes | Preferred | Informational OK; bulk/spam = violation | **CAUTION**/UNSAFE as auto core |
| Unrepost | Yes | `DELETE /2/users/{id}/retweets/{source_tweet_id}` | `tweet.write`, `users.read`, `tweet.read` | Yes | Yes | — | **SAFE** user-driven |
| Bookmark | Yes | `POST /2/users/{id}/bookmarks` | `bookmark.write`, `users.read`, `tweet.read` | Yes | Optional | Guidelines: fine for personal/automated | **SAFE** |
| Unbookmark | Yes | `DELETE /2/users/{id}/bookmarks/{tweet_id}` | `bookmark.write`, `users.read`, `tweet.read` | Yes | — | — | **SAFE** |
| Create Post | Yes | `POST /2/tweets` | `tweet.write`, `users.read`, `tweet.read` | Yes | Preferred | No spam / identical multi-account posts | **SAFE** with user review |
| Reply | Yes | `POST /2/tweets` + `reply.in_reply_to_tweet_id` | `tweet.write`… | Yes | **Required for MVP** | Self-serve summon rule; auto needs opt-in; AI needs X approval | **UNSAFE** auto · **SAFE** draft→user send |
| Quote | Partial | `quote_tweet_id` on create | `tweet.write`… | Yes | Preferred | **Enterprise required** for quote-posting (create-post warning); spam rules | **UNSAFE** on PPU (gated) |
| Lists | Yes | create/update/delete/members/pin | `list.write`, `list.read`, … | Yes | Preferred | No bulk/indiscriminate member adds | **CAUTION** · bulk = **UNSAFE** |
| Mute | Yes | `POST /2/users/{id}/muting` | `mute.write`, `users.read`, `tweet.read` | Yes | Preferred | — | **SAFE** user-driven |
| Block | Lookup yes; write Enterprise | `GET/POST/DELETE .../blocking` | `block.read` / `block.write` | Yes | Preferred | Write endpoints **Enterprise only** | **UNSAFE** on self-serve write · Enterprise user-driven **SAFE** |

### Pricing categories (actions)

From [Pricing](https://docs.x.com/x-api/getting-started/pricing) (accessed 2026-09-04):

- **User Interaction: Create** — $0.015 / request (follow/like-class interactions)
- **Interaction: Delete** — $0.010 / request
- **Bookmark** — $0.005 / request
- **Post: Create** — $0.015 ($0.200 with URL; $0.010 summoned)
- **List: Create / Manage** — $0.010 / $0.005

Confirm live rates in Developer Console.

---

## Recommended MVP wiring

| Feature | Wire? | How |
| --- | --- | --- |
| Follow from UI | Optional | Button → user OAuth → single follow; rate-limit & UX friction |
| Auto-follow graph expansion | **No** | Policy **UNSAFE** |
| Like button | Yes | User tap only |
| Auto-like / like-farm | **No** | Hard ban |
| Compose / reply | Yes | AI draft optional → **user sends** |
| Auto-reply bot | **No** (MVP) | Needs X approval + summon/opt-in; out of MVP |
| Bookmark | Yes | Low risk |
| Block | Defer | Enterprise write |

---

## Citations

- https://docs.x.com/x-api/users/follow-user — 2026-09-04  
- https://docs.x.com/x-api/users/like-post — 2026-09-04  
- https://docs.x.com/x-api/users/repost-post — 2026-09-04  
- https://docs.x.com/x-api/users/create-bookmark — 2026-09-04  
- https://docs.x.com/x-api/users/mute-user — 2026-09-04  
- https://docs.x.com/x-api/posts/create-post — 2026-09-04  
- https://docs.x.com/x-api/posts/manage-tweets/introduction — 2026-09-04  
- https://docs.x.com/x-api/users/blocks/introduction — 2026-09-04  
- https://docs.x.com/developer-guidelines — 2026-09-04  
- https://help.x.com/en/rules-and-policies/x-automation — 2026-09-04  
