---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes the **plan** agent to create a comprehensive implementation plan before writing any code.

## What This Command Does
1. **Restate Requirements** - Clarify what needs to be built
2. **Identify Risks** - Surface potential issues and blockers
3. **Create Step Plan** - Break down implementation into phases
4. **Wait for Confirmation** - MUST receive user approval before proceeding

## When to Use
Use `/plan` when:
- Starting a new feature
- Making significant architectural changes
- Working on complex refactoring
- Multiple files/components will be affected
- Requirements are unclear or ambiguous

## How It Works
The `plan` agent will:
1. Analyze the request and restate requirements in clear terms
2. Break down into phases with specific, actionable steps
3. Identify dependencies between components
4. Assess risks and potential blockers
5. Estimate complexity (High/Medium/Low)
6. Present the plan and WAIT for explicit user confirmation

## Important Notes
**CRITICAL**: The plan agent will **NOT** write any code until you explicitly confirm with "yes" or "proceed".

If you want changes, respond with:
- "modify: [your changes]"
- "different approach: [alternative]"
- "skip phase 2 and do phase 3 first"

## Integration with Other Commands
After planning:
- Use `/tdd` to implement with test-driven development
- Use `/build-fix` if build errors occur
- Use `/code-review` to review completed implementation

## Related Agents
This command invokes the `plan` agent located at:
`~/.claude/plugins/cache/almedia-code/almedia-code/<version>/agents/plan.md` (Claude Code's plugin cache structure: `cache/<marketplace>/<plugin>/<version>/`)
