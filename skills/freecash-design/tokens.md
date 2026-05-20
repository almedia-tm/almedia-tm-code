# Freecash Design System — V1 Tokens

**Source file:** Figma — `Design System` (`Q93Z0XEmvjBhIAwIGp1Gqp`)
**Extracted:** April 22, 2026
**Collections covered:** Color Primitives Token, Typography Token, Spacing, Corner Radius Token, Typography text styles.

---

## How to use

This file is the **source of truth** for Freecash V1 design tokens. Every value below was extracted verbatim from the Figma file — hex codes, pixel dimensions, font metrics, everything.

Rules:

1. **Never improvise values.** If a color, size, spacing, or radius isn't in this document, it doesn't exist in the design system — do not invent one. Ask a designer to add it first.
2. **Never approximate.** `#01D676` is not `#00D674` or `#02D677`. Copy-paste, don't retype from memory.
3. **Use the right layer.** Every token has two names:
   - **Figma variable name** (e.g. `Core/freecash-green/500`) — use when writing scripts that drive the Figma plugin API.
   - **CSS custom property** (e.g. `--color-freecash-green-500`) — use when generating HTML, React, or any web output.
4. **Primitives only (V1 scope).** This document captures the primitive palette and raw scales. A semantic layer (`--color-bg-primary`, `--color-text-muted`, etc.) exists in Figma as local styles but is not yet stable enough to ship — it is deliberately excluded. Consume primitives directly until the semantic layer is promoted.
5. **Deprecated or unpublished variables are not included.** If you find one in Figma that isn't here, treat it as not-for-production.

Open questions and gaps are listed in the final section — read them before building anything load-bearing.

---

## 1. Colors

The Color Primitives Token collection has a single mode (`Mode 1`), so all values below are mode-agnostic. The palette is organized into two families:

- **`Core/*`** — foundational palette. Brand green, base greys, and semantic-ish scales (red, yellow, blue) used as ingredients for status/feedback colors at the semantic layer.
- **`Highlight/*`** — accent palette. Used for marketing surfaces, illustrations, category tagging, and decorative moments.

Alpha variants (`*-A10`, `A-80`, `1000-A70`, etc.) are pre-baked at a specific opacity; hex codes are 8-digit (`#RRGGBBAA`).

### 1.1 Core — Freecash Green (brand)

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Core/freecash-green/25-A10` | `--color-freecash-green-25-a10` | `#01D6761A` | 10% alpha of green/500. Use for subtle brand tints. |
| `Core/freecash-green/50` | `--color-freecash-green-50` | `#EDFFF6` | Lightest tint. |
| `Core/freecash-green/100` | `--color-freecash-green-100` | `#D6FFEC` | |
| `Core/freecash-green/200` | `--color-freecash-green-200` | `#AFFFDA` | |
| `Core/freecash-green/300` | `--color-freecash-green-300` | `#71FFC0` | |
| `Core/freecash-green/400` | `--color-freecash-green-400` | `#2CFC9E` | |
| `Core/freecash-green/500` | `--color-freecash-green-500` | `#01D676` | **Brand anchor.** |
| `Core/freecash-green/600` | `--color-freecash-green-600` | `#00BF66` | |
| `Core/freecash-green/700` | `--color-freecash-green-700` | `#009653` | |
| `Core/freecash-green/800` | `--color-freecash-green-800` | `#067544` | |
| `Core/freecash-green/900` | `--color-freecash-green-900` | `#00361F` | Darkest shade. |

### 1.2 Core — Grey-Blue (neutrals with a cool cast)

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Core/grey-blue/25` | `--color-grey-blue-25` | `#CCCCDD` | |
| `Core/grey-blue/50` | `--color-grey-blue-50` | `#A9A9CA` | |
| `Core/grey-blue/100` | `--color-grey-blue-100` | `#7D7D9E` | |
| `Core/grey-blue/200` | `--color-grey-blue-200` | `#525266` | |
| `Core/grey-blue/300` | `--color-grey-blue-300` | `#33334D` | |
| `Core/grey-blue/400` | `--color-grey-blue-400` | `#2F3043` | |
| `Core/grey-blue/500` | `--color-grey-blue-500` | `#252539` | |
| `Core/grey-blue/600` | `--color-grey-blue-600` | `#212134` | |
| `Core/grey-blue/700` | `--color-grey-blue-700` | `#1D1E30` | |
| `Core/grey-blue/800` | `--color-grey-blue-800` | `#1E1E2E` | Near-duplicate of 700 — see §6. |
| `Core/grey-blue/900` | `--color-grey-blue-900` | `#141523` | |
| `Core/grey-blue/A-80` | `--color-grey-blue-a-80` | `#141523CC` | 80% alpha of grey-blue/900. Scrims/overlays. |

### 1.3 Core — Red

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Core/red/25-A10` | `--color-red-25-a10` | `#F043431A` | 10% alpha of red/500. |
| `Core/red/50` | `--color-red-50` | `#FEF2F2` | |
| `Core/red/100` | `--color-red-100` | `#FEE2E2` | |
| `Core/red/200` | `--color-red-200` | `#FECACA` | |
| `Core/red/300` | `--color-red-300` | `#FCA5A5` | |
| `Core/red/400` | `--color-red-400` | `#F97070` | |
| `Core/red/500` | `--color-red-500` | `#F04343` | |
| `Core/red/600` | `--color-red-600` | `#DE2C2C` | |
| `Core/red/700` | `--color-red-700` | `#BA1B1B` | |
| `Core/red/800` | `--color-red-800` | `#9A1A1A` | |
| `Core/red/900` | `--color-red-900` | `#7F1D1D` | |

### 1.4 Core — Yellow

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Core/yellow/25-A10` | `--color-yellow-25-a10` | `#ECC2061A` | 10% alpha of yellow/500. |
| `Core/yellow/50` | `--color-yellow-50` | `#FEFDE8` | |
| `Core/yellow/100` | `--color-yellow-100` | `#FFFEC2` | |
| `Core/yellow/200` | `--color-yellow-200` | `#FFF889` | |
| `Core/yellow/300` | `--color-yellow-300` | `#FFEB32` | |
| `Core/yellow/400` | `--color-yellow-400` | `#FDDD12` | |
| `Core/yellow/500` | `--color-yellow-500` | `#ECC206` | |
| `Core/yellow/600` | `--color-yellow-600` | `#CC9702` | |
| `Core/yellow/700` | `--color-yellow-700` | `#A36C05` | |
| `Core/yellow/800` | `--color-yellow-800` | `#86540D` | |
| `Core/yellow/900` | `--color-yellow-900` | `#724511` | |

### 1.5 Core — Blue

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Core/blue/25-A10` | `--color-blue-25-a10` | `#059FDB1A` | 10% alpha of blue/500. |
| `Core/blue/50` | `--color-blue-50` | `#E0F4FE` | |
| `Core/blue/100` | `--color-blue-100` | `#BBEAFC` | |
| `Core/blue/200` | `--color-blue-200` | `#7FD9FA` | |
| `Core/blue/300` | `--color-blue-300` | `#3AC7F6` | |
| `Core/blue/400` | `--color-blue-400` | `#11B1E6` | |
| `Core/blue/500` | `--color-blue-500` | `#059FDB` | |
| `Core/blue/600` | `--color-blue-600` | `#05719F` | |
| `Core/blue/700` | `--color-blue-700` | `#096083` | |
| `Core/blue/800` | `--color-blue-800` | `#0D506D` | |
| `Core/blue/900` | `--color-blue-900` | `#093348` | |

### 1.6 Core — Neutrals

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Core/neutral/0` | `--color-neutral-0` | `#FFFFFF` | Pure white. |
| `Core/neutral/0-A10` | `--color-neutral-0-a10` | `#FFFFFF1A` | 10% white — highlights on dark surfaces. |
| `Core/neutral/1000` | `--color-neutral-1000` | `#000000` | Pure black. |
| `Core/neutral/1000-A10` | `--color-neutral-1000-a10` | `#0000001A` | 10% black — subtle shadows/overlays. |
| `Core/neutral/1000-A70` | `--color-neutral-1000-a70` | `#000000B2` | 70% black — heavy scrims/modal backdrops. |

### 1.7 Core — Gold and Bronze

`[purpose unclear — confirm]` These 4 variables use capitalized names (`Core/Gold/*`, `Core/Bronze/*`) whereas the rest of the palette is lowercase. No scale — only 500 and 600 exist. Likely intended for tier/rank/achievement UI (leaderboards, medals), but not documented.

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Core/Gold/500` | `--color-gold-500` | `#FFE229` | `[purpose unclear — confirm]` |
| `Core/Gold/600` | `--color-gold-600` | `#B39A1E` | `[purpose unclear — confirm]` |
| `Core/Bronze/500` | `--color-bronze-500` | `#FF9829` | `[purpose unclear — confirm]` |
| `Core/Bronze/600` | `--color-bronze-600` | `#B3691E` | `[purpose unclear — confirm]` |

### 1.8 Highlight — Orange

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Highlight/orange/25-A10` | `--color-highlight-orange-25-a10` | `#FC84131A` | |
| `Highlight/orange/50` | `--color-highlight-orange-50` | `#FFF8ED` | |
| `Highlight/orange/100` | `--color-highlight-orange-100` | `#FFF0D5` | |
| `Highlight/orange/200` | `--color-highlight-orange-200` | `#FFDDA9` | |
| `Highlight/orange/300` | `--color-highlight-orange-300` | `#FFC472` | |
| `Highlight/orange/400` | `--color-highlight-orange-400` | `#FD9727` | |
| `Highlight/orange/500` | `--color-highlight-orange-500` | `#FC8413` | |
| `Highlight/orange/600` | `--color-highlight-orange-600` | `#ED6809` | |
| `Highlight/orange/700` | `--color-highlight-orange-700` | `#C44E0A` | |
| `Highlight/orange/800` | `--color-highlight-orange-800` | `#9C3D10` | |
| `Highlight/orange/900` | `--color-highlight-orange-900` | `#7D3411` | |

### 1.9 Highlight — Fuschia

Note: Figma spells it "fuschia" (with an s before c). The CSS property matches Figma for automation consistency — do not correct to "fuchsia" in output.

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Highlight/fuschia/25-A10` | `--color-highlight-fuschia-25-a10` | `#E533C91A` | |
| `Highlight/fuschia/50` | `--color-highlight-fuschia-50` | `#FFF4FE` | |
| `Highlight/fuschia/100` | `--color-highlight-fuschia-100` | `#FEE9FD` | |
| `Highlight/fuschia/200` | `--color-highlight-fuschia-200` | `#FCD2F8` | |
| `Highlight/fuschia/300` | `--color-highlight-fuschia-300` | `#F9AEEE` | |
| `Highlight/fuschia/400` | `--color-highlight-fuschia-400` | `#F47EE2` | |
| `Highlight/fuschia/500` | `--color-highlight-fuschia-500` | `#E533C9` | |
| `Highlight/fuschia/600` | `--color-highlight-fuschia-600` | `#CC2DAF` | |
| `Highlight/fuschia/700` | `--color-highlight-fuschia-700` | `#A9228E` | |
| `Highlight/fuschia/800` | `--color-highlight-fuschia-800` | `#8A1E73` | |
| `Highlight/fuschia/900` | `--color-highlight-fuschia-900` | `#711E5D` | |

### 1.10 Highlight — Blue-Ribbon

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Highlight/blue-ribbon/25-A10` | `--color-highlight-blue-ribbon-25-a10` | `#555BFF1A` | |
| `Highlight/blue-ribbon/50` | `--color-highlight-blue-ribbon-50` | `#ECF1FF` | |
| `Highlight/blue-ribbon/100` | `--color-highlight-blue-ribbon-100` | `#DDE5FF` | |
| `Highlight/blue-ribbon/200` | `--color-highlight-blue-ribbon-200` | `#C2D0FF` | |
| `Highlight/blue-ribbon/300` | `--color-highlight-blue-ribbon-300` | `#9CAFFF` | |
| `Highlight/blue-ribbon/400` | `--color-highlight-blue-ribbon-400` | `#7584FF` | |
| `Highlight/blue-ribbon/500` | `--color-highlight-blue-ribbon-500` | `#555BFF` | |
| `Highlight/blue-ribbon/600` | `--color-highlight-blue-ribbon-600` | `#3E36F5` | |
| `Highlight/blue-ribbon/700` | `--color-highlight-blue-ribbon-700` | `#352AD8` | |
| `Highlight/blue-ribbon/800` | `--color-highlight-blue-ribbon-800` | `#2B25AE` | |
| `Highlight/blue-ribbon/900` | `--color-highlight-blue-ribbon-900` | `#282689` | |

### 1.11 Highlight — Purple

Purple uses `25` (no `-A10` suffix) even though the hex is an alpha value (`#7469C21A`). Naming inconsistent with peers — see §6.

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Highlight/purple/25` | `--color-highlight-purple-25` | `#7469C21A` | **Is actually a 10% alpha value.** Naming is inconsistent. |
| `Highlight/purple/50` | `--color-highlight-purple-50` | `#E7EAF8` | |
| `Highlight/purple/100` | `--color-highlight-purple-100` | `#D3D7F2` | |
| `Highlight/purple/200` | `--color-highlight-purple-200` | `#B8BEE9` | |
| `Highlight/purple/300` | `--color-highlight-purple-300` | `#9C9EDD` | |
| `Highlight/purple/400` | `--color-highlight-purple-400` | `#8783D1` | |
| `Highlight/purple/500` | `--color-highlight-purple-500` | `#7469C2` | |
| `Highlight/purple/600` | `--color-highlight-purple-600` | `#6459A9` | |
| `Highlight/purple/700` | `--color-highlight-purple-700` | `#524A8A` | |
| `Highlight/purple/800` | `--color-highlight-purple-800` | `#45416E` | |
| `Highlight/purple/900` | `--color-highlight-purple-900` | `#292640` | |

### 1.12 Highlight — Grey

A second grey scale that coexists with `Core/grey-blue/*`. This one is neutral (no blue cast). See §6 — likely a warm/neutral grey for highlight/marketing surfaces vs. grey-blue's cool product surfaces, but confirm.

| Figma variable | CSS custom property | Hex | Notes |
|---|---|---|---|
| `Highlight/grey/25-A10` | `--color-highlight-grey-25-a10` | `#70737B1A` | |
| `Highlight/grey/50` | `--color-highlight-grey-50` | `#FAFAFA` | |
| `Highlight/grey/100` | `--color-highlight-grey-100` | `#F4F4F5` | |
| `Highlight/grey/200` | `--color-highlight-grey-200` | `#E4E5E7` | |
| `Highlight/grey/300` | `--color-highlight-grey-300` | `#D4D5D8` | |
| `Highlight/grey/400` | `--color-highlight-grey-400` | `#8F929C` | |
| `Highlight/grey/500` | `--color-highlight-grey-500` | `#70737B` | |
| `Highlight/grey/600` | `--color-highlight-grey-600` | `#51545C` | |
| `Highlight/grey/700` | `--color-highlight-grey-700` | `#3E4047` | |
| `Highlight/grey/800` | `--color-highlight-grey-800` | `#27282A` | |
| `Highlight/grey/900` | `--color-highlight-grey-900` | `#18191B` | |

---

## 2. Typography

Typography is split across two layers in Figma:

- **Atomic variables** (`Typography Token` collection) — font family, weights, sizes, line heights, letter spacing. These are responsive: the collection has `mobile` and `desktop` modes.
- **Composite text styles** (the `Typography/*` text styles) — named presets that combine size and weight. These are what designers actually apply in the file.

### 2.1 Font family

| Figma variable | CSS custom property | Value (mobile) | Value (desktop) |
|---|---|---|---|
| `font/family/typography` | `--font-family-typography` | `Poppins` | `Poppins` |

Stack fallback (suggested, not in Figma): `'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.

### 2.2 Font weights

| Figma variable | CSS custom property | Weight |
|---|---|---|
| `font/weight/regular` | `--font-weight-regular` | `400` |
| `font/weight/medium` | `--font-weight-medium` | `500` |
| `font/weight/semibold` | `--font-weight-semibold` | `600` |
| `font/weight/bold` | `--font-weight-bold` | `700` |

### 2.3 Font sizes (responsive)

| Figma variable | CSS custom property | Mobile | Desktop |
|---|---|---|---|
| `font/size/micro` | `--font-size-micro` | `10px` | `12px` |
| `font/size/xs` | `--font-size-xs` | `12px` | `14px` |
| `font/size/sm` | `--font-size-sm` | `14px` | `16px` |
| `font/size/md` | `--font-size-md` | `16px` | `18px` |
| `font/size/lg` | `--font-size-lg` | `18px` | `20px` |
| `font/size/xl` | `--font-size-xl` | `20px` | `24px` |
| `font/size/2xl` | `--font-size-2xl` | `24px` | `32px` |
| `font/size/3xl` | `--font-size-3xl` | `32px` | `40px` |
| `font/size/4xl` | `--font-size-4xl` | `40px` | `48px` |
| `font/size/5xl` | `--font-size-5xl` | `48px` | `56px` |

### 2.4 Line heights (responsive)

| Figma variable | CSS custom property | Mobile | Desktop |
|---|---|---|---|
| `font/lineHeight/micro` | `--font-line-height-micro` | `14px` | `20px` |
| `font/lineHeight/xs` | `--font-line-height-xs` | `20px` | `22px` |
| `font/lineHeight/sm` | `--font-line-height-sm` | `22px` | `24px` |
| `font/lineHeight/md` | `--font-line-height-md` | `24px` | `26px` |
| `font/lineHeight/lg` | `--font-line-height-lg` | `26px` | `28px` |
| `font/lineHeight/xl` | `--font-line-height-xl` | `28px` | `32px` |
| `font/lineHeight/2xl` | `--font-line-height-2xl` | `32px` | `40px` |
| `font/lineHeight/3xl` | `--font-line-height-3xl` | `40px` | `48px` |
| `font/lineHeight/4xl` | `--font-line-height-4xl` | `48px` | `56px` |
| `font/lineHeight/5xl` | `--font-line-height-5xl` | `56px` | `64px` |

### 2.5 Letter spacing (responsive)

All values are in pixels (use `em` equivalents if your build tool prefers; the raw source is `px`).

| Figma variable | CSS custom property | Mobile | Desktop |
|---|---|---|---|
| `font/letterSpacing/none` | `--font-letter-spacing-none` | `0px` | `0px` |
| `font/letterSpacing/xs` | `--font-letter-spacing-xs` | `-0.08px` | `-0.16px` |
| `font/letterSpacing/sm` | `--font-letter-spacing-sm` | `-0.16px` | `-0.24px` |
| `font/letterSpacing/md` | `--font-letter-spacing-md` | `-0.24px` | `-0.32px` |
| `font/letterSpacing/lg` | `--font-letter-spacing-lg` | `-0.32px` | `-0.40px` |
| `font/letterSpacing/xl` | `--font-letter-spacing-xl` | `-0.40px` | `-0.48px` |

### 2.6 Text styles — composite presets

These are the text styles designers apply in Figma. They combine one size and one weight from the atomic scales above. Family is always `Poppins`; sizes/line-heights are **responsive** (resolved from `mobile`/`desktop` modes). Letter spacing is not encoded per style in Figma's style definition — the variables above define the letter-spacing scale, but which style maps to which letter-spacing token is not explicitly declared. `[letter-spacing mapping unclear — confirm]` for all styles.

**Usage categories** are inferred from the naming convention (`micro`/`xs`/`sm` = UI & body; `md`/`lg` = body & subheadings; `xl`–`5xl` = headings; `button/*` = UI) and are proposals, not declarations from the Figma file.

| Figma style | CSS class suggestion | Font size (mobile / desktop) | Weight | Line height (mobile / desktop) | Category |
|---|---|---|---|---|---|
| `Typography/micro/regular` | `.text-micro-regular` | 10 / 12 | 400 | 14 / 20 | UI (captions, metadata) |
| `Typography/micro/medium` | `.text-micro-medium` | 10 / 12 | 500 | 14 / 20 | UI |
| `Typography/micro/semibold` | `.text-micro-semibold` | 10 / 12 | 600 | 14 / 20 | UI |
| `Typography/micro/bold` | `.text-micro-bold` | 10 / 12 | 700 | 14 / 20 | UI |
| `Typography/xs/regular` | `.text-xs-regular` | 12 / 14 | 400 | 20 / 22 | Body (small) |
| `Typography/xs/medium` | `.text-xs-medium` | 12 / 14 | 500 | 20 / 22 | Body (small) |
| `Typography/xs/semibold` | `.text-xs-semibold` | 12 / 14 | 600 | 20 / 22 | UI / emphasis |
| `Typography/xs/bold` | `.text-xs-bold` | 12 / 14 | 700 | 20 / 22 | UI / emphasis |
| `Typography/sm/regular` | `.text-sm-regular` | 14 / 16 | 400 | 22 / 24 | Body |
| `Typography/sm/medium` | `.text-sm-medium` | 14 / 16 | 500 | 22 / 24 | Body |
| `Typography/sm/semibold` | `.text-sm-semibold` | 14 / 16 | 600 | 22 / 24 | Body / emphasis |
| `Typography/sm/bold` | `.text-sm-bold` | 14 / 16 | 700 | 22 / 24 | Body / emphasis |
| `Typography/md/regular` | `.text-md-regular` | 16 / 18 | 400 | 24 / 26 | Body (default) |
| `Typography/md/medium` | `.text-md-medium` | 16 / 18 | 500 | 24 / 26 | Body |
| `Typography/md/semibold` | `.text-md-semibold` | 16 / 18 | 600 | 24 / 26 | Body / emphasis |
| `Typography/md/bold` | `.text-md-bold` | 16 / 18 | 700 | 24 / 26 | Body / emphasis |
| `Typography/lg/regular` | `.text-lg-regular` | 18 / 20 | 400 | 26 / 28 | Subheading / large body |
| `Typography/lg/medium` | `.text-lg-medium` | 18 / 20 | 500 | 26 / 28 | Subheading |
| `Typography/lg/semibold` | `.text-lg-semibold` | 18 / 20 | 600 | 26 / 28 | Subheading |
| `Typography/lg/bold` | `.text-lg-bold` | 18 / 20 | 700 | 26 / 28 | Subheading |
| `Typography/xl/regular` | `.text-xl-regular` | 20 / 24 | 400 | 28 / 32 | Heading (small) |
| `Typography/xl/medium` | `.text-xl-medium` | 20 / 24 | 500 | 28 / 32 | Heading |
| `Typography/xl/semibold` | `.text-xl-semibold` | 20 / 24 | 600 | 28 / 32 | Heading |
| `Typography/xl/bold` | `.text-xl-bold` | 20 / 24 | 700 | 28 / 32 | Heading |
| `Typography/2xl/regular` | `.text-2xl-regular` | 24 / 32 | 400 | 32 / 40 | Heading |
| `Typography/2xl/medium` | `.text-2xl-medium` | 24 / 32 | 500 | 32 / 40 | Heading |
| `Typography/2xl/semibold` | `.text-2xl-semibold` | 24 / 32 | 600 | 32 / 40 | Heading |
| `Typography/2xl/bold` | `.text-2xl-bold` | 24 / 32 | 700 | 32 / 40 | Heading |
| `Typography/3xl/regular` | `.text-3xl-regular` | 32 / 40 | 400 | 40 / 48 | Heading (large) |
| `Typography/3xl/medium` | `.text-3xl-medium` | 32 / 40 | 500 | 40 / 48 | Heading (large) |
| `Typography/3xl/semibold` | `.text-3xl-semibold` | 32 / 40 | 600 | 40 / 48 | Heading (large) |
| `Typography/3xl/bold` | `.text-3xl-bold` | 32 / 40 | 700 | 40 / 48 | Heading (large) |
| `Typography/4xl/regular` | `.text-4xl-regular` | 40 / 48 | 400 | 48 / 56 | Display |
| `Typography/4xl/medium` | `.text-4xl-medium` | 40 / 48 | 500 | 48 / 56 | Display |
| `Typography/4xl/semibold` | `.text-4xl-semibold` | 40 / 48 | 600 | 48 / 56 | Display |
| `Typography/4xl/bold` | `.text-4xl-bold` | 40 / 48 | 700 | 48 / 56 | Display |
| `Typography/5xl/regular` | `.text-5xl-regular` | 48 / 56 | 400 | 56 / 64 | Display (hero) |
| `Typography/5xl/medium` | `.text-5xl-medium` | 48 / 56 | 500 | 56 / 64 | Display (hero) |
| `Typography/5xl/semibold` | `.text-5xl-semibold` | 48 / 56 | 600 | 56 / 64 | Display (hero) |
| `Typography/5xl/bold` | `.text-5xl-bold` | 48 / 56 | 700 | 56 / 64 | Display (hero) |

**Button-only text styles** (Figma description: "Copy for button size X. Do not use for other purpose."):

| Figma style | CSS class suggestion | Values | Notes |
|---|---|---|---|
| `Typography/button/sm` | `.text-button-sm` | `[values not inspected — confirm in Figma]` | Button copy only. Not backed by a named size variable. |
| `Typography/button/md` | `.text-button-md` | `[values not inspected — confirm in Figma]` | Button copy only. Not backed by a named size variable. |
| `Typography/button/lg` | `.text-button-lg` | `[values not inspected — confirm in Figma]` | Button copy only. Not backed by a named size variable. |

---

## 3. Spacing

Single-mode collection. Linear-named (`spacing-01`…`spacing-14`) rather than semantic (`xs`/`sm`/`md`/…). The scale is **not** a strict 4pt or 8pt grid — it starts at 2px, uses 4pt increments up to 32px, then 8pt up to 48px, then doubles toward 64/80/96/160. See §6 for the gap between 96 and 160.

| Figma variable | CSS custom property | Value |
|---|---|---|
| `spacing-01` | `--spacing-01` | `2px` |
| `spacing-02` | `--spacing-02` | `4px` |
| `spacing-03` | `--spacing-03` | `8px` |
| `spacing-04` | `--spacing-04` | `12px` |
| `spacing-05` | `--spacing-05` | `16px` |
| `spacing-06` | `--spacing-06` | `20px` |
| `spacing-07` | `--spacing-07` | `24px` |
| `spacing-08` | `--spacing-08` | `32px` |
| `spacing-09` | `--spacing-09` | `40px` |
| `spacing-10` | `--spacing-10` | `48px` |
| `spacing-11` | `--spacing-11` | `64px` |
| `spacing-12` | `--spacing-12` | `80px` |
| `spacing-13` | `--spacing-13` | `96px` |
| `spacing-14` | `--spacing-14` | `160px` |

---

## 4. Radii

Single-mode collection. 8 steps including a pill-style 100px for full rounding.

| Figma variable | CSS custom property | Value | Typical use |
|---|---|---|---|
| `radius-01` | `--radius-01` | `4px` | Tight details, inline chips. |
| `radius-02` | `--radius-02` | `8px` | Inputs, small cards. |
| `radius-03` | `--radius-03` | `12px` | Cards, menus. |
| `radius-04` | `--radius-04` | `16px` | Large cards, modals. |
| `radius-05` | `--radius-05` | `20px` | Emphasis surfaces. |
| `radius-06` | `--radius-06` | `24px` | Hero surfaces. |
| `radius-07` | `--radius-07` | `32px` | Extra-large surfaces. |
| `radius-08` | `--radius-08` | `100px` | Pill shape (buttons, tags, avatars). Use for full-rounded, not a literal 100px corner. |

---

## 5. Shadows / elevation

**Omitted — the Figma file defines no shadow or elevation tokens.** There are no `EFFECT` styles and no variable collection for shadows. When shadow tokens are added to Figma, this section should be populated before the skill is updated.

---

## 6. Gaps, ambiguities, and inconsistencies

Every item below needs a design decision before V1 can be considered complete. Each is labeled with severity: 🔴 blocks confident use, 🟡 should be resolved soon, ⚪ informational.

### Missing that you'd expect in a V1 design system

- 🔴 **No semantic color layer shipped.** The primitive palette is all we have in V1. Common product tokens are absent at the token level: no `color-bg-default`, `color-bg-subtle`, `color-text-default`, `color-text-muted`, `color-text-inverse`, `color-border-default`, `color-border-strong`, `color-success`, `color-warning`, `color-danger`, `color-info`, `color-focus-ring`, `color-disabled-bg`, `color-disabled-text`. Implementers will pick primitives ad hoc, which will drift. A semantic layer exists in Figma as local styles (`System Colors (Utilities)/Surface/*` and `/Content/*`) but was judged not stable enough to ship — that decision means **implementation will diverge until the semantic layer lands.**
- 🔴 **No shadow / elevation tokens.** Any drop shadows, modal elevation, or card lift used in designs are currently one-off values, not tokens.
- 🟡 **No explicit focus-ring token** (outline color, outline width, offset). Accessibility-critical.
- 🟡 **No disabled-state tokens** (bg, text, border).
- 🟡 **No z-index / layer scale.**
- 🟡 **No motion tokens** (duration, easing). Common for V1s to defer, but worth a decision.
- 🟡 **No opacity scale** as a standalone token group — opacity is baked into color variants (`*-A10`, `A-80`, `A70`).
- ⚪ **No breakpoint tokens.** The `mobile`/`desktop` modes on Typography imply breakpoints exist conceptually, but the actual pixel thresholds are not encoded anywhere machine-readable. The Grid styles mention "1133px", "1440px", "1920px" in their descriptions — these should probably become breakpoint tokens.

### Ambiguities in what *is* there

- 🟡 **Mobile/desktop breakpoints undefined.** Typography has `mobile` and `desktop` modes, but no token tells a consumer at what viewport width to switch. Grid style descriptions hint at 1133/1440/1920 — needs to be declared.
- 🟡 **`Blur Token` collection contains exactly one variable.** Not documented above because a one-variable collection is almost certainly a placeholder, not a shipped token group. `[purpose unclear — confirm]`
- 🟡 **`Typography/button/*` styles have no backing variables.** Their size/line-height values aren't captured in this document because they'd have to be read from the style definitions themselves, which the extraction tools don't surface by default. Marked `[values not inspected — confirm in Figma]` for all three. Should be resolved before shipping.
- 🟡 **Text-style letter-spacing mapping is undeclared.** The variables `font/letterSpacing/xs`…`xl` exist but there's no explicit rule mapping which text style uses which. Currently implicit.
- 🟡 **`Highlight/purple/25` is named inconsistently with its peers.** Every other palette uses `-A10` suffix for 10%-alpha values (`Highlight/orange/25-A10`, `Highlight/fuschia/25-A10`, etc.), but purple uses bare `25`. The hex (`#7469C21A`) confirms it *is* a 10%-alpha value. Rename to `Highlight/purple/25-A10` for consistency.
- 🟡 **`Core/Gold/*` and `Core/Bronze/*` use PascalCase** while the entire rest of the palette is lowercase. Also the scale is incomplete (only 500 and 600). Either flesh out the scale or document that these are intentionally two-step accent colors for a specific use (ranks/tiers?).
- ⚪ **`Highlight/fuschia` is spelled nonstandardly** (correct English is "fuchsia"). If the plan is to ship this to a public-facing CSS API, the name will be visible to external developers. Worth a conscious decision.
- ⚪ **Two grey scales (`Core/grey-blue` and `Highlight/grey`).** Not necessarily a problem — cool-grey vs. neutral-grey is a legitimate split — but this is undocumented and will cause confusion about which to pick.
- ⚪ **`Core/grey-blue/700` (`#1D1E30`) and `/800` (`#1E1E2E`) are visually indistinguishable** (max ΔE channel difference: 2). One of them is likely vestigial.
- ⚪ **Spacing gap between 96px and 160px.** `spacing-13` is 96px, `spacing-14` is 160px. Missing 128px (common next step in a doubling progression). Intentional or oversight?
- ⚪ **`System Fonts/01`** text style doesn't follow the `Typography/<size>/<weight>` convention. Not included in this document — looks like legacy. Confirm it can be deleted.
- ⚪ **Spacing naming is non-semantic** (`spacing-01`…`14`). Readable but opaque at a glance — consumers can't guess from `spacing-07` whether it's tight or spacious without consulting this document. Consider aliasing to `xs`/`sm`/`md`/`lg`/… for the CSS custom properties in a future iteration.
