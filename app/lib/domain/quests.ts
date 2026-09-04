import type { NextMove, Opportunity, Quest, WorldState } from "./types";

export const DAILY_MOVE_LABELS = [
  "Discover 3 creators",
  "Explore a rising topic",
  "Join one conversation",
] as const;

export function scoreOpportunity(o: Opportunity): number {
  return o.score;
}

export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 40;
}

export function applyXp(
  state: WorldState,
  amount: number
): WorldState {
  let { xp, level, xpToNext, xpThisWeek } = state.user;
  xp += amount;
  xpThisWeek += amount;
  while (xp >= xpToNext) {
    xp -= xpToNext;
    level += 1;
    xpToNext = xpForLevel(level);
  }
  return {
    ...state,
    user: { ...state.user, xp, level, xpToNext, xpThisWeek },
  };
}

export function buildDailyMoves(state: WorldState): NextMove[] {
  const creators = state.entities.filter(
    (e) =>
      e.entityType === "person" &&
      e.id !== state.user.entityId &&
      !state.discoveredCreatorIds.includes(e.id)
  );
  const topic =
    state.entities.find((e) => e.id === "topic_ai_agents") ??
    state.entities.find((e) => e.entityType === "topic");
  const post =
    state.posts.find((p) => p.entityId === "post_alice_1") ?? state.posts[0];

  return [
    {
      id: "move_discover",
      label: DAILY_MOVE_LABELS[0],
      action: "DISCOVER",
      targetEntityId: creators[0]?.id ?? "person_alice",
      why: "Expand your neighborhood with 3 high-signal creators in your topics.",
      xpReward: 30,
      questId: "quest_discover",
    },
    {
      id: "move_topic",
      label: DAILY_MOVE_LABELS[1],
      action: "TRACK",
      targetEntityId: topic?.id ?? "topic_ai_agents",
      why: "AI Agents is rising in your graph — deepen the halo.",
      xpReward: 20,
      questId: "quest_topic",
      opportunityId: "opp_topic_ai",
    },
    {
      id: "move_reply",
      label: DAILY_MOVE_LABELS[2],
      action: "REPLY",
      targetEntityId: post?.entityId ?? "post_alice_1",
      why: "One thoughtful reply beats ten empty likes.",
      xpReward: 40,
      questId: "quest_reply",
      opportunityId: "opp_reply_alice",
    },
  ];
}

export function syncQuestProgress(state: WorldState): WorldState {
  const quests = state.quests.map((q) => {
    if (q.status === "completed") return q;
    if (q.id === "quest_discover") {
      const progress = Math.min(3, state.discoveredCreatorIds.length);
      return {
        ...q,
        progress,
        status: (progress >= 3 ? "completed" : q.status) as Quest["status"],
      };
    }
    return q;
  });
  return { ...state, quests };
}
