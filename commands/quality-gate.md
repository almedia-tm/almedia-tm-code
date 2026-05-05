# Quality Gate Command

Run the quality pipeline on demand for a file or project scope.

## Usage
`/quality-gate [path|.] [--fix] [--strict]`

- default target: current directory (`.`)
- `--fix`: allow auto-format/fix where configured
- `--strict`: fail on warnings where supported

## Pipeline
1. Detect language/tooling for target.
2. Run formatter checks.
3. Run lint/type checks when available.
4. Produce a concise remediation list.
5. Run `ts-code-reviewer` (or language-appropriate reviewer) agent on changed files.
6. Run `security-reviewer` if changed files include auth, payment, or user-data code.

## Notes
This command mirrors hook behavior but is operator-invoked.

## Arguments
$ARGUMENTS:
- `[path|.]` optional target path
- `--fix` optional
- `--strict` optional
