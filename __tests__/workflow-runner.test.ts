import { describe, it, expect } from "vitest";
import { evaluateGate, buildStepPrompt } from "../src/workflows/runner.js";

describe("evaluateGate", () => {
  it("should pass for empty or 'none' gate", () => {
    expect(evaluateGate("", "any output")).toBe(true);
    expect(evaluateGate("none", "any output")).toBe(true);
    expect(evaluateGate("always", "")).toBe(true);
  });

  it("should pass for not-empty when output has content", () => {
    expect(evaluateGate("not-empty", "hello")).toBe(true);
    expect(evaluateGate("non-empty", "hello")).toBe(true);
  });

  it("should fail for not-empty when output is blank", () => {
    expect(evaluateGate("not-empty", "")).toBe(false);
    expect(evaluateGate("not-empty", "   ")).toBe(false);
  });

  it("should pass for exit-code:0", () => {
    expect(evaluateGate("exit-code:0", "any output")).toBe(true);
    expect(evaluateGate("exit-code: 0", "any output")).toBe(true);
  });

  it("should check contains: pattern", () => {
    expect(evaluateGate("contains:PASS", "Tests: 5 PASS, 0 FAIL")).toBe(true);
    expect(evaluateGate("contains:pass", "Tests: 5 PASS")).toBe(true);
    expect(evaluateGate("contains:error", "All tests passed")).toBe(false);
  });

  it("should do loose substring match as fallback", () => {
    expect(evaluateGate("success", "Build success!")).toBe(true);
    expect(evaluateGate("PASS", "all tests passed")).toBe(true);
    expect(evaluateGate("error", "no problems here")).toBe(false);
  });
});

describe("buildStepPrompt", () => {
  it("should include action and output", () => {
    const prompt = buildStepPrompt({
      agent: "executor",
      action: "Run the linter",
      output: "Clean output",
      gate: "exit-code:0",
    });
    expect(prompt).toContain("Run the linter");
    expect(prompt).toContain("Clean output");
  });

  it("should include prior output when provided", () => {
    const prompt = buildStepPrompt(
      { agent: "test-engineer", action: "Run tests", output: "Pass", gate: "pass" },
      "Lint was clean",
    );
    expect(prompt).toContain("Lint was clean");
    expect(prompt).toContain("previous step");
  });

  it("should not include prior context when not provided", () => {
    const prompt = buildStepPrompt({
      agent: "executor",
      action: "Build",
      output: "Artifacts",
      gate: "exit-code:0",
    });
    expect(prompt).not.toContain("previous step");
  });
});
