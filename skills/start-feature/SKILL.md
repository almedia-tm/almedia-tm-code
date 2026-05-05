---
name: start-feature
description: Use when the user wants to add new functionality, build something new, or implement a feature. Triggers on phrases like "add", "build", "implement", "create a", "I want to make".
---

# Start Feature Skill

The user wants to start a new feature. Plan first, then test-drive the implementation.

## Action
1. Invoke the `plan` agent to break the feature into phased tasks.
2. WAIT for user approval of the plan.
3. Once approved, invoke the `tester` agent for the first phase to write tests RED → GREEN → REFACTOR.
4. Implement each phase, with `tester` writing tests before each implementation step.

## Do not
- Skip planning — straight-to-code on a new feature is the #1 source of rework.
- Skip the RED phase — confirm tests fail for the right reason before implementing.
