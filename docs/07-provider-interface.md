# 07 — Data Provider Interface

**Phase:** 0  
**Updated:** 2026-09-04 (Asia/Taipei)

---

## Purpose

Isolate all external social data behind one contract so:

1. Concept Demo runs on **MockProvider** with zero X API spend.
2. Production swaps to **XApiProvider** without UI rewrites.
3. Compliance can wrap either implementation uniformly.

**UI → Domain → Provider.** Never UI → X API.

---

## Interface (conceptual TypeScript)

```ts
type Page<T> = { items: T[]; nextCursor?: string };

interface DataProvider {
  readonly name: 'mock' | 'xapi';

  // Identity / users
  getMe(): Promise<PersonDTO>;
  getUserByUsername(username: string): Promise<PersonDTO | null>;
  getUserById(xUserId: string): Promise<PersonDTO | null>;

  // Graph (paginated, lazy)
  getFollowingPage(xUserId: string, cursor?: string): Promise<Page<PersonDTO>>;
  getFollowersPage(xUserId: string, cursor?: string): Promise<Page<PersonDTO>>;

  // Content
  getUserPosts(xUserId: string, cursor?: string): Promise<Page<PostDTO>>;
  getPost(postId: string): Promise<PostDTO | null>;
  searchRecent(query: string, cursor?: string): Promise<Page<PostDTO>>; // Tier C; budgeted

  // User-gated writes (must pass Compliance + explicit user confirm)
  followUser(targetXUserId: string): Promise<void>;
  unfollowUser(targetXUserId: string): Promise<void>;
  likePost(postId: string): Promise<void>;
  replyToPost(postId: string, text: string): Promise<PostDTO>;
  createPost(text: string): Promise<PostDTO>;

  // Optional stubs
  fullArchiveSearch?(query: string): Promise<never>; // refuse / Tier D
}
```

DTOs map into `entities` / `posts` / `relationships` in the Repository layer.

---

## XApiProvider

- Uses **X API v2** base `https://api.x.com/2/`.
- **OAuth 2.0 PKCE** for user-context reads/writes (follow, like, post, reply).
- App **Bearer** only where policy/product allows app-only reads.
- Implements pagination via API meta `next_token` → `nextCursor`.
- Maps errors: 429 → retry/budget UX; 403 scope → reconnect OAuth; 402/payment → cost gate.
- Reference samples: [github.com/xdevplatform/samples](https://github.com/xdevplatform/samples) (Python/JS users, posts, likes, OAuth) — see `13-github-research.md`.

**Must not:** scrape, drive logged-in browser, or call undocumented GraphQL.

---

## MockProvider

- Loads `/workspace/x-world/mock/sample-world.json` (or bundled copy).
- In-memory graph; cursors are opaque offsets.
- Writes mutate in-memory state (and optionally append to a session log) so the world evolves in Concept Demo.
- Deterministic Opportunity inputs for demo beats.

---

## Swap path for Concept Demo

| Step | Action |
|------|--------|
| 1 | `PROVIDER_MODE=mock` |
| 2 | App boots MockProvider; Domain scores NBA from seed world |
| 3 | Video / interactive demo never touches X network |
| 4 | Later: set `PROVIDER_MODE=xapi`, complete PKCE link, same Domain/UI |
| 5 | Feature flags per write method until scopes + budgets verified |

**Acceptance:** Switching provider changes *data origin* only — NBA enum, quest types, and graph UX remain identical.

---

## Compliance wrapper (pseudo)

```ts
class CompliantProvider implements DataProvider {
  constructor(private inner: DataProvider, private compliance: ComplianceLayer) {}
  async followUser(id: string) {
    await this.compliance.assertUserGated('FOLLOW');
    await this.compliance.assertNotBulkFarm('FOLLOW');
    await this.compliance.chargeBudget('write:follow');
    return this.inner.followUser(id);
  }
}
```

---

## Testing

- Contract tests run against MockProvider in CI.
- Optional recorded fixtures for XApiProvider (no live calls in default CI).
