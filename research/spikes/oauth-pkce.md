# Spike: OAuth 2.0 Authorization Code + PKCE (X)

**Phase:** 0  
**Date:** 2026-09-04 (Asia/Taipei)  
**Official:** https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code  
**Also:** https://docs.x.com/fundamentals/authentication/overview  
**Samples:** https://github.com/xdevplatform/samples  

Architecture chapter (summary + ID map): `docs/06-system-architecture.md` → **OAuth 2.0 + PKCE chapter**.

---

## 1. Why PKCE

X API v2 user-context auth for modern apps uses **OAuth 2.0 Authorization Code Flow with PKCE**. Supported grant types at launch docs: **authorization_code** + **refresh_token** only.

- **Confidential client** (Web App / Automated App or bot): can hold **Client Secret**; use Basic Auth on token endpoint as required.  
- **Public client** (Native / SPA): no secret; PKCE protects the code exchange.  

**X WORLD recommendation:** Next.js on Vercel → treat token exchange as **confidential server** route (Client Secret in server env). Still use **PKCE (S256)** for defense in depth.

---

## 2. End-to-end flow

### 2.1 Login (authorize)

1. Server generates `state` (CSRF, ≥500 chars) and PKCE `code_verifier`.  
2. Derive `code_challenge` = `BASE64URL(SHA256(verifier))`, method **`S256`** (prefer over `plain`).  
3. Store `{ state, code_verifier, user_session_or_anon }` **server-side** (short TTL cookie / Redis / DB), never in localStorage.  
4. Redirect browser to:

```
https://x.com/i/oauth2/authorize
  ?response_type=code
  &client_id=CLIENT_ID
  &redirect_uri=EXACT_CALLBACK
  &scope=tweet.read%20users.read%20follows.read%20offline.access
  &state=STATE
  &code_challenge=CHALLENGE
  &code_challenge_method=S256
```

Enable OAuth 2.0 in Developer Console App settings; register **exact-match** callback URLs.

### 2.2 Callback

1. Validate `state`.  
2. Exchange within **30 seconds** (auth code TTL):

```
POST https://api.x.com/2/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTH_CODE
&redirect_uri=EXACT_CALLBACK
&code_verifier=VERIFIER
&client_id=CLIENT_ID   # required for public clients; confidential may use Authorization header
```

3. Persist tokens (see §5).  
4. Call `GET /2/users/me` → bind **X User ID**.

### 2.3 Refresh (offline.access)

- Access token default lifetime: **2 hours** (`expires_in` typically 7200) unless documented otherwise.  
- Scope **`offline.access`** required to receive a **refresh token**.  
- Refresh:

```
POST https://api.x.com/2/oauth2/token
grant_type=refresh_token
&refresh_token=...
&client_id=...
```

**Must-do:** Treat refresh tokens as **rotating / single-use** in practice (persist new refresh token **before** using the new access token; serialize refresh per user to avoid races). If refresh fails → force re-authorize.

### 2.4 Revoke / disconnect / logout

| Action | Behavior |
|--------|----------|
| **Logout** | End app Session ID; optionally keep encrypted refresh if “stay connected” |
| **Disconnect X** | Call X revoke endpoint if available / invalidate locally; **delete** access+refresh ciphertext; clear X User ID link; Compliance stops Provider calls |
| **App credential rotate** | Expect mass invalidation → re-auth all users |

---

## 3. Scopes (official table excerpt)

| Scope | Use in X WORLD |
|-------|----------------|
| `users.read` | Profiles, including protected the user can view |
| `tweet.read` | Posts the user can view |
| `follows.read` | Followers / following reads |
| `offline.access` | Refresh token — **required for production** |
| `tweet.write` | Only when user confirms a post/reply |
| `like.write` / `follows.write` | Only on explicit user confirm; never auto |
| `dm.read` / `dm.write` | Avoid MVP |
| `users.email` | Only if product needs email + privacy UX |

**Least privilege:** start read + `offline.access`; add write scopes when a feature needs them (re-consent).

---

## 4. Multi-user model

Many app users ↔ one X developer app (X WORLD) ↔ many X user tokens.

```
App User (users.id)
   1–1..n  Session (session_id)
   1–0..1  X Connection (x_user_id, scopes, status)
              1–1  OAuth Token record (access ciphertext, expiry)
              1–1  Refresh Token record (refresh ciphertext, rotated_at)
```

- Provider calls always run as **that user’s** access token (user context), never a shared user token.  
- App-only Bearer only for endpoints that explicitly allow it and are budgeted (often unused in Lazy Graph MVP).

---

## 5. Secure storage (must-dos)

| Do | Don’t |
|----|-------|
| Store tokens **server-side** (Supabase Vault / KMS / envelope encryption) | **localStorage / sessionStorage / IndexedDB** for tokens |
| Encrypt at rest; restrict DB RLS so only service role reads ciphertext | Log tokens in analytics / APM |
| Bind token row to `users.id` + `x_user_id` | Ship Client Secret to the browser |
| Short-lived PKCE verifier cookie (httpOnly, Secure, SameSite) | Put `code_verifier` in the authorize URL query as reusable secret beyond the flow |

---

## 6. Identity map (canonical)

```
User ID  ↔  X User ID  ↔  Session ID  ↔  OAuth Access Token  ↔  Refresh Token
 (uuid)      (snowflake)   (app sess)     (2h bearer)            (offline.access)
```

| ID | Source | Lifetime |
|----|--------|----------|
| **User ID** | Supabase Auth / app `users.id` | Account life |
| **X User ID** | `users/me` `data.id` after OAuth | Until disconnect |
| **Session ID** | App session cookie | Hours–days |
| **OAuth Access Token** | Token endpoint | ~2h |
| **Refresh Token** | Token endpoint w/ `offline.access` | Until revoke / rotate fail |

Never use X User ID as the sole primary key for product rows that must survive disconnect; keep **User ID** as PK and X User ID as linked identity.

---

## 7. Error / edge cases

| Case | Handling |
|------|----------|
| Auth code >30s | Restart login |
| Refresh race (two workers) | Per-user lock; one refresh; broadcast new token |
| User revokes in X settings | Next API 401 → mark `connection_status=revoked`, prompt reconnect |
| Protected account content | Show only to owning session; no export/share APIs |
| Scope upgrade | Re-run authorize with new scope set |

---

## 8. Test plan (Phase 1)

1. MockProvider bypasses OAuth; XApiProvider integration test with one sandbox user.  
2. PKCE happy path + bad state + expired code.  
3. Refresh rotation persistence.  
4. Disconnect deletes ciphertext (assert DB).  
5. Write methods blocked without confirm + scope.

---

## 9. References

- https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code (2026-09-04)  
- https://docs.x.com/developer-guidelines (token / automation / redistribution)  
- https://github.com/xdevplatform/samples  
