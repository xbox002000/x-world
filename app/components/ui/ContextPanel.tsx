"use client";

import type { Entity, NextMove, Opportunity, Post, WorldState } from "@/lib/domain/types";
import { useI18n } from "@/lib/i18n";

export function ContextPanel({
  entity,
  world,
  onClose,
  onDoMove,
  busy,
}: {
  entity: Entity | null;
  world: WorldState;
  onClose: () => void;
  onDoMove: (moveId: string) => void;
  busy: boolean;
}) {
  const { t } = useI18n();
  if (!entity) return null;

  const post: Post | undefined = world.posts.find((p) => p.entityId === entity.id);
  const opp: Opportunity | undefined = world.opportunities.find(
    (o) => o.targetEntityId === entity.id
  );
  const relatedMove: NextMove | undefined =
    world.nextMoves.find((m) => m.targetEntityId === entity.id) ??
    (entity.entityType === "person"
      ? world.nextMoves.find((m) => m.action === "DISCOVER")
      : undefined);

  const why =
    opp?.why ??
    relatedMove?.why ??
    entity.summary ??
    t("context.whyFallback");

  const nextLabel =
    relatedMove?.label ??
    (entity.entityType === "person"
      ? t("context.discoverCreator")
      : entity.entityType === "topic"
        ? t("context.exploreTopic")
        : entity.entityType === "post"
          ? t("context.joinConversation")
          : t("context.engage"));

  const typeKey = `context.entityType.${entity.entityType}` as const;
  const typeLabel = t(typeKey);

  return (
    <aside className="panel-glass absolute bottom-4 right-4 z-30 w-[min(100%-2rem,360px)] rounded-2xl p-5 shadow-panel">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-mist">
            {typeLabel}
          </p>
          <h2 className="font-display text-xl text-frost">{entity.title}</h2>
          {entity.handle && (
            <p className="text-xs text-mist">@{entity.handle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-mist hover:text-frost"
        >
          {t("context.close")}
        </button>
      </div>

      {post && (
        <p className="mb-3 rounded-xl bg-white/[0.03] p-3 text-sm leading-relaxed text-mist">
          {post.text}
        </p>
      )}

      {!post && entity.summary && (
        <p className="mb-3 text-sm leading-relaxed text-mist">{entity.summary}</p>
      )}

      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
          {t("context.why")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-frost/90">{why}</p>
        {opp && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {opp.rationale.map((r) => (
              <li
                key={r}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-mist"
              >
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-glow">
            {t("context.nextMove")}
          </p>
          <p className="text-sm text-frost">{nextLabel}</p>
        </div>
        <button
          type="button"
          disabled={busy || !relatedMove}
          onClick={() => relatedMove && onDoMove(relatedMove.id)}
          className="rounded-full bg-frost px-4 py-2 text-xs font-medium text-void disabled:opacity-40"
        >
          {busy ? t("context.working") : t("context.doIt")}
        </button>
      </div>
    </aside>
  );
}
