"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const TIMINGS = [0, 3500, 7000, 10500];

export function CinematicOverlay({
  active,
  onDone,
}: {
  active: boolean;
  onDone: () => void;
}) {
  const { messages } = useI18n();
  const [idx, setIdx] = useState(0);

  const scenes = useMemo(
    () =>
      messages.cinematic.scenes.map((text, i) => ({
        t: TIMINGS[i] ?? i * 3500,
        text,
      })),
    [messages.cinematic.scenes]
  );

  useEffect(() => {
    if (!active) {
      setIdx(0);
      return;
    }
    const timers = scenes.map((s, i) => setTimeout(() => setIdx(i), s.t));
    const end = setTimeout(onDone, 14000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
  }, [active, onDone, scenes]);

  if (!active) return null;

  const scene = scenes[idx] ?? scenes[0];
  const isFinale = idx === scenes.length - 1;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-end justify-center pb-24">
      <AnimatePresence mode="wait">
        <motion.p
          key={scene.text}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.8 }}
          className={`max-w-lg px-6 text-center font-display tracking-wide ${
            isFinale
              ? "tagline-glow text-2xl text-accent sm:text-3xl"
              : "text-lg text-frost/90"
          }`}
        >
          {scene.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
