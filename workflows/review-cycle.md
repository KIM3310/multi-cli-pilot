---
name: review-cycle
description: Thorough code review with actionable feedback and resolution
triggers:
  - "review this code"
  - "code review"
  - "check this PR"
execution_policy:
  max_iterations: 4
  auto_approve: false
  halt_on_failure: true
---

# Review Cycle Workflow

Multi-perspective code review with structured feedback and resolution.

## Steps

### 1. Quality Review
- **agent**: reviewer
- **action**: Review for correctness, clarity, and maintainability
- **output**: review findings with severity levels
- **gate**: Review is thorough and specific

### 2. Security Review
- **agent**: security-auditor
- **action**: Check for security vulnerabilities
- **output**: security findings with risk levels
- **gate**: Security review complete

### 3. Consolidate
- **agent**: analyst
- **action**: Merge findings, remove duplicates, prioritize
- **output**: consolidated action items
- **gate**: All findings categorized and prioritized

### 4. Resolve
- **agent**: executor
- **action**: Address blocking issues from review
- **output**: updated code with fixes
- **gate**: All blocking issues resolved

### 5. Re-review
- **agent**: reviewer
- **action**: Verify blocking issues are properly resolved
- **output**: final approval or remaining issues
- **gate**: No blocking issues remain
