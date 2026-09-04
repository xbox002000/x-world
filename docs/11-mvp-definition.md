# 11 — MVP Definition

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)  
**Question answered:** What is the smallest evolvable core we can build with least resources?

---

## MVP one-liner

**Mock-first Interactive X World: ego graph + Rule+Score Next Best Action + user-gated quests — swappable to X API later.**

---

## Smallest evolvable core

1. Auth shell (Supabase) + optional X OAuth PKCE stub.  
2. Provider Interface + **MockProvider** seeded from `mock/sample-world.json`.  
3. Repository tables: users, entities, relationships, posts, quests, quest_events, user_subscriptions, snapshots (minimal).  
4. R3F Lazy Graph: view, zoom/pan/orbit, click, expand (mock pages).  
5. Opportunity Score → NBA card.  
6. Quest Engine with 3–5 example quests (no farm patterns).  
7. Compliance stubs (deny volume actions; budget counters).  
8. `PROVIDER_MODE` switch documented; XApiProvider can be a thin partial impl or stub behind flag.

---

## MUST

- Next Best Action as primary CTA  
- Person/Topic/Post/Community nodes + edges  
- Lazy expansion  
- Mock-first Concept Demo path  
- User-gated writes  
- Official-API-only production path (when enabled)  
- Domain ↔ Provider separation  

## MUST NOT

- Analytics-only dashboard as the product  
- Auto volume follow/like/DM  
- Unofficial collection / browser-session data as prod source  
- K8s, microservices, Kafka, Redis cluster, graph DB, heavy ML  
- Claiming we decoded X ranking  

---

## Mock-first gate

Phase 0 complete → Phase 1 Interactive Concept Prototype on MockProvider.  
No paid X API required to validate UX loop.

---

## Out of scope for MVP

- Full-archive search  
- Multi-account agencies  
- Cross-platform (LinkedIn etc.)  
- Real-time filtered stream  
- Team seats / SSO  
