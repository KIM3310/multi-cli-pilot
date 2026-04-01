import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { StateManager } from "../src/state/manager.js";
import {
  ProjectMemorySchema,
  NotepadSchema,
  SessionStateSchema,
} from "../src/state/schema.js";

describe("State Schemas", () => {
  it("should parse empty project memory", () => {
    const memory = ProjectMemorySchema.parse({});
    expect(memory.techStack).toEqual([]);
    expect(memory.conventions).toEqual([]);
    expect(memory.notes).toEqual([]);
    expect(memory.decisions).toEqual([]);
  });

  it("should parse project memory with data", () => {
    const memory = ProjectMemorySchema.parse({
      techStack: ["TypeScript", "Node.js"],
      notes: ["Use ESM modules"],
    });
    expect(memory.techStack).toHaveLength(2);
    expect(memory.notes).toHaveLength(1);
  });

  it("should parse empty notepad", () => {
    const notepad = NotepadSchema.parse({});
    expect(notepad.entries).toEqual([]);
  });

  it("should validate session state", () => {
    const session = SessionStateSchema.parse({
      id: "abc123",
      startedAt: new Date().toISOString(),
    });
    expect(session.status).toBe("active");
    expect(session.turns).toBe(0);
  });
});

describe("StateManager", () => {
  let tempDir: string;
  let stateManager: StateManager;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gp-test-"));
    // Create .gemini-pilot inside tempDir so getStateDir works
    const stateDir = path.join(tempDir, ".gemini-pilot");
    fs.mkdirSync(stateDir, { recursive: true });
    stateManager = new StateManager(tempDir);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should save and load a session", () => {
    const session = {
      id: "test-001",
      startedAt: new Date().toISOString(),
      agent: "architect",
      tier: "high",
      approvalMode: "auto",
      turns: 5,
      status: "active" as const,
    };

    stateManager.saveSession(session);
    const loaded = stateManager.loadSession("test-001");

    expect(loaded).toBeDefined();
    expect(loaded!.id).toBe("test-001");
    expect(loaded!.agent).toBe("architect");
    expect(loaded!.turns).toBe(5);
  });

  it("should return undefined for non-existent session", () => {
    const loaded = stateManager.loadSession("nonexistent");
    expect(loaded).toBeUndefined();
  });

  it("should manage project memory", () => {
    stateManager.addTechStack("TypeScript");
    stateManager.addTechStack("Vitest");
    stateManager.addConvention("Use ESM imports");
    stateManager.addMemoryNote("Project uses Node 20+");

    const memory = stateManager.loadMemory();
    expect(memory.techStack).toContain("TypeScript");
    expect(memory.techStack).toContain("Vitest");
    expect(memory.conventions).toContain("Use ESM imports");
    expect(memory.notes).toContain("Project uses Node 20+");
  });

  it("should not duplicate tech stack entries", () => {
    stateManager.addTechStack("TypeScript");
    stateManager.addTechStack("TypeScript");

    const memory = stateManager.loadMemory();
    expect(memory.techStack.filter((t) => t === "TypeScript")).toHaveLength(1);
  });

  it("should manage notepad entries", () => {
    stateManager.addNote("First note", ["todo"]);
    stateManager.addNote("Second note", ["idea"]);
    stateManager.addNote("Third note", ["todo", "urgent"]);

    const allNotes = stateManager.getNotes();
    expect(allNotes).toHaveLength(3);

    const todoNotes = stateManager.getNotes("todo");
    expect(todoNotes).toHaveLength(2);

    const ideaNotes = stateManager.getNotes("idea");
    expect(ideaNotes).toHaveLength(1);
  });

  it("should record decisions with timestamps", () => {
    stateManager.addDecision("Use Vitest", "Faster than Jest, native ESM support");

    const memory = stateManager.loadMemory();
    expect(memory.decisions).toHaveLength(1);
    expect(memory.decisions[0]!.decision).toBe("Use Vitest");
    expect(memory.decisions[0]!.rationale).toContain("Faster");
    expect(memory.decisions[0]!.date).toBeTruthy();
  });
});
