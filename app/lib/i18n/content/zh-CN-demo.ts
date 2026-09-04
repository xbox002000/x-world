/**
 * zh-CN demo content maps keyed by English mock ids.
 * Localization is applied at the UI layer — MockProvider data stays English.
 */

export type EntityContent = { title: string; summary: string };
export type MoveContent = { label: string; why: string };
export type OppContent = { title: string; why: string; rationale: string[] };
export type QuestContent = { title: string; description: string };

export const zhCNEntities: Record<string, EntityContent> = {
  person_you: {
    title: "你 · Rock",
    summary: "自我节点——互动式 X 成长世界的中心",
  },
  person_alice: {
    title: "Alice",
    summary: "AI 智能体折腾者；每周发布演示",
  },
  person_bob: {
    title: "Bob",
    summary: "B2B SaaS 定价与包装",
  },
  person_charlie: {
    title: "Charlie",
    summary: "为独立运营者打造自动化系统",
  },
  person_david: {
    title: "David",
    summary: "独立黑客；公开记录 MRR",
  },
  person_emma: {
    title: "Emma",
    summary: "创作者运营；为建设者设计习惯系统",
  },
  topic_ai_agents: {
    title: "AI 智能体",
    summary: "自主 / 半自主智能体工作流",
  },
  topic_saas: {
    title: "SaaS",
    summary: "包装、席位、按用量计费的讨论",
  },
  topic_automation: {
    title: "自动化",
    summary: "消除重复劳动的工作流",
  },
  topic_indie_hacker: {
    title: "独立黑客",
    summary: "个人与小团队产品建设者",
  },
  community_operator_ring: {
    title: "运营者圆环",
    summary: "公开建设的运营者精选圈层",
  },
  post_alice_1: {
    title: "智能体该记住什么、又该每次重新拉取什么？",
    summary: "Alice 关于记忆设计的开放问题",
  },
  post_bob_1: {
    title: "按用量定价，却不制造账单惊吓",
    summary: "Bob 关于计量体验的讨论串",
  },
  post_charlie_1: {
    title: "自动化无聊路径，保留判断力",
    summary: "Charlie 谈自动化边界",
  },
  post_david_1: {
    title: "MRR 第 12 周：安静的复利",
    summary: "David 的独立黑客日志",
  },
  post_emma_1: {
    title: "下一步不清晰时，连续打卡就会失败",
    summary: "Emma 谈习惯设计",
  },
  post_you_1: {
    title: "搭建互动成长世界——第 1 周",
    summary: "你正在公开建设",
  },
  post_alice_2: {
    title: "不会骗你的智能体评测",
    summary: "Alice 关于评测的后续",
  },
  post_bob_2: {
    title: "席位 vs 用量：一棵决策树",
    summary: "Bob 的包装笔记",
  },
};

export const zhCNPosts: Record<string, string> = {
  post_alice_1:
    "今天在交付智能体记忆。诚实提问：智能体该记住什么，又该每次运行重新拉取什么？",
  post_bob_1:
    "按用量计费看起来很公平，直到第一张惊吓账单。你怎么在产品里解释计量？",
  post_charlie_1:
    "自动化无聊路径。把人类判断留在每周都会变化的边缘。",
  post_david_1:
    "第 12 周 MRR：+8%。没有病毒式爆发——只是一个渠道安静的复利。",
  post_emma_1:
    "下一步不清晰时，连续打卡就会失败。习惯产品需要「下一步最佳动作」，而不是一个火焰图标。",
  post_you_1:
    "第 1 周：在勾画互动式 X 成长世界。核心产出是下一步最佳动作——不是又一个仪表盘。",
  post_alice_2:
    "不会骗你的智能体评测：衡量任务成功，而不是感觉。分享一份小量规。",
  post_bob_2:
    "席位 vs 用量定价——我和创始人用的一棵短决策树。",
};

export const zhCNNextMoves: Record<string, MoveContent> = {
  move_discover: {
    label: "发现 3 位创作者",
    why: "在你的话题里扩展邻域，加入 3 位高信号创作者。",
  },
  move_topic: {
    label: "探索上升话题",
    why: "「AI 智能体」正在你的图谱中上升——加深话题光环。",
  },
  move_reply: {
    label: "加入一场对话",
    why: "一条有思考的回复，胜过十个空洞点赞。",
  },
};

export const zhCNOpportunities: Record<string, OppContent> = {
  opp_reply_alice: {
    title: "回复 Alice 的开放问题",
    why: "Alice 在你的核心话题里提出了具体设计问题。一条有思考的回复会加深互关边。",
    rationale: ["互相关注", "共同话题：AI 智能体", "高回复空间"],
  },
  opp_topic_ai: {
    title: "探索上升话题：AI 智能体",
    why: "「AI 智能体」是你世界中最密集的光环。探索它会浮现创作者与对话。",
    rationale: ["你最强的兴趣", "两篇近期帖子", "创作者密度"],
  },
  opp_discover_emma: {
    title: "发现 Emma",
    why: "Emma 连接创作者运营与独立建设——今天任务的自然第三次发现。",
    rationale: ["邻近「独立黑客」", "高信号习惯写作", "尚未追踪"],
  },
  opp_join_bob: {
    title: "加入 Bob 的定价讨论",
    why: "Bob 的计量问题仍开放。一个清晰观点胜过旁观。",
    rationale: ["你关注 Bob", "SaaS 兴趣", "活跃回复"],
  },
  opp_community: {
    title: "加入运营者圆环对话",
    why: "运营者圆环汇聚了已在你图谱中的人。订阅会收紧这一簇。",
    rationale: ["已追踪社区", "Alice + Bob 成员", "成长路径"],
  },
};

export const zhCNQuests: Record<string, QuestContent> = {
  quest_discover: {
    title: "发现 3 位创作者",
    description: "将三位创作者标记为已发现，以扩展你的邻域。",
  },
  quest_topic: {
    title: "探索一个上升话题",
    description: "打开并追踪「AI 智能体」，加深你的话题光环。",
  },
  quest_reply: {
    title: "加入一场对话",
    description: "向一篇高信号帖子发送一条有思考的模拟回复。",
  },
};

/** Exact English ActionResult.message → zh-CN (static). Dynamic ones use patterns in localizeContent. */
export const zhCNToasts: Record<string, string> = {
  "Reply sent (mock). World evolved.": "回复已发送（模拟）。世界已进化。",
  "Subscribed (mock)": "已订阅（模拟）",
  "Action applied (mock)": "动作已执行（模拟）",
  "Not a creator entity": "不是创作者实体",
  "Not a topic": "不是话题",
  "Post not found": "未找到帖子",
  "Move not found": "未找到动作",
  "Quest not found": "未找到任务",
};

export const zhCNUser = {
  displayName: "你 · Rock",
  bio: "公开建设。学习分发。",
};
