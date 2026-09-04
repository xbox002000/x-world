import type { SocialDataProvider } from "@/lib/providers/types";
import { getMockProvider } from "@/lib/providers/mock/MockProvider";

/**
 * Provider swap point.
 * Phase 1: PROVIDER_MODE=mock only.
 * Future: PROVIDER_MODE=xapi → XApiProvider (OAuth PKCE + official X API v2).
 */
export function getProvider(): SocialDataProvider {
  const mode = (process.env.NEXT_PUBLIC_PROVIDER_MODE || "mock").toLowerCase();
  if (mode !== "mock") {
    // Hard gate for Phase 1 — never accidentally hit X
    console.warn(
      `[x-world] PROVIDER_MODE=${mode} ignored in Phase 1; using MockProvider`
    );
  }
  return getMockProvider();
}

export type { SocialDataProvider };
