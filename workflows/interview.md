---
name: interview
description: Socratic requirements clarification through structured questioning
triggers:
  - "clarify requirements"
  - "what exactly do you need"
  - "interview mode"
execution_policy:
  max_iterations: 6
  auto_approve: false
  halt_on_failure: false
---

# Interview Workflow

Structured questioning to elicit clear, complete requirements from ambiguous requests.

## Steps

### 1. Initial Assessment
- **agent**: analyst
- **action**: Analyze the request and identify ambiguities
- **output**: list of open questions and assumptions
- **gate**: Ambiguities are catalogued

### 2. Clarify
- **agent**: mentor
- **action**: Ask targeted questions to resolve ambiguities
- **output**: answers and refined understanding
- **gate**: Key ambiguities resolved

### 3. Challenge
- **agent**: critic
- **action**: Test requirements for completeness and consistency
- **output**: gaps and contradictions found
- **gate**: Requirements are internally consistent

### 4. Synthesize
- **agent**: planner
- **action**: Compile findings into a clear requirements document
- **output**: structured requirements with acceptance criteria
- **gate**: Requirements are specific and testable

### 5. Validate
- **agent**: architect
- **action**: Confirm requirements are technically feasible
- **output**: feasibility assessment
- **gate**: All requirements are achievable
