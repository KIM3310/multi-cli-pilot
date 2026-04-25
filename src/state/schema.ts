/**
 * State schema definitions for sessions, workflows, teams, memory, and notepad.
 *
 * All state objects are validated at runtime with Zod schemas.
 *
 * @module state/schema
 */

import { z } from "zod";

/** Per-session performance metrics. */
export const SessionMetricsSchema = z.object({
  promptsSent: z.number().default(0),
  estimatedTokens: z.number().default(0),
  elapsedMs: z.number().default(0),
  modelUsed: z.string().optional(),
});
/** Session metrics type. */
export type SessionMetrics = z.infer<typeof SessionMetricsSchema>;

/** Persisted state for a single CLI session. */
export const SessionStateSchema = z.object({
  id: z.string(),
  startedAt: z.string(),
  endedAt: z.string().optional(),
  agent: z.string().optional(),
  workflow: z.string().optional(),
  tier: z.string().default("balanced"),
  approvalMode: z.string().default("auto"),
  turns: z.number().default(0),
  status: z.enum(["active", "paused", "completed", "error"]).default("active"),
  metrics: SessionMetricsSchema.optional(),
});
export type SessionState = z.infer<typeof SessionStateSchema>;

export const WorkflowStateSchema = z.object({
  workflowName: z.string(),
  currentStep: z.number().default(0),
  totalSteps: z.number(),
  status: z
    .enum(["pending", "running", "paused", "completed", "failed"])
    .default("pending"),
  iterations: z.number().default(0),
  stepResults: z.array(z.record(z.unknown())).default([]),
  startedAt: z.string(),
  updatedAt: z.string(),
});
export type WorkflowState = z.infer<typeof WorkflowStateSchema>;

export const TeamStateSchema = z.object({
  id: z.string(),
  workerCount: z.number(),
  workers: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      status: z.enum(["idle", "busy", "done", "error"]),
      currentTask: z.string().optional(),
      lastHeartbeat: z.string().optional(),
    }),
  ),
  taskQueue: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      assignedTo: z.string().optional(),
      status: z.enum(["pending", "assigned", "running", "done", "failed"]),
      result: z.string().optional(),
    }),
  ),
  phase: z.enum(["plan", "execute", "verify", "fix"]).default("plan"),
  startedAt: z.string(),
});
export type TeamState = z.infer<typeof TeamStateSchema>;

export const ProjectMemorySchema = z.object({
  techStack: z.array(z.string()).default([]),
  conventions: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  decisions: z
    .array(
      z.object({
        date: z.string(),
        decision: z.string(),
        rationale: z.string(),
      }),
    )
    .default([]),
});
export type ProjectMemory = z.infer<typeof ProjectMemorySchema>;

export const NotepadSchema = z.object({
  entries: z
    .array(
      z.object({
        timestamp: z.string(),
        content: z.string(),
        tags: z.array(z.string()).default([]),
      }),
    )
    .default([]),
});
export type Notepad = z.infer<typeof NotepadSchema>;
