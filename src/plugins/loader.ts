/**
 * Plugin / extension loader.
 *
 * Scans the user's `.gemini-pilot/prompts/` and `.gemini-pilot/workflows/`
 * directories for custom definitions and merges them with the built-in
 * registries.
 *
 * @module plugins/loader
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { getStateDir } from "../utils/fs.js";
import { createLogger } from "../utils/logger.js";

const log = createLogger("plugins");

/** Directories that the plugin system manages. */
export interface PluginDirs {
  /** Path to custom user prompts directory. */
  prompts: string;
  /** Path to custom user workflows directory. */
  workflows: string;
}

/**
 * Resolve plugin directories for a project.
 *
 * @param projectRoot - Optional project root override
 * @returns Resolved plugin directory paths
 */
export function getPluginDirs(projectRoot?: string): PluginDirs {
  const stateDir = getStateDir(projectRoot);
  return {
    prompts: path.join(stateDir, "prompts"),
    workflows: path.join(stateDir, "workflows"),
  };
}

/**
 * Ensure plugin directories exist, creating them if needed.
 *
 * @param projectRoot - Optional project root override
 * @returns The resolved plugin directories
 */
export function ensurePluginDirs(projectRoot?: string): PluginDirs {
  const dirs = getPluginDirs(projectRoot);
  for (const dir of Object.values(dirs)) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.debug(`Created plugin directory: ${dir}`);
    }
  }
  return dirs;
}

/**
 * List plugin files in a directory.
 *
 * @param dirPath - Directory to scan
 * @returns Array of absolute file paths
 */
export function listPluginFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dirPath, f));
}

/**
 * Discover all custom prompt files in the plugin directory.
 *
 * @param projectRoot - Optional project root override
 * @returns Array of absolute paths to custom prompt files
 */
export function discoverCustomPrompts(projectRoot?: string): string[] {
  const dirs = getPluginDirs(projectRoot);
  const files = listPluginFiles(dirs.prompts);
  if (files.length > 0) {
    log.info(`Found ${files.length} custom prompt(s) in ${dirs.prompts}`);
  }
  return files;
}

/**
 * Discover all custom workflow files in the plugin directory.
 *
 * @param projectRoot - Optional project root override
 * @returns Array of absolute paths to custom workflow files
 */
export function discoverCustomWorkflows(projectRoot?: string): string[] {
  const dirs = getPluginDirs(projectRoot);
  const files = listPluginFiles(dirs.workflows);
  if (files.length > 0) {
    log.info(`Found ${files.length} custom workflow(s) in ${dirs.workflows}`);
  }
  return files;
}
