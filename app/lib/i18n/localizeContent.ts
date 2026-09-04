import type {
  Entity,
  NextMove,
  Opportunity,
  Post,
  Quest,
  User,
} from "@/lib/domain/types";
import type { Locale } from "./I18nProvider";
import {
  zhCNEntities,
  zhCNNextMoves,
  zhCNOpportunities,
  zhCNPosts,
  zhCNQuests,
  zhCNToasts,
  zhCNUser,
} from "./content/zh-CN-demo";

function isZh(locale: Locale): boolean {
  return locale === "zh-CN";
}

export function localizeEntity(entity: Entity, locale: Locale): Entity {
  if (!isZh(locale)) return entity;
  const mapped = zhCNEntities[entity.id];
  if (!mapped) return entity;
  return {
    ...entity,
    title: mapped.title,
    summary: mapped.summary,
  };
}

export function localizeMove(move: NextMove, locale: Locale): NextMove {
  if (!isZh(locale)) return move;
  const mapped = zhCNNextMoves[move.id];
  if (!mapped) return move;
  return {
    ...move,
    label: mapped.label,
    why: mapped.why,
  };
}

export function localizeQuest(quest: Quest, locale: Locale): Quest {
  if (!isZh(locale)) return quest;
  const mapped = zhCNQuests[quest.id];
  if (!mapped) return quest;
  return {
    ...quest,
    title: mapped.title,
    description: mapped.description,
  };
}

export function localizeOpp(opp: Opportunity, locale: Locale): Opportunity {
  if (!isZh(locale)) return opp;
  const mapped = zhCNOpportunities[opp.id];
  if (!mapped) return opp;
  return {
    ...opp,
    title: mapped.title,
    why: mapped.why,
    rationale: mapped.rationale,
  };
}

export function localizePost(post: Post, locale: Locale): Post {
  if (!isZh(locale)) return post;
  const text = zhCNPosts[post.entityId];
  if (!text) return post;
  return { ...post, text };
}

export function localizeUser(user: User, locale: Locale): User {
  if (!isZh(locale)) return user;
  return {
    ...user,
    displayName: zhCNUser.displayName,
    bio: zhCNUser.bio,
  };
}

const ENGLISH_TITLE_TO_ZH: Record<string, string> = {
  "YOU Rock": zhCNEntities.person_you.title,
  Alice: zhCNEntities.person_alice.title,
  Bob: zhCNEntities.person_bob.title,
  Charlie: zhCNEntities.person_charlie.title,
  David: zhCNEntities.person_david.title,
  Emma: zhCNEntities.person_emma.title,
  "AI Agents": zhCNEntities.topic_ai_agents.title,
  SaaS: zhCNEntities.topic_saas.title,
  Automation: zhCNEntities.topic_automation.title,
  "Indie Hacker": zhCNEntities.topic_indie_hacker.title,
  "Operator Ring": zhCNEntities.community_operator_ring.title,
};

const ENGLISH_QUEST_TITLE_TO_ZH: Record<string, string> = {
  "Discover 3 creators": zhCNQuests.quest_discover.title,
  "Explore a rising topic": zhCNQuests.quest_topic.title,
  "Join one conversation": zhCNQuests.quest_reply.title,
};

function localizeTitleByEnglish(englishTitle: string): string {
  return ENGLISH_TITLE_TO_ZH[englishTitle] ?? englishTitle;
}

function localizeQuestTitleByEnglish(englishTitle: string): string {
  return ENGLISH_QUEST_TITLE_TO_ZH[englishTitle] ?? englishTitle;
}

/**
 * Localize MockProvider ActionResult.message at the UI toast layer.
 * Keeps provider English; maps known static + patterned messages.
 */
export function localizeActionMessage(
  message: string,
  locale: Locale
): string {
  if (!isZh(locale)) return message;

  const exact = zhCNToasts[message];
  if (exact) return exact;

  const creators = /^Discovered (\d+) creators$/.exec(message);
  if (creators) {
    return `已发现 ${creators[1]} 位创作者`;
  }

  const discovered = /^Discovered (.+)$/.exec(message);
  if (discovered) {
    return `已发现 ${localizeTitleByEnglish(discovered[1])}`;
  }

  const explored = /^Explored topic (.+)$/.exec(message);
  if (explored) {
    return `已探索话题 ${localizeTitleByEnglish(explored[1])}`;
  }

  const started = /^Quest started: (.+)$/.exec(message);
  if (started) {
    return `任务已开始：${localizeQuestTitleByEnglish(started[1])}`;
  }

  const completed = /^Quest completed: (.+)$/.exec(message);
  if (completed) {
    return `任务已完成：${localizeQuestTitleByEnglish(completed[1])}`;
  }

  return message;
}
