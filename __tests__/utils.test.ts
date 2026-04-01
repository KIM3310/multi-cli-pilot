import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { parseMarkdownWithFrontmatter } from "../src/utils/markdown.js";
import { ensureDir, readJsonFile, writeJsonFile, listFiles } from "../src/utils/fs.js";
import { createLogger, setLogLevel, getLogLevel } from "../src/utils/logger.js";

describe("Markdown Parser", () => {
  it("should parse frontmatter and body", () => {
    const content = `---
name: test
description: A test
---

# Test Content

Some body text.`;

    const result = parseMarkdownWithFrontmatter(content);
    expect(result.frontmatter).toEqual({ name: "test", description: "A test" });
    expect(result.body).toContain("Test Content");
    expect(result.body).toContain("Some body text.");
  });

  it("should handle content without frontmatter", () => {
    const content = "# Just a heading\n\nSome text.";
    const result = parseMarkdownWithFrontmatter(content);
    expect(result.frontmatter).toEqual({});
    expect(result.body).toContain("Just a heading");
  });

  it("should handle empty content", () => {
    const result = parseMarkdownWithFrontmatter("");
    expect(result.frontmatter).toEqual({});
    expect(result.body).toBe("");
  });
});

describe("File System Utilities", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gp-fstest-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should create nested directories", () => {
    const nested = path.join(tempDir, "a", "b", "c");
    ensureDir(nested);
    expect(fs.existsSync(nested)).toBe(true);
  });

  it("should read and write JSON files", () => {
    const filePath = path.join(tempDir, "test.json");
    const data = { key: "value", num: 42, arr: [1, 2, 3] };

    writeJsonFile(filePath, data);
    const loaded = readJsonFile(filePath);

    expect(loaded).toEqual(data);
  });

  it("should return undefined for non-existent JSON file", () => {
    const loaded = readJsonFile(path.join(tempDir, "nonexistent.json"));
    expect(loaded).toBeUndefined();
  });

  it("should list files with extension filter", () => {
    fs.writeFileSync(path.join(tempDir, "a.md"), "");
    fs.writeFileSync(path.join(tempDir, "b.md"), "");
    fs.writeFileSync(path.join(tempDir, "c.ts"), "");

    const mdFiles = listFiles(tempDir, ".md");
    expect(mdFiles).toHaveLength(2);
    expect(mdFiles).toContain("a.md");
    expect(mdFiles).toContain("b.md");

    const allFiles = listFiles(tempDir);
    expect(allFiles).toHaveLength(3);
  });
});

describe("Logger", () => {
  it("should create loggers with scope", () => {
    const log = createLogger("test-scope");
    expect(log).toBeDefined();
    expect(typeof log.info).toBe("function");
    expect(typeof log.debug).toBe("function");
    expect(typeof log.warn).toBe("function");
    expect(typeof log.error).toBe("function");
  });

  it("should get and set log level", () => {
    const original = getLogLevel();
    setLogLevel("debug");
    expect(getLogLevel()).toBe("debug");
    setLogLevel(original);
  });
});
