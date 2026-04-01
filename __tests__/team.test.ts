import { describe, it, expect } from "vitest";
import {
  initTeamState,
  enqueueTask,
  assignNextTask,
  completeTask,
  advancePhase,
} from "../src/team/coordinator.js";

describe("Team State Management", () => {
  it("should initialize team state correctly", () => {
    const state = initTeamState({ workerCount: 3, role: "executor" });

    expect(state.workerCount).toBe(3);
    expect(state.workers).toHaveLength(3);
    expect(state.phase).toBe("plan");
    expect(state.taskQueue).toHaveLength(0);
    expect(state.workers.every((w) => w.status === "idle")).toBe(true);
    expect(state.workers.every((w) => w.role === "executor")).toBe(true);
  });

  it("should default role to executor", () => {
    const state = initTeamState({ workerCount: 2 });
    expect(state.workers.every((w) => w.role === "executor")).toBe(true);
  });

  it("should enqueue tasks", () => {
    let state = initTeamState({ workerCount: 2 });
    state = enqueueTask(state, "Implement feature A");
    state = enqueueTask(state, "Write tests for feature A");

    expect(state.taskQueue).toHaveLength(2);
    expect(state.taskQueue[0]!.status).toBe("pending");
    expect(state.taskQueue[1]!.description).toBe("Write tests for feature A");
  });

  it("should assign tasks to idle workers", () => {
    let state = initTeamState({ workerCount: 2 });
    state = enqueueTask(state, "Task 1");
    state = enqueueTask(state, "Task 2");

    state = assignNextTask(state);

    const busyWorker = state.workers.find((w) => w.status === "busy");
    expect(busyWorker).toBeDefined();
    expect(busyWorker!.currentTask).toBeDefined();

    const assignedTask = state.taskQueue.find((t) => t.status === "assigned");
    expect(assignedTask).toBeDefined();
    expect(assignedTask!.assignedTo).toBe(busyWorker!.id);
  });

  it("should not assign when no idle workers", () => {
    let state = initTeamState({ workerCount: 1 });
    state = enqueueTask(state, "Task 1");
    state = enqueueTask(state, "Task 2");

    state = assignNextTask(state); // Assigns task 1
    state = assignNextTask(state); // No idle workers

    const assignedTasks = state.taskQueue.filter((t) => t.status === "assigned");
    expect(assignedTasks).toHaveLength(1);
  });

  it("should complete tasks and free workers", () => {
    let state = initTeamState({ workerCount: 1 });
    state = enqueueTask(state, "Task 1");
    state = assignNextTask(state);

    const taskId = state.taskQueue[0]!.id;
    state = completeTask(state, taskId, "Done successfully");

    expect(state.taskQueue[0]!.status).toBe("done");
    expect(state.taskQueue[0]!.result).toBe("Done successfully");
    expect(state.workers[0]!.status).toBe("idle");
    expect(state.workers[0]!.currentTask).toBeUndefined();
  });

  it("should return unchanged state when completing nonexistent task", () => {
    const state = initTeamState({ workerCount: 1 });
    const result = completeTask(state, "nonexistent-id", "result");
    expect(result).toEqual(state);
  });

  it("should advance phases in order", () => {
    let state = initTeamState({ workerCount: 1 });
    expect(state.phase).toBe("plan");

    state = advancePhase(state);
    expect(state.phase).toBe("execute");

    state = advancePhase(state);
    expect(state.phase).toBe("verify");

    state = advancePhase(state);
    expect(state.phase).toBe("fix");

    state = advancePhase(state);
    expect(state.phase).toBe("plan"); // Cycles back
  });
});
