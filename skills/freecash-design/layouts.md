# Freecash Layouts

## How to use this file

This file documents the page-level layout patterns for Freecash's five core navigation destinations. It answers: *"When someone asks for the Earn screen, what is the vertical stack of sections, how are they spaced, and what stays fixed when you scroll?"* It does **not** re-document the components those sections contain — for that, use `components.md`. Spacing, color, and radius references here all point to tokens in `tokens.md`.

Use this file when:
- Generating a full screen from a prompt like "build the Cashout page"
- Composing a new screen that should feel consistent with the core five
- Deciding what goes above-the-fold on any page-level output
- Wiring up bottom-nav active state for any screen

Every layout in this file shares a three-region skeleton: a **fixed Header** at top (status bar + balance bar), a **scrolling Body** in the middle, and a **fixed Bottom TabBar** at the base. Only the Body changes meaningfully between layouts.

Each layout entry covers: purpose, entry point, viewport, vertical stack, spacing rhythm, what's fixed vs scrolling, state variations, layout-specific rules, and a minimal HTML skeleton.

When in doubt, prefer patterns documented here over inventing new ones. Any section or pattern tagged `[candidate for components.md V1.1]` is a repeating pattern seen in the Figma that should be promoted to a real component in the next iteration.

---

## Quick index

| Screen | Frame (Figma) | Active tab | Body-scroll height* | Hero pattern |
|---|---|---|---|---|
| Earn | `Earn` | `Earn` | ~2334px | CashoutProgress bar |
| Deals | `Deals - Cashback` / `Deals - Gift Cards` | `Deals` | ~2901px | Sub-tabs + AI search |
| My Offers | `My Offers` | `My Offers` | ~2151px | Horizontal Menu + active-offers Bubbles |
| Cashout | `Cashout` | `Cashout` | ~1014px | Horizontal Menu + Balance container |
| Quests | `Quests` | `Quests` | ~830px | (No hero — straight to list) |

*Body-scroll height is the total vertical content inside the scrolling region in the canonical "expanded" frame. The visible viewport is always 844px regardless.

All screens render in a **390×844** viewport (iPhone portrait, safe-area–aware). All use the same dark background token.

---

## Bottom navigation

The bottom nav is present on every screen in this file. It is the single persistent piece of chrome across the app's core experience, so all five layouts assume it and reserve space for it at the bottom of the viewport.

### Component

- **Name in Figma:** `Bottom TabBar`
- **Type:** `COMPONENT_SET` — a single set with 5 variants, not 5 separate components.
- **Source file:** Design System library (`https://www.figma.com/design/Q93Z0XEmvjBhIAwIGp1Gqp/Design-System`), node `1187:7357`, component key `9a969605f187478cddd2c1f23138a64f44f07cd7`.
- **Variants (property `Item`):** `Earn` (default), `Deals`, `My Offers`, `Cashout`, `Quests`. Each variant pre-selects the matching tab's `Selected=True` state — all others render `Selected=False`.
- **Boolean property:** `Show Home Indicator` — toggles the iOS home-indicator bar below the tabs. Default `true`.

Internally each tab is its own component, `Bottom Nav / Tab`, with its own `Selected: True | False` variant. Each tab exposes three swappable/toggled properties:

- `icon active` (INSTANCE_SWAP) — the glyph shown when selected.
- `icon_inactive` (INSTANCE_SWAP) — the glyph shown when unselected.
- `Show Highlight` (BOOLEAN, default `false`) — toggles a notification badge (see **Badges and notifications** below).

The icons themselves are drawn from a dedicated `navigation icons` component set, variant property `Type` with values `Earn | Deals | My offers | Cashout | Quests`.

> ⚠️ **Known label inconsistency:** inside the `navigation icons` component set, the My Offers variant is spelled `"My offers"` (lowercase "o"), while the `Bottom TabBar` `Item` variant is `"My Offers"` (title case) and the visible label text is `"My Offers"`. This is a Figma-internal mismatch only — the user-facing label is always `"My Offers"`. `[flag to design system: align the variant casing]`

### Tabs — order and labels

The bar contains exactly five tabs, in this left-to-right order:

1. **Earn**
2. **Deals**
3. **My Offers**
4. **Cashout**
5. **Quests**

Order is fixed. Adding, removing, or reordering tabs is out of scope for V1.

### Per-tab icon and label

Labels are always the same five strings: `"Earn"`, `"Deals"`, `"My Offers"`, `"Cashout"`, `"Quests"`. Label typography (all tabs, both states):

- Font: **Poppins SemiBold 600**, **10px**, line height **14px**, letter spacing **0**, text-align center. `[confirm token names with tokens.md — this string is already fully bound to variables in Figma]`

Icons are custom vectors drawn from the `navigation icons` component set — one `Type` per tab. They are 24×24 inside a square slot. Exact SVG paths live in the library's `navigation icons` component. When an icon needs to be used outside the Bottom TabBar (e.g. for a deep-link promo), pull the corresponding `Type` variant from that set rather than redrawing.

### States

Each tab has two states driven by the `Selected` property on `Bottom Nav / Tab`. The parent `Bottom TabBar` variant (`Item`) automatically flips the correct tab to `Selected=True` and leaves the other four at `Selected=False`.

**Inactive (`Selected=False`)** — the four non-current tabs:

- Icon fill: `color.text.muted` (rgb `#7D7D9E` in design, bound to `VariableID:8:1839`)
- Label fill: same `color.text.muted`
- No background glow

**Active (`Selected=True`)** — the one current tab:

- Icon fill: `color.brand.success` (rgb `#01D676`, bound to `VariableID:8:1833`)
- Label fill: `color.text.default` (white, bound to `VariableID:8:1947`) — **not** green. The icon goes green, the label goes white.
- Background glow: a 60×26 ellipse positioned behind the icon, filled `color.brand.success` at **20% opacity** with a **41px Layer Blur**. Reads as a soft green halo under the active icon. `[candidate for tokens.md — "tab.active.glow"]`

**Pressed / disabled / loading:** not defined as named variants in the library and not required for V1.1. Implementations should handle these via standard platform affordances (e.g. press opacity, disabled dimming) rather than dedicated component variants.

> ℹ️ Token names in this file (`color.text.muted`, `color.brand.success`, `color.text.default`) are inferred from the Figma variable bindings. Replace with the canonical names from `tokens.md` once finalized.

### Height and positioning rules

- **Total height:** 94px (73px tab row + 21px iOS Home Indicator) when `Show Home Indicator=true`. Collapses to 73px when `Show Home Indicator=false`. V1 targets iOS only; Android variants are out of scope for now.
- **Tab row:** full-width horizontal flex, 5 tabs each with `layoutGrow: 1` → each tab gets exactly 1/5 of the available width (78px at 390px viewport).
- **Each tab internally:** vertical stack, center-aligned, 15.5px top/bottom padding, 4px gap between icon and label. `[confirm token names with tokens.md]`
- **Container fill:** `color.surface.nav` (rgb `#1D1E30`, bound to `VariableID:8:1845`) — a solid dark surface, no border, no top shadow. `[confirm token name with tokens.md]`
- **Position:** fixed to the bottom edge of the viewport, full width (390px at iPhone reference).
- **Safe area:** the 21px home-indicator strip is the iOS safe-area inset. On Android or non-home-indicator contexts, disable the embedded `Home Indicator` and apply the platform's native safe-area padding instead. `[from team rules — verify]`
- **Never obscured:** no screen content should render on top of the tab bar. The scrolling Body must end at least 94px before the viewport bottom (or apply bottom padding equal to the tab-bar height).

### Badges and notifications

Badges are supported per-tab via the `Show Highlight` boolean property on each `Bottom Nav / Tab`.

- **Default:** hidden (`Show Highlight=false`).
- **When enabled:** a 16×16 circle anchored at the top-right of the icon, filled `color.brand.success` (same green as the active icon), with a 10/Poppins SemiBold 600 numeric label inside in black (`#000`). The number is editable per instance.
- **Use case:** surface unread/new counts (e.g. "2 new offers on My Offers").
- **Multi-tab behavior:** any combination of tabs can show highlights simultaneously. There's no mutual exclusivity.
- **Dot-only vs numeric:** the library ships the numeric variant only. A pure dot (no number) would be a new variant. `[candidate for design system V1.1 — dot badge]`

### Example markup

```html
<nav class="bottom-tab-bar"
     data-component="Bottom TabBar"
     data-active="Earn"
     data-show-home-indicator="true">
  <!-- 73px tab row, 5 tabs each 1/5 width -->
  <ul class="bottom-tab-bar__items">
    <li class="bottom-tab-bar__item"
        data-tab="Earn"
        data-selected="true"
        aria-current="page">
      <!-- Soft green glow behind the icon (Selected=True only) -->
      <span class="bottom-tab-bar__glow" aria-hidden="true"></span>
      <!-- 24×24 icon slot, Type=Earn -->
      <span class="bottom-tab-bar__icon" data-icon-type="Earn"></span>
      <span class="bottom-tab-bar__label">Earn</span>
      <!-- Optional highlight badge -->
      <span class="bottom-tab-bar__highlight" hidden>2</span>
    </li>
    <li class="bottom-tab-bar__item" data-tab="Deals" data-selected="false">…</li>
    <li class="bottom-tab-bar__item" data-tab="My Offers" data-selected="false">…</li>
    <li class="bottom-tab-bar__item" data-tab="Cashout" data-selected="false">…</li>
    <li class="bottom-tab-bar__item" data-tab="Quests" data-selected="false">…</li>
  </ul>
  <!-- 21px safe-area home indicator, iOS only -->
  <div class="bottom-tab-bar__home-indicator" aria-hidden="true"></div>
</nav>
```

---

## Earn

The home-base destination for all earning activities — the screen users land on after login.

### 1. Name
`Earn` (canonical: `13006:15119`). Full-scroll reference frame: `Earn (expanded)` (`13002:8755`). Both frames have identical content; `Earn (expanded)` is a taller canvas rendering the full scrolled body flattened for review.

### 2. Purpose
Give the user immediate visibility into their cashout progress, then offer a stacked feed of earning opportunities organized into themed sections (Best for You, plus further sections below).

### 3. Entry point
Bottom nav → **Earn** tab. Active tab on this screen: **`Earn`**.

### 4. Viewport
390 × 844 (iPhone portrait, mobile default).

### 5. Structure (top to bottom)

- **Header** (fixed, 108px)
  - `Status Bar` (iOS system bar, 44px)
  - `Header balance` (64px — balance display; see `components.md` [candidate for components.md V1.1 if not yet there])
- **Body** (scrolling, ~2334px of content)
  - `CashoutProgress` — "Next cashout" label + progress bar ($current / $threshold)
  - Section: **"Best for You"** — horizontal `Offer Card` carousel (Trophy icon + title)
  - Section: second themed section `[verify section title in Figma]`
  - Section: third themed section `[verify section title in Figma]`
  - Section: fourth themed section `[verify section title in Figma]`
  - Section: fifth themed section `[verify section title in Figma]`
  - Section: sixth themed section (~215px — shorter, likely a CTA/closer) `[verify section title in Figma]`
- **Bottom TabBar** (fixed, 94px, `Item="Earn"`)

### 6. Spacing rhythm

- **Horizontal page padding:** 16px (applied inside each Section, not on the Body). Section and Section container frames are 390px wide with 16px left/right padding.
- **Vertical gap between CashoutProgress and first Section:** 24px (CashoutProgress sits at y=20 inside Body; first Section at y=93 → gap ~24px after CashoutProgress' 49px height + its 8px internal gap).
- **Vertical gap between adjacent Sections:** 24px (Sections stack at 426px intervals for 402px-tall Sections).
- **Inside a Section:** 16px between Section title row and Cards row; 12px between cards in a horizontal carousel.
- **Top/bottom padding inside each Section:** 16px top, 16px bottom.

All spacing values above should resolve to tokens in `tokens.md` (e.g. `space.md` = 16, `space.lg` = 24, `space.sm` = 12) — `[confirm token names with tokens.md]`.

### 7. Fixed vs scrollable

- **Fixed:** `Header` (Status Bar + Header balance), `Bottom TabBar`.
- **Sticky:** `CashoutProgress` — sticks directly under the fixed `Header` while the rest of Body scrolls beneath it. The user's progress toward their next cashout stays continuously visible.
- **Scrolling:** everything else in `Body` (the stacked Sections).

### 8. State variations

The Example Screens file does not contain empty, loading, or error frames for Earn. Suggested V1.1 targets (not design-approved — proposed starting points only):
- **Loading:** skeleton placeholders for `Header balance` amount, CashoutProgress bar fill, and three or more card skeletons in the first Section carousel.
- **Empty:** unlikely — Earn is an always-populated feed server-side.
- **Error (feed failed to load):** retry state replacing the stack of Sections while keeping `Header` and `CashoutProgress` visible.

### 9. Rules

- `CashoutProgress` is always the first item inside Body, above all themed Sections. Do not interleave themed content above it.
- The **"Best for You"** section is always first and always a horizontal carousel (not a grid). This section is the personalized slot.
- Each themed Section carries its own title row (icon + title, 16/Poppins 600, white) and its own content row beneath.
- Never place a CTA button at the page level — all primary actions live inside Offer Cards.
- Bottom TabBar must have `Item="Earn"`.

### 10. Example markup

```html
<main class="screen" data-screen="Earn" style="width: 390px;">
  <!-- Fixed header (Status Bar + Header balance) -->
  <header class="screen__header" data-region="Header">
    <div data-component="Status Bar"></div>
    <div data-component="Header balance"></div>
  </header>

  <!-- Scrolling body -->
  <div class="screen__body" data-region="Body">
    <section data-component="CashoutProgress">
      <p>Next cashout</p>
      <div class="progress-bar" style="--fill: 25%;">
        <span>$5.00 / $20.00</span>
      </div>
    </section>

    <section data-section="Best for You">
      <header class="section__title">
        <!-- Trophy icon + title -->
        <span>Best for You</span>
      </header>
      <div class="section__cards section__cards--carousel">
        <article data-component="Offer Card">…</article>
        <article data-component="Offer Card">…</article>
      </div>
    </section>

    <!-- Repeat: five more Sections -->

  </div>

  <!-- Fixed bottom nav -->
  <nav data-component="Bottom TabBar" data-active="Earn"></nav>
</main>
```

---

## Deals

The marketplace for time-limited cashback and gift-card deals, organized into two co-equal sub-views via an in-page tab selector.

### 1. Name
Primary reference: `Deals - Cashback` (`13001:2098`) with full-scroll variant `Deals - Cashback (expanded)` (`13001:1305`). Paired sub-view: `Deals - Gift Cards` (`13001:3443`) with full-scroll variant `Deals - Gift Cards (expanded)` (`13001:3000`). Both sub-views share the same shell (Header, internal tabs, search bar, section stack, Bottom TabBar) — the sub-view choice changes the stack of `Section` frames, not the layout.

### 2. Purpose
Surface cashback deals (default) and gift-card deals in a single, tab-switchable screen, with a prominent search and a stacked feed of themed deal sections.

### 3. Entry point
Bottom nav → **Deals** tab. Active tab on this screen: **`Deals`**.

### 4. Viewport
390 × 844.

### 5. Structure (top to bottom)

- **Header** (fixed, 108px) — `Status Bar` + `Header balance`
- **Body** (scrolling, ~2901px on the Cashback expanded variant)
  - **Hero 1 — sub-tabs** (68px, 20px top / 12px bottom padding): two `tab_primary` pills in a row — **Cashback** and **Gift Cards**. One is active (green tint + green label), the other inactive (white outline). `[candidate for components.md V1.1 — "Sub-tab bar" pattern]`
  - **Hero 2 — AI search** (64px, 12px top / 12px bottom padding): search field with magnifying-glass icon, placeholder text (e.g. "Find the best price for iPhone"), and a trailing `Sparkle` (AI) icon indicating AI-assisted search. Fully-rounded `cornerRadius: 32`, dark fill, gradient stroke. `[candidate for components.md V1.1 — "AI Search Field"]`
  - Section: **"Special Deals"** (316px) — horizontal `Card` carousel (320×230), gradient-overlaid imagery, `Special Tag` with countdown ("Ends in 17h 16m"), dots pagination.
  - Section: **"Starter Bonus"** (212px) — horizontal carousel of `Cashback Bonus` cards (Get +$5 / +$2 / +$1 on 1st/2nd/3rd cashback), orange-gradient section background, gold trophy visual, dots pagination.
  - Section: **"Limited Deals"** (533px) — 2-column grid of smaller `Card` (173×228) with "View all" CTA in the header. Each card: image + gradient + `Special Tag` (yellow).
  - Section: fourth section `[verify section title in Figma]` (~324px)
  - Section: fifth section `[verify section title in Figma]` (~775px — tallest, likely a long-form list)
  - Section: sixth section `[verify section title in Figma]` (~609px)
- **Bottom TabBar** (fixed, 94px, `Item="Deals"`)

### 6. Spacing rhythm

- **Horizontal page padding:** 16px, applied inside each top-level region (both Heroes and each Section).
- **Gap between the two Heroes:** 0 (they are stacked directly; padding inside each Hero creates visual breathing room).
- **Gap between Hero 2 (search) and first Section:** effectively 0 — Section 1 begins immediately after the search bar, with Section 1's own 16px top padding providing separation.
- **Gap between adjacent Sections:** 0 — Sections stack flush; each Section's internal top/bottom padding (16px or 24px) produces the visual rhythm.
- **Inside "Special Deals" / "Starter Bonus" carousels:** 12px between cards.
- **Inside "Limited Deals" grid:** 12px between cards horizontally, 12px between rows.

### 7. Fixed vs scrollable

- **Fixed:** `Header` (Status Bar + Header balance), `Bottom TabBar`.
- **Sticky:** `Hero 1 (sub-tabs)` — the Cashback / Gift Cards selector sticks directly under the fixed `Header` while the rest of Body scrolls beneath it. `Hero 2 (AI search)` is **not** sticky; it scrolls away with content. This keeps the sub-view switch always one tap away while still allowing search to reclaim vertical space during browsing.
- **Scrolling:** Hero 2 (search) and all Sections.

### 8. State variations

No dedicated loading, empty, or error frames in the Example Screens file. Sensible defaults for V1.1 (not design-approved — proposed starting points only):
- **Loading:** Hero 1 and Hero 2 render immediately; Sections display card skeletons.
- **Empty search:** a "No deals match your search" card in place of the first Section when the search field has text.
- **Gift Cards tab active:** same layout, different Section contents; sub-tab active state flips.

### 9. Rules

- Hero 1 (sub-tabs) is always the first item in Body. The two options are always **Cashback** (default active) and **Gift Cards** — in that order.
- Hero 2 (AI search) always sits directly below Hero 1. The search is global to the active sub-tab (Cashback search searches cashback deals; Gift Cards search searches gift cards).
- **Boosted / time-limited deals always appear in Section 1 ("Special Deals")** above the fold — users must see at least one time-limited offer without scrolling when the screen mounts. `[from team rules — verify]`
- "View all" CTAs appear only on Sections where the full inventory exceeds what's shown inline (observed on "Limited Deals").
- Bottom TabBar must have `Item="Deals"`.

### 10. Example markup

```html
<main class="screen" data-screen="Deals" style="width: 390px;">
  <header class="screen__header" data-region="Header">
    <div data-component="Status Bar"></div>
    <div data-component="Header balance"></div>
  </header>

  <div class="screen__body" data-region="Body">
    <!-- Hero 1: Sub-tabs -->
    <div data-pattern="Sub-tab bar" role="tablist">
      <button data-component="tab_primary" role="tab" aria-selected="true">Cashback</button>
      <button data-component="tab_primary" role="tab" aria-selected="false">Gift Cards</button>
    </div>

    <!-- Hero 2: AI search -->
    <div data-pattern="AI Search Field">
      <span class="icon-magnifying-glass"></span>
      <input type="search" placeholder="Find the best price for iPhone" />
      <span class="icon-sparkle" aria-label="AI-assisted search"></span>
    </div>

    <!-- Sections -->
    <section data-section="Special Deals">
      <header class="section__title">Special Deals</header>
      <div class="section__cards section__cards--carousel">
        <article data-component="Card">…</article>
        <article data-component="Card">…</article>
      </div>
      <div class="section__pagination" aria-hidden="true">● ○ ○ ○</div>
    </section>

    <section data-section="Starter Bonus">
      <header class="section__title">Starter Bonus</header>
      <!-- Cashback Bonus cards carousel -->
    </section>

    <section data-section="Limited Deals">
      <header class="section__title">
        <span>Limited Deals</span>
        <a class="section__cta" href="#">View all ›</a>
      </header>
      <div class="section__cards section__cards--grid" data-cols="2">
        <!-- Card × 6 -->
      </div>
    </section>

    <!-- …further Sections -->
  </div>

  <nav data-component="Bottom TabBar" data-active="Deals"></nav>
</main>
```

---

## My Offers

The user's personal view of active, in-progress, and completed earning activities across all offer types.

### 1. Name
`My Offers` (`13008:20901`). Full-scroll reference frame: `My Offers (expanded)` (`13006:18038`).

### 2. Purpose
Give the user a single place to track offers they've started — filtered by category — with a quick-access row of their most recent or active offers, then a detailed list below.

### 3. Entry point
Bottom nav → **My Offers** tab. Active tab on this screen: **`My Offers`**.

### 4. Viewport
390 × 844.

### 5. Structure (top to bottom)

- **Header** (fixed, 108px) — `Status Bar` + `Header balance`
- **Body** (scrolling, ~2151px)
  - **Horizontal Menu** (56px, 20px top padding, 16px horizontal padding, 16px item spacing): five `tab_primary` category filter pills — **Earn** (active, green), **Cashback**, **Surveys**, **Rewards**, **Referrals**. Horizontally scrollable if content overflows.
  - **Bubbles** (132px, 20px top/bottom padding, 16px horizontal padding, 16px item spacing): horizontal row of `Offer` pips — 70×70 rounded game/offer icons with a 12px corner radius, a 76×76 green `Stroke` ring, and a 10/Poppins 500 label below ("Monopoly Go!", "Board of Kings", etc.). First pip full opacity (currently-active offer), subsequent pips at 30% opacity and muted-color label (inactive/paused offers). Horizontally scrollable. `[candidate for components.md V1.1 — "Offer Pip" or "Active Offer Bubble"]`
  - **Offer Details** (~1963px): a tall vertical stack of detailed offer rows/cards — the primary content region. Exact row component `[verify in Figma — likely an "Offer Row" or "Offer List Item" pattern]`.
- **Bottom TabBar** (fixed, 94px, `Item="My Offers"`)

### 6. Spacing rhythm

- **Horizontal page padding:** 16px, applied inside each region (Horizontal Menu, Bubbles, Offer Details).
- **Gap Horizontal Menu → Bubbles:** 0 (Bubbles has its own 20px top padding).
- **Gap Bubbles → Offer Details:** 0 (Offer Details continues from the bottom of Bubbles' 20px bottom padding).
- **Inside Horizontal Menu:** 16px between pills.
- **Inside Bubbles:** 16px between pips; 8px vertical gap between pip image and label.
- **Inside Offer Details:** `[verify with Figma — likely 12px between rows, to match other list patterns]`.

### 7. Fixed vs scrollable

- **Fixed:** `Header`, `Bottom TabBar`.
- **Sticky:** `Horizontal Menu` — the category filter sticks directly under the fixed `Header` while Bubbles and Offer Details scroll beneath it. The active category stays visible no matter how far down the user scrolls.
- **Scrolling:** Bubbles, Offer Details.
- **Horizontal scroll regions (internal):** Horizontal Menu (overflowing pills) and Bubbles (overflowing pips) both scroll horizontally within their own row, independently of page scroll.

### 8. State variations

No dedicated loading, empty, or error frames. Defaults for V1.1 (not design-approved — proposed starting points only):
- **Loading:** render Horizontal Menu immediately; show skeleton pips in Bubbles and skeleton rows in Offer Details.
- **Empty (no offers started):** replace Bubbles + Offer Details with a single empty-state card ("You haven't started any offers yet — head to Earn") that links back to the Earn tab. Keep Horizontal Menu rendered.
- **Filter yields empty:** category-specific empty state ("No Surveys in progress").

### 9. Rules

- The Horizontal Menu is always the first item in Body. Categories are always in this order: **Earn, Cashback, Surveys, Rewards, Referrals**.
- "Earn" is the default active category on first load. `[from team rules — verify]`
- The Bubbles row appears **only** when at least one offer is in progress. If all offers are completed/empty, hide the Bubbles row and promote Offer Details directly beneath the Horizontal Menu. `[from team rules — verify]`
- The first pip in Bubbles represents the most recently active or most-advanced offer (full opacity); subsequent pips represent other in-progress offers in the selected category (30% opacity to de-emphasize).
- Bottom TabBar must have `Item="My Offers"`.

### 10. Example markup

```html
<main class="screen" data-screen="My Offers" style="width: 390px;">
  <header class="screen__header" data-region="Header">
    <div data-component="Status Bar"></div>
    <div data-component="Header balance"></div>
  </header>

  <div class="screen__body" data-region="Body">
    <!-- Category filter pills -->
    <div data-pattern="Horizontal Menu" role="tablist">
      <button data-component="tab_primary" aria-selected="true">Earn</button>
      <button data-component="tab_primary">Cashback</button>
      <button data-component="tab_primary">Surveys</button>
      <button data-component="tab_primary">Rewards</button>
      <button data-component="tab_primary">Referrals</button>
    </div>

    <!-- Active offer bubbles -->
    <div data-pattern="Bubbles">
      <a data-pattern="Offer Pip" data-state="active">
        <img alt="" />
        <span>Monopoly Go!</span>
      </a>
      <a data-pattern="Offer Pip" data-state="inactive">
        <img alt="" />
        <span>Board of Kings</span>
      </a>
      <!-- …more pips -->
    </div>

    <!-- Offer rows -->
    <section data-region="Offer Details">
      <article data-component="Offer Row">…</article>
      <article data-component="Offer Row">…</article>
      <!-- …continues -->
    </section>
  </div>

  <nav data-component="Bottom TabBar" data-active="My Offers"></nav>
</main>
```

---

## Cashout

The withdrawal destination — where users turn their balance into payouts via their chosen cashout method.

### 1. Name
`Cashout` (`13010:5544`). Full-scroll reference frame: `Cashout (expanded)` (`13010:4201`).

### 2. Purpose
Let the user pick a cashout method (PayPal, gift cards, crypto, etc.) and initiate a withdrawal, with their current balance prominently displayed and their withdrawal history one tap away.

### 3. Entry point
Bottom nav → **Cashout** tab. Active tab on this screen: **`Cashout`**.

### 4. Viewport
390 × 844.

### 5. Structure (top to bottom)

- **Background decoration:** `Background Blur-Earnings-positive` — a 128×128 blurred vector shape behind the Balance area, layered between the top Header and Body content. Decorative only; pointer-events: none.
- **Top Header** (fixed, 108px) — `Status Bar` + `Header balance`
- **Body** (scrolling, ~1014px — shortest of the five screens)
  - **Horizontal Menu** (60px, 20px top / 12px bottom padding, 16px horizontal padding): two full-width-split `tab_primary` sub-tabs — **Cashout** (active, green) | **My Withdrawals**. Unlike other screens where Horizontal Menu is a scrollable filter row, here it's a **two-tab section switcher** that splits the width. `[candidate for components.md V1.1 — "Sub-tab bar (split)" variant of the sub-tab pattern also seen on Deals]`
  - **Balance container** (86px, centered): the primary balance display. Large amount, possibly with a USD/equivalent toggle. Sits over the `Background Blur-Earnings-positive` decoration. `[candidate for components.md V1.1 — "Balance hero"]`
  - **Cashout methods** (1014px): vertical stack of cashout-method cards/rows (PayPal, gift cards, crypto, etc.). Each row is tappable and leads into the method's flow. Exact row component `[verify in Figma — "Cashout Method Row"]`
- **Bottom TabBar** (fixed, 94px, `Item="Cashout"`)

### 6. Spacing rhythm

- **Horizontal page padding:** 16px, applied inside each region.
- **Top Header → Horizontal Menu:** 0 gap; Horizontal Menu's 20px top padding handles separation.
- **Horizontal Menu → Balance container:** 24px (Horizontal Menu ends at y=60 inside Body; Balance container starts at y=84).
- **Balance container → Cashout methods:** 24px (Balance ends at y=170; Cashout methods start at y=194).
- **Inside Cashout methods:** method-to-method spacing `[verify with Figma — likely 12px]`.

### 7. Fixed vs scrollable

- **Fixed:** `Header` (Status Bar + Header balance), `Bottom TabBar`.
- **Sticky:** `Horizontal Menu` — the Cashout / My Withdrawals sub-tab sticks directly under the fixed `Header`. The sub-view switch stays one tap away while the user scrolls the methods list (or the withdrawal history on the other sub-tab).
- **Scrolling:** Balance container, Cashout methods.

### 8. State variations

No dedicated loading, empty, or error frames. Required states for V1.1 (not design-approved — proposed starting points only):
- **Loading:** skeleton for Balance amount; skeleton rows for Cashout methods.
- **Below minimum balance (empty-to-cashout):** Cashout methods list renders with all primary CTAs disabled; a notice at the top of the methods list explains the minimum-balance requirement.
- **My Withdrawals sub-tab:** same shell (top Header, Horizontal Menu, Bottom TabBar). Balance container hides or becomes a smaller summary; Cashout methods list is replaced by a transaction history list.

### 9. Rules

- Balance container is always visible in the Cashout sub-tab (not in My Withdrawals).
- **Primary cashout CTA within each method row is disabled until the user's balance meets that method's minimum threshold.** Disabled state should communicate the gap to the threshold (e.g. "$5 more to cashout via PayPal"). `[from team rules — verify]`
- Users land on the **Cashout** sub-tab by default; **My Withdrawals** is never the default.
- The `Background Blur-Earnings-positive` decoration is tied to the Cashout sub-tab only; hide it on My Withdrawals.
- Bottom TabBar must have `Item="Cashout"`.

### 10. Example markup

```html
<main class="screen" data-screen="Cashout" style="width: 390px;">
  <!-- Decorative glow behind Balance -->
  <div class="screen__bg-decoration" data-component="Background Blur-Earnings-positive" aria-hidden="true"></div>

  <header class="screen__header" data-region="Header">
    <div data-component="Status Bar"></div>
    <div data-component="Header balance"></div>
  </header>

  <div class="screen__body" data-region="Body">
    <!-- Sub-tabs: Cashout | My Withdrawals -->
    <div data-pattern="Sub-tab bar" data-variant="split" role="tablist">
      <button data-component="tab_primary" role="tab" aria-selected="true">Cashout</button>
      <button data-component="tab_primary" role="tab" aria-selected="false">My Withdrawals</button>
    </div>

    <!-- Balance hero -->
    <section data-pattern="Balance hero">
      <span class="balance__amount">$5.00</span>
    </section>

    <!-- Methods -->
    <section data-region="Cashout methods">
      <article data-component="Cashout Method Row" data-method="paypal">…</article>
      <article data-component="Cashout Method Row" data-method="amazon-gift-card">…</article>
      <article data-component="Cashout Method Row" data-method="crypto">…</article>
      <!-- …continues -->
    </section>
  </div>

  <nav data-component="Bottom TabBar" data-active="Cashout"></nav>
</main>
```

---

## Quests

The gamified engagement layer — time-limited challenges with rewards, plus a prominent invite-friends promo.

### 1. Name
`Quests` (`13009:4313`). Full-scroll reference frame: `Quests (expanded)` (`13009:2581`).

### 2. Purpose
Show the user their current active quests (each with progress or a countdown) and a rotating promotional slot (e.g. Invite Friends), in a short, focused layout designed to drive action without competing with feed-heavy screens.

### 3. Entry point
Bottom nav → **Quests** tab. Active tab on this screen: **`Quests`**.

### 4. Viewport
390 × 844.

### 5. Structure (top to bottom)

- **Header** (fixed, 108px) — `Status Bar` + `Header balance`
- **Body** (scrolling, ~830px — by far the shortest). Body is full-width (390px); the 16px horizontal padding is applied inside each top-level child region, matching the other four screens.
  - **Quests section** (134px, 16px gap internal): Title row (nav icon + **"Quests"** in 18/Poppins 600, white) + `cases` — a vertical stack of quest `card`s (8px gap between cards). Each `card`:
    - Dark fill (`#252539`-ish), 8px corner radius, 0.5px translucent white border.
    - Content row: `Reward` pill (green-tint, $amount or 1/N progress) + description ("Install 3 apps, use them for 2 mins", 12/Poppins 400 white) + status text (right-aligned — either "X/N" progress or "HH:MM" countdown for timed quests).
    - Optional `Progress Bar` beneath Content (4px tall, green fill on green-10% track) for progress-based quests.
    - `[candidate for components.md V1.1 — "Quest Card"]`
  - **Container section — "Invite Friends"** (652px): Title row (Confetti icon + **"Invite Friends"** 18/Poppins 600 white + trailing info `Question` icon) + a single large `Banner` (610px, dark fill `#1D1D2E`, 12px radius, 12px padding):
    - Banner header: `Reward` pill ("$X" in green) + body copy ("Invite a friend!") + `Countdown` pill (hourglass icon + "7D").
    - Headline area: imagery banner (334×180, 8px radius), large headline ("Invite and get $X for each friend who installs a game! 🎉" — 20/Poppins 700 white, centered), and a body copy block (334×148, 80%-opacity dark fill, 16px padding).
    - Buttons row: three `button` elements — one full-width (334×48) above two half-width (159×42).
    - `[candidate for components.md V1.1 — "Promo Banner" or "Featured Quest Banner"]`
- **Bottom TabBar** (fixed, 94px, `Item="Quests"`)

### 6. Spacing rhythm

- **Horizontal page padding:** 16px, applied inside each top-level region (Quests section, Container section) — matches the other four screens.
- **Top Header → Quests section:** 20px (Quests section starts at y=20 inside Body).
- **Quests section → Container section:** 24px (inferred from the ~158px gap after the 134px Quests section — i.e. Quests ends at y=154; Container starts at y=178).
- **Inside Quests section:** 16px between Title row and cases; 8px between cards.
- **Inside Container section:** 16px between Title row and Banner; 12px gap inside Banner header row; 8px between Banner's internal children (header → container); 32px between the Banner's `Headline` area and its `Buttons` area; 16px between the three buttons.

### 7. Fixed vs scrollable

- **Fixed:** `Header`, `Bottom TabBar`.
- **Scrolling:** Quests section and Container section.
- **No sticky candidates:** the screen is short enough that stickiness isn't needed.

### 8. State variations

No dedicated loading, empty, or error frames. Defaults for V1.1 (not design-approved — proposed starting points only):
- **Loading:** skeleton quest cards (2–3) in Quests section; skeleton banner in Container section.
- **Empty (no quests available):** collapse the Quests section's `cases` to a single "No quests right now — check back soon" card; keep Container section rendered.
- **Promo rotation:** the Container section's "Invite Friends" is one of potentially multiple rotating promos. The containing pattern stays; only the Banner's imagery, copy, and CTAs swap.

### 9. Rules

- The **Quests section is always first** in Body (above the promo Container), even if the promo is more visually prominent. Quest engagement takes priority over promo engagement. `[from team rules — verify]`
- Each `Quest Card` must show either a progress indicator (X/N + progress bar) or a countdown — never both.
- The Container section promo always carries a `Reward` pill and a `Countdown` pill in its header to signal "this is time-limited and has value." Hide them only if both are structurally absent (e.g. evergreen promo).
- Bottom TabBar must have `Item="Quests"`.

### 10. Example markup

```html
<main class="screen" data-screen="Quests" style="width: 390px;">
  <header class="screen__header" data-region="Header">
    <div data-component="Status Bar"></div>
    <div data-component="Header balance"></div>
  </header>

  <div class="screen__body" data-region="Body">
    <!-- Quests section -->
    <section data-section="Quests">
      <header class="section__title">
        <span class="icon-navigation"></span>
        <span>Quests</span>
      </header>
      <ul class="cases">
        <li data-component="Quest Card" data-kind="progress">
          <div class="card__content">
            <span class="reward-pill">—</span>
            <span class="card__desc">Install 3 apps, use them for 2 mins</span>
            <span class="card__status">1/3</span>
          </div>
          <div class="progress-bar" style="--fill: 33%;"></div>
        </li>
        <li data-component="Quest Card" data-kind="countdown">
          <div class="card__content">
            <span class="reward-pill">$0.10</span>
            <span class="card__desc">Install 1 app within 10 minutes</span>
            <span class="card__status">09:48</span>
          </div>
        </li>
      </ul>
    </section>

    <!-- Promo (Invite Friends) -->
    <section data-section="Invite Friends">
      <header class="section__title">
        <span class="icon-confetti"></span>
        <span>Invite Friends</span>
        <span class="icon-question" aria-label="More info"></span>
      </header>

      <article data-component="Promo Banner">
        <header class="promo__header">
          <span class="reward-pill">$X</span>
          <span class="promo__eyebrow">Invite a friend!</span>
          <span class="countdown-pill">
            <span class="icon-hourglass"></span> 7D
          </span>
        </header>
        <div class="promo__headline">
          <div class="promo__image" aria-hidden="true"></div>
          <h2>Invite and get $X for each friend who installs a game! 🎉</h2>
          <p class="promo__body">…</p>
        </div>
        <div class="promo__buttons">
          <button class="button button--primary button--full">Invite friends</button>
          <button class="button button--secondary">Copy link</button>
          <button class="button button--secondary">Share</button>
        </div>
      </article>
    </section>
  </div>

  <nav data-component="Bottom TabBar" data-active="Quests"></nav>
</main>
```

---

## Appendix: Cross-cutting notes

A few patterns worth hardening before V2:

- **Header consistency:** all five screens use the same 108px top Header (44px Status Bar + 64px Header balance). This should be a single reusable `Screen Header` component in `components.md` V1.1, so screens compose it rather than rebuild it each time.
- **Horizontal Menu is doing two jobs.** On My Offers it's a **scrollable category filter** (5 pills). On Cashout it's a **fixed split sub-tab bar** (2 pills, each 50% width). These are different patterns that share a name in Figma. Split them into two components (`Category Filter` and `Sub-tab bar`) in V1.1. `[from team rules — verify]`
- **Deals' Hero 1 and Cashout's Horizontal Menu are the same underlying pattern** (split sub-tab bar, 2 options) even though the Figma frames are named differently. Unify in V1.1.
- **Sticky regions are common.** Four of the five screens sticky-pin something directly under the top Header: Earn (`CashoutProgress`), Deals (sub-tab bar), My Offers (Horizontal Menu), Cashout (Horizontal Menu). Quests is the exception — its body is short enough that nothing needs to stick. When composing a new screen that borrows one of these patterns, carry the stickiness with it.
- **No loading/empty/error frames exist** in the Example Screens file for any of the five screens — these states are not yet designed. V1.1 must add canonical loading, empty, and error states for each screen. Every layout in this file contains suggested defaults as starting points, but they are not design-approved.
- **Bottom nav:** now fully documented above from the Design System library. The component set lives at node `1187:7357` in `https://www.figma.com/design/Q93Z0XEmvjBhIAwIGp1Gqp/Design-System`. A small inconsistency remains in the `navigation icons` set — the My Offers variant is internally spelled `"My offers"` (lowercase "o"); the user-facing label is correctly `"My Offers"`. Worth cleaning up in the next design-system pass.

