"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export function GenerativeLoader({ progress }: { progress: number }) {
  const { messages } = useI18n();
  const phrases = messages.loader.phrases;
  const phrase =
    phrases[Math.min(phrases.length - 1, Math.floor(progress * phrases.length))];
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-void">
      <div className="relative h-40 w-40">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/80"
            animate={{
              x: [0, Math.cos((i / 4) * Math.PI * 2) * 48, 0],
              y: [0, Math.sin((i / 4) * Math.PI * 2) * 48, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.6, 1.2, 0.6],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-frost"
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <p className="mt-8 font-display text-sm tracking-wide text-mist">{phrase}</p>
      <div className="progress-track mt-4 h-1 w-48">
        <div
          className="progress-fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
