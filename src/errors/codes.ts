/**
 * Standardized error codes for Gemini Pilot.
 *
 * Every user-facing error should reference one of these codes so that
 * users can search for "GP_XXX" and find documentation.
 *
 * @module errors/codes
 */

/** Structured error code descriptor. */
export interface ErrorCode {
  /** Machine-readable code, e.g. "GP_001". */
  code: string;
  /** One-line human-readable summary. */
  message: string;
  /** Longer guidance on how to resolve the issue. */
  hint: string;
}

/**
 * Catalog of all Gemini Pilot error codes.
 *
 * Range allocation:
 *   GP_001 - GP_009  Configuration and setup
 *   GP_010 - GP_019  Agent and prompt resolution
 *   GP_020 - GP_029  Workflow execution
 *   GP_030 - GP_039  Session and harness
 *   GP_040 - GP_049  Team / tmux
 *   GP_050 - GP_059  MCP server
 *   GP_060 - GP_069  Plugin system
 */
export const ERROR_CODES = {
  // --- Configuration & Setup ---
  GP_001: {
    code: "GP_001",
    message: "Configuration file contains invalid JSON",
    hint: "Run 'gp config validate' to see details. Check for trailing commas or missing quotes.",
  },
  GP_002: {
    code: "GP_002",
    message: "Configuration schema validation failed",
    hint: "Run 'gp config validate' to see which fields are invalid. See config.example.json for reference.",
  },
  GP_003: {
    code: "GP_003",
    message: "Project not initialized",
    hint: "Run 'gp setup' in your project root to create the .gemini-pilot/ directory.",
  },
  GP_004: {
    code: "GP_004",
    message: "Node.js version too old",
    hint: "Gemini Pilot requires Node.js >= 20. Upgrade via nvm or your package manager.",
  },
  GP_005: {
    code: "GP_005",
    message: "Gemini CLI not found",
    hint: "Install it with: npm i -g @google/gemini-cli",
  },

  // --- Agent & Prompt Resolution ---
  GP_010: {
    code: "GP_010",
    message: "Unknown agent name",
    hint: "Run 'gp prompts list' to see all available agent roles.",
  },
  GP_011: {
    code: "GP_011",
    message: "Prompt file failed to parse",
    hint: "Check the YAML frontmatter in the prompt markdown file. Required fields: name, description.",
  },
  GP_012: {
    code: "GP_012",
    message: "No prompts found",
    hint: "Ensure the prompts/ directory exists in the package root or set config.promptsDir.",
  },

  // --- Workflow ---
  GP_020: {
    code: "GP_020",
    message: "Unknown workflow name",
    hint: "Run 'gp workflows list' to see all available workflows.",
  },
  GP_021: {
    code: "GP_021",
    message: "Workflow step failed gate check",
    hint: "The gate condition for this step was not met. Review the step output and try again.",
  },
  GP_022: {
    code: "GP_022",
    message: "Workflow exceeded maximum iterations",
    hint: "The workflow hit its max_iterations limit. Increase it in the workflow file or fix the failing step.",
  },
  GP_023: {
    code: "GP_023",
    message: "Workflow step references unknown agent",
    hint: "The agent specified in this step is not in the prompt registry. Run 'gp prompts list'.",
  },

  // --- Session & Harness ---
  GP_030: {
    code: "GP_030",
    message: "Gemini CLI execution failed",
    hint: "Check that 'gemini' is installed and GEMINI_API_KEY is set. Run 'gp doctor' for diagnostics.",
  },
  GP_031: {
    code: "GP_031",
    message: "Empty prompt provided",
    hint: 'Provide a non-empty prompt string. Usage: gp ask "your question here"',
  },
  GP_032: {
    code: "GP_032",
    message: "Invalid model tier",
    hint: "Valid tiers are: high, balanced, fast.",
  },

  // --- Team / tmux ---
  GP_040: {
    code: "GP_040",
    message: "tmux is not installed",
    hint: "Team mode requires tmux. Install with: brew install tmux (macOS) or apt install tmux (Linux).",
  },
  GP_041: {
    code: "GP_041",
    message: "Invalid worker count",
    hint: "Worker count must be between 1 and 8.",
  },

  // --- MCP Server ---
  GP_050: {
    code: "GP_050",
    message: "MCP server failed to start",
    hint: "Check that no other process is using stdio. The MCP server is typically started by Gemini CLI.",
  },

  // --- Plugin System ---
  GP_060: {
    code: "GP_060",
    message: "Plugin directory not found",
    hint: "Create .gemini-pilot/prompts/ or .gemini-pilot/workflows/ in your project root.",
  },
  GP_061: {
    code: "GP_061",
    message: "Plugin file failed to load",
    hint: "Check the markdown frontmatter in your custom prompt/workflow file.",
  },

  // --- Benchmark ---
  GP_070: {
    code: "GP_070",
    message: "Benchmark execution failed",
    hint: "Ensure Gemini CLI is installed and GEMINI_API_KEY is set. Run 'gp doctor'.",
  },

  // --- Init ---
  GP_080: {
    code: "GP_080",
    message: "Unknown project template",
    hint: "Available templates: node, python, fullstack. Usage: gp init --template node",
  },
} as const satisfies Record<string, ErrorCode>;

/** All known error code keys. */
export type ErrorCodeKey = keyof typeof ERROR_CODES;

/**
 * Create a formatted error message that includes the error code.
 *
 * @param key - Error code key from ERROR_CODES catalog
 * @param extra - Optional additional context to append
 * @returns Formatted error string: "[GP_XXX] message\n  Hint: hint"
 */
export function formatError(key: ErrorCodeKey, extra?: string): string {
  const entry = ERROR_CODES[key];
  let msg = `[${entry.code}] ${entry.message}`;
  if (extra) {
    msg += `: ${extra}`;
  }
  msg += `\n  Hint: ${entry.hint}`;
  return msg;
}

/**
 * GeminiPilotError extends the base Error class with a structured error code.
 *
 * @example
 * ```ts
 * throw new GeminiPilotError("GP_010", "agent name: foo");
 * ```
 */
export class GeminiPilotError extends Error {
  /** The structured error code key. */
  readonly errorCode: ErrorCodeKey;

  /**
   * @param key - Error code key from the catalog
   * @param extra - Optional extra context
   */
  constructor(key: ErrorCodeKey, extra?: string) {
    super(formatError(key, extra));
    this.name = "GeminiPilotError";
    this.errorCode = key;
  }
}
