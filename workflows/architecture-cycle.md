---
name: architecture-cycle
description: Thorough code assessment with actionable feedback and resolution
triggers:
  - "architecture this code"
  - "code architecture"
  - "check this PR"
execution_policy:
  max_iterations: 4
  auto_approve: false
  halt_on_failure: true
---

# Architecture Cycle Workflow

Multi-perspective code assessment with structured feedback and resolution.

## Steps

### 1. Quality Assessment
- **agent**: architecture-reader
- **action**: Assess for correctness, clarity, and maintainability
- **output**: architecture findings with severity levels
- **gate**: Architecture is thorough and specific

### 2. Security Architecture
- **agent**: security-auditor
- **action**: Check for security vulnerabilities
- **output**: security findings with risk levels
- **gate**: Security architecture complete

### 3. Consolidate
- **agent**: analyst
- **action**: Merge findings, remove duplicates, prioritize
- **output**: consolidated action items
- **gate**: All findings categorized and prioritized

### 4. Resolve
- **agent**: executor
- **action**: Address blocking issues from architecture
- **output**: updated code with fixes
- **gate**: All blocking issues resolved

### 5. Recheck
- **agent**: architecture-reader
- **action**: Confirm blocking issues are properly resolved
- **output**: final approval or remaining issues
- **gate**: No blocking issues remain
