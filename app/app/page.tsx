"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { track } from "@/lib/domain/events";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-auto absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(126,184,255,0.14), transparent 55%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.08), transparent 50%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-xl text-center"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-mist">
          {t("landing.badge")}
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight text-frost sm:text-6xl">
          {t("landing.title")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-mist">
          {t("landing.subtitle")}
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/world"
            onClick={() => track("world_enter", { from: "landing" })}
            className="inline-flex items-center justify-center rounded-full bg-frost px-8 py-3.5 text-sm font-medium text-void transition hover:bg-white"
          >
            {t("landing.ctaBuild")}
          </Link>
          <Link
            href="/world"
            onClick={() => track("world_enter", { from: "landing_demo" })}
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-3.5 text-sm text-mist transition hover:border-white/25 hover:text-frost"
          >
            {t("landing.ctaDemo")}
          </Link>
        </div>
        <p className="mt-8 text-xs text-mist/70">{t("landing.footnote")}</p>
      </motion.div>
    </main>
  );
}
