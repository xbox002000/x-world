# 03 — X Policy Compliance (Project X WORLD)

**Access date:** 2026-09-04  
**Scope:** Automation, engagement writes, content storage / deletion / redistribution from **official** X developer & help policies.  
**Related:** [`02-x-api-capability-map.md`](./02-x-api-capability-map.md) · [`../research/spikes/ai-reply-policy.md`](../research/spikes/ai-reply-policy.md) · [`../research/spikes/user-actions-api.md`](../research/spikes/user-actions-api.md)

> Architecture rule: **official X API only**. Scraping, browser scripting, or unofficial automation = permanent ban risk.

---

## 1. Binding policy stack

Developers must comply with **all** of:

| Policy | URL | Accessed |
| --- | --- | --- |
| Developer Guidelines | https://docs.x.com/developer-guidelines | 2026-09-04 |
| Developer Agreement & Policy | https://developer.x.com/en/developer-terms/agreement-and-policy.html | 2026-09-04 |
| Automation Rules | https://help.x.com/en/rules-and-policies/x-automation | 2026-09-04 (page: Updated April 2026) |
| X Rules / spam & following rules | help.x.com rules hub | 2026-09-04 |
| Display / Brand guidelines | about.x.com brand toolkit (linked from guidelines) | 2026-09-04 |

---

## 2. Automation — what’s allowed vs not

### 2.1 Ground rules (Automation Rules)

**Do:** broadcast helpful info; auto-reply only when users engage/opt in; use official API; stay within rate limits; good UX.  
**Don’t:** spam; script the website; unsolicited messages; abuse/privacy violations; circumvent rate limits; trend manipulation; duplicative multi-account posting.

### 2.2 Automated actions through another user’s account

OAuth authorization **alone is not consent** for automation. Required:

1. Clearly describe automated actions,
2. Receive **express consent**,
3. Immediately honor **opt-out**,
4. Re-consent if purpose changes substantially.

Applies to posting, DMs, deletes, follow/unfollow, etc.

### 2.3 Action cheat-sheet (Developer Guidelines)

| Action | Allowed? | Rules (official) |
| --- | --- | --- |
| Post tweets | Yes (with limits) | No unsolicited @mentions; no identical cross-posting |
| Reply | Conditional | Only if user engaged first; max 1 reply per interaction |
| DMs | Conditional | Only after user DMs first; easy opt-out |
| Like | Conditional | **Must be directly user-initiated**; auto/bulk/selling likes prohibited |
| Repost / Quote | Conditional | Informational OK; no bulk spam/manipulation |
| Follow/Unfollow | **No (bulk/auto)** | No bulk, aggressive, or automated following |
| Add to Lists | Conditional | No bulk/indiscriminate adds |
| Bookmark | Yes | Fine for personal/automated use |
| Search/Read | Yes | Within rate limits |

### 2.4 AI replies

- Automation Rules: AI-powered automated reply bots require **prior written explicit approval from X**.
- Developer Guidelines: AI-generated content & replies require **prior approval**; deploying without approval is a violation.

**X WORLD:** AI draft → user review → user send. No auto-reply MVP. See [ai-reply-policy.md](../research/spikes/ai-reply-policy.md).

### 2.5 Self-serve API reply/quote gates

- Replies: only if target author **summoned** the account (@mention or quote) — Manage Posts docs.
- Quote create: **Enterprise** required — Create Post docs.

---

## 3. Prohibited activities (hard fails)

From Developer Guidelines “Prohibited activities” (accessed 2026-09-04):

- Spam & manipulation (fake engagement, trend manipulation, bulk posting)
- Unsolicited outreach (auto-replies to random users, bulk DMs, uninvited mentions)
- Deceptive bots / impersonation
- Engagement selling (likes, follows, retweets, views)
- Rate-limit abuse
- **Non-API automation** (browser scripting, scraping)
- Account farms
- Surveillance / profiling without consent
- **Unauthorized AI/ML training** on X data (Grok excepted)
- Sensitive attribute inference
- Excessive redistribution (>1.5M Post IDs / 30 days to a single entity)

---

## 4. Content storage, deletion, redistribution

### 4.1 Content deletion deadlines

| Trigger | Deadline |
| --- | --- |
| X requests deletion | **24 hours** |
| User requests deletion | **24 hours** |
| Content suspended/removed on X | **24 hours** |
| API access terminated | **10 business days** — delete **all** X data |

Use Compliance streams/firehose where applicable to receive deletion events ([Compliance docs](https://docs.x.com/x-api/compliance/batch-compliance/introduction)).

### 4.2 Display requirements

- Proper attribution / brand guidelines  
- No content alterations beyond display formatting  
- No iframes for X content  
- **Respect removals within 24 hours** if deleted on X  

### 4.3 Redistribution technical caps

| Restriction | Limit |
| --- | --- |
| Post ID redistribution | Max **1.5M Post IDs** per 30-day period to any single entity |
| Hydrated content redistribution | Max **50,000** hydrated Posts or Users per recipient per day |
| AI/ML training | Prohibited (except Grok) |
| Non-API access | Prohibited |
| Competitive benchmarking | Prohibited |
| Duplicate apps to bypass limits | Prohibited |

### 4.4 Off-X matching

Allowed with **express opt-in** when linking X identity to your customer records. Without consent, only match info the user gave you, public X data, or public directories — never in a way that would **surprise** the user.

### 4.5 Sensitive data

Do not derive health, financial hardship, political, racial/ethnic, religious, sexual orientation, trade-union, or criminal attributes from X content (aggregate research exceptions are narrow — see guidelines).

---

## 5. Pricing / access compliance note

X API v2 is **pay-per-usage** ([Pricing](https://docs.x.com/x-api/getting-started/pricing)): credits in Console; per-resource reads; per-request writes; Owned Reads discount; 24h dedup; **3M Post reads / month** PPU cap. Government and some commercial patterns may require Enterprise.

---

## 6. X WORLD compliance checklist (MVP)

- [ ] OAuth user context for all writes; scopes least-privilege  
- [ ] No scraper / headless browser path in architecture  
- [ ] Follow/like only from explicit user gestures; no auto-follow / auto-like jobs  
- [ ] Reply composer: AI draft only; user must submit  
- [ ] Store Post/User IDs + minimal fields; wire compliance deletion ≤24h  
- [ ] No redistribution of hydrated content beyond caps  
- [ ] No training foundation models on stored X content  
- [ ] Document express consent for any off-X identity matching  

---

## Citation index

| Source | URL | Accessed |
| --- | --- | --- |
| Developer Guidelines | https://docs.x.com/developer-guidelines | 2026-09-04 |
| Automation Rules | https://help.x.com/en/rules-and-policies/x-automation | 2026-09-04 |
| Pricing | https://docs.x.com/x-api/getting-started/pricing | 2026-09-04 |
| Manage Posts | https://docs.x.com/x-api/posts/manage-tweets/introduction | 2026-09-04 |
| Create Post | https://docs.x.com/x-api/posts/create-post | 2026-09-04 |
| Agreement & Policy | https://developer.x.com/en/developer-terms/agreement-and-policy.html | 2026-09-04 |
