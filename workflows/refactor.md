---
name: refactor
description: Safe refactoring with full regression verification
triggers:
  - "refactor this"
  - "clean up the code"
  - "improve structure"
execution_policy:
  max_iterations: 6
  auto_approve: true
  halt_on_failure: true
---

# Refactor Workflow

Safe code restructuring with regression checks at every step.

## Steps

### 1. Assess
- **agent**: analyst
- **action**: Identify code smells and improvement opportunities
- **output**: prioritized list of refactoring targets
- **gate**: Targets identified with clear rationale

### 2. Baseline
- **agent**: test-engineer
- **action**: Ensure adequate test coverage before refactoring
- **output**: test coverage report, new tests if needed
- **gate**: Coverage is sufficient to detect regressions

### 3. Refactor
- **agent**: refactorer
- **action**: Apply one refactoring transformation
- **output**: refactored code with explanation
- **gate**: All tests pass after transformation

### 4. Verify
- **agent**: test-engineer
- **action**: Run full test suite and check for regressions
- **output**: test results with comparison to baseline
- **gate**: No regressions, behavior preserved

### 5. Continue
- **agent**: analyst
- **action**: Evaluate if more refactoring targets remain
- **output**: updated target list
- **gate**: High-priority targets remain
- **loop_to**: 3 (until targets exhausted)
