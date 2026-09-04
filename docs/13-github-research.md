# 13 — GitHub Research

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)  
**Method:** WebFetch of official samples + WebSearch; GitHub API rate-limited unauthenticated at research time.

---

## Official: xdevplatform/samples

- Repo: https://github.com/xdevplatform/samples
- Stars on fetched page: about 3,204 (2026-09-04)
- Purpose: Working X API v2 samples (Python, JavaScript, Ruby, Java, R)
- LLM map fetched: https://raw.githubusercontent.com/xdevplatform/samples/main/llms.txt (2026-09-04)

### Auth patterns (from llms.txt)

| Type | Use | Env |
|------|-----|-----|
| Bearer Token | App-only read | BEARER_TOKEN |
| OAuth 2.0 PKCE | User actions (post, like, repost, bookmark, mute) | CLIENT_ID, CLIENT_SECRET |
| OAuth 1.0a | Legacy user context | CONSUMER_KEY, CONSUMER_SECRET |

API base: `https://api.x.com/2/`

### Useful sample areas for X WORLD

| Need | Endpoints / areas in llms.txt | MVP relevance |
|------|-------------------------------|---------------|
| OAuth / me | GET /2/users/me; OAuth 2.0 PKCE | Link x_accounts |
| Users lookup | GET /2/users/by | Person nodes |
| Followers / following | GET /2/users/:id/followers, .../following | Lazy Graph edges (paginated) |
| Posts | POST/DELETE/GET /2/tweets; user timeline | Post nodes, CREATE_POST |
| Likes | POST /2/users/:id/likes; liked tweets; liking users | ENGAGED_WITH (gated) |
| Search recent | GET /2/tweets/search/recent | Discovery quests (Tier C, budgeted) |
| Search all | GET /2/tweets/search/all | Archive; treat as Tier D |
| Bookmarks | bookmarks endpoints | Optional later |
| Compliance / usage | compliance/, usage/ folders | Cost + policy instrumentation |

Prefer `javascript/` and `python/` samples as reference for XApiProvider. Keep secrets server-side.

### Low priority for MVP

- Filtered / sampled streams
- DM send (abuse / policy sensitive)
- Media upload
- Lists manage (Community v2 maybe)


## Viz libs (ideas only)

- r3f-forcegraph: https://github.com/vasturiano/r3f-forcegraph
- reagraph: https://github.com/reaviz/reagraph
- d3-force-3d as worker layout
- react-force-graph for prototypes

Sources checked 2026-09-04 via WebSearch.

## Architecture feed

Map official samples to XApiProvider. Keep MockProvider for Concept Demo.
