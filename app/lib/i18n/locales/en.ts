export const en = {
  lang: {
    toggle: "EN ↔ 简体中文",
    en: "EN",
    zh: "简体中文",
  },
  landing: {
    badge: "Phase 1 · Concept Prototype",
    title: "X WORLD",
    subtitle:
      "An interactive growth world for X — not another dashboard. See people, topics, and posts. Know your next move.",
    ctaBuild: "Build Your World",
    ctaDemo: "Enter Demo",
    footnote: "No login · MockProvider · Zero X API calls",
  },
  world: {
    brand: "X WORLD",
    followers: "{name} · {count} followers",
    cinematic: "Cinematic",
    exitCinematic: "Exit cinematic",
    share: "Share My World",
    hint: "Drag to orbit · Scroll to zoom · Click a node",
    xpToast: "{message} · +{xp} XP",
  },
  loader: {
    phrases: [
      "Mapping your neighborhood…",
      "Gathering creators & topics…",
      "Scoring next moves…",
      "Breathing life into the graph…",
    ],
  },
  cinematic: {
    scenes: [
      "This is your X Growth World.",
      "People, topics, and posts — connected.",
      "Click to see why. Act to evolve.",
      "KNOW YOUR NEXT MOVE",
    ],
  },
  context: {
    close: "Close",
    why: "Why",
    nextMove: "Next Move",
    doIt: "Do it",
    working: "Working…",
    whyFallback: "Part of your growth neighborhood.",
    discoverCreator: "Discover creator",
    exploreTopic: "Explore topic",
    joinConversation: "Join conversation",
    engage: "Engage",
    entityType: {
      person: "person",
      topic: "topic",
      post: "post",
      community: "community",
    },
  },
  moves: {
    title: "Today's 3 Moves",
    empty: "No moves yet — explore the graph.",
    quest: "Quest {progress}/{goal}",
    questDone: " · done",
    doIt: "Do it",
    done: "Done",
    busy: "…",
  },
  growth: {
    level: "Level",
    progress: "Progress",
    xp: "{xp}/{next} XP",
    thisWeek: "This week",
  },
  share: {
    title: "My X World",
    followers: "Followers",
    level: "Level",
    edges: "Edges",
    tagline: "KNOW YOUR NEXT MOVE",
    close: "Close",
    copy: "Copy card (mock)",
  },
  entity: {
    you: "YOU",
  },
};

/** Deep string map matching EN structure (allows translated values). */
export type Messages = {
  lang: { toggle: string; en: string; zh: string };
  landing: {
    badge: string;
    title: string;
    subtitle: string;
    ctaBuild: string;
    ctaDemo: string;
    footnote: string;
  };
  world: {
    brand: string;
    followers: string;
    cinematic: string;
    exitCinematic: string;
    share: string;
    hint: string;
    xpToast: string;
  };
  loader: { phrases: readonly string[] };
  cinematic: { scenes: readonly string[] };
  context: {
    close: string;
    why: string;
    nextMove: string;
    doIt: string;
    working: string;
    whyFallback: string;
    discoverCreator: string;
    exploreTopic: string;
    joinConversation: string;
    engage: string;
    entityType: {
      person: string;
      topic: string;
      post: string;
      community: string;
    };
  };
  moves: {
    title: string;
    empty: string;
    quest: string;
    questDone: string;
    doIt: string;
    done: string;
    busy: string;
  };
  growth: {
    level: string;
    progress: string;
    xp: string;
    thisWeek: string;
  };
  share: {
    title: string;
    followers: string;
    level: string;
    edges: string;
    tagline: string;
    close: string;
    copy: string;
  };
  entity: { you: string };
};
