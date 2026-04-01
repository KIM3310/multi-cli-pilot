---
name: autopilot
description: Autonomous loop from idea to verified, tested code
triggers:
  - "build this"
  - "implement this end to end"
  - "make it work"
execution_policy:
  max_iterations: 10
  auto_approve: true
  halt_on_failure: false
---

# Autopilot Workflow

Fully autonomous development cycle: plan, implement, test, and verify.

## Steps

### 1. Understand
- **agent**: architect
- **action**: Analyze the request and clarify requirements
- **output**: requirements document with acceptance criteria
- **gate**: Requirements must be specific and testable

### 2. Plan
- **agent**: planner
- **action**: Break down into implementation tasks
- **output**: ordered task list with dependencies
- **gate**: All tasks have clear acceptance criteria

### 3. Implement
- **agent**: executor
- **action**: Write code for each task in sequence
- **output**: source files with inline documentation
- **gate**: Code compiles without errors

### 4. Test
- **agent**: test-engineer
- **action**: Write and run tests for all implemented code
- **output**: test files and execution results
- **gate**: All tests pass

### 5. Review
- **agent**: reviewer
- **action**: Review implementation for quality issues
- **output**: review report with findings
- **gate**: No blocking issues remain

### 6. Fix
- **agent**: executor
- **action**: Address any issues from review
- **output**: updated source files
- **gate**: All tests still pass after fixes
- **loop_to**: 4 (if issues found, max 3 iterations)

### 7. Verify
- **agent**: analyst
- **action**: Verify all acceptance criteria are met
- **output**: verification report
- **gate**: All criteria satisfied
