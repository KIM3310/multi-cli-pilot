/**
 * Event hooks: extensible lifecycle events for session management.
 *
 * Provides a simple pub/sub system for lifecycle events like session-start,
 * session-end, workflow-step, and error.
 *
 * @module hooks/manager
 */

import { createLogger } from "../utils/logger.js";

const log = createLogger("hooks");

export type HookEvent =
  | "session-start"
  | "session-end"
  | "turn-start"
  | "turn-complete"
  | "workflow-step"
  | "team-phase"
  | "error";

export type HookHandler = (
  event: HookEvent,
  data: Record<string, unknown>,
) => void | Promise<void>;

/**
 * Hook manager: register and emit lifecycle events.
 */
export class HookManager {
  private handlers = new Map<HookEvent, HookHandler[]>();

  /**
   * Register a handler for an event.
   */
  on(event: HookEvent, handler: HookHandler): void {
    const existing = this.handlers.get(event) ?? [];
    existing.push(handler);
    this.handlers.set(event, existing);
    log.debug(`Hook registered: ${event}`);
  }

  /**
   * Remove a handler for an event.
   */
  off(event: HookEvent, handler: HookHandler): void {
    const existing = this.handlers.get(event) ?? [];
    this.handlers.set(
      event,
      existing.filter((h) => h !== handler),
    );
  }

  /**
   * Emit an event, calling all registered handlers.
   */
  async emit(
    event: HookEvent,
    data: Record<string, unknown> = {},
  ): Promise<void> {
    const handlers = this.handlers.get(event) ?? [];
    log.debug(`Emitting hook: ${event} (${handlers.length} handlers)`);

    for (const handler of handlers) {
      try {
        await handler(event, data);
      } catch (err) {
        log.error(`Hook handler error for ${event}:`, err);
      }
    }
  }

  /**
   * Get the number of handlers for an event.
   */
  handlerCount(event: HookEvent): number {
    return (this.handlers.get(event) ?? []).length;
  }

  /**
   * Remove all handlers.
   */
  clear(): void {
    this.handlers.clear();
  }
}

/**
 * Default hook manager instance.
 */
export const hooks = new HookManager();
