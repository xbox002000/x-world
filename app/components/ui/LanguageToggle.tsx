"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, toggleLocale, t } = useI18n();
  const label = locale === "en" ? t("lang.zh") : t("lang.en");

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t("lang.toggle")}
      title={t("lang.toggle")}
      className={`rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] tracking-wide text-mist backdrop-blur transition hover:border-white/25 hover:text-frost ${className}`}
    >
      {locale === "en" ? "EN" : "中文"}
      <span className="mx-1.5 text-mist/40">·</span>
      <span className="text-frost/80">{label}</span>
    </button>
  );
}
