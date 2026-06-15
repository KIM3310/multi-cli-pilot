# Architecture Guide - Multi-CLI Pilot

Updated: 2026-05-30

Use this page as the short path through the repository. It keeps the architecture grounded in the code, docs, commands, and boundaries that are already present.

## Summary

| Field | Notes |
|---|---|
| Lane | B2B developer productivity |
| Core idea | One orchestration harness for Gemini, Qwen, prompts, workflows, hooks, MCP, and team primitives. |
| Primary reader | Engineering teams and platform groups standardizing multiple coding-agent CLIs. |
| Stack | TypeScript/JavaScript |

## Open First

1. Start with the README fast path and architecture section.
2. Open `docs/service-launch-playbook.md` only when architectureing the product or service angle.
3. Check the commands below before making claims about quality.
4. Skim the CI workflows and fixture data before deeper implementation architecture.
5. Read the boundaries section before presenting the project externally.

## Checks

| Purpose | Command |
|---|---|
| Full local gate | `npm run verify` |
| Test suite | `npm test` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Production build | `npm run build` |

## CI

- .github/workflows/architecture-blueprint.yml
- .github/workflows/ci.yml
- .github/workflows/dependency-architecture.yml
- .github/workflows/repository-health.yml
- .github/workflows/repository-surface.yml
- .github/workflows/secret-scan.yml

## Evidence

- package scripts and web/runtime checks
- npm run verify passes
- Installers work
- Workflow examples are inspectable

## Architecture Notes

| Possible offer | Working scope assumption |
|---|---|
| Internal workflow setup | Scope after product intake |
| Team-agent playbook | Scope after product intake |
| MCP orchestration starter | Scope after product intake |

## Boundaries

- Human architecture remains required
- Secrets stay local
- Generated code needs CI gates

## Useful Metrics

- Workflow completion
- Architecture cycle time
- Failed-agent recovery rate
