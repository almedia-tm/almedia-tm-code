# Freecash Design System — Components (V1)

Source: Figma file **Design System** (`Q93Z0XEmvjBhIAwIGp1Gqp`). All component names below match the Figma component names exactly.

---

## How to use this file

This file teaches Claude how to correctly reproduce Freecash UI components when generating visuals (HTML, React, or Figma output). Use it alongside `tokens.md`, which defines every CSS variable referenced here.

Rules when building UI from this file:

1. **Use the exact Figma component names** (the H2 headings below) in code comments, class names, and artifact titles so the output stays traceable to the source.
2. **Never invent variants.** If a variant is not listed under "Variants / props" for a component, do not use it. Prefer a listed variant that approximates the need over making one up.
3. **Token references map to `tokens.md`.** Any CSS variable like `--color-bg-primary`, `--space-md`, `--radius-md`, `--font-size-body-m` must resolve to a value defined in `tokens.md`. If `tokens.md` doesn't have a token you need, stop and flag it — don't substitute a raw hex or px value.
4. **Flags in the text:**
   - `[from team rules — verify]` = behavioral rule that isn't visible in Figma; came from past conversation notes. Confirm with the team before trusting.
   - `[confirm with design]` = reasonable assumption made while writing this file, but I wasn't certain. Needs a designer to sign off.
5. **Example markup is minimal by design.** It shows structure, semantic wrapping, and token hookup — not every edge case. Don't copy-paste it into production without filling in real content and accessibility attributes.
6. **Do not bake in hex colors or raw px values.** Everything visual flows through tokens. The one exception: the rgba black used for Scrim is defined as a token (`--color-scrim`) and referenced as such.

---

## Quick index

- [Accordion (FAQ-Question)](#accordion-faq-question)
- [Button (`button`)](#button-button)
- [Button, special (`button_special`)](#button-special-button_special)
- [Utility Button](#utility-button)
- [Checkbox](#checkbox)
- [Tabs / Chips — primary (`tab_primary`)](#tabs--chips--primary-tab_primary)
- [Tabs / Chips — secondary (`tab_secondary`)](#tabs--chips--secondary-tab_secondary)
- [Tooltip](#tooltip)
- [Offer Card](#offer-card)
- [Cashback card (`Card`)](#cashback-card-card)
- [Top Navigation — Tab NavBar (`Tab NavBar`)](#top-navigation--tab-navbar-tab-navbar)
- [Top Navigation — Header balance (`Header balance`)](#top-navigation--header-balance-header-balance)
- [Top Navigation — Header component (`Header component`)](#top-navigation--header-component-header-component)
- [Bottom TabBar](#bottom-tabbar)
- [Scrim](#scrim)
- [Modal](#modal)
- [Bottom Sheet](#bottom-sheet)

---

## Accordion (FAQ-Question)

> The Figma file has no component literally named "Accordion." The closest match — and the one this section documents — is `FAQ-Question`. The other expandable component (`Footer Link`) is intentionally excluded; it's footer-specific. [confirm with design]

**Purpose.** Show a question/answer pair that a user can expand to read the body. Use for FAQ lists and any question-led reveal.

**Variants / props.**

| Prop | Values |
|---|---|
| `size` | `mobile`, `desktop` |
| `expanded` | `false`, `true` |
| `status` | `default`, `hover` |
| `question` (text) | the question string |
| `body` (text) | the answer string |

**Anatomy.** Question row (question text + chevron icon) → divider (when expanded) → body text (only when `expanded=true`).

**Token usage.**
- Background: `--color-bg-surface`
- Question text: `--color-text-primary`
- Body text: `--color-text-secondary`
- Chevron icon: `--color-icon-default`
- Border / divider: `--color-border-subtle`
- Corner radius: `--radius-md`
- Padding: `--space-md` (mobile) / `--space-lg` (desktop) `[confirm with design]`

**Rules.**
- Only one accordion open at a time is a common pattern but is **not** enforced by the component — if your product requires single-open behavior, implement it in the parent. `[confirm with design]`
- The chevron rotates on expand; it's the same icon component flipped, not a separate icon.
- Don't nest accordions inside accordions.

**Do / Don't.**
- ✅ Do animate the expand/collapse with a height transition so the chevron rotation and content reveal stay in sync.
- ❌ Don't use this for non-Q&A content (use Bottom Sheet or Modal for richer reveals).
- ❌ Don't put CTAs in the body — if the user needs to act, consider a different pattern.

**Example markup.**

```html
<details class="fc-accordion" data-size="desktop">
  <summary class="fc-accordion__q">
    <span>How do I cash out my earnings?</span>
    <svg class="fc-accordion__chevron" aria-hidden="true"><!-- CaretDown --></svg>
  </summary>
  <div class="fc-accordion__body">
    You can cash out once you reach the minimum balance for your chosen payout method.
  </div>
</details>

<style>
  .fc-accordion {
    background: var(--color-bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    color: var(--color-text-primary);
  }
  .fc-accordion__q {
    display: flex; justify-content: space-between; align-items: center;
    font: var(--font-body-m-semibold);
    cursor: pointer; list-style: none;
  }
  .fc-accordion__chevron { transition: transform .2s ease; }
  .fc-accordion[open] .fc-accordion__chevron { transform: rotate(180deg); }
  .fc-accordion__body {
    margin-top: var(--space-sm);
    color: var(--color-text-secondary);
    font: var(--font-body-m-regular);
  }
</style>
```

---

## Button (`button`)

**Purpose.** The default CTA. Use for primary, secondary, and destructive actions across product surfaces.

**Variants / props.**

| Prop | Values |
|---|---|
| `variant` | `primary`, `secondary` |
| `subVariant` | `green`, `accent`, `destructive` |
| `content` | `text`, `icon` |
| `size` | `sm`, `md`, `lg` |
| `status` | `default`, `hover`, `pressed`, `disabled` |
| `iconLeft` (bool) | show left icon |
| `iconRight` (bool) | show right icon |
| `Copy` (text) | button label |

The Figma set ships **108 variants** — all combinations of the above. When picking a variant, fix `variant` + `subVariant` first (that's the role), then pick size/status.

**Anatomy.** Optional left icon → label (or just icon if `content=icon`) → optional right icon. Corner radius is `--radius-md`.

**Token usage.**
- Default fill (primary / green): `--color-action-primary-bg`, label `--color-action-primary-fg`
- Accent: `--color-action-accent-bg` / `--color-action-accent-fg`
- Destructive: `--color-action-destructive-bg` / `--color-action-destructive-fg`
- Secondary: transparent fill, border `--color-action-secondary-border`, label matches subVariant's accent color
- Hover/pressed/disabled states use state-suffixed tokens (e.g. `--color-action-primary-bg-hover`)
- Corner radius: `--radius-md` (observed 8px in Figma wrapper — confirm the token maps to 8)
- Padding & font size per `size`: map `sm` → `--space-sm` + `--font-body-s-semibold`, `md` → `--space-md` + `--font-body-m-semibold`, `lg` → `--space-lg` + `--font-body-l-semibold` `[confirm with design]`

**Rules.**
- Only one **primary / green** button per screen section. If you need two CTAs, the second must be `secondary` or an accent/destructive variant. `[from team rules — verify]`
- Destructive variants are only for actions that delete, remove, or permanently alter user data. Never use destructive for "Cancel."
- `content=icon` means icon-only. Still pass an accessible name (`aria-label`).
- Disabled buttons must be non-interactive (no hover change, no pointer cursor).

**Do / Don't.**
- ✅ Do pair `variant=primary, subVariant=green` with the main conversion action on a screen.
- ❌ Don't mix two different `subVariant` colors in the same button group (e.g. accent next to destructive).
- ❌ Don't put a left **and** right icon with a long label at `size=sm` — it gets too cramped.

**Example markup.**

```html
<button class="fc-btn" data-variant="primary" data-sub="green" data-size="lg">
  <span class="fc-btn__label">Claim reward</span>
</button>

<button class="fc-btn" data-variant="secondary" data-sub="accent" data-size="md">
  <svg class="fc-btn__icon-left" aria-hidden="true"><!-- icon --></svg>
  <span class="fc-btn__label">Learn more</span>
</button>

<style>
  .fc-btn {
    display: inline-flex; align-items: center; gap: var(--space-xs);
    border-radius: var(--radius-md);
    font: var(--font-body-m-semibold);
    border: 0; cursor: pointer;
  }
  .fc-btn[data-size="sm"] { padding: var(--space-xs) var(--space-sm); font: var(--font-body-s-semibold); }
  .fc-btn[data-size="md"] { padding: var(--space-sm) var(--space-md); }
  .fc-btn[data-size="lg"] { padding: var(--space-md) var(--space-lg); font: var(--font-body-l-semibold); }

  .fc-btn[data-variant="primary"][data-sub="green"] {
    background: var(--color-action-primary-bg);
    color: var(--color-action-primary-fg);
  }
  .fc-btn[data-variant="primary"][data-sub="green"]:hover {
    background: var(--color-action-primary-bg-hover);
  }
  .fc-btn[data-variant="secondary"] {
    background: transparent;
    border: 1px solid var(--color-action-secondary-border);
    color: var(--color-action-secondary-fg);
  }
  .fc-btn:disabled { opacity: .5; cursor: not-allowed; }
</style>
```

---

## Button, special (`button_special`)

**Purpose.** Rewards-specific, high-emphasis CTA used for gold / bronze reward tiers (e.g. streak claim, special promotions). Visually richer than the default button.

**Variants / props.**

| Prop | Values |
|---|---|
| `variant` | `gold`, `bronze` |
| `content` | `text`, `icon` |
| `size` | `sm`, `md`, `lg` |
| `status` | `default`, `hover`, `pressed`, `disabled` |
| `iconLeft`, `iconRight` (bool) | |
| `Copy` (text) | label |

**Anatomy.** Same as `button` but with gold/bronze gradient fills and richer hover/pressed treatments.

**Token usage.**
- Gold fill: `--color-reward-gold-bg` (likely a gradient token — `[confirm with design]`)
- Bronze fill: `--color-reward-bronze-bg`
- Text: `--color-reward-on-gold-fg` / `--color-reward-on-bronze-fg`
- Radius: `--radius-md`

**Rules.**
- **Never** use `button_special` for generic actions. It's reserved for reward / streak / tier-linked CTAs. `[from team rules — verify]`
- Gold is higher emphasis than bronze. Don't put two `button_special` instances adjacent — they compete.
- The Boosted Deals flow has specific rules about which variant goes where `[from team rules — verify]` — ask the team, I don't have those notes loaded.

**Do / Don't.**
- ✅ Do use `gold` for "Claim streak" and "Unlock tier" kinds of actions.
- ❌ Don't substitute `button_special` for a regular `button` just because gold looks nicer.
- ❌ Don't combine with accent / destructive colors in the same row.

**Example markup.**

```html
<button class="fc-btn-special" data-variant="gold" data-size="lg">
  <svg class="fc-btn-special__icon" aria-hidden="true"><!-- Crown --></svg>
  <span>Claim streak</span>
</button>

<style>
  .fc-btn-special {
    display: inline-flex; align-items: center; gap: var(--space-xs);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-md);
    border: 0; cursor: pointer;
    font: var(--font-body-l-semibold);
  }
  .fc-btn-special[data-variant="gold"] {
    background: var(--color-reward-gold-bg);
    color: var(--color-reward-on-gold-fg);
  }
  .fc-btn-special[data-variant="bronze"] {
    background: var(--color-reward-bronze-bg);
    color: var(--color-reward-on-bronze-fg);
  }
</style>
```

---

## Utility Button

**Purpose.** Low-emphasis circular/compact button for utility actions (close, back, share) placed on top of photos, illustrations, or busy backgrounds. Adapts to light or dark backdrops.

**Variants / props.**

| Prop | Values |
|---|---|
| `Type` | `on-dark`, `on-light` |
| `State` | `defaut` (spelled this way in Figma), `hover` |

No size prop — this component ships at a single size. `[confirm with design]`

**Anatomy.** Icon centered in a translucent circular/rounded background.

**Token usage.**
- `on-dark` bg: `--color-utility-on-dark-bg` (semi-transparent black)
- `on-light` bg: `--color-utility-on-light-bg` (semi-transparent white)
- Icon color: `--color-icon-on-scrim` (or the inverse on light)

**Rules.**
- Always match the `Type` to the actual backdrop brightness — `on-dark` on a light bg will disappear.
- This is the correct component for close/back buttons floating over Offer Card images or videos.

**Do / Don't.**
- ✅ Do use `on-dark` for close buttons on videos, photos, Scrim overlays.
- ❌ Don't use Utility Button for primary actions — it's deliberately low-emphasis.
- ❌ Don't add a solid background; the translucency is the point.

**Example markup.**

```html
<button class="fc-utility-btn" data-type="on-dark" aria-label="Close">
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>

<style>
  .fc-utility-btn {
    width: 40px; height: 40px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 0; border-radius: 50%;
    cursor: pointer;
  }
  .fc-utility-btn[data-type="on-dark"] {
    background: var(--color-utility-on-dark-bg);
    color: var(--color-icon-on-scrim);
  }
  .fc-utility-btn[data-type="on-light"] {
    background: var(--color-utility-on-light-bg);
    color: var(--color-icon-default);
  }
</style>
```

---

## Checkbox

**Purpose.** Boolean selection in forms and lists.

**Variants / props.**

| Prop | Values |
|---|---|
| `State` | `Default`, `Selected`, `Hover`, `Disabled`, `Disabled Empty`, `Error` |
| `Size` | `sm`, `md`, `lg` |

**Anatomy.** Square box (with border in unselected, fill + check glyph in selected). No built-in label — wrap in a `<label>` and place label text as a sibling.

**Token usage.**
- Unselected border: `--color-border-default`
- Selected fill: `--color-action-primary-bg`
- Check glyph: `--color-action-primary-fg`
- Error border: `--color-border-error`
- Disabled: `--color-bg-disabled` + `--color-border-disabled`
- Radius: `--radius-sm` `[confirm with design]`

**Rules.**
- `Disabled` and `Disabled Empty` are different: `Disabled` = disabled + checked; `Disabled Empty` = disabled + unchecked. Pick the right one for the data state.
- `Error` state is visual only — always pair it with a hint message below the row.
- Size should match the text it sits next to: `sm` for body-s, `md` for body-m, `lg` for body-l.

**Do / Don't.**
- ✅ Do expand the click target to the label — don't make users aim at a 16px box.
- ❌ Don't use Checkbox for single-choice selection (use radio / a single-select pattern instead).
- ❌ Don't omit the label — even if the context makes the meaning "obvious."

**Example markup.**

```html
<label class="fc-checkbox-row">
  <input type="checkbox" class="fc-checkbox" data-size="md">
  <span>I agree to the Terms &amp; Privacy Policy</span>
</label>

<style>
  .fc-checkbox-row {
    display: inline-flex; align-items: center; gap: var(--space-sm);
    font: var(--font-body-m-regular);
    color: var(--color-text-primary);
    cursor: pointer;
  }
  .fc-checkbox {
    appearance: none;
    width: 20px; height: 20px; /* md */
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-sm);
    background: transparent;
    display: inline-grid; place-content: center;
  }
  .fc-checkbox[data-size="sm"] { width: 16px; height: 16px; }
  .fc-checkbox[data-size="lg"] { width: 24px; height: 24px; }
  .fc-checkbox:checked {
    background: var(--color-action-primary-bg);
    border-color: var(--color-action-primary-bg);
  }
  .fc-checkbox:checked::after {
    content: ""; width: 60%; height: 60%;
    background: var(--color-action-primary-fg);
    clip-path: polygon(14% 44%, 0 58%, 40% 100%, 100% 20%, 84% 4%, 40% 68%);
  }
  .fc-checkbox:disabled {
    background: var(--color-bg-disabled);
    border-color: var(--color-border-disabled);
  }
</style>
```

---

## Tabs / Chips — primary (`tab_primary`)

**Purpose.** Top-level tabs inside a section, used for switching between major views (e.g. "All", "Active", "Completed"). Higher emphasis than `tab_secondary`.

**Variants / props.**

| Prop | Values |
|---|---|
| `size` | `sm`, `lg` |
| `status` | `default`, `hover`, `selected`, `disabled` |
| `show icon` (bool) | toggle leading icon |
| `label` (text) | tab label |
| `iconSlot` | swappable icon instance |

**Anatomy.** Optional leading icon → label. Selected state has a filled background; default has a transparent/outline look.

**Token usage.**
- Default bg: `--color-bg-subtle` (or transparent)
- Selected bg: `--color-tab-primary-selected-bg`
- Default text: `--color-text-secondary`
- Selected text: `--color-text-primary`
- Disabled: `--color-text-disabled`
- Radius: `--radius-pill` (chip-shaped) `[confirm with design]`

**Rules.**
- Only one tab in a group can be `selected` at a time.
- Tabs in a row must all be the same `size`.

**Do / Don't.**
- ✅ Do use `tab_primary` for the top-level tab row on a page.
- ❌ Don't nest `tab_primary` inside another `tab_primary` row — use `tab_secondary` for sub-tabs.
- ❌ Don't replace with a custom pill button; use the real component.

**Example markup.**

```html
<div role="tablist" class="fc-tabs" data-size="lg">
  <button role="tab" aria-selected="true"  class="fc-tab-primary" data-status="selected">All offers</button>
  <button role="tab" aria-selected="false" class="fc-tab-primary" data-status="default">Trending</button>
  <button role="tab" aria-selected="false" class="fc-tab-primary" data-status="default">New</button>
</div>

<style>
  .fc-tabs { display: inline-flex; gap: var(--space-xs); }
  .fc-tab-primary {
    padding: var(--space-sm) var(--space-md);
    border: 0; border-radius: var(--radius-pill);
    font: var(--font-body-m-semibold);
    background: transparent; color: var(--color-text-secondary);
    cursor: pointer;
  }
  .fc-tab-primary[data-status="selected"] {
    background: var(--color-tab-primary-selected-bg);
    color: var(--color-text-primary);
  }
  .fc-tab-primary:disabled { color: var(--color-text-disabled); cursor: not-allowed; }
</style>
```

---

## Tabs / Chips — secondary (`tab_secondary`)

**Purpose.** Sub-filter chips, typically used below a `tab_primary` row for finer slicing (e.g. category filters, reward type chips).

**Variants / props.** Same shape as `tab_primary`: `size` (`sm`, `lg`), `status` (`default`, `hover`, `selected`, `disabled`), `show icon`, `label`, `iconSlot`.

**Anatomy.** Same as `tab_primary` but styled as a lower-emphasis chip (outline vs. fill when selected).

**Token usage.**
- Default: border `--color-border-subtle`, text `--color-text-secondary`
- Selected: border `--color-border-default`, bg `--color-tab-secondary-selected-bg`, text `--color-text-primary`
- Radius: `--radius-pill`

**Rules.**
- **Multi-select is allowed** here (unlike `tab_primary`). Secondary chips commonly act as toggleable filters. `[confirm with design]`
- Keep row count ≤ 2 — don't create a 4-row chip wall.

**Do / Don't.**
- ✅ Do allow multiple `selected` chips in a `tab_secondary` row if they're filters.
- ❌ Don't mix `tab_primary` and `tab_secondary` in the same row.

**Example markup.**

```html
<div class="fc-chips" data-size="sm">
  <button class="fc-tab-secondary" data-status="selected" aria-pressed="true">Cashback</button>
  <button class="fc-tab-secondary" data-status="default" aria-pressed="false">Surveys</button>
  <button class="fc-tab-secondary" data-status="default" aria-pressed="false">Games</button>
</div>

<style>
  .fc-chips { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
  .fc-tab-secondary {
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid var(--color-border-subtle);
    background: transparent;
    border-radius: var(--radius-pill);
    color: var(--color-text-secondary);
    font: var(--font-body-s-medium);
    cursor: pointer;
  }
  .fc-tab-secondary[data-status="selected"] {
    background: var(--color-tab-secondary-selected-bg);
    border-color: var(--color-border-default);
    color: var(--color-text-primary);
  }
</style>
```

---

## Tooltip

**Purpose.** Short hint attached to a trigger element, revealed on hover or focus.

**Variants / props.**

| Prop | Values |
|---|---|
| `Direction` | `top`, `down`, `left`, `right` |
| `Size` | `sm`, `lg` |
| `Color` | `light`, `dark` |
| `Icon` (bool) | show leading icon |

16 variants total (4 × 2 × 2).

**Anatomy.** Pointer/arrow → content bubble (optional icon + hint text). Content slot is the `Hint Content` sub-component (one-line or multi-line).

**Token usage.**
- Light bg: `--color-tooltip-light-bg` / text `--color-tooltip-light-fg`
- Dark bg: `--color-tooltip-dark-bg` / text `--color-tooltip-dark-fg`
- Padding: 20px on all sides (from Figma layout spec) — map to `--space-lg`
- Radius: `--radius-md`

**Rules.**
- **Never put interactive controls inside a tooltip.** If users need to click something, use a Popover or Modal instead.
- `Direction` should be chosen based on viewport space — the tooltip must not overflow the screen. `[confirm with design]`
- Keep copy under ~100 characters for `sm`; use `lg` for longer hints.

**Do / Don't.**
- ✅ Do make the trigger keyboard-focusable so the tooltip appears on focus as well as hover.
- ❌ Don't stack tooltips (tooltip inside a tooltip).
- ❌ Don't use a tooltip where a persistent helper label would work — tooltips hide info.

**Example markup.**

```html
<span class="fc-tooltip-wrap">
  <button aria-describedby="tt-1" class="fc-tooltip-trigger">
    <svg aria-hidden="true"><!-- Info icon --></svg>
  </button>
  <span role="tooltip" id="tt-1" class="fc-tooltip" data-direction="top" data-size="sm" data-color="dark">
    <svg aria-hidden="true" class="fc-tooltip__icon"><!-- Info --></svg>
    <span>Cashback is credited within 24 hours of purchase confirmation.</span>
  </span>
</span>

<style>
  .fc-tooltip-wrap { position: relative; display: inline-block; }
  .fc-tooltip {
    position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: var(--space-xs);
    padding: var(--space-lg);
    border-radius: var(--radius-md);
    font: var(--font-body-s-regular);
    white-space: normal; max-width: 260px;
    opacity: 0; pointer-events: none; transition: opacity .15s;
  }
  .fc-tooltip[data-color="dark"] {
    background: var(--color-tooltip-dark-bg);
    color: var(--color-tooltip-dark-fg);
  }
  .fc-tooltip[data-color="light"] {
    background: var(--color-tooltip-light-bg);
    color: var(--color-tooltip-light-fg);
  }
  .fc-tooltip-trigger:hover + .fc-tooltip,
  .fc-tooltip-trigger:focus + .fc-tooltip { opacity: 1; }
</style>
```

---

## Offer Card

**Purpose.** Canonical Freecash offer surface — displays an offer (brand, reward amount, CTA) at varying visual weights. The core revenue-driving component.

**Variants / props.**

| Prop | Values |
|---|---|
| `Size` | `Large`, `Medium`, `Small` |
| `Emphasis` | `Default`, `High`, `Highest`, `Offer Partner` |
| `Video` (bool) | swap static image for video preview |
| `Title` (text) | offer title |

Note: `Emphasis=Offer Partner` is only shipped at `Size=Small` in Figma.

**Anatomy.** Media area (image/video) → title → reward amount → CTA. Larger sizes add description text and more prominent CTAs; `Highest` emphasis gets a colored frame / glow treatment.

**Token usage.**
- Card bg: `--color-bg-surface`
- Title: `--color-text-primary`
- Reward amount: `--color-text-accent` (the signature green)
- Description: `--color-text-secondary`
- Emphasis border (High / Highest): `--color-border-emphasis` / `--color-border-emphasis-strong`
- Radius: `--radius-md`
- Gap inside card: `--space-sm`

**Rules.**
- **Only one `Highest` emphasis Offer Card per screen view.** Visual shouting loses meaning if everything shouts. `[from team rules — verify]`
- `Offer Partner` variant is reserved for paid partner / featured offers and must carry a sponsorship disclosure nearby. `[from team rules — verify]`
- When `Video=true`, always pair with a play affordance (the Utility Button `on-dark` is the standard). Don't autoplay with sound.
- The reward amount must be the visually dominant element inside the card — larger or heavier than the title.

**Do / Don't.**
- ✅ Do use `Size=Large, Emphasis=Highest` sparingly for hero / boosted-deal slots.
- ❌ Don't stack two `Highest` emphasis cards next to each other.
- ❌ Don't replace the green reward text with any other color — that green is what users scan for.

**Example markup.**

```html
<article class="fc-offer-card" data-size="Large" data-emphasis="High">
  <div class="fc-offer-card__media">
    <img src="/offers/santander.png" alt="">
  </div>
  <h3 class="fc-offer-card__title">Santander cashback</h3>
  <div class="fc-offer-card__reward">$35.99</div>
  <p class="fc-offer-card__desc">Open a new account and earn the bonus after your first transaction.</p>
  <button class="fc-btn" data-variant="primary" data-sub="green" data-size="md">Get offer</button>
</article>

<style>
  .fc-offer-card {
    display: flex; flex-direction: column; gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--color-bg-surface);
    border-radius: var(--radius-md);
  }
  .fc-offer-card[data-emphasis="High"]    { border: 1px solid var(--color-border-emphasis); }
  .fc-offer-card[data-emphasis="Highest"] { border: 2px solid var(--color-border-emphasis-strong); }
  .fc-offer-card__title  { font: var(--font-body-l-semibold); color: var(--color-text-primary); margin: 0; }
  .fc-offer-card__reward { font: var(--font-display-s); color: var(--color-text-accent); }
  .fc-offer-card__desc   { font: var(--font-body-s-regular); color: var(--color-text-secondary); margin: 0; }
</style>
```

---

## Cashback card (`Card`)

> Documented here as the Cashback component per team scope. Figma name is literally `Card`. [confirm with design]

**Purpose.** Shows a single cashback merchant offer with reward, optional old reward (for discounted/boosted deals), and optional code tag.

**Variants / props.**

| Prop | Values |
|---|---|
| `Size` | `xl`, `lg`, `md`, `sm` |
| `Time-limited` | `True`, `False` |
| `Name` (text) | merchant name, e.g. "Santander" |
| `Reward` (text) | current reward, e.g. "$35.99" |
| `Old reward` (text) | previous reward (strikethrough), e.g. "$29.54" |
| `Show code tag` (bool) | show promo code chip |

**Anatomy.** Logo/brand media → merchant name → reward (+ old reward if boosted) → optional `Code Tag` chip → optional time-limited indicator.

**Token usage.**
- Bg: `--color-bg-surface`
- Name: `--color-text-primary`
- Reward: `--color-text-accent`
- Old reward: `--color-text-tertiary` with `text-decoration: line-through`
- Code Tag bg: `--color-tag-code-bg`, text `--color-tag-code-fg`
- Time-limited indicator uses `--color-warning-fg` with a clock icon
- Radius: `--radius-md`

**Rules.**
- When `Old reward` is displayed, `Reward` must be **greater** than it (this is a boosted/discounted cashback, not a reduction). `[from team rules — verify]`
- `Time-limited=True` requires a real expiry timestamp somewhere in the parent flow — don't use the time-limited badge decoratively.
- Boosted Deals have additional rules around badge placement and ranking — ask the team for those. `[from team rules — verify]`

**Do / Don't.**
- ✅ Do show `Old reward` (strikethrough) whenever the offer is a boosted amount so users see the lift.
- ❌ Don't show the `Old reward` field when there's no actual boost — it misleads users.
- ❌ Don't put a cashback `Card` and an `Offer Card` in the same feed without clear section headers — they're similar enough to confuse.

**Example markup.**

```html
<article class="fc-cashback" data-size="lg" data-time-limited="true">
  <img class="fc-cashback__logo" src="/logos/santander.svg" alt="">
  <div class="fc-cashback__name">Santander</div>
  <div class="fc-cashback__rewards">
    <span class="fc-cashback__reward">$35.99</span>
    <span class="fc-cashback__old">$29.54</span>
  </div>
  <span class="fc-code-tag">CASHBACK50</span>
  <span class="fc-cashback__timer" aria-label="Time-limited offer">
    <svg aria-hidden="true"><!-- Clock --></svg> 2d left
  </span>
</article>

<style>
  .fc-cashback {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--color-bg-surface);
    border-radius: var(--radius-md);
    align-items: center;
  }
  .fc-cashback__name { font: var(--font-body-m-semibold); color: var(--color-text-primary); }
  .fc-cashback__reward { font: var(--font-body-l-semibold); color: var(--color-text-accent); }
  .fc-cashback__old    { font: var(--font-body-s-regular); color: var(--color-text-tertiary); text-decoration: line-through; margin-left: var(--space-xs); }
  .fc-code-tag {
    padding: var(--space-xxs) var(--space-xs);
    background: var(--color-tag-code-bg);
    color: var(--color-tag-code-fg);
    border-radius: var(--radius-sm);
    font: var(--font-body-xs-medium);
  }
  .fc-cashback__timer { color: var(--color-warning-fg); font: var(--font-body-xs-medium); }
</style>
```

---

## Top Navigation — Tab NavBar (`Tab NavBar`)

**Purpose.** Top-level navigation item used in the main desktop navigation bar.

**Variants / props.**

| Prop | Values |
|---|---|
| `State` | `Selected`, `Unselected`, `Hover` |
| `Show Chevron` | `Yes`, `No` |

**Anatomy.** Optional leading icon → label → optional trailing chevron (for nav items with a dropdown).

**Token usage.**
- Default text: `--color-text-secondary`
- Hover text: `--color-text-primary`
- Selected text: `--color-text-primary`
- Selected indicator (underline or fill): `--color-nav-selected-indicator`
- Chevron icon: matches current text color

**Rules.**
- `Show Chevron=Yes` means the item opens a dropdown/menu — don't use the chevron decoratively on leaf items.
- Only one `Tab NavBar` item can be `Selected` at a time in a given bar.

**Do / Don't.**
- ✅ Do rotate the chevron when its menu is open.
- ❌ Don't shrink the hit target below the design — these are frequent nav targets.

**Example markup.**

```html
<nav class="fc-top-nav">
  <a href="/earn"    class="fc-tab-navbar" data-state="Selected">Earn</a>
  <a href="/cashout" class="fc-tab-navbar" data-state="Unselected">Cashout</a>
  <button class="fc-tab-navbar" data-state="Unselected" aria-haspopup="true" aria-expanded="false">
    More <svg aria-hidden="true"><!-- CaretDown --></svg>
  </button>
</nav>

<style>
  .fc-top-nav { display: inline-flex; gap: var(--space-lg); }
  .fc-tab-navbar {
    display: inline-flex; align-items: center; gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    background: transparent; border: 0;
    color: var(--color-text-secondary);
    font: var(--font-body-m-semibold);
    text-decoration: none; cursor: pointer;
  }
  .fc-tab-navbar[data-state="Selected"] {
    color: var(--color-text-primary);
    box-shadow: inset 0 -2px 0 0 var(--color-nav-selected-indicator);
  }
  .fc-tab-navbar[data-state="Hover"],
  .fc-tab-navbar:hover { color: var(--color-text-primary); }
</style>
```

---

## Top Navigation — Header balance (`Header balance`)

**Purpose.** The user's balance display in the global header — shows current earnings and adapts to logged-in / logged-out and mobile / desktop contexts.

**Variants / props.**

| Prop | Values |
|---|---|
| `Property 1` (device) | `Mobile`, `Desktop` |
| `State` | `Logged in`, `Logged out` |

**Anatomy.** Coin/currency icon → balance amount (logged in) OR CTA "Sign in" (logged out).

**Token usage.**
- Bg: `--color-bg-surface` or transparent
- Amount: `--color-text-accent`
- Icon: `--color-icon-accent`
- Logged-out CTA uses the `button` component, typically `variant=primary, subVariant=green, size=sm`.

**Rules.**
- Never show a stale balance — if data is loading, show a skeleton, not a zero. `[confirm with design]`
- Clicking the balance should route to the wallet / cashout flow.

**Do / Don't.**
- ✅ Do use the coin icon to reinforce the earnings meaning.
- ❌ Don't show the balance if the user is logged out — render the sign-in CTA instead.

**Example markup.**

```html
<!-- Logged in -->
<a href="/wallet" class="fc-header-balance" data-device="desktop" data-state="logged-in">
  <svg aria-hidden="true" class="fc-header-balance__icon"><!-- Coin --></svg>
  <span class="fc-header-balance__amount">$12.40</span>
</a>

<!-- Logged out -->
<button class="fc-btn" data-variant="primary" data-sub="green" data-size="sm">Sign in</button>

<style>
  .fc-header-balance {
    display: inline-flex; align-items: center; gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    color: var(--color-text-accent);
    font: var(--font-body-m-semibold);
    text-decoration: none;
  }
  .fc-header-balance__icon { color: var(--color-icon-accent); }
</style>
```

---

## Top Navigation — Header component (`Header component`)

**Purpose.** Composite header slots that live next to `Header balance` — lottery, balance, and streak containers. Used as discrete pieces of the top navigation.

**Variants / props.**

| Prop | Values |
|---|---|
| `Component` | `Lottery Container`, `Balance container`, `Streak container` |
| `State` | `Default`, `Pressed` |

**Anatomy.** Icon (component-specific: ticket, coin, or fire/streak) → value text. Entire element is pressable.

**Token usage.**
- Bg: `--color-bg-subtle`
- Value text: `--color-text-primary`
- Icon colors per component:
  - Lottery: `--color-icon-lottery`
  - Balance: `--color-icon-accent`
  - Streak: `--color-icon-streak` (typically fire/orange)
- Radius: `--radius-pill`

**Rules.**
- Only show the Streak container when the user has an active streak — empty states belong elsewhere.
- `Pressed` is a transient state — don't render it as the resting state.

**Do / Don't.**
- ✅ Do route each container to its corresponding full screen (lottery page, wallet, streak detail).
- ❌ Don't combine the icons into one amalgamated pill — each container ships separately.

**Example markup.**

```html
<div class="fc-header-stack">
  <button class="fc-header-chip" data-component="streak">
    <svg aria-hidden="true"><!-- Fire --></svg> 7
  </button>
  <button class="fc-header-chip" data-component="lottery">
    <svg aria-hidden="true"><!-- Ticket --></svg> 3
  </button>
  <a class="fc-header-chip" data-component="balance" href="/wallet">
    <svg aria-hidden="true"><!-- Coin --></svg> $12.40
  </a>
</div>

<style>
  .fc-header-stack { display: inline-flex; gap: var(--space-xs); }
  .fc-header-chip {
    display: inline-flex; align-items: center; gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-bg-subtle);
    border: 0; border-radius: var(--radius-pill);
    color: var(--color-text-primary);
    font: var(--font-body-m-semibold);
    text-decoration: none; cursor: pointer;
  }
</style>
```

---

## Bottom TabBar

**Purpose.** Mobile bottom navigation. The `Item` variant determines which tab is the currently active one.

**Variants / props.**

| Prop | Values |
|---|---|
| `Item` | `Deals`, `Quests`, `My Offers`, `Earn`, `Cashout` |
| `Show Home Indicator` (bool) | show the iOS home-indicator pad |

**Anatomy.** Row of 5 tabs (icon + label). Active tab is highlighted. Optional home indicator pad below.

**Token usage.**
- Bg: `--color-bg-surface`
- Inactive icon/label: `--color-text-tertiary`
- Active icon/label: `--color-text-accent` (or `--color-text-primary`, `[confirm with design]`)
- Top border: `--color-border-subtle`
- Safe-area padding for the home indicator: `--space-sm`

**Rules.**
- Tab order is **fixed**: `Deals`, `Quests`, `My Offers`, `Earn`, `Cashout` — don't reorder by screen.
- Always exactly 5 items. Don't add or remove tabs conditionally.
- `Show Home Indicator` should be `true` only on iOS devices with safe-area.

**Do / Don't.**
- ✅ Do reflect the current route in the `Item` variant so users know where they are.
- ❌ Don't hide the TabBar on deep screens unless the product spec explicitly calls for it.
- ❌ Don't use the TabBar on desktop — desktop uses `Tab NavBar`.

**Example markup.**

```html
<nav class="fc-tabbar" aria-label="Primary" data-active="Earn">
  <a href="/deals"     class="fc-tabbar__item" data-item="Deals">     <svg aria-hidden="true"><!-- Tag --></svg>       <span>Deals</span></a>
  <a href="/quests"    class="fc-tabbar__item" data-item="Quests">    <svg aria-hidden="true"><!-- Compass --></svg>   <span>Quests</span></a>
  <a href="/my-offers" class="fc-tabbar__item" data-item="My Offers"> <svg aria-hidden="true"><!-- ListChecks --></svg><span>My Offers</span></a>
  <a href="/earn"      class="fc-tabbar__item" data-item="Earn"       aria-current="page"><svg aria-hidden="true"><!-- Lightning --></svg><span>Earn</span></a>
  <a href="/cashout"   class="fc-tabbar__item" data-item="Cashout">   <svg aria-hidden="true"><!-- Wallet --></svg>    <span>Cashout</span></a>
</nav>

<style>
  .fc-tabbar {
    display: grid; grid-template-columns: repeat(5, 1fr);
    background: var(--color-bg-surface);
    border-top: 1px solid var(--color-border-subtle);
    padding: var(--space-xs) 0 calc(var(--space-sm) + env(safe-area-inset-bottom));
  }
  .fc-tabbar__item {
    display: inline-flex; flex-direction: column; align-items: center; gap: var(--space-xxs);
    color: var(--color-text-tertiary);
    font: var(--font-body-xs-medium);
    text-decoration: none;
  }
  .fc-tabbar__item[aria-current="page"] { color: var(--color-text-accent); }
</style>
```

---

## Scrim

**Purpose.** Dimmed overlay behind Modals, Bottom Sheets, and other focused surfaces. Blocks interaction with everything underneath.

**Variants / props.**

| Prop | Values |
|---|---|
| `Device` | `Mobile`, `Desktop` |

**Anatomy.** Full-viewport translucent black layer, typically with an optional backdrop blur.

**Token usage.**
- Background: `--color-scrim` (semi-transparent black, e.g. `rgba(0,0,0,0.6)`) — resolve via `tokens.md`.
- Optional blur: `--blur-scrim` (a `backdrop-filter` value, if defined in `tokens.md`)

**Rules.**
- Scrim **must** block clicks on anything beneath it. Clicks on the scrim itself should dismiss the overlay (Modal/Bottom Sheet) unless the content is destructive / requires a decision.
- Never render a Scrim without a focused surface above it — a lone scrim is a bug.
- `z-index` must sit above page content but below the surface it's dimming.

**Do / Don't.**
- ✅ Do fade the scrim in (~150ms ease-out) — a hard cut feels jarring.
- ❌ Don't use Scrim as decoration. It's a structural layer.
- ❌ Don't nest Scrims. If two overlays are open, close one first.

**Example markup.**

```html
<div class="fc-scrim" data-device="mobile" role="presentation" aria-hidden="true"></div>

<style>
  .fc-scrim {
    position: fixed; inset: 0;
    background: var(--color-scrim);
    backdrop-filter: var(--blur-scrim);
    z-index: 900;
    animation: fc-scrim-in 150ms ease-out;
  }
  @keyframes fc-scrim-in { from { opacity: 0; } to { opacity: 1; } }
</style>
```

---

## Modal

**Purpose.** Focused dialog for decisions, confirmations, and rich content that interrupts the main flow. Always sits on top of a Scrim.

**Variants / props.**

| Prop | Values |
|---|---|
| `Device` | `Mobile`, `Desktop` |
| `Color` | `Grey Blue 900`, `Grey Blue 800`, `Grey Blue 500` |
| `Footer Layout` | `Vertical`, `Horizontal` |
| `Background Blur` (bool) | blur the scrim below |
| `Illustration` (bool) | show illustration slot |
| `Footer` (bool) | show footer at all |
| `Primary CTA`, `Secondary CTA` (bool) | toggle each footer button |
| `Second slot` (bool) | show second body slot |
| `Header` (text) | title |
| `Subheader` (text) | supporting text |

**Anatomy.** Illustration slot (optional) → Header → Subheader → Slot content → second Slot content (optional) → Footer (primary/secondary CTAs, vertical or horizontal).

**Token usage.**
- Surface bg per `Color`:
  - `Grey Blue 900` → `--color-bg-surface-900`
  - `Grey Blue 800` → `--color-bg-surface-800`
  - `Grey Blue 500` → `--color-bg-surface-500`
- Header: `--color-text-primary`
- Subheader: `--color-text-secondary`
- Radius: `--radius-lg`
- Footer gap: `--space-sm`

**Rules.**
- Pair **every** Modal with a Scrim. Never render a Modal without one.
- `Footer Layout=Horizontal` is Desktop-only. Mobile must use `Vertical`. `[confirm with design]`
- When both CTAs are shown, **primary goes on the right (Horizontal) or on top (Vertical)**. `[confirm with design]`
- ESC should dismiss the Modal. Focus must be trapped inside it while open.
- Scrim click dismisses the Modal **unless** the Modal represents a destructive or required decision.

**Do / Don't.**
- ✅ Do label the Modal's dialog role and bind `aria-labelledby` to the header.
- ❌ Don't stack Modals. If a second decision is needed, replace the first or use a Bottom Sheet.
- ❌ Don't put long-scrolling content inside a Modal — use a full-screen view.

**Example markup.**

```html
<div class="fc-scrim" aria-hidden="true"></div>
<div role="dialog" aria-modal="true" aria-labelledby="modal-title"
     class="fc-modal" data-device="desktop" data-color="Grey Blue 900" data-footer="Horizontal">
  <img class="fc-modal__illus" src="/illus/rewards.svg" alt="">
  <h2 id="modal-title" class="fc-modal__header">Confirm payout</h2>
  <p class="fc-modal__sub">You'll receive $12.40 to your connected PayPal within 24 hours.</p>

  <div class="fc-modal__footer">
    <button class="fc-btn" data-variant="secondary" data-sub="green" data-size="md">Cancel</button>
    <button class="fc-btn" data-variant="primary"   data-sub="green" data-size="md">Confirm</button>
  </div>
</div>

<style>
  .fc-modal {
    position: fixed; inset: 50% auto auto 50%; transform: translate(-50%, -50%);
    max-width: 440px; width: calc(100% - var(--space-lg) * 2);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    display: flex; flex-direction: column; gap: var(--space-md);
    z-index: 1000;
  }
  .fc-modal[data-color="Grey Blue 900"] { background: var(--color-bg-surface-900); }
  .fc-modal[data-color="Grey Blue 800"] { background: var(--color-bg-surface-800); }
  .fc-modal[data-color="Grey Blue 500"] { background: var(--color-bg-surface-500); }
  .fc-modal__header { font: var(--font-display-xs); color: var(--color-text-primary); margin: 0; }
  .fc-modal__sub    { font: var(--font-body-m-regular); color: var(--color-text-secondary); margin: 0; }
  .fc-modal__footer { display: flex; gap: var(--space-sm); justify-content: flex-end; }
  .fc-modal[data-footer="Vertical"] .fc-modal__footer { flex-direction: column-reverse; }
</style>
```

---

## Bottom Sheet

**Purpose.** Mobile-first sheet that slides up from the bottom edge. Used for selections, supplemental actions, and medium-weight content. Paired with a Scrim.

**Variants / props.**

| Prop | Values |
|---|---|
| `Type` | `Draggable`, `Floating`, `Fixed Height` |
| `Header` (text) | title |
| `Subheader` (text) | supporting text |
| `Microcopy` (text) | tertiary hint line |
| `Show Header`, `Show Subheader`, `Show Microcopy` (bool) | per-line toggles |
| `Show Header Slot`, `Header Slot` | custom header slot (overrides text header) |
| `Show slot 2`, `Slot 2` | secondary content slot |
| `Show Slot 1`, `Slot 1` | primary content slot |
| `Show Footer`, `Show CTAs`, `Show Primary CTA`, `Show Secondary CTA` (bool) | footer controls |

**Anatomy.** Optional drag handle (`Draggable`) → Header area (Header / Subheader / Microcopy or custom slot) → Slot 1 → Slot 2 → Footer (Primary + Secondary CTAs).

**Token usage.**
- Sheet bg: `--color-bg-surface`
- Top corners radius: `--radius-lg` (bottom edges flush with viewport)
- Drag handle: `--color-border-default`
- Header, Subheader, Microcopy: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- Footer follows standard Button tokens

**Rules.**
- `Draggable` = user can dismiss by dragging; `Fixed Height` = no drag, no programmatic resize; `Floating` = detached from bottom edge with margin.
- Pair with a Scrim. Tapping the Scrim dismisses `Draggable` and `Floating` sheets.
- Keep the content above the fold on standard phone heights (iPhone SE baseline). Long lists get their own screen.
- The `Microcopy` line should be used sparingly — it's the third line in the header stack and risks visual clutter.

**Do / Don't.**
- ✅ Do include a drag handle on `Draggable` so users know it can be dismissed that way.
- ❌ Don't put destructive primary actions as the only CTA without a safe escape.
- ❌ Don't use Bottom Sheet on desktop — use Modal instead. `[confirm with design]`

**Example markup.**

```html
<div class="fc-scrim" aria-hidden="true"></div>
<section role="dialog" aria-modal="true" aria-labelledby="sheet-title"
         class="fc-bottom-sheet" data-type="Draggable">
  <div class="fc-bottom-sheet__handle" aria-hidden="true"></div>
  <header class="fc-bottom-sheet__header">
    <h2 id="sheet-title">Choose payout method</h2>
    <p class="fc-bottom-sheet__sub">Payouts arrive within 24 hours.</p>
  </header>

  <div class="fc-bottom-sheet__slot">
    <!-- Slot 1 content -->
  </div>

  <footer class="fc-bottom-sheet__footer">
    <button class="fc-btn" data-variant="secondary" data-sub="green" data-size="md">Cancel</button>
    <button class="fc-btn" data-variant="primary"   data-sub="green" data-size="md">Continue</button>
  </footer>
</section>

<style>
  .fc-bottom-sheet {
    position: fixed; left: 0; right: 0; bottom: 0;
    padding: var(--space-md) var(--space-md) calc(var(--space-md) + env(safe-area-inset-bottom));
    background: var(--color-bg-surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: flex; flex-direction: column; gap: var(--space-md);
    z-index: 1000;
  }
  .fc-bottom-sheet[data-type="Floating"] {
    left: var(--space-sm); right: var(--space-sm); bottom: var(--space-sm);
    border-radius: var(--radius-lg);
  }
  .fc-bottom-sheet__handle {
    width: 40px; height: 4px; border-radius: 2px;
    background: var(--color-border-default);
    margin: 0 auto;
  }
  .fc-bottom-sheet__header h2 { font: var(--font-body-l-semibold); color: var(--color-text-primary); margin: 0; }
  .fc-bottom-sheet__sub { font: var(--font-body-s-regular); color: var(--color-text-secondary); margin: var(--space-xxs) 0 0; }
  .fc-bottom-sheet__footer { display: flex; gap: var(--space-sm); }
  .fc-bottom-sheet__footer .fc-btn { flex: 1; }
</style>
```

---

## Not yet documented (flagged during scope review)

These components exist in the Figma file and appear V1-relevant, but weren't on the original scope list. Ask to add any of these and I'll extend this file:

- `Input field` (18 variants) — form inputs
- `Special Tag` — used inside Offer Cards
- `Code Tag` — promo code chip (already referenced from Cashback)
- `Section Headline` — section headers with optional CTA
- `Information box` — inline info / alert
- `Hint Content` — one-line / multi-line helper text
- `Footer Link` — the other "Accordion-like" expanding component (footer-specific)

## Token coverage — gaps to close in `tokens.md`

If any of the tokens referenced above don't yet exist in `tokens.md`, they need to be added before this file is fully usable. Known likely gaps (worth verifying):

- `--color-reward-gold-bg`, `--color-reward-bronze-bg` (likely gradients)
- `--color-utility-on-dark-bg`, `--color-utility-on-light-bg`
- `--color-scrim`, `--blur-scrim`
- `--color-nav-selected-indicator`
- `--color-bg-surface-900`, `--color-bg-surface-800`, `--color-bg-surface-500` (Modal color variants)
- `--color-icon-lottery`, `--color-icon-streak`
- `--color-tag-code-bg`, `--color-tag-code-fg`
- `--radius-pill` (for chip-shaped components)
