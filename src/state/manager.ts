/**
 * State manager: persists session, workflow, team, memory, and notepad state
 * to the `.gemini-pilot/` directory on disk as JSON files.
 *
 * @module state/manager
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { getStateDir, readJsonFile, writeJsonFile, ensureDir } from "../utils/fs.js";
import { createLogger } from "../utils/logger.js";
import {
  type SessionState,
  type WorkflowState,
  type TeamState,
  type ProjectMemory,
  type Notepad,
  ProjectMemorySchema,
  NotepadSchema,
} from "./schema.js";

const log = createLogger("state");

/**
 * Manages reading and writing all persistent state for Gemini Pilot.
 *
 * State is stored as JSON files inside the `.gemini-pilot/` directory.
 */
export class StateManager {
  private readonly stateDir: string;

  /**
   * @param projectRoot - Optional project root override; defaults to auto-detected root.
   */
  constructor(projectRoot?: string) {
    this.stateDir = getStateDir(projectRoot);
    ensureDir(this.stateDir);
    ensureDir(path.join(this.stateDir, "sessions"));
  }

  // --- Session State ---

  /**
   * Get the file path for a session's state file.
   * @param sessionId - Unique session identifier
   * @returns Absolute path to the session JSON file
   */
  getSessionPath(sessionId: string): string {
    return path.join(this.stateDir, "sessions", `${sessionId}.json`);
  }

  /**
   * Persist a session state to disk.
   * @param session - The session state object to save
   */
  saveSession(session: SessionState): void {
    writeJsonFile(this.getSessionPath(session.id), session);
    log.debug(`Session saved: ${session.id}`);
  }

  /**
   * Load a session state from disk.
   * @param sessionId - Session identifier
   * @returns The session state, or undefined if not found
   */
  loadSession(sessionId: string): SessionState | undefined {
    return readJsonFile<SessionState>(this.getSessionPath(sessionId));
  }

  /**
   * List all saved sessions.
   * @returns Array of session state objects
   */
  listSessions(): SessionState[] {
    const sessionsDir = path.join(this.stateDir, "sessions");
    let files: string[];
    try {
      files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith(".json"));
    } catch {
      return [];
    }
    return files
      .map((f) => readJsonFile<SessionState>(path.join(sessionsDir, f)))
      .filter((s): s is SessionState => s !== undefined);
  }

  /**
   * Delete a session state file from disk.
   * @param sessionId - Session identifier to delete
   */
  deleteSession(sessionId: string): void {
    try {
      fs.unlinkSync(this.getSessionPath(sessionId));
      log.debug(`Session deleted: ${sessionId}`);
    } catch {
      // Already gone
    }
  }

  // --- Workflow State ---

  /**
   * Get the file path for the workflow state.
   * @returns Absolute path to workflow-state.json
   */
  getWorkflowStatePath(): string {
    return path.join(this.stateDir, "workflow-state.json");
  }

  /**
   * Persist workflow execution state.
   * @param state - Workflow state to save
   */
  saveWorkflowState(state: WorkflowState): void {
    writeJsonFile(this.getWorkflowStatePath(), state);
    log.debug(`Workflow state saved: ${state.workflowName} step ${state.currentStep}`);
  }

  /**
   * Load the current workflow execution state.
   * @returns The workflow state, or undefined if no workflow is active
   */
  loadWorkflowState(): WorkflowState | undefined {
    return readJsonFile<WorkflowState>(this.getWorkflowStatePath());
  }

  /** Remove the persisted workflow state file. */
  clearWorkflowState(): void {
    try {
      fs.unlinkSync(this.getWorkflowStatePath());
    } catch {
      // Already gone
    }
  }

  // --- Team State ---

  /**
   * Get the file path for team state.
   * @returns Absolute path to team-state.json
   */
  getTeamStatePath(): string {
    return path.join(this.stateDir, "team-state.json");
  }

  /**
   * Persist team coordination state.
   * @param state - Team state to save
   */
  saveTeamState(state: TeamState): void {
    writeJsonFile(this.getTeamStatePath(), state);
    log.debug(`Team state saved: ${state.id}`);
  }

  /**
   * Load the current team coordination state.
   * @returns The team state, or undefined if no team is active
   */
  loadTeamState(): TeamState | undefined {
    return readJsonFile<TeamState>(this.getTeamStatePath());
  }

  // --- Project Memory ---

  /**
   * Get the file path for project memory.
   * @returns Absolute path to memory.json
   */
  getMemoryPath(): string {
    return path.join(this.stateDir, "memory.json");
  }

  /**
   * Load project memory, returning defaults if no file exists.
   * @returns The project memory object
   */
  loadMemory(): ProjectMemory {
    const raw = readJsonFile<ProjectMemory>(this.getMemoryPath());
    return ProjectMemorySchema.parse(raw ?? {});
  }

  /**
   * Persist project memory to disk.
   * @param memory - Project memory object to save
   */
  saveMemory(memory: ProjectMemory): void {
    writeJsonFile(this.getMemoryPath(), memory);
    log.debug("Project memory saved");
  }

  /**
   * Append a note to project memory.
   * @param note - The note text to add
   */
  addMemoryNote(note: string): void {
    const memory = this.loadMemory();
    memory.notes.push(note);
    this.saveMemory(memory);
  }

  /**
   * Add a technology to the project tech stack (deduplicates).
   * @param tech - Technology name to add
   */
  addTechStack(tech: string): void {
    const memory = this.loadMemory();
    if (!memory.techStack.includes(tech)) {
      memory.techStack.push(tech);
      this.saveMemory(memory);
    }
  }

  /**
   * Add a coding convention to project memory (deduplicates).
   * @param convention - Convention text to add
   */
  addConvention(convention: string): void {
    const memory = this.loadMemory();
    if (!memory.conventions.includes(convention)) {
      memory.conventions.push(convention);
      this.saveMemory(memory);
    }
  }

  /**
   * Record an architectural or technical decision with rationale.
   * @param decision - Short description of the decision
   * @param rationale - Why this decision was made
   */
  addDecision(decision: string, rationale: string): void {
    const memory = this.loadMemory();
    memory.decisions.push({
      date: new Date().toISOString(),
      decision,
      rationale,
    });
    this.saveMemory(memory);
  }

  // --- Notepad ---

  /**
   * Get the file path for the working notepad.
   * @returns Absolute path to notepad.json
   */
  getNotepadPath(): string {
    return path.join(this.stateDir, "notepad.json");
  }

  /**
   * Load the working notepad, returning defaults if no file exists.
   * @returns The notepad object
   */
  loadNotepad(): Notepad {
    const raw = readJsonFile<Notepad>(this.getNotepadPath());
    return NotepadSchema.parse(raw ?? {});
  }

  /**
   * Persist the notepad to disk.
   * @param notepad - Notepad object to save
   */
  saveNotepad(notepad: Notepad): void {
    writeJsonFile(this.getNotepadPath(), notepad);
  }

  /**
   * Add an entry to the working notepad.
   * @param content - Note content text
   * @param tags - Optional tags for filtering
   */
  addNote(content: string, tags: string[] = []): void {
    const notepad = this.loadNotepad();
    notepad.entries.push({
      timestamp: new Date().toISOString(),
      content,
      tags,
    });
    this.saveNotepad(notepad);
  }

  /**
   * Get notepad entries, optionally filtered by tag.
   * @param tag - Optional tag to filter by
   * @returns Matching notepad entries
   */
  getNotes(tag?: string): Notepad["entries"] {
    const notepad = this.loadNotepad();
    if (tag) {
      return notepad.entries.filter((e) => e.tags.includes(tag));
    }
    return notepad.entries;
  }
}
