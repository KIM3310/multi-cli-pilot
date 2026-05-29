# Review Guide - Multi-CLI Pilot

Updated: 2026-05-30

Use this page as the short path through the repository. It keeps the review grounded in the code, docs, commands, and boundaries that are already present.

## Summary

| Field | Notes |
|---|---|
| Lane | B2B developer productivity |
| Core idea | One orchestration harness for Gemini, Qwen, prompts, workflows, hooks, MCP, and team primitives. |
| Primary reader | Engineering teams and platform groups standardizing multiple coding-agent CLIs. |
| Stack | TypeScript/JavaScript |

## Open First

1. Start with the README fast path and architecture section.
2. Open `docs/monetization-playbook.md` only when reviewing the product or service angle.
3. Check the commands below before making claims about quality.
4. Skim the CI workflows and fixture data before deeper implementation review.
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
- .github/workflows/dependency-review.yml
- .github/workflows/repository-health.yml
- .github/workflows/repository-surface.yml
- .github/workflows/secret-scan.yml

## Evidence

- package scripts and web/runtime checks
- npm run verify passes
- Installers work
- Workflow examples are inspectable

## Commercial Notes

| Possible offer | Working price assumption |
|---|---|
| Internal workflow setup | $2k-$8k setup |
| Team-agent playbook | $10k-$35k team rollout |
| MCP orchestration starter | $1k-$6k/month workflow maintenance |

## Boundaries

- Human review remains required
- Secrets stay local
- Generated code needs CI gates

## Useful Metrics

- Workflow completion
- Review cycle time
- Failed-agent recovery rate
