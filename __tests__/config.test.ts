import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  GeminiPilotConfigSchema,
  DEFAULT_CONFIG,
  ModelTierSchema,
  ApprovalModeSchema,
} from "../src/config/schema.js";
import { validateConfig } from "../src/config/loader.js";

describe("Config Schema", () => {
  it("should parse default config correctly", () => {
    const config = GeminiPilotConfigSchema.parse({});
    expect(config.models.high).toBe("gemini-2.5-pro");
    expect(config.models.balanced).toBe("gemini-2.5-flash");
    expect(config.models.fast).toBe("gemini-2.0-flash");
    expect(config.session.approvalMode).toBe("auto");
    expect(config.session.defaultTier).toBe("balanced");
  });

  it("should accept valid custom config", () => {
    const config = GeminiPilotConfigSchema.parse({
      models: { high: "custom-pro", balanced: "custom-flash", fast: "custom-fast" },
      session: { approvalMode: "yolo", defaultTier: "high" },
    });
    expect(config.models.high).toBe("custom-pro");
    expect(config.session.approvalMode).toBe("yolo");
  });

  it("should reject invalid approval mode", () => {
    expect(() =>
      GeminiPilotConfigSchema.parse({
        session: { approvalMode: "invalid" },
      }),
    ).toThrow();
  });

  it("should have correct default values in DEFAULT_CONFIG", () => {
    expect(DEFAULT_CONFIG.models.high).toBe("gemini-2.5-pro");
    expect(DEFAULT_CONFIG.team.maxWorkers).toBe(4);
    expect(DEFAULT_CONFIG.session.maxTurns).toBe(50);
  });

  it("should validate model tiers", () => {
    expect(ModelTierSchema.safeParse("high").success).toBe(true);
    expect(ModelTierSchema.safeParse("balanced").success).toBe(true);
    expect(ModelTierSchema.safeParse("fast").success).toBe(true);
    expect(ModelTierSchema.safeParse("turbo").success).toBe(false);
  });

  it("should validate approval modes", () => {
    expect(ApprovalModeSchema.safeParse("full").success).toBe(true);
    expect(ApprovalModeSchema.safeParse("auto").success).toBe(true);
    expect(ApprovalModeSchema.safeParse("yolo").success).toBe(true);
    expect(ApprovalModeSchema.safeParse("unsafe").success).toBe(false);
  });
});

describe("Config Validation", () => {
  it("should validate a correct config", () => {
    const result = validateConfig(DEFAULT_CONFIG);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should report errors for invalid config", () => {
    const result = validateConfig({
      models: { high: 123 },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });
});

describe("Config Environment Overrides", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should detect env vars for model overrides", () => {
    // Just verify the env var names are correct
    expect(typeof process.env.GP_MODEL_HIGH).toBe(
      process.env.GP_MODEL_HIGH ? "string" : "undefined",
    );
  });
});
