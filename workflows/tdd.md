---
name: tdd
description: Test-driven development cycle with red-green-refactor rhythm
triggers:
  - "tdd this"
  - "test first"
  - "test-driven"
execution_policy:
  max_iterations: 15
  auto_approve: true
  halt_on_failure: false
---

# TDD Workflow

Test-driven development: write failing tests first, then make them pass, then refactor.

## Steps

### 1. Specify
- **agent**: test-engineer
- **action**: Write a failing test for the next behavior
- **output**: test file with one failing test
- **gate**: Test fails for the right reason (red)

### 2. Implement
- **agent**: executor
- **action**: Write minimal code to make the test pass
- **output**: implementation code
- **gate**: Previously failing test now passes (green)

### 3. Refactor
- **agent**: refactorer
- **action**: Improve code structure while keeping tests green
- **output**: refactored code
- **gate**: All tests still pass after refactoring

### 4. Next
- **agent**: test-engineer
- **action**: Determine if more behaviors need testing
- **output**: assessment of remaining behaviors
- **gate**: Behaviors remain to be implemented
- **loop_to**: 1 (until all behaviors covered)
