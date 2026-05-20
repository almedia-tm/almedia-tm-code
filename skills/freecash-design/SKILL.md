---
name: freecash-design
description: Use for any Freecash design work — producing mockups, prototypes, HTML artifacts, React components, or UI code; critiquing designs against the system; or turning meeting notes, briefs, or specs into design ideations. Triggers on prompts to design, build, mock up, prototype, wireframe, sketch, ideate, visualize, or iterate on any Freecash screen, flow, or component, including the core surfaces (Earn, Deals, My Offers, Cashout, Quests) and component-level work (deal cards, buttons, bottom navigation, offer rows, progress bars). Also triggers on exploratory phrasing like "help me design X," "I'm thinking about a feature for Y," "what could Z look like," or when the prompt provides meeting notes, Slack threads, or briefs needing structure. Always load this skill when the word "Freecash" appears alongside any design or UI intent. Always produces full HTML artifacts (not inline previews) so the user can evaluate at native mobile viewport size.
---

# Freecash Design

This skill produces Freecash-accurate design output: mockups, prototypes, HTML artifacts, and component code. It handles two distinct request types — exploratory ideation (where the user wants to think through a problem and see options) and direct execution (where the user already knows what they want built). The skill routes between these modes automatically based on the prompt.

Everything needed to produce on-brand output lives inside this skill folder. No external tools, MCP connections, Figma calls, or visualize tools are required for HTML/React rendering. Files in this folder are sufficient and authoritative.

## Routing — read this first

Decide which mode applies based on the user's prompt:

**Ideation mode** — full structured flow (classify → intake → confirm → directions → normalize → render). Triggers when the user:
- Uses exploratory phrasing ("help me think through," "what could this look like," "ideate on," "give me ideas for")
- Describes a problem or feature without specifying the solution
- Provides meeting notes, briefs, Slack threads, or loose specs
- Is a non-designer (PM, engineer, stakeholder) likely to benefit from structured intake
- Is unclear whether they want one answer or several options

**Execution mode** — skip ideation, normalize the prompt, then render. Triggers when the user:
- Has clearly decided on a single direction ("build me the Cashout screen")
- Asks for a component-level tweak ("make a deal card with a countdown")
- Says "just build" / "skip ideation" / "I already know what I want"
- Provides a fully-specified brief with no open questions

When uncertain, default to ideation mode and offer the user an escape hatch on the first turn. False starts are cheap; rendering the wrong thing is expensive.

---

## Ideation mode

Sequential, interactive. Walk the user through one phase at a time. Never batch phases. Never skip the classification step.

### Phase 1 — Classify

Use `ask_user_input_v0` to ask:

> "Before I dig in, how big is this change?"

Options:
- **Small change** — tweaking copy, adjusting a component, adding one element
- **Larger change** — new feature, new surface, or flow redesign
- **Not sure yet** — help me figure out

STOP after this tool call. End your turn. Wait for the user's selection.

Route based on answer:
- Small → Phase 2a
- Larger → Phase 2b
- Not sure → briefly explain the distinction in 2-3 sentences, then re-ask the classification question

### Phase 2a — Condensed intake (small changes)

Ask in a single message:

> "Quick context:
> 1. Which screen or component are we changing?
> 2. What's the change, and the goal in one sentence?
> 3. Anything specific I should NOT change?"

Wait for the answer. Then run the **Confirmation protocol** below.

### Phase 2b — Full intake (larger changes)

Ask in a single message:

> "Answer what you can — leave blanks if unsure:
> 1. **What's the user problem?** (What's broken, missing, or suboptimal today?)
> 2. **What surface are we designing on?** (Which screen, tab, or flow — or new surface?)
> 3. **What does success look like?** (A metric, behavior change, or qualitative goal)
> 4. **Any constraints or anti-goals?** (Technical, legal, tracking, past attempts to avoid)"

Wait for the answer. Then run the **Confirmation protocol** below.

### Confirmation protocol (always runs, regardless of size)

Never skip. Never batch with rendering.

1. Write a prose summary — 2-3 sentences for small changes, 3-4 for larger. Format as a single paragraph the user could paste into a ticket.

2. Call `ask_user_input_v0`:

   Question: "Does this capture it accurately?"

   Options:
   - **Yes, proceed** — advance to next phase
   - **Needs a tweak** — user provides corrections; re-run this protocol
   - **Let me rewrite it** — user provides a fresh brief; re-run this protocol

3. STOP. End your turn. Do not render, do not generate directions, do not take any further action until the user selects an option.

4. Only on "Yes, proceed" → advance: small changes → Variant detail + Normalize + Render; larger changes → Phase 3 (with 3 directions).

### Phase 3 — Generate directions (larger changes only)

Produce **3 genuinely divergent** directions — different solutions to the problem, not variations of one solution.

Good divergence:
- Visibility vs. restraint
- Inline pattern vs. dedicated screen
- Fast-to-ship vs. long-term investment
- No new components vs. proposes a new pattern

Bad divergence (reject internally): same structure, different colors / radii / button counts.

For each direction, provide:
1. **Name** — 2-4 words, evocative (e.g. "Inline whisper," "Dedicated hub")
2. **Optimizes for** — one sentence on the trade-off
3. **Structure** — 2-4 bullets on layout and key components used
4. **Why it might win / lose** — one sentence each
5. **Watch for** — open questions or risks

Then proceed to Normalize, then Render.

### Variant detail (small changes only)

For each variant, provide:
1. **Name** — 2-3 words naming what makes it different
2. **Key decisions** — 2-3 bullets on typography, token, placement, format, alignment
3. **Trade-off vs. the other variant** — one sentence

Then proceed to Normalize, then Render.

---

## Execution mode

No classification, no intake, no confirmation phase — the user has already specified what they want. Proceed directly to **Normalize**, then Render. If the prompt is genuinely underspecified, ask one targeted clarifying question first; otherwise normalize and proceed.

---

## Normalize — required pre-render step

⚠️ **Normalize runs before every render**, in both ideation mode and execution mode. It exists because user prompts written in natural language consistently leak two failure modes:

1. **Structural drift** — "create a banner for the Earn tab" gets rendered as a banner on a generic dark screen, losing the canonical Bubbles + Active Offer Header + reward sections that define the My Offers Earn tab. The prompt didn't explicitly require those, so they got dropped.

2. **Visual drift** — "bold," "promotional," "premium," "playful" pull Claude toward generic web/marketing design language (saturated brand-color block fills, text underlines, gradient backgrounds spanning the whole card). The Freecash system has its own vocabulary for emphasis, and natural-language tone words don't map to it.

Normalize translates the user's prompt into a structured form that anchors against canonical files and uses Freecash-specific vocabulary. The structured prompt is shown to the user for a single confirmation, then becomes the binding spec for render.

### Auto-skip — when normalization can be bypassed

If the user's prompt **already contains all three** of the following anchors, normalization is unnecessary and the skill proceeds directly to render:

- **Structural anchor** — names a baseline file from `examples/` (e.g. *"use `examples/my-offers.html` as the structural baseline"*)
- **Emphasis anchor** — names a specific component or token as the visual reference (e.g. *"match the emphasis level of the Active Offer Header"* or *"primary CTA = green Button per components.md"*)
- **Anti-pattern block** — names what to avoid (e.g. *"do NOT use saturated brand-color fills, underlines, or invent new visual treatments"*)

If any of the three is missing, run the full normalization. Auto-skip is for users who already speak the structured format; everyone else gets normalized.

### The four task archetypes

Identify which archetype the user's prompt falls into. Each has its own template.

**1. Additive change** — adding a component to an existing surface. Verbs: "add," "insert," "place," "include." Example: *"add a banner to the Earn tab."*

**2. Full screen** — building a new surface or substantially redesigning an existing one. Verbs: "design," "build," "create," "redesign." Example: *"design a new Quests screen."*

**3. Component-only** — work on a single component out of context. Verbs: "make a card," "build a row," "design a button." Example: *"make a deal card with a countdown."*

**4. Critique** — evaluating an existing design against the system. Verbs: "review," "critique," "what's wrong with," "audit." Example: *"critique this Cashback screen."*

If the prompt is ambiguous between two archetypes, default to **additive change** — it's the most constraining and lowest-risk default.

### Templates

Use these as the structural rewrite of the user's prompt. Fill the brackets from the user's prompt + the design system files. Replace tonal language ("bold," "promotional") with token-named structural language using the **Vocabulary translation** table below.

#### Additive change template

```
TASK: Add [component] to [surface].

STRUCTURAL BASELINE: examples/[file].html — preserve all existing
components, positions, and density exactly. The new component sits
[position relative to existing landmarks].

VISUAL APPROACH: Match the emphasis level of [reference component
in the example file]. The loudest element should be [specific
token-backed treatment]. Surfaces should use [specific token].

ANTI-PATTERNS — do NOT:
- [list 3-5 specific failure modes, drawn from common drift]

REQUIREMENTS:
- [component-specific requirements: copy, behavior, states]

DELIVERABLE: Render the full surface with the new component in
place at native mobile viewport, so the addition can be evaluated
in real context. Do not substitute or simplify any existing
components.
```

#### Full-screen template

```
TASK: Design [surface] with the goal of [user-stated goal].

ARCHETYPE: [feed | reward-list | cashback | quests | cashout | other]
— follow the archetype's required body structure per layouts.md.

REFERENCE SCREENS: [examples/earn.html and/or examples/my-offers.html]
— use these for component density, spacing, and visual treatment.
Header pattern (108px) and Bottom TabBar are mandatory.

VISUAL APPROACH: Standard Freecash dark theme. Primary CTAs are
green per components.md `Button` component. Yellow/gold reserved
for `button_special` (rewards-tier high-emphasis only).

ANTI-PATTERNS — do NOT:
- Substitute generic cards for documented components
- Invent visual treatments not present in the example files
- Render a primary CTA in yellow/gold (that's button_special only)

REQUIREMENTS:
- [screen-specific requirements]

DELIVERABLE: Full HTML artifact at 390px viewport, scrollable to
natural content height, with Header + Bottom TabBar.
```

#### Component-only template

```
TASK: Build [component] as a standalone component.

REFERENCE: components.md section [name]. If the component is
documented, follow the documented anatomy, props, density, and
token usage exactly. If it's a new pattern, flag it inline as
[candidate for components.md V1.1] and note the gap.

VISUAL APPROACH: [token-backed treatment]. Primary CTAs use the
green Button per components.md. Reserve yellow/gold for
button_special (rewards-tier only).

ANTI-PATTERNS — do NOT:
- Invent props or variants not in components.md
- Use values outside tokens.md without flagging them

REQUIREMENTS:
- [component-specific requirements]

DELIVERABLE: Component in isolation on a dark surface
(--color-grey-blue-900) at appropriate viewport width.
```

#### Critique template

```
TASK: Critique [target] against the Freecash design system.

REFERENCE FILES: tokens.md, components.md, layouts.md,
examples/earn.html, examples/my-offers.html — these define
correctness. Anything not in these files is improvisation.

OUTPUT FORMAT: For each issue found:
- What's wrong (specific element + why it diverges)
- What it should be (token, component, or example file reference)
- Severity (blocking / should-fix / minor)

ANTI-PATTERNS — do NOT:
- Critique on subjective taste alone — every issue must reference
  a token, component, layout rule, or example file
- Suggest "improvements" that introduce new visual language
```

### Confirmation step

After producing the normalized prompt, show it to the user via `ask_user_input_v0`:

Question: *"Here's how I'm reading the brief. Confirm before I render."*

Options:
- **Yes, render** — proceed to Render step
- **Adjust scope** — user wants to change task / structural baseline / requirements
- **Adjust visual approach** — user wants to change emphasis level / token references / anti-patterns
- **Start over** — fresh brief

STOP after this tool call. Do not proceed to render until the user confirms.

If the user selects "Adjust scope" or "Adjust visual approach," ask what specifically and re-run normalize.

### Audience note

The normalized prompt is read by **designers, PMs, and other team members** — not just the original prompter. Write it in a way that someone joining mid-conversation could understand. Don't over-abbreviate. Token references should include the human-readable color name in parentheses on first mention (e.g. `--color-freecash-green-500` (brand green)).

---

## Vocabulary translation

Generic design words that **must be translated** before they enter the normalized prompt. Left column is what users say; right column is what the skill renders against.

| User says | Translate to |
|---|---|
| "bold" / "loud" / "attention-grabbing" | "Use the documented high-emphasis vocabulary: green primary CTA, dollar-amount in `--color-freecash-green-500`, or category accent color. Do NOT saturate the whole surface." |
| "subtle" / "understated" / "quiet" | "Use `--color-grey-blue-700` or `-800` surface, no color accents beyond hairline borders, body copy in `--color-grey-blue-50`." |
| "premium" / "high-end" / "polished" | RESERVED — ask the user what they mean. Premium isn't a documented Freecash mode. Likely they mean either "use `button_special` rewards treatment" or "tighten density." |
| "playful" / "fun" / "energetic" | "Use the gradient-and-sparkle illustration convention from `.pip__image` in my-offers.html. Category accent colors (yellow / fuschia / cyan) for section emphasis." |
| "promotional" / "marketing-y" | "Card-style surface with eyebrow pill, headline, subhead, primary CTA. Surface stays `--color-grey-blue-700`. Loudness comes from the CTA, not the background fill." |
| "modern" / "clean" / "minimal" | NEAR-MEANINGLESS — Freecash is already dark, sans-serif, token-driven. Drop these words from the normalized prompt entirely; they add no constraint. |
| "primary button" / "main CTA" | Green `Button` component, `variant=primary, subVariant=green`, per components.md. Background `--color-freecash-green-500`. NEVER yellow/gold. |
| "special button" / "rewards button" | `button_special` (gold or bronze), scoped to rewards-tier high-emphasis moments only (streak claim, gold-tier reward unlock). Hard-edge shadow is signature. |
| "hero" / "featured" | Use `Offer Card` with `Size=Large, Emphasis=Highest` per components.md. Maximum one per screen view. |
| "card" | Default to `--color-grey-blue-700` surface, `--radius-04` (16px) corner, 1px hairline `--color-neutral-0-a10` inset. |
| "make it stand out" | Specify which mechanism: (a) elevation contrast (lighter surface), (b) accent color border, (c) larger size, (d) different position. Don't leave open-ended. |

If the user's prompt uses a word not in this table that feels like a tonal/emotional descriptor, **flag it** in the normalized prompt: *"User used the word 'X' — interpreting as Y based on context. Confirm if this is wrong."*

---

## Render

Apply to all output, whether from ideation mode or execution mode.

### ⚠️ Render is binding — complete every step in order

Do not produce any visual output before completing every numbered step below. If a step cannot be completed, stop and tell the user rather than proceeding with degraded output. Skipping or batching steps in this section is a failure of the task.

**Step 0: Confirm the normalized prompt is locked.** Render must not begin until either (a) the user has confirmed the normalized prompt via the Normalize step, or (b) the user's original prompt cleared the auto-skip check (had structural anchor + emphasis anchor + anti-pattern block). If neither is true, return to Normalize. The normalized prompt is the binding spec for everything that follows.

**Step 1: Read the design system files in this skill folder.** All of them, in order:
- `tokens.md` — the exact CSS variable values you must use
- `components.md` — the component patterns and their rules
- `layouts.md` — the page composition rules
- `examples/earn.html` — visual reference for feed-style screens
- `examples/my-offers.html` — visual reference for filter + offer screens

**Step 2: Confirm what you read.** Output a single line listing the files you successfully read and the specific tokens you'll use as CSS variables. Example: *"Read tokens.md, components.md, layouts.md, examples/earn.html, examples/my-offers.html. Using --color-bg-primary, --color-brand-green, --color-text-default, --space-md, --space-lg, --radius-card, --font-primary."* Then add a second line declaring the **screen archetype**: one of `feed` (Earn), `reward-list` (My Offers / offer-detail Rewards tab), `cashback`, `quests`, `cashout`, or `other` — and for `reward-list` specifically, confirm the body will use Bubbles + Active Offer Header + Section Header + Reward Row patterns from `components.md`. If any file failed to read, stop and tell the user.

**Density rule (applies to every component).** Every numeric value — width, height, padding, gap, font-size, line-height, border-radius — must come from either (a) a token in `tokens.md`, (b) an explicit pixel value documented in the relevant `components.md` section under "Density (these are not suggestions)", or (c) a value lifted directly from the matching block in `examples/my-offers.html` or `examples/earn.html`. **Do not eyeball.** If you find yourself thinking "32px feels right" or "let's make it 16px," stop — go look up what the example uses. The example file is the canonical pixel-level reference. If example and components.md disagree, the example wins. If neither covers the case, flag the gap inline with `[density gap — verify with design]` and use the closest documented value.

**Step 3: Render as a full HTML artifact. This is non-negotiable.**

Required tool sequence:
1. `create_file` producing a `.html` file saved to `/mnt/user-data/outputs/`
2. `present_files` immediately after, to make the artifact visible to the user in Claude's artifact panel

The user must be able to open the rendered output at full fidelity — 390px mobile viewport at native size, fully scrollable, inspectable in the artifact panel. Inline previews shrink the output to thumbnail size and make evaluation impossible.

**Forbidden:**
- The `visualize` tool — produces inline previews instead of artifacts
- Inline SVG mockups embedded directly in the chat
- ASCII or text-based previews
- Any rendering that displays inline in the chat thread rather than in the artifact panel
- MCP tools or Figma fetches for HTML/React output (Figma MCP is permitted ONLY when the user explicitly asks for Figma work — see Output format defaults)

If you find yourself reaching for any of the forbidden tools, stop — the only correct rendering path for HTML/React is `create_file` followed by `present_files`.

**Filenames:** use the direction or variant name with hyphens (e.g. `direction-inline-whisper.html`, `variant-subtle-default.html`). One file per direction or variant.

See **Output count** below for how many files to create.

**After creating files, keep your chat message brief.** The artifacts are the deliverable, not the prose around them. A short summary of what each artifact shows is enough — let the user open and judge the work directly.

**Step 4: Self-check before presenting.** Run this checklist against your output. If any answer is "no" (or "yes" for items framed as failures), regenerate before calling `present_files`:

- Is the background `var(--color-bg-primary)` (dark)?
- Are all colors, spacings, radii, and font values defined as CSS custom properties in `:root`?
- Are there any hex codes scattered in CSS rules outside `:root`? (Should be no.)
- Is the font `'Poppins', 'Inter', sans-serif`?
- Are icons from Phosphor (except Bottom TabBar nav icons, which use the Freecash custom set)?
- **Is the primary CTA the green `Button` component (`variant=primary, subVariant=green`, background `--color-freecash-green-500`)?** Yellow/gold buttons are `button_special`, scoped to rewards-tier high-emphasis only — they are NOT the default primary CTA. If the rendered output uses yellow for a non-rewards CTA (e.g. a promotional banner, a generic action button, a navigation CTA), regenerate with green.
- Is the Bottom TabBar present, with exactly one tab in active state matching the screen's purpose?
- Are illustration slots rendered as gradient + sparkle placeholders, not invented illustrations or emoji? (No exception — the Bubbles carousel and Active Offer Header logo both use the same sparkle convention.)
- Did you avoid inventing components not in `components.md`? (If you did invent, did you flag them with `[candidate for components.md V1.1]`?)
- **Density check:** every width / height / padding / gap / font-size / line-height value resolves to a token, a documented density value in components.md, or a value from the example file. No eyeballed pixel values. If unsure on any single value, did you compare it against `examples/my-offers.html`?
- **Normalized-prompt fidelity check:** does the output match every requirement in the normalized prompt? If the normalized prompt named a structural baseline file, did you preserve every component from it? If it named anti-patterns, did you avoid all of them? If it named an emphasis anchor, does the loudest element match it?

**Anti-patterns — if your output looks like any of these, regenerate:**
- Marketing landing page sections like "See it in action", "How it works", "Watch demo" with a hero video and numbered steps. Freecash is a list-of-rewards product, not a SaaS landing page.
- A reward / offer-detail screen rendered without any [Reward Row](components.md#reward-row) instances. If the prompt is about rewards, earning, offers, progress, or "what can I earn from X", the screen must use Reward Rows grouped under [Section Headers with Icon](components.md#section-header-with-icon).
- **My Offers → Earn tab rendered without Bubbles or the offer-details region.** If the screen is My Offers (any category) and an offer is in progress, the body MUST include the Bubbles row + Active Offer Header + sub-tabs + categorized reward sections per `examples/my-offers.html`. Promotional banners or other additions sit ABOVE this structure, never replace it.
- An Active Offer Header rendered with a yellow rectangular CTA instead of a 48×48 green circular play button (with a *black* play icon, not white).
- **A primary CTA rendered in yellow/gold instead of green.** Yellow is reserved for `button_special` (rewards-tier high-emphasis: streak claims, gold-tier reward unlocks, etc.). Standard primary CTAs — including promotional banners, navigation actions, and general conversion buttons — use the green `Button` component per components.md.
- **Saturated brand-color block fills covering an entire surface.** A card on a `--color-freecash-green-500` background filling its full area is wrong. Cards live on `--color-grey-blue-700` or `-800`. Brand color appears in CTAs, accent text (dollar amounts), eyebrow pills, and small decorative gradients — never as a full-card fill.
- **Text underlines used for emphasis.** Underlines aren't a Freecash convention. Emphasis comes from weight (semibold/bold), color (`--color-freecash-green-500` for value, `--color-yellow-400` for bonus, etc.), or size — never decoration.
- A header that omits the avatar / streak / balance / tickets / bell row and instead places a single floating element. Every full screen has the standard 108px header.
- Generic h1/h2 marketing copy used as the loudest element on a screen where a dollar amount should dominate.

**Reward-list screens — required pattern.** If the screen is a reward list (My Offers, an offer's Rewards tab, anything that enumerates ways to earn), the body must be:
1. **`tab_primary` Horizontal Menu** at the top (Earn / Cashback / Surveys / Rewards / Referrals — sticky pill row, horizontally scrollable). This is required, not optional, on the My Offers / offer-detail surface. See `examples/my-offers.html` line 1036 for the canonical markup.
2. [Bubbles / Game Tile Carousel](components.md#game-tile-carousel-bubbles) (optional, top of body)
3. **`<section class="offer-details">` wrapper with `background: var(--color-grey-blue-800)`** — this is required when the screen shows an offer's reward details. The wrapper contains everything from step 4 onward. The screen stays `--color-grey-blue-900`; the offer-details area is `--color-grey-blue-800`. Don't skip this wrapper — without it, the screen reads as a generic dark theme, not as Freecash.
4. [Active Offer Header](components.md#active-offer-header) (optional, anchors the screen)
5. `tab_secondary` (Rewards / Details) — optional, only if the screen is an offer detail
6. Repeating: `[Section Header with Icon]` → `[Reward Row]` × 2-6 → next section

Do not substitute generic cards, tiles, or list items for Reward Rows on these screens.

If all checks pass, proceed to `present_files`.

### Non-negotiable rules — apply these to every output

These rules are the floor. They apply even if file reads return less detail than expected.

- **Background:** dark only. `var(--color-bg-primary)`, which is `#141521`. No light mode, ever.
- **Font:** `'Poppins', 'Inter', sans-serif`. No other families. No system-ui as a primary, only as a secondary fallback.
- **Mobile-first.** 390px viewport (iPhone portrait). Full-screen output extends to natural scroll height.
- **Tokens only.** Every color, spacing, radius, font value resolves to a CSS custom property defined in `:root` from `tokens.md`. No hex codes scattered in rules. No magic pixel values. If a needed value isn't in `tokens.md`, flag the gap inline with a comment; do not hardcode silently.
- **Components match `components.md`.** Do not invent components. If a needed pattern isn't documented, implement inline and flag with `[candidate for components.md V1.1]`.
- **Primary CTA buttons are green.** The standard primary CTA is the `Button` component with `variant=primary, subVariant=green` per components.md — background `--color-freecash-green-500`, dark text. Yellow/gold is the `button_special` component, which is **scoped specifically to rewards-tier high-emphasis moments** (streak claim, gold-tier reward unlock) and is NOT the default primary CTA. The "Play and Earn $X" button in `examples/earn.html` is `button_special`, not the standard primary — do not generalize that pattern to non-rewards CTAs like promotional banners or navigation actions.
- **Icons are Phosphor only.** Use the Phosphor web CDN (`@phosphor-icons/web`) for HTML output or `@phosphor-icons/react` for React. Default to Regular weight; use Fill for active or emphasized states. Never use Lucide, Heroicons, Material Icons, emoji, or inline SVGs as icon substitutes.
- **Exception — Bottom TabBar icons.** The five tab icons (Earn, Deals, My Offers, Cashout, Quests) come from a dedicated Freecash `navigation icons` component set per `layouts.md`. These are custom Freecash icons and must NOT be replaced with Phosphor.
- **Illustration slots are placeholders.** Featured card artwork, game icons, and similar slots render as CSS-only gradient backgrounds with a centered sparkle motif, matching `examples/earn.html` and `examples/my-offers.html`. Never invent illustrations, generate fake artwork, or use emoji as illustration stand-ins.
- **Every full-screen output includes the Bottom TabBar.** Exactly one tab is in the active state matching the screen's purpose (Earn screen → Earn active, etc.). Active tab uses the documented green icon + white label + soft green glow.
- **Header pattern is fixed across screens.** All five core screens use the same 108px top header (44px Status Bar + 64px Header balance with avatar, streak pill, balance pill, tickets pill, and bell). Pills are horizontally centered as a group.

### Output count

- **Larger changes (after Phase 3):** create 3 HTML artifacts, one per direction, labeled by direction name.
- **Small changes:** create **2 HTML artifacts**, one per variant — not 1, not 3. One variant hides the design choices Claude makes silently; three is overkill for a small scope. Two lets the user see the trade-off without choice overload.
- **Execution mode:** create 1 HTML artifact matching the user's specification.

### Post-render — always include (ideation mode only)

Before the final choice prompt, add a short **Notes** block (2-4 bullets total):
- **Assumptions made** — silent decisions the user might want to correct
- **Open questions** — unspecified things that could change the answer
- **V1 gaps encountered** — missing tokens/components, flagged `[V1 known gap]`

Then use `ask_user_input_v0` for the final choice:

Question: "Which direction should we go?"

Options (larger changes): Direction A / B / C / Combine elements / Neither, try again
Options (small changes): Variant A / B / Combine elements / Neither, try again

Never commit silently. Always give the user the choice.

---

## Output format defaults

Unless the prompt specifies otherwise:

- **Default output is a self-contained HTML file** with an inline `<style>` block. All tokens defined in `:root` at the top. No external CSS, no external fonts loaded (reference Poppins in `font-family` with Inter fallback), no JavaScript unless layout absolutely requires it.
- **When asked for React**, produce a single functional component using Tailwind arbitrary values that resolve to tokens (e.g. `bg-[var(--color-bg-primary)]`). Import Phosphor icons from `@phosphor-icons/react`.
- **When asked for Figma work specifically** (e.g. "create this in our Figma file," "update the Figma component," "build this in Figma"), use the `figma-console` MCP plugin for programmatic operations. Load fonts in a separate call before creating text nodes. **This is the ONLY case where MCP tools are permitted** — for HTML/React output, MCP is forbidden per the Render section.

## Escape hatches

Respect these user signals to change the flow:

- "Just build me one thing" / "I already know what I want" → switch to execution mode immediately (still runs Normalize unless auto-skip applies)
- Complete brief in initial prompt → confirm the brief back, skip the question set, proceed to Normalize then Render
- "I don't know, pick something" on a question → note the gap, stand in a sensible default, flag it in Notes
- "Skip the confirmation" / "just render it" → bypass Normalize confirmation step, but still run Normalize internally and use the rewritten prompt as the binding spec
