/**
 * Simple structured logger for Gemini Pilot.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[90m",
  info: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

const RESET = "\x1b[0m";

let currentLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

export function getLogLevel(): LogLevel {
  return currentLevel;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[currentLevel];
}

function formatMessage(level: LogLevel, scope: string, message: string): string {
  const timestamp = new Date().toISOString().slice(11, 23);
  const color = LEVEL_COLORS[level];
  const tag = level.toUpperCase().padEnd(5);
  return `${color}${timestamp} [${tag}]${RESET} ${scope ? `(${scope}) ` : ""}${message}`;
}

export function createLogger(scope: string) {
  return {
    debug(message: string, ...args: unknown[]): void {
      if (shouldLog("debug")) {
        console.debug(formatMessage("debug", scope, message), ...args);
      }
    },
    info(message: string, ...args: unknown[]): void {
      if (shouldLog("info")) {
        console.info(formatMessage("info", scope, message), ...args);
      }
    },
    warn(message: string, ...args: unknown[]): void {
      if (shouldLog("warn")) {
        console.warn(formatMessage("warn", scope, message), ...args);
      }
    },
    error(message: string, ...args: unknown[]): void {
      if (shouldLog("error")) {
        console.error(formatMessage("error", scope, message), ...args);
      }
    },
  };
}
