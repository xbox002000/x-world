/** X WORLD domain types — Phase 1 concept prototype */

export type EntityType = "person" | "topic" | "post" | "community";
export type RelType =
  | "FOLLOW"
  | "MUTUAL"
  | "ENGAGED_WITH"
  | "AUTHORED"
  | "ABOUT"
  | "INTERESTED_IN"
  | "MEMBER_OF"
  | "TRACK"
  | "DISCOVERED";

export type NbaAction =
  | "FOLLOW"
  | "READ"
  | "REPLY"
  | "TRACK"
  | "SUBSCRIBE"
  | "CREATE_POST"
  | "DISCOVER";

export type QuestType =
  | "discovery"
  | "relationship"
  | "content"
  | "engagement"
  | "growth";

export type QuestStatus =
  | "suggested"
  | "accepted"
  | "completed"
  | "dismissed"
  | "expired";

export type Tier = "A" | "B" | "C" | "D";

export interface User {
  id: string;
  displayName: string;
  handle: string;
  bio: string;
  followers: number;
  level: number;
  xp: number;
  xpToNext: number;
  xpThisWeek: number;
  entityId: string;
}

export interface Entity {
  id: string;
  entityType: EntityType;
  externalId?: string | null;
  handle?: string | null;
  title: string;
  summary?: string | null;
  tier: Tier;
  meta?: Record<string, unknown>;
  /** Runtime: discovered / highlighted */
  discovered?: boolean;
  size?: number;
}

export interface Relationship {
  id: string;
  from: string;
  to: string;
  relType: RelType;
  weight: number;
  source: "mock" | "derived" | "user" | "x_api";
}

export interface Post {
  entityId: string;
  authorEntityId: string;
  text: string;
  postedAt: string;
  metrics: { likes: number; replies: number; reposts: number };
}

export interface Opportunity {
  id: string;
  title: string;
  rationale: string[];
  score: number;
  targetEntityId: string;
  nbaAction: NbaAction;
  why: string;
}

export interface NextMove {
  id: string;
  label: string;
  action: NbaAction;
  targetEntityId: string;
  why: string;
  opportunityId?: string;
  questId?: string;
  xpReward: number;
}

export interface Quest {
  id: string;
  questType: QuestType;
  title: string;
  description: string;
  targetEntityId?: string | null;
  nbaAction: NbaAction;
  status: QuestStatus;
  score: number;
  progress: number;
  goal: number;
  payload?: { rationale?: string[] };
}

export interface WorldState {
  user: User;
  entities: Entity[];
  relationships: Relationship[];
  posts: Post[];
  opportunities: Opportunity[];
  quests: Quest[];
  nextMoves: NextMove[];
  discoveredCreatorIds: string[];
}

export interface ActionResult {
  ok: boolean;
  message: string;
  xpGained: number;
  world: WorldState;
}
