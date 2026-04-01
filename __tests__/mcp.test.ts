import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { createMcpServer } from "../src/mcp/server.js";

/**
 * Helper to call a tool on the MCP server and return the text content.
 */
async function callTool(
  server: ReturnType<typeof createMcpServer>,
  toolName: string,
  args: Record<string, unknown>,
): Promise<string> {
  const registeredTools = (server as any)._registeredTools as Record<
    string,
    { handler: (args: Record<string, unknown>, extra: unknown) => Promise<{ content: { type: string; text: string }[] }> }
  >;
  const tool = registeredTools[toolName];
  if (!tool) {
    throw new Error(`Tool not found: ${toolName}. Available: ${Object.keys(registeredTools).join(", ")}`);
  }
  const result = await tool.handler(args, {});
  return result.content[0]?.text ?? "";
}

describe("MCP Server Tools", () => {
  let tmpDir: string;
  let server: ReturnType<typeof createMcpServer>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gp-mcp-test-"));
    // Create necessary state directories
    const stateDir = path.join(tmpDir, ".gemini-pilot");
    fs.mkdirSync(stateDir, { recursive: true });
    fs.mkdirSync(path.join(stateDir, "sessions"), { recursive: true });
    server = createMcpServer(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // --- Test 1: state_list ---
  it("state_list should return overview of all state keys", async () => {
    const result = await callTool(server, "state_list", {});
    const parsed = JSON.parse(result);

    expect(parsed).toHaveProperty("memory");
    expect(parsed).toHaveProperty("notepad");
    expect(parsed).toHaveProperty("sessions");
    expect(parsed.memory).toHaveProperty("techStack");
    expect(parsed.memory).toHaveProperty("notes");
    expect(parsed.sessions.count).toBe(0);
  });

  // --- Test 2: state_write + state_read ---
  it("state_write should persist data and state_read should retrieve it", async () => {
    const memoryData = {
      techStack: ["TypeScript", "Node.js"],
      conventions: ["ESM imports"],
      notes: ["test note"],
      decisions: [],
    };

    const writeResult = await callTool(server, "state_write", {
      key: "memory",
      value: JSON.stringify(memoryData),
    });
    expect(writeResult).toContain("Saved memory");

    const readResult = await callTool(server, "state_read", { key: "memory" });
    const parsed = JSON.parse(readResult);
    expect(parsed.techStack).toContain("TypeScript");
    expect(parsed.notes).toContain("test note");
  });

  // --- Test 3: state_read with nested key ---
  it("state_read should navigate dot-separated key paths", async () => {
    const memoryData = {
      techStack: ["Rust"],
      conventions: [],
      notes: [],
      decisions: [],
    };
    await callTool(server, "state_write", {
      key: "memory",
      value: JSON.stringify(memoryData),
    });

    const result = await callTool(server, "state_read", { key: "memory.techStack" });
    const parsed = JSON.parse(result);
    expect(parsed).toEqual(["Rust"]);
  });

  // --- Test 4: state_read unknown root ---
  it("state_read should return error for unknown root key", async () => {
    const result = await callTool(server, "state_read", { key: "nonexistent" });
    expect(result).toContain("Unknown state root");
  });

  // --- Test 5: state_write invalid JSON ---
  it("state_write should reject invalid JSON", async () => {
    const result = await callTool(server, "state_write", {
      key: "memory",
      value: "not valid json{{{",
    });
    expect(result).toContain("Invalid JSON");
  });

  // --- Test 6: memory_add_note ---
  it("memory_add_note should add a note to project memory", async () => {
    const addResult = await callTool(server, "memory_add_note", {
      note: "Remember to update docs",
    });
    expect(addResult).toContain("Note added");

    const readResult = await callTool(server, "state_read", { key: "memory.notes" });
    const notes = JSON.parse(readResult);
    expect(notes).toContain("Remember to update docs");
  });

  // --- Test 7: memory_add_tech + memory_add_convention ---
  it("memory tools should add tech stack and conventions", async () => {
    await callTool(server, "memory_add_tech", { tech: "Vitest" });
    await callTool(server, "memory_add_convention", { convention: "Test everything" });

    const memResult = await callTool(server, "state_read", { key: "memory" });
    const memory = JSON.parse(memResult);
    expect(memory.techStack).toContain("Vitest");
    expect(memory.conventions).toContain("Test everything");
  });

  // --- Test 8: session_list (empty) ---
  it("session_list should return empty array when no sessions exist", async () => {
    const result = await callTool(server, "session_list", {});
    const sessions = JSON.parse(result);
    expect(sessions).toEqual([]);
  });

  // --- Test 9: session_get (not found) ---
  it("session_get should report not found for missing session", async () => {
    const result = await callTool(server, "session_get", { sessionId: "nonexistent" });
    expect(result).toContain("Session not found");
  });

  // --- Test 10: notepad_add + notepad_list ---
  it("notepad_add should create entries and notepad_list should retrieve them", async () => {
    await callTool(server, "notepad_add", {
      content: "First note",
      tags: "todo,urgent",
    });
    await callTool(server, "notepad_add", {
      content: "Second note",
      tags: "idea",
    });

    const allResult = await callTool(server, "notepad_list", {});
    const allNotes = JSON.parse(allResult);
    expect(allNotes).toHaveLength(2);

    const filteredResult = await callTool(server, "notepad_list", { tag: "urgent" });
    const filtered = JSON.parse(filteredResult);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].content).toBe("First note");
  });

  // --- Test 11: memory_add_decision ---
  it("memory_add_decision should record a decision with rationale", async () => {
    const result = await callTool(server, "memory_add_decision", {
      decision: "Use Zod for validation",
      rationale: "Type-safe runtime validation",
    });
    expect(result).toContain("Decision recorded");

    const memResult = await callTool(server, "state_read", { key: "memory.decisions" });
    const decisions = JSON.parse(memResult);
    expect(decisions).toHaveLength(1);
    expect(decisions[0].decision).toBe("Use Zod for validation");
    expect(decisions[0].rationale).toBe("Type-safe runtime validation");
  });

  // --- Test 12: state_write to read-only key ---
  it("state_write should reject writes to non-writable keys", async () => {
    const result = await callTool(server, "state_write", {
      key: "workflow",
      value: "{}",
    });
    expect(result).toContain("Cannot write to");
  });
});
