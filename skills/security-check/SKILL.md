---
name: security-check
description: Use when touching authentication, payments, webhooks, secrets, or user data. Triggers when the conversation includes "auth", "login", "Stripe", "webhook", "API key", "service role", "session", "JWT", "RLS", "password", or when modified files include known auth/payment paths.
---

# Security Check Skill

The user is touching security-sensitive code. Run the security review.

## Action
Invoke the `security-reviewer` agent. The agent will check:
- No hardcoded secrets / API keys
- `SUPABASE_SERVICE_ROLE_KEY` not on client side
- `.env` is in `.gitignore`
- Stripe webhooks call `stripe.webhooks.constructEvent()` first
- Webhook secret comes from env var
- All input validated at system boundaries
- No SQL string concatenation
- Rate limiting on auth endpoints

## Do not
- Approve auth/payment changes without this review.
- Trust client-sent amounts in payment flows.
