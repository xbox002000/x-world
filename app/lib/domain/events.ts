export type WorldEventName =
  | "world_enter"
  | "world_loaded"
  | "entity_clicked"
  | "entity_explored"
  | "opportunity_viewed"
  | "next_move_shown"
  | "quest_started"
  | "quest_completed"
  | "share_clicked";

export interface WorldEvent {
  name: WorldEventName;
  at: string;
  payload?: Record<string, unknown>;
}

const events: WorldEvent[] = [];

export function track(
  name: WorldEventName,
  payload?: Record<string, unknown>
): void {
  const evt: WorldEvent = {
    name,
    at: new Date().toISOString(),
    payload,
  };
  events.push(evt);
  // eslint-disable-next-line no-console
  console.info("[x-world]", name, payload ?? {});
}

export function getEvents(): readonly WorldEvent[] {
  return events;
}

export function clearEvents(): void {
  events.length = 0;
}
