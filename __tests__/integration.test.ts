import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import * as path from "node:path";

const CLI_PATH = path.resolve(__dirname, "..", "dist", "cli", "index.js");

describe("CLI Integration", () => {
  it("should exit 0 and show help with expected commands", () => {
    const output = execFileSync("node", [CLI_PATH, "--help"], {
      encoding: "utf-8",
      timeout: 10000,
    });

    expect(output).toContain("gp");
    expect(output).toContain("harness");
    expect(output).toContain("team");
    expect(output).toContain("ask");
    expect(output).toContain("prompts");
    expect(output).toContain("workflows");
    expect(output).toContain("doctor");
    expect(output).toContain("config");
    expect(output).toContain("status");
    expect(output).toContain("mcp");
    expect(output).toContain("benchmark");
    expect(output).toContain("init");
  });

  it("should show version number", () => {
    const output = execFileSync("node", [CLI_PATH, "--version"], {
      encoding: "utf-8",
      timeout: 10000,
    });

    // Should match semver pattern
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("should list prompts without error", () => {
    const output = execFileSync("node", [CLI_PATH, "prompts", "list"], {
      encoding: "utf-8",
      timeout: 10000,
    });

    expect(output).toContain("Available Prompts");
    expect(output).toContain("executor");
  });

  it("should list workflows without error", () => {
    const output = execFileSync("node", [CLI_PATH, "workflows", "list"], {
      encoding: "utf-8",
      timeout: 10000,
    });

    expect(output).toContain("Available Workflows");
    expect(output).toContain("autopilot");
  });

  it("should show config without error", () => {
    const output = execFileSync("node", [CLI_PATH, "config", "show"], {
      encoding: "utf-8",
      timeout: 10000,
    });

    const config = JSON.parse(output);
    expect(config).toHaveProperty("models");
    expect(config).toHaveProperty("session");
    expect(config.models).toHaveProperty("high");
  });
});
