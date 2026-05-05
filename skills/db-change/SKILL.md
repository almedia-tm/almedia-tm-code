---
name: db-change
description: Use when changing database schema, migrations, or RLS policies. Triggers when the conversation includes SQL CREATE/ALTER/DROP TABLE, schema.prisma edits, supabase migrations, or RLS policy references.
---

# DB Change Skill

The user is changing the database. Run the database review.

## Action
Invoke the `db-reviewer` agent. The agent will check:
- RLS enabled on all tables
- Every user-scoped policy uses `auth.uid()` correctly
- Migrations are additive (no `DROP COLUMN` without a documented backup plan)
- New `NOT NULL` columns have a `DEFAULT` for existing rows
- Every foreign key has a corresponding index
- Prisma queries use `select` to limit returned fields
- No N+1 patterns

## Do not
- Skip RLS review — silent data leaks are the most common Supabase failure mode.
