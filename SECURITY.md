# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | Yes                |
| < 1.0   | No                 |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in Gemini Pilot,
please report it responsibly.

### How to Report

1. **Do NOT open a public issue.** Security vulnerabilities must be reported privately.
2. Email **security@gemini-pilot.dev** (or open a [private security advisory](https://github.com/KIM3310/gemini-pilot/security/advisories/new) on GitHub).
3. Include:
   - A clear description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment** within 48 hours of your report.
- **Status update** within 7 days with our assessment.
- **Fix timeline** communicated once the issue is confirmed. We aim to release patches within 14 days for critical issues.
- **Credit** in the release notes (unless you prefer to remain anonymous).

### Scope

The following are in scope:

- Command injection via CLI arguments or prompt content
- Path traversal in prompt/workflow file loading
- Arbitrary file read/write through the MCP server
- State file tampering leading to privilege escalation
- Dependency vulnerabilities in production dependencies

The following are out of scope:

- Issues in the Gemini CLI itself (report to Google)
- Denial of service via large input files
- Issues requiring physical access to the machine

### Safe Harbor

We will not pursue legal action against researchers who:

- Act in good faith to avoid privacy violations, destruction of data, and disruption of services
- Only interact with accounts they own or with explicit permission
- Report vulnerabilities promptly and do not exploit them beyond what is needed to demonstrate the issue

Thank you for helping keep Gemini Pilot secure.
