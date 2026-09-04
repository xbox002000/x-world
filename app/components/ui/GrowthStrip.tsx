"use client";

import type { User } from "@/lib/domain/types";
import { useI18n } from "@/lib/i18n";

export function GrowthStrip({ user }: { user: User }) {
  const { t } = useI18n();
  const pct = Math.min(100, Math.round((user.xp / user.xpToNext) * 100));
  return (
    <div className="panel-glass flex items-center gap-4 rounded-2xl px-4 py-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-mist">
          {t("growth.level")}
        </p>
        <p className="font-display text-xl text-frost">
          {String(user.level).padStart(2, "0")}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex justify-between text-[10px] text-mist">
          <span>{t("growth.progress")}</span>
          <span>
            {t("growth.xp", { xp: user.xp, next: user.xpToNext })}
          </span>
        </div>
        <div className="progress-track h-1.5">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-[0.2em] text-mist">
          {t("growth.thisWeek")}
        </p>
        <p className="font-display text-sm text-success">+{user.xpThisWeek}</p>
      </div>
    </div>
  );
}
