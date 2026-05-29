# Readability

> Code is read 10x more than it's written. Optimize the read.

This file lists the universal readability rules every reviewer enforces, and every agent applying changes follows. Companion to [surgical-edits.md](./surgical-edits.md): surgical-edits keeps diffs small; this file keeps the code that ships *readable*.

Each rule has a **severity** that the reviewer should apply when reporting findings. Severities below are *minimums* — a reviewer may upgrade to a higher tier when the violation is severe.

---

## Tier 1 — High severity (must fix before merge)

### R1. Dispatch via lookup or switch, not `if/else if` ladders

When you have **3+ branches dispatching on a single value**, the structure is shouting "table". Use `switch`/`case`, `match`, or an object/map lookup.

```ts
// ❌  Hard to extend, hard to scan
if (status === 'pending') return showSpinner();
else if (status === 'active') return showContent();
else if (status === 'error') return showError();
else if (status === 'done') return showResult();

// ✅  Add a case in one place; all branches at the same indent
switch (status) {
  case 'pending': return showSpinner();
  case 'active':  return showContent();
  case 'error':   return showError();
  case 'done':    return showResult();
}

// ✅  Even better when every branch is the same shape
const HANDLERS = { pending: showSpinner, active: showContent, error: showError, done: showResult };
return HANDLERS[status]();
```

### R2. Guard clauses over nested conditions

Early `return` / `throw` / `continue` flattens the function. Deeply-nested conditions force the reader to hold state in their head.

```ts
// ❌  Reader has to track three layers
function processOrder(order) {
  if (order) {
    if (order.user) {
      if (order.user.active) {
        return doWork(order);
      }
    }
  }
  return null;
}

// ✅  Each early-return narrows the precondition; main path is unindented
function processOrder(order) {
  if (!order) return null;
  if (!order.user) return null;
  if (!order.user.active) return null;
  return doWork(order);
}
```

### R3. Booleans named for truth, not negation

Avoid double-negative reading. `!notReady` is how bugs hide.

```ts
// ❌
const notReady = false;
if (!notReady) start();

// ✅
const isReady = true;
if (isReady) start();
```

Prefer `is*`, `has*`, `can*`, `should*` prefixes. Reserve negative names (`isDisabled`, `isHidden`) for inherently-negative states only.

### R4. No magic numbers or strings in logic

Bare literals can't be searched, can't be renamed, and divorce intent from value.

```ts
// ❌
if (status === 3) cancel();

// ✅
const OrderStatus = { Pending: 1, Active: 2, Cancelled: 3, Done: 4 } as const;
if (status === OrderStatus.Cancelled) cancel();
```

Exception: `0`, `1`, `-1`, empty string `""`, and `null` are conventionally meaningful and don't need a name.

---

## Tier 2 — Medium severity (fix when possible, doesn't block merge alone)

### R5. Functions do one thing; mixed levels of abstraction are a smell

A function that **does HTTP + parses JSON + applies business rules + writes to DB** is four functions wearing a trench coat. Split by level of abstraction so each function reads as a sequence of named verbs at the same level.

```ts
// ❌  Levels mixed: top-level orchestration intermixed with low-level parsing
function handleSignup(req) {
  const body = JSON.parse(req.body);                // low-level
  if (!body.email.match(/^\S+@\S+/)) throw new Error('bad email'); // low-level
  const user = await db.query('INSERT INTO users ...', body);      // low-level
  await sendEmail(user.email, 'welcome');                          // high-level
  return { id: user.id };
}

// ✅  Each line reads at one level
async function handleSignup(req) {
  const body = parseSignupRequest(req);
  validateSignup(body);
  const user = await createUser(body);
  await sendWelcomeEmail(user);
  return { id: user.id };
}
```

### R6. Side effects at the edges, pure logic in the middle

I/O (network, DB, filesystem, env) should happen at the function boundaries. Decision logic in the middle should be pure — testable without mocks, easy to reason about.

```ts
// ❌  Pricing logic tangled with DB calls and external API calls
async function calculatePrice(orderId) {
  const order = await db.getOrder(orderId);
  const taxRate = await taxApi.fetch(order.region);
  let total = 0;
  for (const item of order.items) {
    const product = await db.getProduct(item.productId);
    total += product.price * item.quantity * (1 + taxRate);
  }
  return total;
}

// ✅  Pure pricing, separate from I/O
function priceOrder(items: Item[], products: Map<Id, Product>, taxRate: number): number {
  return items.reduce((sum, item) => {
    const product = products.get(item.productId);
    return sum + product.price * item.quantity * (1 + taxRate);
  }, 0);
}

async function calculatePrice(orderId) {
  const order = await db.getOrder(orderId);
  const products = await db.getProducts(order.items.map(i => i.productId));
  const taxRate = await taxApi.fetch(order.region);
  return priceOrder(order.items, products, taxRate);
}
```

### R7. No commented-out code; no `TODO` without a ticket reference

Commented-out blocks rot — readers can't tell if they're load-bearing or dead. Delete them; `git` remembers.

`// TODO` without an owner and a ticket has no path to completion. Either fix it now, or open an issue and reference it: `// TODO(issue-142): handle rate-limited path`.

### R8. Drop `else` after `return` / `throw` / `continue` / `break`

If the `if` branch exits the function, the `else` is structural noise.

```ts
// ❌
if (!user) {
  return null;
} else {
  return doWork(user);
}

// ✅
if (!user) return null;
return doWork(user);
```

---

## DRY — Rule of 3

**Extract on the THIRD duplication, not the second.**

- Two similar blocks may be a coincidence. The "right" abstraction often isn't clear until you've seen a third instance.
- Premature extraction creates an abstraction that's wrong for the third caller and forces them to bend their needs to fit, or hack around the helper, or create a sibling.
- Three similar lines is better than a premature abstraction.

When the third copy appears, *then* extract — and when extracting, look at all three call sites to design the right shape. If you can only find two similar blocks, leave them alone.

---

## How reviewers should apply this

When you find a violation:

1. Tag it with the **rule ID** (`R1`–`R8` or `DRY`) and the severity from this file.
2. Propose a surgical fix per [surgical-edits.md](./surgical-edits.md). If the fix would touch > 30 lines, describe it in prose and flag for discussion — don't paste a giant block.
3. Don't chain rules into one finding ("R1 + R3 + R8 here") — one finding per rule violation per location.

## How implementing agents should follow this

When you write or modify code:

1. Apply Tier 1 by default — there is rarely a reason to violate R1–R4 in new code.
2. Apply Tier 2 when the cost is low. Don't refactor existing R5/R6 violations during an unrelated change — that's not surgical (see [surgical-edits.md](./surgical-edits.md)).
3. Follow Rule of 3 — don't extract a helper just because you wrote two similar lines.
