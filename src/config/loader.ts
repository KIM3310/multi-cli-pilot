/**
 * Hierarchical config loader: defaults -> user config -> project config -> env vars.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  GeminiPilotConfigSchema,
  type GeminiPilotConfig,
  DEFAULT_CONFIG,
} from "./schema.js";
import { readJsonFile, getStateDir } from "../utils/fs.js";
import { createLogger } from "../utils/logger.js";

const log = createLogger("config");

/**
 * Path to user-level config file.
 */
export function getUserConfigPath(): string {
  return path.join(os.homedir(), ".config", "gemini-pilot", "config.json");
}

/**
 * Path to project-level config file.
 */
export function getProjectConfigPath(projectRoot?: string): string {
  return path.join(getStateDir(projectRoot), "config.json");
}

/**
 * Deep merge two objects. Source values override target values.
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceVal = source[key];
    const targetVal = target[key];
    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>,
      ) as T[keyof T];
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal as T[keyof T];
    }
  }
  return result;
}

/**
 * Apply environment variable overrides.
 */
function applyEnvOverrides(config: GeminiPilotConfig): GeminiPilotConfig {
  const result = { ...config, models: { ...config.models } };

  if (process.env.GP_MODEL_HIGH) {
    result.models.high = process.env.GP_MODEL_HIGH;
  }
  if (process.env.GP_MODEL_BALANCED) {
    result.models.balanced = process.env.GP_MODEL_BALANCED;
  }
  if (process.env.GP_MODEL_FAST) {
    result.models.fast = process.env.GP_MODEL_FAST;
  }

  return result;
}

/**
 * Load configuration with hierarchical merging:
 * defaults -> user config -> project config -> env vars
 */
export function loadConfig(projectRoot?: string): GeminiPilotConfig {
  let config: GeminiPilotConfig = { ...DEFAULT_CONFIG };

  // Layer 1: User config
  const userConfig = readJsonFile<Partial<GeminiPilotConfig>>(getUserConfigPath());
  if (userConfig) {
    log.debug("Loaded user config");
    config = deepMerge(config, userConfig);
  }

  // Layer 2: Project config
  const projectConfig = readJsonFile<Partial<GeminiPilotConfig>>(
    getProjectConfigPath(projectRoot),
  );
  if (projectConfig) {
    log.debug("Loaded project config");
    config = deepMerge(config, projectConfig);
  }

  // Layer 3: Environment variables
  config = applyEnvOverrides(config);

  // Validate final config
  const parsed = GeminiPilotConfigSchema.safeParse(config);
  if (!parsed.success) {
    log.warn("Config validation issues, using defaults for invalid fields");
    return DEFAULT_CONFIG;
  }

  return parsed.data;
}

/**
 * Validate a config object against the schema.
 */
export function validateConfig(
  config: unknown,
): { valid: boolean; errors?: string[] } {
  const result = GeminiPilotConfigSchema.safeParse(config);
  if (result.success) {
    return { valid: true };
  }
  return {
    valid: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`,
    ),
  };
}

/**
 * Load and validate the raw project config file from disk.
 * Unlike loadConfig(), this does NOT silently fall back to defaults --
 * it reports JSON parse errors and schema violations directly.
 */
export function loadAndValidateConfigFile(
  projectRoot?: string,
): { valid: boolean; errors?: string[] } {
  const configPath = getProjectConfigPath(projectRoot);
  let raw: string;
  try {
    raw = fs.readFileSync(configPath, "utf-8");
  } catch {
    // No project config file -- that is fine, defaults will be used
    return { valid: true };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {
      valid: false,
      errors: [`Invalid JSON in ${configPath}: ${(err as Error).message}`],
    };
  }

  return validateConfig(parsed);
}
