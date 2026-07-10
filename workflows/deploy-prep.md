---
name: deploy-prep
description: Pre-deployment verification checklist and readiness assessment
triggers:
  - "prepare for deploy"
  - "release checklist"
  - "pre-deployment"
execution_policy:
  max_iterations: 3
  auto_approve: false
  halt_on_failure: true
---

# Deploy Prep Workflow

Systematic pre-deployment verification to ensure release readiness.

## Steps

### 1. Test Suite
- **agent**: test-engineer
- **action**: Run complete test suite and report results
- **output**: full test results with coverage metrics
- **gate**: All tests pass, coverage meets threshold

### 2. Security Scan
- **agent**: security-auditor
- **action**: Final security audit of release candidate
- **output**: security clearance report
- **gate**: No critical or high severity issues

### 3. Performance Check
- **agent**: optimizer
- **action**: Verify no performance regressions
- **output**: performance comparison report
- **gate**: No significant performance degradation

### 4. Documentation
- **agent**: documenter
- **action**: Verify docs are current and changelog is updated
- **output**: documentation checklist
- **gate**: All public changes documented

### 5. Final Review
- **agent**: architect
- **action**: Holistic review of release readiness
- **output**: go/no-go recommendation with rationale
- **gate**: Architect approves release
