/**
 * Agent registry: resolves agent definitions from prompts and config.
 */

import { z } from "zod";
import type { PromptDefinition } from "../prompts/loader.js";
import type { ModelsConfig, ModelTier } from "../config/schema.js";
import { createLogger } from "../utils/logger.js";

const log = createLogger("agents");

export const AgentDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  model: z.string(),
  tier: z.enum(["high", "balanced", "fast"]),
  reasoningEffort: z.enum(["low", "medium", "high"]),
  systemPrompt: z.string(),
});

export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

/**
 * Map a model name to a tier.
 */
function modelToTier(model: string): ModelTier {
  if (model.includes("2.5-pro")) return "high";
  if (model.includes("2.5-flash")) return "balanced";
  return "fast";
}

/**
 * Resolve an agent definition from a prompt and model config.
 */
export function resolveAgent(
  prompt: PromptDefinition,
  models: ModelsConfig,
): AgentDefinition {
  const tier = modelToTier(prompt.frontmatter.model);
  const resolvedModel = models[tier];

  return {
    name: prompt.frontmatter.name,
    description: prompt.frontmatter.description,
    model: resolvedModel,
    tier,
    reasoningEffort: prompt.frontmatter.reasoning_effort,
    systemPrompt: prompt.body,
  };
}

/**
 * Agent registry that manages agent definitions.
 */
export class AgentRegistry {
  private agents = new Map<string, AgentDefinition>();

  register(agent: AgentDefinition): void {
    this.agents.set(agent.name, agent);
    log.debug(`Registered agent: ${agent.name} (${agent.model})`);
  }

  get(name: string): AgentDefinition | undefined {
    return this.agents.get(name);
  }

  list(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }

  names(): string[] {
    return Array.from(this.agents.keys());
  }

  has(name: string): boolean {
    return this.agents.has(name);
  }

  get size(): number {
    return this.agents.size;
  }
}

/**
 * Build an agent registry from a set of prompts and model config.
 */
export function buildAgentRegistry(
  prompts: Map<string, PromptDefinition>,
  models: ModelsConfig,
): AgentRegistry {
  const registry = new AgentRegistry();
  for (const [, prompt] of prompts) {
    const agent = resolveAgent(prompt, models);
    registry.register(agent);
  }
  log.info(`Agent registry built with ${registry.size} agents`);
  return registry;
}
