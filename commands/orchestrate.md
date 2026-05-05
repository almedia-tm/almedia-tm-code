# Orchestrate Command

Sequential agent workflow for complex tasks.

## Usage
`/orchestrate [workflow-type] [task-description]`

## Workflow Types

### feature
Full feature implementation workflow:
```
plan -> tester -> ts-code-reviewer -> security-reviewer
```

### bugfix
Bug investigation and fix workflow:
```
plan -> tester -> ts-code-reviewer
```

### refactor
Safe refactoring workflow:
```
architect -> ts-code-reviewer -> tester
```

### security
Security-focused review:
```
security-reviewer -> ts-code-reviewer -> architect
```

## Execution Pattern
For each agent in the workflow:
1. **Invoke agent** with context from previous agent
2. **Collect output** as structured handoff document
3. **Pass to next agent** in chain
4. **Aggregate results** into final report

## Handoff Document Format
Between agents, create handoff document:

```markdown
## HANDOFF: [previous-agent] -> [next-agent]

### Context
[Summary of what was done]

### Findings
[Key discoveries or decisions]

### Files Modified
[List of files touched]

### Open Questions
[Unresolved items for next agent]

### Recommendations
[Suggested next steps]
```

## Final Report Format
```
ORCHESTRATION REPORT
====================
Workflow: feature
Task: [description]
Agents: plan -> tester -> ts-code-reviewer -> security-reviewer

SUMMARY
-------
[One paragraph summary]

AGENT OUTPUTS
-------------
plan: [summary]
tester: [summary]
ts-code-reviewer: [summary]
security-reviewer: [summary]

FILES CHANGED
-------------
[List all files modified]

TEST RESULTS
------------
[Test pass/fail summary]

SECURITY STATUS
---------------
[Security findings]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## Parallel Execution
For independent checks, run agents in parallel via the `Agent` tool — multiple parallel calls in a single message.

## Arguments
$ARGUMENTS:
- `feature <description>` - Full feature workflow
- `bugfix <description>` - Bug fix workflow
- `refactor <description>` - Refactoring workflow
- `security <description>` - Security review workflow
- `custom <agents> <description>` - Custom agent sequence
