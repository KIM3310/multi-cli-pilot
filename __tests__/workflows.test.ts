import { describe, it, expect } from "vitest";
import * as path from "node:path";
import {
  loadWorkflowFile,
  WorkflowRegistry,
  WorkflowFrontmatterSchema,
  ExecutionPolicySchema,
  createWorkflowRegistry,
} from "../src/workflows/engine.js";

const WORKFLOWS_DIR = path.resolve(__dirname, "..", "workflows");

describe("Workflow Frontmatter Schema", () => {
  it("should validate correct frontmatter", () => {
    const result = WorkflowFrontmatterSchema.safeParse({
      name: "test-workflow",
      description: "A test workflow",
      triggers: ["test this"],
      execution_policy: { max_iterations: 5, auto_approve: true },
    });
    expect(result.success).toBe(true);
  });

  it("should apply defaults for execution policy", () => {
    const result = ExecutionPolicySchema.parse({});
    expect(result.max_iterations).toBe(10);
    expect(result.auto_approve).toBe(false);
    expect(result.halt_on_failure).toBe(true);
  });
});

describe("Workflow File Loading", () => {
  it("should load the autopilot workflow", () => {
    const workflow = loadWorkflowFile(path.join(WORKFLOWS_DIR, "autopilot.md"));
    expect(workflow).toBeDefined();
    expect(workflow!.frontmatter.name).toBe("autopilot");
    expect(workflow!.steps.length).toBeGreaterThan(0);
    expect(workflow!.frontmatter.execution_policy.auto_approve).toBe(true);
  });

  it("should load the deep-plan workflow", () => {
    const workflow = loadWorkflowFile(path.join(WORKFLOWS_DIR, "deep-plan.md"));
    expect(workflow).toBeDefined();
    expect(workflow!.frontmatter.name).toBe("deep-plan");
    expect(workflow!.frontmatter.execution_policy.halt_on_failure).toBe(true);
  });

  it("should parse workflow steps correctly", () => {
    const workflow = loadWorkflowFile(path.join(WORKFLOWS_DIR, "tdd.md"));
    expect(workflow).toBeDefined();
    expect(workflow!.steps.length).toBeGreaterThanOrEqual(3);

    const firstStep = workflow!.steps[0]!;
    expect(firstStep.agent).toBe("test-engineer");
    expect(firstStep.action).toBeTruthy();
    expect(firstStep.gate).toBeTruthy();
  });

  it("should return undefined for non-existent file", () => {
    const workflow = loadWorkflowFile("/nonexistent/workflow.md");
    expect(workflow).toBeUndefined();
  });
});

describe("WorkflowRegistry", () => {
  it("should load all 10 workflows", () => {
    const registry = new WorkflowRegistry();
    registry.addDirectory(WORKFLOWS_DIR);
    expect(registry.size).toBe(10);
  });

  it("should have all expected workflow names", () => {
    const registry = new WorkflowRegistry();
    registry.addDirectory(WORKFLOWS_DIR);
    const names = registry.names();

    expect(names).toContain("autopilot");
    expect(names).toContain("deep-plan");
    expect(names).toContain("sprint");
    expect(names).toContain("investigate");
    expect(names).toContain("tdd");
    expect(names).toContain("review-cycle");
    expect(names).toContain("refactor");
    expect(names).toContain("deploy-prep");
    expect(names).toContain("interview");
    expect(names).toContain("team-sync");
  });

  it("should find workflows by trigger", () => {
    const registry = new WorkflowRegistry();
    registry.addDirectory(WORKFLOWS_DIR);

    const found = registry.findByTrigger("build this feature");
    expect(found).toBeDefined();
    expect(found!.frontmatter.name).toBe("autopilot");
  });

  it("should return undefined for unmatched trigger", () => {
    const registry = new WorkflowRegistry();
    registry.addDirectory(WORKFLOWS_DIR);

    const found = registry.findByTrigger("something completely unrelated xyz123");
    expect(found).toBeUndefined();
  });
});
