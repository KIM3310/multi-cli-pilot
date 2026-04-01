/**
 * Configuration schema definitions using Zod.
 */

import { z } from "zod";

export const ModelTierSchema = z.enum(["high", "balanced", "fast"]);
export type ModelTier = z.infer<typeof ModelTierSchema>;

export const ApprovalModeSchema = z.enum(["full", "auto", "yolo"]);
export type ApprovalMode = z.infer<typeof ApprovalModeSchema>;

export const ModelsConfigSchema = z.object({
  high: z.string().default("gemini-2.5-pro"),
  balanced: z.string().default("gemini-2.5-flash"),
  fast: z.string().default("gemini-2.0-flash"),
});
export type ModelsConfig = z.infer<typeof ModelsConfigSchema>;

export const SessionConfigSchema = z.object({
  approvalMode: ApprovalModeSchema.default("auto"),
  defaultTier: ModelTierSchema.default("balanced"),
  contextWindow: z.number().default(1000000),
  maxTurns: z.number().default(50),
});
export type SessionConfig = z.infer<typeof SessionConfigSchema>;

export const TeamConfigSchema = z.object({
  maxWorkers: z.number().default(4),
  heartbeatIntervalMs: z.number().default(5000),
  taskTimeoutMs: z.number().default(300000),
});
export type TeamConfig = z.infer<typeof TeamConfigSchema>;

export const GeminiPilotConfigSchema = z.object({
  models: ModelsConfigSchema.default({}),
  session: SessionConfigSchema.default({}),
  team: TeamConfigSchema.default({}),
  promptsDir: z.string().optional(),
  workflowsDir: z.string().optional(),
});

export type GeminiPilotConfig = z.infer<typeof GeminiPilotConfigSchema>;

export const DEFAULT_CONFIG: GeminiPilotConfig = GeminiPilotConfigSchema.parse({});
