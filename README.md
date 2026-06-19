# Multi-CLI Pilot

## Live Demo

- [Open the public GitHub Pages demo](https://kim3310.github.io/multi-cli-pilot/)
- Scope: credential-free, synthetic-data demo for architecture-readers and evaluators.

![CI](https://github.com/KIM3310/multi-cli-pilot/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Providers](https://img.shields.io/badge/providers-Gemini%20%7C%20Qwen-7b61ff)

[English](README.md) | [한국어](README.ko.md)

# Multi-CLI Pilot

**One orchestration harness, multiple coding-agent CLIs.** Drive
[Gemini CLI](https://github.com/google-gemini/gemini-cli) or
[Qwen CLI](https://github.com/QwenLM/qwen-code) from the same agents,
workflows, prompts, hooks, MCP tools, and team primitives.

> Multi-CLI Pilot is the successor to `gemini-pilot` and `qwen-pilot`.
> Both repos have been consolidated here and the Gemini-only APIs are
> preserved as deprecated aliases — existing `gp` / `gemini-pilot`
> commands continue to work.

## Product and System Surface

A multi-agent CLI harness that shows how complex coding work can be coordinated without losing traceability.

| Lens | Definition |
|---|---|
| Audience | Engineering teams, automation leads, and internal platform groups experimenting with agent-assisted development. |
| Architecture path | Validate the demo, README, architecture notes, and quality gate before deeper workflow architecture. |
| System signal | Prompt management, workflows, coordination, task queues, and MCP support in a inspectable CLI surface. |
| Safety boundary | Agent output remains advisory and approval-required; production repositories should keep human approval and CI gates. |
| Fast path | Run the local test/build scripts and inspect the workflow examples and coordination docs. |

## System Fast Path

- **First minute:** Run a simple workflow, then inspect how provider switching and team coordination are represented.
- **Local demo:** Run the installer or `npm install && npm run build`, then use the CLI examples under Quick Start.
- **Verification:** Run `npm run verify`; it covers lint, typecheck, tests, and build.

## Service Launch Playbook

- [Service launch playbook](docs/service-launch-playbook.md) maps the repository to architecture audiences, operating gates, operating boundaries, and risk controls.

## Architecture Notes

- [Architecture guide](docs/architecture-evidence-map.md) summarizes the project angle, first files to inspect, runtime commands, and known boundaries.
- [Quality notes](docs/quality-gate.md) lists the local checks, CI surface, and release expectations for this repository.
- [Enterprise readiness notes](docs/enterprise-readiness.md) outlines security, data, operations, integration, and handoff expectations.

## Why

Coding-agent CLIs ship fast but each one ends up with its own agents,
workflows, and tmux scripts. Multi-CLI Pilot abstracts the CLI behind
a **provider adapter** so the harness, HUD, MCP server, and tool-
reliability pipeline stay the same regardless of which CLI you target.

## Architecture

```mermaid
flowchart LR
  subgraph UX["UX"]
    CLI[mcp / gp]
    HUD[HUD display]
  end

  subgraph Core["Multi-CLI Pilot Core"]
    Config[Config + Env<br/>provider, models, approval]
    Agents[16 Agents + Registry]
    Workflows[10 Workflows]
    Hooks[Hook Manager]
    Team[Team Coordinator<br/>plan/execute/verify/fix]
    Harness[Harness<br/>session + metrics + state]
    MCP[MCP Server<br/>tools exported]
    ToolRel[Tool-Call Reliability<br/>parser + middleware]
  end

  subgraph Providers["Provider Adapters"]
    Gemini[Gemini CLI<br/>gemini]
    Qwen[Qwen CLI<br/>qwen]
  end

  CLI --> Config
  CLI --> Workflows
  CLI --> Agents
  Config --> Harness
  Harness --> Providers
  Workflows --> Harness
  Team --> Harness
  Hooks --> Harness
  MCP --> Harness
  HUD --> Harness
  ToolRel --> Harness
```

## Features

- **16 Specialized Agents** — architect, executor, debugger, architecture-reader, test-engineer, and more, each with a role prompt plus a tool-calling optimization prompt.
- **10 Built-in Workflows** — autopilot, deep-plan, sprint, investigate, tdd, architecture-cycle, refactor, deploy-prep, clarification, team-sync.
- **Provider Adapter** — pick `gemini` or `qwen` via config or env. Swapping providers swaps the binary, default models, and install instructions.
- **Team Coordination** — phase-based pipeline (Plan → Execute → Verify → Fix) with quality gates and shared state.
- **Session Metrics** — prompts sent, estimated tokens, latency samples, wall-clock elapsed — persisted to session state.
- **Tool-Call Reliability** — parser and middleware for hardening tool-call output across providers.
- **Hook System** — event-driven hooks for extending harness behavior (session-start, session-end, error, …).
- **MCP Server** — Model Context Protocol integration so the harness can be driven from any MCP-aware client.
- **HUD Dashboard** — real-time metrics display with tmux integration.
- **State Persistence** — JSON state, memory, and notepad stored in `.gemini-pilot/` (directory name kept for backward compatibility).

## Installation

### macOS
1. Download or clone this repo
2. Double-click `Install-Mac.command`
3. Open Terminal and type `mcp --help` (or the legacy `gp --help`)

### Windows
1. Download or clone this repo
2. Double-click `Install-Windows.bat`
3. Open CMD and type `mcp --help`

### Linux
```bash
git clone https://github.com/KIM3310/multi-cli-pilot.git
cd multi-cli-pilot
chmod +x Install-Linux.sh && ./Install-Linux.sh
```

### npm
```bash
npm install -g multi-cli-pilot
```

### Requirements

- Node.js ≥ 20.0.0
- One of the supported coding-agent CLIs on `$PATH`:
  - **Gemini** — `npm install -g @google/gemini-cli` (default, `gemini-3.1-pro` family)
  - **Qwen** — `npm install -g @qwen-code/qwen-code` (`qwen3-coder-plus` family)

## Quick Start

```bash
# Run with the default provider (Gemini)
mcp

# Switch to Qwen for the current session
MCP_PROVIDER=qwen mcp

# Legacy aliases still work
gp
gemini-pilot
```

## Provider Selection

The provider is resolved from the first matching source:

1. `MCP_PROVIDER` (or the legacy `GP_PROVIDER`) environment variable
2. `provider` field in `.gemini-pilot/config.json` (project)
3. `provider` field in `~/.config/gemini-pilot/config.json` (user)
4. Built-in default (`gemini`)

Example project config:

```jsonc
{
  "provider": "qwen",
  "session": { "approvalMode": "auto", "defaultTier": "balanced" }
}
```

When `provider` is set to `qwen` and `models.*` entries have not been
overridden, the loader substitutes Qwen tier defaults
(`qwen3-coder-plus` / `qwen3-coder` / `qwen3-coder-flash`)
automatically.

## Project Structure

```
multi-cli-pilot/
  AGENTS.md           # Master orchestration contract
  prompts/            # 16 agent role prompts (markdown)
  workflows/          # 10 workflow definitions (markdown with frontmatter)
  src/
    agents/           # Agent registry
    benchmark/        # Benchmark runner
    cli/              # CLI entry point
    config/           # Config loader, schema, provider resolution
    errors/           # Error codes
    harness/          # Session harness (provider-aware)
    hooks/            # Event hook manager
    hud/              # HUD renderer
    init/             # `mcp init` templates
    mcp/              # MCP server integration
    metrics/          # Runtime session metrics tracker
    plugins/          # Prompt/workflow plugin loader
    prompts/          # Prompt file loader
    providers/        # Provider adapter layer (Gemini, Qwen)
    state/            # State manager and schema
    team/             # Team coordinator (plan/execute/verify/fix)
    tool-bench/       # Tool-calling benchmark harness
    tool-reliability/ # Tool-call parser + middleware
    utils/            # fs, logger, small helpers
    workflows/        # Workflow runner
  __tests__/          # Vitest test suite (225 tests)
```

## Commands

| Command | Description |
|---|---|
| `mcp init` | Scaffold `.gemini-pilot/` with config, memory, workflows |
| `mcp` | Launch an interactive session with the active provider |
| `mcp config show` | Print the resolved configuration |
| `mcp workflows list` | List available workflows |
| `mcp workflows run <name>` | Execute a workflow end-to-end |
| `mcp agents list` | List registered agents |
| `mcp team` | Start a tmux-based multi-agent team |

## Backward Compatibility

- The published binary names `gp` and `gemini-pilot` continue to work.
- Existing imports of `GeminiPilotConfig` / `GeminiPilotConfigSchema`
  are retained as deprecated type aliases pointing at the new
  `MultiCliPilotConfig` / `MultiCliPilotConfigSchema` names.
- The state directory is still `.gemini-pilot/` so existing projects
  don't need to migrate anything.

## Development

```bash
npm install
npm run typecheck      # strict TypeScript
npm test               # 225 tests across config, harness, team, MCP, …
npm run lint           # biome
npm run build          # emit to dist/
```

## License

MIT — see [LICENSE](LICENSE).

## Cloud + AI Architecture

This repository includes a neutral cloud and AI engineering blueprint that maps the current proof surface to runtime boundaries, data contracts, model-risk controls, deployment posture, and validation hooks.

- [Cloud + AI architecture blueprint](docs/cloud-ai-architecture.md)
- [Machine-readable architecture manifest](docs/architecture/blueprint.json)
- Validation command: `python3 scripts/validate_architecture_blueprint.py`

## Enterprise Productization

- [Product operating model](docs/product-operating-model.md) defines the architecture-reader, trust boundary, trust boundary, operating checks, and service path for this repository.

## System Architecture

- [System architecture](docs/system-architecture.md) maps the runtime boundary, data/control flow, cloud or local deployment surface, and operating assumptions for this repository.

## Service Architecture

- [Service architecture](docs/service-architecture.md) defines the cloud resources, account information, cost controls, and production guardrails needed to turn this repo into a scoped service without publishing public financial assumptions.

<!-- search-growth-readme:start -->

## Search And Service Surface

- Public entry: free CLI recipes and demo tasks
- Paid boundary: team workflow library, hosted run history, and provider cost dashboard
- Canonical URL: https://kim3310.github.io/multi-cli-pilot/
- Lead capture: mailto:ehdjs1351@gmail.com?subject=Multi-CLI%20Pilot%20private%20workspace&body=I%20am%20interested%20in%20team%20workflow%20library%2C%20hosted%20run%20history%2C%20and%20provider%20cost%20dashboard%20for%20Multi-CLI%20Pilot.
- Machine-readable offer: [docs/service-offer.json](docs/service-offer.json)
- Search growth implementation: [docs/search-growth-implementation.md](docs/search-growth-implementation.md)
- Revenue architecture: [docs/revenue-architecture.md](docs/revenue-architecture.md)

<!-- search-growth-readme:end -->
