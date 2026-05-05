---
description: Sync documentation with the codebase, generating from source-of-truth files (package.json, .env.example, OpenAPI, etc.).
---

# Update Documentation

Sync documentation with the codebase, generating from source-of-truth files.

## Step 1: Identify Sources of Truth
| Source | Generates |
|--------|-----------|
| `package.json` scripts | Available commands reference |
| `.env.example` | Environment variable documentation |
| `openapi.yaml` / route files | API endpoint reference |
| Source code exports | Public API documentation |
| `Dockerfile` / `docker-compose.yml` | Infrastructure setup docs |

## Step 2: Generate Script Reference
1. Read `package.json` (or `Makefile`, `Cargo.toml`, `pyproject.toml`)
2. Extract all scripts/commands with their descriptions
3. Generate a reference table

## Step 3: Generate Environment Documentation
1. Read `.env.example` (or `.env.template`, `.env.sample`)
2. Extract all variables with their purposes
3. Categorize as required vs optional
4. Document expected format and valid values

## Step 4: Update Contributing Guide
Generate or update `docs/CONTRIBUTING.md` with:
- Development environment setup (prerequisites, install steps)
- Available scripts and their purposes
- Testing procedures (how to run, how to write new tests)
- Code style enforcement (linter, formatter, pre-commit hooks)
- PR submission checklist

## Step 5: Update Runbook
Generate or update `docs/RUNBOOK.md` with:
- Deployment procedures (step-by-step)
- Health check endpoints and monitoring
- Common issues and their fixes
- Rollback procedures
- Alerting and escalation paths

## Step 6: Staleness Check
1. Find documentation files not modified in 90+ days
2. Cross-reference with recent source code changes
3. Flag potentially outdated docs for manual review

## Rules
- **Single source of truth**: Always generate from code, never manually edit generated sections
- **Preserve manual sections**: Only update generated sections; leave hand-written prose intact
- **Mark generated content**: Use `<!-- AUTO-GENERATED -->` markers around generated sections
- **Don't create docs unprompted**: Only create new doc files if the command explicitly requests it
