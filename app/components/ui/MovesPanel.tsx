"use client";

import type { NextMove, Quest } from "@/lib/domain/types";
import { useI18n, localizeMove, localizeQuest } from "@/lib/i18n";

export function MovesPanel({
  moves,
  quests,
  onDoIt,
  busyId,
}: {
  moves: NextMove[];
  quests: Quest[];
  onDoIt: (moveId: string) => void;
  busyId: string | null;
}) {
  const { t, locale } = useI18n();
  const visible = moves.slice(0, 3).map((m) => localizeMove(m, locale));

  return (
    <div className="panel-glass rounded-2xl p-4">
      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-mist">
        {t("moves.title")}
      </p>
      {visible.length === 0 ? (
        <p className="text-sm text-mist/80">{t("moves.empty")}</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((m) => {
            const questRaw = quests.find((q) => q.id === m.questId);
            const quest = questRaw ? localizeQuest(questRaw, locale) : undefined;
            const done = quest?.status === "completed";
            return (
              <li
                key={m.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p
                    className={`text-sm ${done ? "text-mist line-through" : "text-frost"}`}
                  >
                    {m.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-mist/80">
                    {m.why}
                  </p>
                  {quest && (
                    <p className="mt-1 text-[10px] text-accent/80">
                      {t("moves.quest", {
                        progress: quest.progress,
                        goal: quest.goal,
                      })}
                      {done ? t("moves.questDone") : ""}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={done || busyId === m.id}
                  onClick={() => onDoIt(m.id)}
                  className="shrink-0 rounded-full bg-frost/95 px-3 py-1.5 text-[11px] font-medium text-void disabled:cursor-default disabled:bg-white/10 disabled:text-mist"
                >
                  {done
                    ? t("moves.done")
                    : busyId === m.id
                      ? t("moves.busy")
                      : t("moves.doIt")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
