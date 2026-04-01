---
name: team-sync
description: Multi-agent parallel coordination with phase synchronization
triggers:
  - "team mode"
  - "parallel execution"
  - "coordinate agents"
execution_policy:
  max_iterations: 12
  auto_approve: true
  halt_on_failure: false
---

# Team Sync Workflow

Coordinate multiple agents working in parallel with synchronization points.

## Steps

### 1. Decompose
- **agent**: planner
- **action**: Break work into parallelizable units
- **output**: task assignments with agent roles
- **gate**: Tasks are independent and well-scoped

### 2. Assign
- **agent**: planner
- **action**: Distribute tasks to appropriate agents
- **output**: assignment map (agent -> tasks)
- **gate**: All tasks assigned, no conflicts

### 3. Execute Parallel
- **agent**: executor
- **action**: All assigned agents execute their tasks simultaneously
- **output**: individual task outputs from each agent
- **gate**: All agents report completion or blockers

### 4. Sync
- **agent**: analyst
- **action**: Collect results, identify conflicts or integration issues
- **output**: integration report with conflicts
- **gate**: Integration assessment complete

### 5. Resolve
- **agent**: architect
- **action**: Resolve any conflicts between parallel outputs
- **output**: unified result with conflict resolutions
- **gate**: All conflicts resolved

### 6. Verify
- **agent**: test-engineer
- **action**: Verify integrated result works as a whole
- **output**: integration test results
- **gate**: Integrated result passes all tests
