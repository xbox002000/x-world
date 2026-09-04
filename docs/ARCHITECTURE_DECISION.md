# Architecture Decision Record — Phase 0

**Updated:** 2026-09-04 (Asia/Taipei)  
**Status:** Accepted for Phase 0 → Phase 1 Concept Prototype  
**Sources:** `01`–`15`, cost model, capability map, OAuth spike

---

## Decisions (summary)

| ID | Decision | Rationale |
|----|----------|-----------|
| ADR-1 | Category: **Interactive X World** | Best brand fit; NBA as payoff (`01`) |
| ADR-2 | Core output: **Next Best Action** | Avoids analytics-only trap |
| ADR-3 | Stack: Next.js/TS/Tailwind/R3F/Three/Supabase/Vercel + X OAuth PKCE + API v2 | Low cost + AI-maintainable |
| ADR-4 | Postgres relational + `relationships` table | No graph DB for MVP |
| ADR-5 | Provider: MockProvider \| XApiProvider | Demo without API spend |
| ADR-6 | Compliance Layer wraps Provider | Budgets, user-gated writes, policy |
| ADR-7 | Lazy Graph Expansion | #1 cost control |
| ADR-8 | Prefer R3F over raw Three.js | AI maintainability |
| ADR-9 | Rule+Score v1 (no ML) | Explainable NBA |
| ADR-10 | No K8s/microservices/Kafka/Redis cluster/graph DB/heavy ML | Least resources |
| ADR-11 | Official X API only for production data | Policy + reliability |
| ADR-12 | Never claim we decoded X algorithm | Trust |

---

## Brief answers (must answer)

### 1. 我們到底在做什麼？
把 X 變成可探索、可成長、可遊玩的 **Interactive X World**：公開訊號 + 關係／主題圖 → **Next Best Action** → 使用者確認後行動 → 世界演進。

### 2. MVP 是什麼？
**Mock-first**：ego graph + Rule+Score NBA + user-gated quests；Provider 可換成 X API。見 `11-mvp-definition.md`。

### 3. MVP 明確不做什麼？
Analytics-only 儀表板、自動大量追蹤／按讚／洗互動、scraper、cookie GraphQL、宣稱破解演算法、K8s／微服務／重 ML、AI 自動回覆當核心。

### 4. X API 能做什麼？
`users/me`、followers/following、`connection_status`、時間線、recent search、發文／回覆、like、follow／bookmark（user OAuth）、lists、mute 等。細節：`02-x-api-capability-map.md`。

### 5. X API 不能做什麼？
便宜的「誰剛 follow 了誰」時間線；任意 A→B 友誼不掃描就知；self-serve 上部分 quote／block write 受限；**bulk follow / auto-like 違規**；AI 自動回覆需 X 書面核准；非官方 scraping 會封號。

### 6. 資料怎麼取得？
Production：**官方 X API v2** + 使用者 OAuth。Concept：**MockProvider**。探索到哪、hydrate 到哪（Lazy）。

### 7. 資料怎麼儲存？
Postgres（Supabase）：users / x_accounts / entities / relationships / posts / snapshots / quests / quest_events / user_subscriptions。分層：Tier A live · B snapshot · C derived · D product state。

### 8. API 成本在哪裡？
Followers/Following 展開 + 大量 User／Post hydrate。粗估 naive 混讀 ~$0.41／user／日 → 100 users ~$41／日。見 `04-x-api-cost-model.md`。

### 9. 如何控制成本？
Lazy Graph、節點展開預算、快取 snapshot、去重、Owned-account 價差若適用、禁止登入即全宇宙同步。

### 10. OAuth 怎麼做？
OAuth 2.0 Authorization Code + **PKCE S256**；`offline.access`；access ~2h；**token 只存伺服器加密**，禁止 localStorage；disconnect = revoke + delete。見 `research/spikes/oauth-pkce.md`。

### 11. Graph 怎麼做？
R3F + force layout（d3-force / react-force-graph 類）；Person/Topic/Post/Community；zoom/pan/click/expand；Lazy hydration。

### 12. Recommendation Engine 怎麼演進？
v1 Rule+Score → NBA；v2 加權校准；v3 可選輕量學習——永不宣稱 = X 官方演算法。

### 13. 哪個部分必須從第一天就可替換？
**Data Provider Interface**（Mock ↔ X）、Repository 背後的 DB host、Recommendation scoring 實作。

### 14. 哪個部分可以 hard-code？
Quest 範例文案、NBA 規則權重初值、Mock 世界 JSON、Concept Demo 鏡頭腳本。

### 15. Concept Demo 怎麼先脫離 X API？
`PROVIDER_MODE=mock` + `mock/sample-world.json`：LOGIN → Build World → 節點浮現 → TODAY'S 3 MOVES → 完成 quest → 世界成長。見 `12-concept-demo.md`。

### 16. 第一個真正值得開發的 MVP 是什麼？
**Interactive Concept Prototype（MockProvider）**：可點的 ego world + 3 個 NBA + 少數 quest + Compliance stub。驗證「我要用」再接真 OAuth／API。

---

## Phase 1 gate

When Rock approves: scaffold Next.js app + R3F scene + MockProvider wired to `sample-world.json`. Still no production SaaS sprawl.

## Consequences

- Quests must not encode volume-farm behaviors.
- Writes (follow/like/reply) always user-confirm in product UX.
- Unstaffed / Lemon track remains separate unless Rock re-prioritizes.
