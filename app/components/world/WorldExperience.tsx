"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { WorldState } from "@/lib/domain/types";
import { track } from "@/lib/domain/events";
import { getProvider } from "@/lib/providers";
import { useI18n, localizeUser, localizeActionMessage } from "@/lib/i18n";
import { GenerativeLoader } from "./GenerativeLoader";
import { CinematicOverlay } from "./CinematicOverlay";
import { GrowthStrip } from "@/components/ui/GrowthStrip";
import { MovesPanel } from "@/components/ui/MovesPanel";
import { ContextPanel } from "@/components/ui/ContextPanel";
import { ShareCardModal } from "@/components/ui/ShareCardModal";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

const WorldCanvas = dynamic(
  () => import("./WorldCanvas").then((m) => m.WorldCanvas),
  { ssr: false }
);

export function WorldExperience() {
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [world, setWorld] = useState<WorldState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const provider = getProvider();

    (async () => {
      const steps = [0.15, 0.35, 0.55, 0.75, 0.9, 1];
      for (const s of steps) {
        await new Promise((r) => setTimeout(r, 280));
        if (cancelled) return;
        setProgress(s);
      }
      const w = await provider.getWorld();
      if (cancelled) return;
      setWorld(w);
      setLoading(false);
      track("world_loaded", {
        entities: w.entities.length,
        edges: w.relationships.length,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const onSelect = (id: string) => {
    setSelectedId(id);
    track("entity_clicked", { entityId: id });
  };

  const onDoMove = async (moveId: string) => {
    if (!world) return;
    setBusyId(moveId);
    try {
      const move = world.nextMoves.find((m) => m.id === moveId);
      if (move?.questId) {
        await getProvider().startQuest(move.questId);
      }
      const result = await getProvider().applyNextMove(moveId);
      setWorld(result.world);
      const msg = localizeActionMessage(result.message, locale);
      showToast(
        result.ok
          ? t("world.xpToast", {
              message: msg,
              xp: result.xpGained,
            })
          : msg
      );
      if (result.ok) {
        const m = result.world.nextMoves.find((x) => x.id === moveId);
        if (m) setSelectedId(m.targetEntityId);
      }
    } finally {
      setBusyId(null);
    }
  };

  const selected = world?.entities.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void">
      {loading && <GenerativeLoader progress={progress} />}

      {!loading && world && (
        <>
          <WorldCanvas
            entities={world.entities}
            relationships={world.relationships}
            youId={world.user.entityId}
            selectedId={selectedId}
            onSelect={onSelect}
            cinematic={cinematic}
          />

          <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-4">
            <div className="pointer-events-auto">
              <p className="font-display text-sm tracking-[0.2em] text-frost/90">
                {t("world.brand")}
              </p>
              <p className="text-[11px] text-mist">
                {t("world.followers", {
                  name: localizeUser(world.user, locale).displayName,
                  count: world.user.followers,
                })}
              </p>
            </div>
            <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
              <LanguageToggle />
              <button
                type="button"
                onClick={() => setCinematic((v) => !v)}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-mist backdrop-blur hover:text-frost"
              >
                {cinematic ? t("world.exitCinematic") : t("world.cinematic")}
              </button>
              <button
                type="button"
                onClick={() => {
                  track("share_clicked", {});
                  setShareOpen(true);
                }}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-mist backdrop-blur hover:text-frost"
              >
                {t("world.share")}
              </button>
            </div>
          </header>

          <div className="pointer-events-none absolute left-4 top-20 z-20 w-[min(100%-2rem,320px)] space-y-3">
            <div className="pointer-events-auto">
              <GrowthStrip user={world.user} />
            </div>
            <div className="pointer-events-auto">
              <MovesPanel
                moves={world.nextMoves}
                quests={world.quests}
                onDoIt={onDoMove}
                busyId={busyId}
              />
            </div>
          </div>

          <ContextPanel
            entity={selected}
            world={world}
            onClose={() => setSelectedId(null)}
            onDoMove={onDoMove}
            busy={!!busyId}
          />

          <CinematicOverlay
            active={cinematic}
            onDone={() => setCinematic(false)}
          />

          <ShareCardModal
            open={shareOpen}
            user={localizeUser(world.user, locale)}
            edgeCount={world.relationships.length}
            onClose={() => setShareOpen(false)}
          />

          {toast && (
            <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-success/30 bg-black/70 px-4 py-2 text-xs text-success backdrop-blur">
              {toast}
            </div>
          )}

          <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-[10px] text-mist/50">
            {t("world.hint")}
          </p>
        </>
      )}

      {loading && (
        <div className="pointer-events-auto absolute right-4 top-4 z-50">
          <LanguageToggle />
        </div>
      )}
    </div>
  );
}
