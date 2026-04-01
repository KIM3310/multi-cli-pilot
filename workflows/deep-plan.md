---
name: deep-plan
description: Multi-phase strategic planning with cross-agent consensus building
triggers:
  - "plan this thoroughly"
  - "design the architecture"
  - "strategic plan"
execution_policy:
  max_iterations: 5
  auto_approve: false
  halt_on_failure: true
---

# Deep Plan Workflow

Thorough planning with multiple perspectives and consensus building.

## Steps

### 1. Scope
- **agent**: planner
- **action**: Define project scope, goals, and constraints
- **output**: scope document with boundaries
- **gate**: Scope is bounded and achievable

### 2. Research
- **agent**: scientist
- **action**: Investigate technical options and precedents
- **output**: research findings with comparisons
- **gate**: Key technical questions answered

### 3. Architecture
- **agent**: architect
- **action**: Design system architecture based on research
- **output**: architecture document with diagrams
- **gate**: Architecture addresses all requirements

### 4. Critique
- **agent**: critic
- **action**: Challenge the architecture for weaknesses
- **output**: critique report with alternatives
- **gate**: All critical issues addressed

### 5. Refine
- **agent**: architect
- **action**: Refine architecture based on critique
- **output**: updated architecture document
- **gate**: Critic approves revised design

### 6. Task Breakdown
- **agent**: planner
- **action**: Create detailed task plan from architecture
- **output**: phased task list with estimates
- **gate**: Tasks are concrete and estimable
