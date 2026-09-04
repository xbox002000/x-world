# 02 — X API v2 Capability Map (Project X WORLD)

**Access date:** 2026-09-04  
**Sources:** Official docs at [docs.x.com](https://docs.x.com) / [developer.x.com](https://developer.x.com) (OpenAPI revision noted as **X API v2 `2.168`** on endpoint pages).  
**Architecture note:** Use only official X API. **No scrapers** as product architecture.

---

## 1. Authenticated user — `GET /2/users/me`

**Confirmed:** Requires **User Context** (OAuth 2.0 Authorization Code + PKCE or OAuth 1.0a). App-only Bearer is not sufficient.  
**OAuth2 scopes (OpenAPI):** `users.read`, `tweet.read`.

**Cite:** [Get Users Me](https://docs.x.com/x-api/users/get-my-user) · [About the X API](https://docs.x.com/x-api/getting-started/about-x-api) — accessed 2026-09-04.

### 1.1 `user.fields` — confirmed vs uncertain

From OpenAPI `UserFieldsParameter` enum on `/2/users/me` (v2.168):

| Field | Status | Notes |
| --- | --- | --- |
| `id` | **Confirmed** | Always available (default) |
| `name` | **Confirmed** | Display name |
| `username` | **Confirmed** | Handle |
| `profile_image_url` | **Confirmed** | Avatar URL |
| `description` | **Confirmed** | Bio |
| `location` | **Confirmed** | Freeform profile location |
| `created_at` | **Confirmed** | Account creation time |
| `public_metrics` | **Confirmed** | followers/following/tweet/listed counts |
| `verified` | **Confirmed** | Verification flag |
| `verified_followers_count` | **Confirmed** | In `user.fields` enum |
| `subscription` | **Confirmed** | In `user.fields` enum |
| `subscription_type` | **Confirmed** | In `user.fields` enum |
| `protected` | **Confirmed** | Protected account |
| `verified_type` | **Confirmed** | In enum |
| `entities` | **Confirmed** | Bio/URL entities |
| `url` | **Confirmed** | Profile website |
| `profile_banner_url` | **Confirmed** | Banner |
| `withheld` | **Confirmed** | Withholding metadata |
| `confirmed_email` | **Confirmed** | In enum (authenticated/me context) |
| `connection_status` | **Confirmed** | Relationship array vs requesting user |
| `is_identity_verified` | **Confirmed** | In enum |
| `parody` | **Confirmed** | In enum |
| `receives_your_dm` | **Confirmed** | In enum |
| `subscriber_count` | **Confirmed** | In enum |
| `subscribes_to_you` | **Confirmed** | In enum |
| `pinned_tweet_id` / `pinned_post_id` | **Confirmed (expansion)** | OpenAPI expansions: `pinned_post_id` (not listed under `user.fields` in v2.168). Legacy “tweet” naming may still appear in older clients — treat as **compat/uncertain** if used as `user.fields`. |
| `most_recent_tweet_id` / `most_recent_post_id` | **Confirmed (expansion)** | OpenAPI expansions: `most_recent_post_id`. Same naming note as above. |
| `affiliation` | **Confirmed (expansion)** | Expansion `affiliation` |

**`connection_status` values (confirmed):** `following`, `followed_by`, `blocking`, `muting`, `follow_request_sent`, `follow_request_received`.

---

## 2. User Graph

**Cite:** [Follows introduction](https://docs.x.com/x-api/users/follows/introduction) · [Mutes](https://docs.x.com/x-api/users/mutes/introduction) · [Blocks](https://docs.x.com/x-api/users/blocks/introduction) · [Lists](https://docs.x.com/x-api/lists/list-lookup/introduction) — accessed 2026-09-04.

| Capability | Endpoint(s) | Auth / scopes | Notes |
| --- | --- | --- | --- |
| Followers list | `GET /2/users/:id/followers` | `follows.read` (+ `users.read`, `tweet.read`); Bearer also listed | Any public user ID |
| Following list | `GET /2/users/:id/following` | same | Any public user ID |
| Follow | `POST /2/users/:id/following` | User auth; `follows.write` | Target in JSON body |
| Unfollow | `DELETE /2/users/:source_user_id/following/:target_user_id` | `follows.write` | |
| Relationship / connection | `user.fields=connection_status` on user lookup | User context | See enum above |
| Mutes list | `GET /2/users/:id/muting` | `mute.read` | Authenticated user |
| Mute / unmute | `POST .../muting`, `DELETE .../muting/:target` | `mute.write` | |
| Blocks list | `GET /2/users/:id/blocking` | `block.read` | Pay-per-use + Enterprise for lookup |
| Block / unblock | `POST/DELETE .../blocking` | `block.write` | **Write = Enterprise only** (official callout) |
| Owned / followed / pinned lists | `GET .../owned_lists`, `followed_lists`, `pinned_lists` | `list.read` | |
| List memberships | `GET /2/users/:id/list_memberships` | `list.read` | |
| List members / followers | `GET /2/lists/:id/members`, `.../followers` | `list.read` | |

### Q1–Q5 (explicit)

| # | Question | Answer |
| --- | --- | --- |
| **Q1** | Can we know A follows B? | **Yes**, for the **authenticated** user: request B (or list membership) with `user.fields=connection_status` and look for `following` / `followed_by`. Alternatively page `GET /2/users/{A}/following` when A is known and accessible. There is **no** general-purpose “does arbitrary A follow arbitrary B?” friendship endpoint documented for v2 beyond connection_status (auth user) + list scans. |
| **Q2** | Mutual? | **Yes** for auth user: both `following` and `followed_by` present in `connection_status`. For two third parties: only by intersecting followers/following lists (costly; see Q5). |
| **Q3** | Who did A recently follow? | **No dedicated “recent follows” endpoint** in official docs. `GET /2/users/:id/following` returns the following set with pagination; **follow-time ordering is not documented** as a guaranteed chronological “recent follows” feed. Treat as a **gap / uncertain**. |
| **Q4** | Get a user's followers/following? | **Yes** — `GET /2/users/:id/followers` and `GET /2/users/:id/following` ([Follows intro](https://docs.x.com/x-api/users/follows/introduction)). Protected accounts require appropriate user auth/authorization. |
| **Q5** | API cost per user fetch? | Official **pay-per-usage** ([Pricing](https://docs.x.com/x-api/getting-started/pricing), accessed 2026-09-04): **User: Read = $0.010 / resource**; **Following/Followers: Read = $0.010 / resource**. **Owned Reads** (app owner + `{id}` = that user) on followers/following/etc. = **$0.001 / resource**. Dedup within 24h UTC soft window. Cap: **3M Post reads / monthly cycle** on PPU (upgrade to Enterprise for higher). Writes: **User Interaction: Create = $0.015** (covers follow/like-class interactions per pricing table). Always verify live rates in [Developer Console](https://console.x.com) / [developer.x.com#pricing](https://developer.x.com/#pricing). |

---

## 3. Post / Content

**Cite:** [Timelines](https://docs.x.com/x-api/posts/timelines/introduction) · [Search Posts](https://docs.x.com/x-api/posts/search/introduction) · [Manage Posts](https://docs.x.com/x-api/posts/manage-tweets/introduction) · [Likes](https://docs.x.com/x-api/posts/likes/introduction) · [Bookmarks](https://docs.x.com/x-api/posts/bookmarks/introduction) · [Retweets/Reposts](https://docs.x.com/x-api/posts/retweets/introduction) · [Quote Posts](https://docs.x.com/x-api/posts/quote-tweets/introduction) — accessed 2026-09-04.

| Area | Endpoint | Realistic access |
| --- | --- | --- |
| User timeline | `GET /2/users/:id/tweets` | Up to ~3,200 recent; exclude replies/reposts |
| Mentions | `GET /2/users/:id/mentions` | Up to ~800 recent |
| Home (rev chrono) | `GET /2/users/:id/timelines/reverse_chronological` | Auth user; ~3,200 or 7 days |
| Lookup | `GET /2/tweets`, `GET /2/tweets/:id` | By ID |
| Recent search | `GET /2/tweets/search/recent` | Last **7 days**; all developers |
| Full-archive search | `GET /2/tweets/search/all` | Back to 2006; **PPU + Enterprise** |
| Quotes | `GET` quoted posts for a Post | Lookup quotes of a Post |
| Reposts | manage + lookup who reposted | `POST /2/users/:id/retweets` etc. |
| Likes | liked posts / likers / like-unlike | User auth for write |
| Bookmarks | get / create / delete | Auth user only |
| Replies (read) | via search `conversation_id` / mentions / thread fields | Reconstruct with `conversation_id` |
| Create / reply / quote | `POST /2/tweets` | See §5 + AI reply spike |

### 3.1 Post field tree (`post.fields` / tweet fields)

Confirmed enum from OpenAPI on `/2/users/me` expansions (`PostFieldsParameter`, v2.168):

```
Post
├── id, text, created_at, lang, source
├── conversation_id, display_text_range
├── public_metrics          # likes, reposts, replies, quotes, bookmarks (as exposed)
├── non_public_metrics, organic_metrics, promoted_metrics  # auth/owned context
├── entities, attachments, media_metadata, matched_media_notes
├── context_annotations
├── geo, withheld, possibly_sensitive
├── reply_settings, scopes
├── edit_controls
├── article, article_title, note_post, note_request_suggestions
├── community_id, card_uri, paid_partnership
└── suggested_source_links[+_with_counts]
```

Common expansions (documented across posts docs): `author_id`, `referenced_tweets.id`, `attachments.media_keys`, `geo.place_id`, etc. (see [Data dictionary](https://docs.x.com/x-api/fundamentals/data-dictionary)).

**Pricing (posts):** Post read **$0.005**/resource; Post create **$0.015** ( **$0.200** if contains URL; summoned create **$0.010**).

---

## 4. What content exploration is realistically possible today

**Practical today (PPU, official API only):**

1. Auth user profile via `/2/users/me` + rich `user.fields`.
2. Lookup users by ID/username; `connection_status` vs auth user.
3. Page followers/following (costly at scale: $0.01/user resource).
4. User timelines, mentions, reverse-chron home timeline.
5. Recent search (7d) and full-archive search (PPU) with operators.
6. Thread reconstruction via `conversation_id`.
7. Likes/bookmarks/lists for the authenticated user (Owned Read discount when applicable).
8. Create posts; replies under **summon / opt-in** constraints (self-serve).
9. Like/repost/bookmark/follow **as user-initiated actions** (not automation cores).

**Not realistic / blocked without Enterprise or approval:**

- Block/unblock **writes** (Enterprise).
- Quote-create via API on self-serve (**Enterprise** required per create-post warning).
- Unsolicited auto-replies / AI auto-reply bots without **prior written X approval**.
- Bulk/aggressive follow or auto-like cores (policy-prohibited).
- Scraping / browser automation (permanent ban risk).
- Dedicated “recent follows” stream (not documented).
- Training ML on X data (prohibited except Grok).

---

## 5. User Action API matrix (SAFE vs UNSAFE)

> Full spike: [`../research/spikes/user-actions-api.md`](../research/spikes/user-actions-api.md)  
> Policy detail: [`03-x-policy-compliance.md`](./03-x-policy-compliance.md) · [`../research/spikes/ai-reply-policy.md`](../research/spikes/ai-reply-policy.md)

| Action | Can API? | OAuth scopes | User auth? | User-initiated? | Automation restrictions | Policy risk |
| --- | --- | --- | --- | --- | --- | --- |
| **Follow** | Yes `POST /2/users/:id/following` | `follows.write`, `users.read`, `tweet.read` | Yes | Required for product | **No bulk/aggressive/automated following** | **UNSAFE** as auto/bulk; **SAFE** only as explicit user click |
| **Unfollow** | Yes `DELETE .../following/:target` | `follows.write`… | Yes | Required | Same as follow | **UNSAFE** bulk; **SAFE** user-driven |
| **Like** | Yes `POST /2/users/:id/likes` | `like.write`… | Yes | **Must be user-initiated** | Auto-like / bulk like **prohibited** | **UNSAFE** if auto; **SAFE** user-initiated only — **no auto-like core** |
| **Unlike** | Yes | `like.write`… | Yes | User-driven | Same spirit | **SAFE** user-driven |
| **Repost** | Yes `POST /2/users/:id/retweets` | `tweet.write`… | Yes | Prefer user-driven | Informational OK; no bulk spam | **CAUTION** → treat auto as **UNSAFE** for MVP |
| **Unrepost** | Yes | `tweet.write`… | Yes | User-driven | — | **SAFE** user-driven |
| **Bookmark** | Yes `POST .../bookmarks` | `bookmark.write`… | Yes | — | Guidelines: OK personal/automated | **SAFE** (low) |
| **Unbookmark** | Yes | `bookmark.write`… | Yes | — | — | **SAFE** |
| **Create Post** | Yes `POST /2/tweets` | `tweet.write`… | Yes | Prefer user confirm | No spam / identical cross-post | **SAFE** with user review |
| **Reply** | Yes via `reply.in_reply_to_tweet_id` | `tweet.write`… | Yes | **Critical** | Self-serve: only if author **summoned** you (@mention/quote). Auto-reply needs opt-in + max 1/interaction; **AI bots need prior X approval** | **UNSAFE** auto; **SAFE** draft→user send |
| **Quote** | Parameter exists; **Enterprise for quote_tweet_id** on create | `tweet.write`… | Yes | — | Same spam rules; Enterprise gate | **UNSAFE** on PPU (unavailable); Enterprise **CAUTION** |
| **Lists** | Create/manage/members | `list.write` / `list.read` | Yes | — | No bulk/indiscriminate adds | **CAUTION** / **UNSAFE** if bulk |
| **Mute** | Yes | `mute.write` | Yes | Prefer user | — | **SAFE** user-driven |
| **Block** | Lookup PPU; **write Enterprise** | `block.read` / `block.write` | Yes | — | Enterprise for write | **UNSAFE** on PPU (can't write); Enterprise user-driven **SAFE** |

**Product emphasis (X WORLD):**  
- **NO** bulk/aggressive follow.  
- **Likes must be user-initiated**; **no auto-like core**.  
- **AI drafts → USER reviews → USER sends** (not auto-reply MVP).

---

## 6. Reply / AI Reply (summary)

See full spike: [`../research/spikes/ai-reply-policy.md`](../research/spikes/ai-reply-policy.md).

| Topic | Official position (2026-09-04) |
| --- | --- |
| Create reply via API | **Yes** — `POST /2/tweets` + `reply.in_reply_to_tweet_id` |
| Self-serve restriction | Replies only if original author **@mentioned** or **quoted** the replying account (“summoned”) |
| Automation | Unsolicited auto-replies/mentions **not permitted**; opt-in + opt-out + 1 reply/interaction |
| AI automated replies | **Prior written/explicit approval from X required** ([Automation rules](https://help.x.com/en/rules-and-policies/x-automation) Apr 2026; [Developer Guidelines](https://docs.x.com/developer-guidelines)) |
| **X WORLD product rule** | AI may **draft** only → **user reviews** → **user sends**. No auto-reply MVP. |

---

## 7. Citation index

| Doc | URL | Accessed |
| --- | --- | --- |
| Docs index | https://docs.x.com/llms.txt | 2026-09-04 |
| Get me | https://docs.x.com/x-api/users/get-my-user | 2026-09-04 |
| Follows | https://docs.x.com/x-api/users/follows/introduction | 2026-09-04 |
| Pricing | https://docs.x.com/x-api/getting-started/pricing | 2026-09-04 |
| About API | https://docs.x.com/x-api/getting-started/about-x-api | 2026-09-04 |
| Search | https://docs.x.com/x-api/posts/search/introduction | 2026-09-04 |
| Timelines | https://docs.x.com/x-api/posts/timelines/introduction | 2026-09-04 |
| Manage posts | https://docs.x.com/x-api/posts/manage-tweets/introduction | 2026-09-04 |
| Create post | https://docs.x.com/x-api/posts/create-post | 2026-09-04 |
| Developer guidelines | https://docs.x.com/developer-guidelines | 2026-09-04 |
| Automation rules | https://help.x.com/en/rules-and-policies/x-automation | 2026-09-04 |
| Blocks | https://docs.x.com/x-api/users/blocks/introduction | 2026-09-04 |
