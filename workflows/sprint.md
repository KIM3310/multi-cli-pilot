---
name: sprint
description: Focused execution with verification gates at each step
triggers:
  - "sprint on this"
  - "focused build"
  - "quick implementation"
execution_policy:
  max_iterations: 8
  auto_approve: true
  halt_on_failure: false
---

# Sprint Workflow

Time-boxed, focused execution with verification after each deliverable.

## Steps

### 1. Define
- **agent**: planner
- **action**: Define sprint scope with clear deliverables
- **output**: sprint backlog with priorities
- **gate**: Scope fits within time constraints

### 2. Execute
- **agent**: executor
- **action**: Implement highest priority item
- **output**: working code with tests
- **gate**: Tests pass for implemented item

### 3. Verify
- **agent**: test-engineer
- **action**: Run full test suite and check for regressions
- **output**: test results report
- **gate**: No regressions introduced

### 4. Next
- **agent**: planner
- **action**: Mark item complete, select next priority
- **output**: updated sprint backlog
- **gate**: Items remain in backlog
- **loop_to**: 2 (until backlog empty)
