import type {
  ActionResult,
  Entity,
  NextMove,
  Opportunity,
  Post,
  Relationship,
  User,
  WorldState,
} from "@/lib/domain/types";
import { applyXp, buildDailyMoves, syncQuestProgress } from "@/lib/domain/quests";
import { track } from "@/lib/domain/events";
import type { SocialDataProvider } from "@/lib/providers/types";
import seed from "@/lib/providers/mock/demo-world.json";

function cloneWorld(): WorldState {
  const data = JSON.parse(JSON.stringify(seed)) as {
    user: User;
    entities: Entity[];
    relationships: Relationship[];
    posts: Post[];
    opportunities: Opportunity[];
    quests: WorldState["quests"];
    discoveredCreatorIds: string[];
  };
  const base: WorldState = {
    user: data.user,
    entities: data.entities,
    relationships: data.relationships,
    posts: data.posts,
    opportunities: data.opportunities,
    quests: data.quests,
    nextMoves: [],
    discoveredCreatorIds: data.discoveredCreatorIds ?? [],
  };
  base.nextMoves = buildDailyMoves(base);
  return base;
}

let world: WorldState = cloneWorld();

function relId(): string {
  return `e_${Math.random().toString(36).slice(2, 9)}`;
}

function ok(message: string, xpGained: number): ActionResult {
  return { ok: true, message, xpGained, world: structuredClone(world) };
}

export class MockProvider implements SocialDataProvider {
  readonly name = "mock" as const;

  async getCurrentUser(): Promise<User> {
    return structuredClone(world.user);
  }

  async getEntities(): Promise<Entity[]> {
    return structuredClone(world.entities);
  }

  async getRelationships(): Promise<Relationship[]> {
    return structuredClone(world.relationships);
  }

  async getPosts(): Promise<Post[]> {
    return structuredClone(world.posts);
  }

  async getOpportunities(): Promise<Opportunity[]> {
    return structuredClone(world.opportunities);
  }

  async getWorld(): Promise<WorldState> {
    world.nextMoves = buildDailyMoves(world);
    return structuredClone(world);
  }

  async getNextMoves(): Promise<NextMove[]> {
    world.nextMoves = buildDailyMoves(world);
    track("next_move_shown", { count: world.nextMoves.length });
    return structuredClone(world.nextMoves);
  }

  async markCreatorDiscovered(entityId: string): Promise<ActionResult> {
    const entity = world.entities.find((e) => e.id === entityId);
    if (!entity || entity.entityType !== "person") {
      return {
        ok: false,
        message: "Not a creator entity",
        xpGained: 0,
        world: structuredClone(world),
      };
    }
    if (!world.discoveredCreatorIds.includes(entityId)) {
      world.discoveredCreatorIds.push(entityId);
    }
    entity.discovered = true;
    const exists = world.relationships.some(
      (r) =>
        r.from === world.user.entityId &&
        r.to === entityId &&
        (r.relType === "DISCOVERED" || r.relType === "TRACK")
    );
    if (!exists) {
      world.relationships.push({
        id: relId(),
        from: world.user.entityId,
        to: entityId,
        relType: "DISCOVERED",
        weight: 1.1,
        source: "user",
      });
    }
    entity.size = Math.min(1.8, (entity.size ?? 1.2) + 0.12);

    let xp = 12;
    world = applyXp(world, xp);
    world = syncQuestProgress(world);

    const q = world.quests.find((x) => x.id === "quest_discover");
    if (q && q.progress >= q.goal && q.status !== "completed") {
      q.status = "completed";
      q.progress = q.goal;
      world = applyXp(world, 18);
      xp += 18;
      track("quest_completed", { questId: q.id });
    } else if (q && q.status === "suggested") {
      q.status = "accepted";
      track("quest_started", { questId: q.id });
    }

    world.nextMoves = buildDailyMoves(world);
    track("entity_explored", { entityId, action: "DISCOVER" });
    return ok(`Discovered ${entity.title}`, xp);
  }

  async trackTopic(entityId: string): Promise<ActionResult> {
    const entity = world.entities.find((e) => e.id === entityId);
    if (!entity || entity.entityType !== "topic") {
      return {
        ok: false,
        message: "Not a topic",
        xpGained: 0,
        world: structuredClone(world),
      };
    }
    const exists = world.relationships.some(
      (r) =>
        r.from === world.user.entityId &&
        r.to === entityId &&
        r.relType === "INTERESTED_IN"
    );
    if (exists) {
      world.relationships = world.relationships.map((r) =>
        r.from === world.user.entityId &&
        r.to === entityId &&
        r.relType === "INTERESTED_IN"
          ? { ...r, weight: Math.min(2.5, r.weight + 0.35) }
          : r
      );
    } else {
      world.relationships.push({
        id: relId(),
        from: world.user.entityId,
        to: entityId,
        relType: "INTERESTED_IN",
        weight: 1.2,
        source: "user",
      });
    }
    entity.size = Math.min(1.6, (entity.size ?? 1) + 0.15);

    let xp = 20;
    world = applyXp(world, xp);
    const q = world.quests.find((x) => x.id === "quest_topic");
    if (q && q.status !== "completed") {
      q.status = "completed";
      q.progress = 1;
      world = applyXp(world, 10);
      xp += 10;
      track("quest_completed", { questId: q.id });
    }
    world.nextMoves = buildDailyMoves(world);
    track("entity_explored", { entityId, action: "TRACK" });
    return ok(`Explored topic ${entity.title}`, xp);
  }

  async mockReply(postEntityId: string): Promise<ActionResult> {
    const postEntity = world.entities.find((e) => e.id === postEntityId);
    const post = world.posts.find((p) => p.entityId === postEntityId);
    if (!postEntity || !post) {
      return {
        ok: false,
        message: "Post not found",
        xpGained: 0,
        world: structuredClone(world),
      };
    }
    world.relationships.push({
      id: relId(),
      from: world.user.entityId,
      to: postEntityId,
      relType: "ENGAGED_WITH",
      weight: 1.4,
      source: "user",
    });
    const authorEdge = world.relationships.find(
      (r) =>
        r.from === world.user.entityId &&
        r.to === post.authorEntityId &&
        r.relType === "FOLLOW"
    );
    if (authorEdge) {
      authorEdge.weight = Math.min(2.5, authorEdge.weight + 0.25);
    } else {
      world.relationships.push({
        id: relId(),
        from: world.user.entityId,
        to: post.authorEntityId,
        relType: "TRACK",
        weight: 0.9,
        source: "user",
      });
    }
    post.metrics.replies += 1;
    postEntity.size = Math.min(0.9, (postEntity.size ?? 0.5) + 0.1);

    let xp = 40;
    world = applyXp(world, xp);
    const q = world.quests.find((x) => x.id === "quest_reply");
    if (q && q.status !== "completed") {
      q.status = "completed";
      q.progress = 1;
      world = applyXp(world, 15);
      xp += 15;
      track("quest_completed", { questId: q.id });
    }
    world.user.followers += 1;
    world.nextMoves = buildDailyMoves(world);
    track("entity_explored", { entityId: postEntityId, action: "REPLY" });
    return ok("Reply sent (mock). World evolved.", xp);
  }

  async applyNextMove(moveId: string): Promise<ActionResult> {
    const moves = buildDailyMoves(world);
    const move = moves.find((m) => m.id === moveId);
    if (!move) {
      return {
        ok: false,
        message: "Move not found",
        xpGained: 0,
        world: structuredClone(world),
      };
    }
    track("opportunity_viewed", { moveId, action: move.action });
    if (move.action === "DISCOVER") {
      const creators = world.entities.filter(
        (e) =>
          e.entityType === "person" &&
          e.id !== world.user.entityId &&
          !world.discoveredCreatorIds.includes(e.id)
      );
      let last: ActionResult | null = null;
      let totalXp = 0;
      for (const c of creators.slice(0, 3)) {
        last = await this.markCreatorDiscovered(c.id);
        totalXp += last.xpGained;
      }
      return {
        ok: true,
        message: `Discovered ${Math.min(3, creators.length)} creators`,
        xpGained: totalXp,
        world: structuredClone(world),
      };
    }
    if (move.action === "TRACK" || move.action === "SUBSCRIBE") {
      const target = world.entities.find((e) => e.id === move.targetEntityId);
      if (target?.entityType === "topic") {
        return this.trackTopic(move.targetEntityId);
      }
      world.relationships.push({
        id: relId(),
        from: world.user.entityId,
        to: move.targetEntityId,
        relType: "TRACK",
        weight: 1.2,
        source: "user",
      });
      world = applyXp(world, move.xpReward);
      world.nextMoves = buildDailyMoves(world);
      return ok("Subscribed (mock)", move.xpReward);
    }
    if (move.action === "REPLY") {
      return this.mockReply(move.targetEntityId);
    }
    world = applyXp(world, move.xpReward);
    world.nextMoves = buildDailyMoves(world);
    return ok("Action applied (mock)", move.xpReward);
  }

  async startQuest(questId: string): Promise<ActionResult> {
    const q = world.quests.find((x) => x.id === questId);
    if (!q) {
      return {
        ok: false,
        message: "Quest not found",
        xpGained: 0,
        world: structuredClone(world),
      };
    }
    if (q.status === "suggested") q.status = "accepted";
    track("quest_started", { questId });
    return ok(`Quest started: ${q.title}`, 0);
  }

  async completeQuest(questId: string): Promise<ActionResult> {
    const q = world.quests.find((x) => x.id === questId);
    if (!q) {
      return {
        ok: false,
        message: "Quest not found",
        xpGained: 0,
        world: structuredClone(world),
      };
    }
    q.status = "completed";
    q.progress = q.goal;
    world = applyXp(world, 25);
    track("quest_completed", { questId });
    world.nextMoves = buildDailyMoves(world);
    return ok(`Quest completed: ${q.title}`, 25);
  }

  reset(): void {
    world = cloneWorld();
  }
}

let singleton: MockProvider | null = null;

export function getMockProvider(): MockProvider {
  if (!singleton) singleton = new MockProvider();
  return singleton;
}
