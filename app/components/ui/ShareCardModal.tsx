"use client";

import type { User } from "@/lib/domain/types";
import { useI18n } from "@/lib/i18n";

export function ShareCardModal({
  open,
  user,
  edgeCount,
  onClose,
}: {
  open: boolean;
  user: User;
  edgeCount: number;
  onClose: () => void;
}) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="panel-glass w-full max-w-md overflow-hidden rounded-3xl">
        <div
          className="relative px-6 pb-8 pt-10"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(126,184,255,0.2), transparent 55%), linear-gradient(180deg,#121622,#0a0c12)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-mist">
            {t("share.title")}
          </p>
          <h3 className="mt-2 font-display text-3xl text-frost">
            {user.displayName}
          </h3>
          <p className="mt-1 text-sm text-mist">@{user.handle}</p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <p className="font-display text-lg">{user.followers}</p>
              <p className="text-[10px] text-mist">{t("share.followers")}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <p className="font-display text-lg">
                {String(user.level).padStart(2, "0")}
              </p>
              <p className="text-[10px] text-mist">{t("share.level")}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <p className="font-display text-lg">{edgeCount}</p>
              <p className="text-[10px] text-mist">{t("share.edges")}</p>
            </div>
          </div>
          <p className="tagline-glow mt-8 text-center font-display text-sm tracking-wide text-accent">
            {t("share.tagline")}
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-white/5 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-xs text-mist hover:text-frost"
          >
            {t("share.close")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-frost px-4 py-2 text-xs font-medium text-void"
          >
            {t("share.copy")}
          </button>
        </div>
      </div>
    </div>
  );
}
