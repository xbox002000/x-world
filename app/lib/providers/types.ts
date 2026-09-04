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

export interface SocialDataProvider {
  readonly name: "mock" | "xapi";

  getCurrentUser(): Promise<User>;
  getEntities(): Promise<Entity[]>;
  getRelationships(): Promise<Relationship[]>;
  getPosts(): Promise<Post[]>;
  getOpportunities(): Promise<Opportunity[]>;
  getWorld(): Promise<WorldState>;
  getNextMoves(): Promise<NextMove[]>;

  /** Mock / gated social actions — mutate in-memory world */
  applyNextMove(moveId: string): Promise<ActionResult>;
  markCreatorDiscovered(entityId: string): Promise<ActionResult>;
  trackTopic(entityId: string): Promise<ActionResult>;
  mockReply(postEntityId: string): Promise<ActionResult>;
  startQuest(questId: string): Promise<ActionResult>;
  completeQuest(questId: string): Promise<ActionResult>;
}
