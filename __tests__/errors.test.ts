import { describe, it, expect } from "vitest";
import {
  ERROR_CODES,
  formatError,
  GeminiPilotError,
} from "../src/errors/codes.js";

describe("Error Codes", () => {
  it("should have all expected error code ranges", () => {
    expect(ERROR_CODES.GP_001).toBeDefined();
    expect(ERROR_CODES.GP_010).toBeDefined();
    expect(ERROR_CODES.GP_020).toBeDefined();
    expect(ERROR_CODES.GP_030).toBeDefined();
    expect(ERROR_CODES.GP_040).toBeDefined();
    expect(ERROR_CODES.GP_050).toBeDefined();
    expect(ERROR_CODES.GP_060).toBeDefined();
    expect(ERROR_CODES.GP_070).toBeDefined();
    expect(ERROR_CODES.GP_080).toBeDefined();
  });

  it("each error code should have code, message, and hint", () => {
    for (const [key, value] of Object.entries(ERROR_CODES)) {
      expect(value.code).toBe(key);
      expect(value.message).toBeTruthy();
      expect(value.hint).toBeTruthy();
    }
  });
});

describe("formatError", () => {
  it("should format an error with code and hint", () => {
    const msg = formatError("GP_001");
    expect(msg).toContain("[GP_001]");
    expect(msg).toContain("invalid JSON");
    expect(msg).toContain("Hint:");
  });

  it("should include extra context when provided", () => {
    const msg = formatError("GP_010", "my-agent");
    expect(msg).toContain("[GP_010]");
    expect(msg).toContain("my-agent");
  });
});

describe("GeminiPilotError", () => {
  it("should extend Error with errorCode property", () => {
    const err = new GeminiPilotError("GP_031");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("GeminiPilotError");
    expect(err.errorCode).toBe("GP_031");
    expect(err.message).toContain("[GP_031]");
  });

  it("should include extra context in message", () => {
    const err = new GeminiPilotError("GP_010", "bad-agent");
    expect(err.message).toContain("bad-agent");
  });
});
