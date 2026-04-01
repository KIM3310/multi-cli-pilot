import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  getPluginDirs,
  ensurePluginDirs,
  listPluginFiles,
  discoverCustomPrompts,
  discoverCustomWorkflows,
} from "../src/plugins/loader.js";

describe("Plugin Loader", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gp-plugin-test-"));
    fs.mkdirSync(path.join(tmpDir, ".gemini-pilot"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("getPluginDirs should return correct paths", () => {
    const dirs = getPluginDirs(tmpDir);
    expect(dirs.prompts).toContain(".gemini-pilot");
    expect(dirs.prompts).toContain("prompts");
    expect(dirs.workflows).toContain("workflows");
  });

  it("ensurePluginDirs should create directories", () => {
    const dirs = ensurePluginDirs(tmpDir);
    expect(fs.existsSync(dirs.prompts)).toBe(true);
    expect(fs.existsSync(dirs.workflows)).toBe(true);
  });

  it("listPluginFiles should return md files", () => {
    const dir = path.join(tmpDir, ".gemini-pilot", "prompts");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "custom.md"), "---\nname: custom\n---\nBody");
    fs.writeFileSync(path.join(dir, "ignore.txt"), "not a prompt");

    const files = listPluginFiles(dir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain("custom.md");
  });

  it("listPluginFiles should return empty for non-existent dir", () => {
    const files = listPluginFiles("/nonexistent/path");
    expect(files).toEqual([]);
  });

  it("discoverCustomPrompts should find custom prompt files", () => {
    const dir = path.join(tmpDir, ".gemini-pilot", "prompts");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "my-agent.md"), "---\nname: my-agent\n---\nPrompt");

    const files = discoverCustomPrompts(tmpDir);
    expect(files).toHaveLength(1);
  });

  it("discoverCustomWorkflows should find custom workflow files", () => {
    const dir = path.join(tmpDir, ".gemini-pilot", "workflows");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "my-flow.md"), "---\nname: my-flow\n---\nWorkflow");

    const files = discoverCustomWorkflows(tmpDir);
    expect(files).toHaveLength(1);
  });
});
