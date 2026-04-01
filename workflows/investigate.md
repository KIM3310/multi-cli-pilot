---
name: investigate
description: Evidence-driven debugging and root cause analysis
triggers:
  - "investigate this"
  - "find the root cause"
  - "debug this issue"
execution_policy:
  max_iterations: 8
  auto_approve: true
  halt_on_failure: false
---

# Investigate Workflow

Systematic investigation to find root causes through evidence gathering.

## Steps

### 1. Reproduce
- **agent**: debugger
- **action**: Reproduce the issue and document symptoms
- **output**: reproduction steps and error details
- **gate**: Issue is reliably reproducible

### 2. Hypothesize
- **agent**: debugger
- **action**: Form hypotheses about potential root causes
- **output**: ranked list of hypotheses
- **gate**: At least two plausible hypotheses

### 3. Gather Evidence
- **agent**: analyst
- **action**: Collect data to test each hypothesis
- **output**: evidence log with findings
- **gate**: Sufficient evidence to evaluate hypotheses

### 4. Diagnose
- **agent**: debugger
- **action**: Identify root cause from evidence
- **output**: root cause analysis with confidence level
- **gate**: Root cause identified with high confidence

### 5. Fix
- **agent**: executor
- **action**: Implement targeted fix for root cause
- **output**: code changes with regression test
- **gate**: Fix addresses root cause without side effects

### 6. Verify
- **agent**: test-engineer
- **action**: Confirm fix resolves issue and passes all tests
- **output**: verification report
- **gate**: Original issue resolved, no regressions
