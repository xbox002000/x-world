import type { Messages } from "./en";

export const zhCN: Messages = {
  lang: {
    toggle: "EN ↔ 简体中文",
    en: "EN",
    zh: "简体中文",
  },
  landing: {
    badge: "第一阶段 · 概念原型",
    title: "X WORLD",
    subtitle:
      "面向 X 的互动成长世界——不是又一个仪表盘。看见人、话题与帖子，知道你的下一步。",
    ctaBuild: "构建你的世界",
    ctaDemo: "进入演示",
    footnote: "无需登录 · MockProvider · 零 X API 调用",
  },
  world: {
    brand: "X WORLD",
    followers: "{name} · {count} 关注者",
    cinematic: "电影模式",
    exitCinematic: "退出电影模式",
    share: "分享我的世界",
    hint: "拖拽环绕 · 滚轮缩放 · 点击节点",
    xpToast: "{message} · +{xp} XP",
  },
  loader: {
    phrases: [
      "正在映射你的邻域…",
      "正在汇集创作者与话题…",
      "正在评分下一步动作…",
      "正在为图谱注入生命…",
    ],
  },
  cinematic: {
    scenes: [
      "这是你的 X 成长世界。",
      "人、话题与帖子——彼此相连。",
      "点击了解原因。行动推动进化。",
      "知道你的下一步",
    ],
  },
  context: {
    close: "关闭",
    why: "原因",
    nextMove: "下一步",
    doIt: "去做",
    working: "处理中…",
    whyFallback: "属于你的成长邻域。",
    discoverCreator: "发现创作者",
    exploreTopic: "探索话题",
    joinConversation: "加入对话",
    engage: "互动",
    entityType: {
      person: "人物",
      topic: "话题",
      post: "帖子",
      community: "社区",
    },
  },
  moves: {
    title: "今日三步",
    empty: "暂无动作——去探索图谱吧。",
    quest: "任务 {progress}/{goal}",
    questDone: " · 完成",
    doIt: "去做",
    done: "完成",
    busy: "…",
  },
  growth: {
    level: "等级",
    progress: "进度",
    xp: "{xp}/{next} XP",
    thisWeek: "本周",
  },
  share: {
    title: "我的 X 世界",
    followers: "关注者",
    level: "等级",
    edges: "连接",
    tagline: "知道你的下一步",
    close: "关闭",
    copy: "复制卡片（模拟）",
  },
  entity: {
    you: "你",
  },
};
