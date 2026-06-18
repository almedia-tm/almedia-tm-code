---
name: almedia-platform-design
description: Design and build UI for the Almedia advertiser platform — HTML mockups/prototypes, React components (Next + Tailwind + cn()), and a design-token/component reference. Figma (Core Design System + Guidelines files) is the source of truth; the design tokens + component reference are CACHED in this folder, so the skill runs with only the Figma MCP connected — no GitHub/repo access required. Use for any Almedia-platform design / build / mockup / prototype / component request, or turning a brief or notes into platform-accurate UI. Hybrid model — cached tokens/components live in this folder, with live-pull of Figma frames on demand.
---

# Almedia Platform Design

Produce **Almedia advertiser-platform-accurate** design output: HTML mockups, React components, and design ideation. Route between two modes like the Freecash skill: **ideation** (explore options) vs **execution** (build a known thing). Default to ideation when unsure — false starts are cheap, rendering the wrong thing is expensive.

## Requirements
- **Only the Figma MCP.** It must be connected (claude.ai → `/mcp` → Figma → authorize) and the user must have access to the Almedia design files (see `figma.md`). Nothing else is needed to run this skill.
- The cached `tokens.md` / `components.md` ship in this folder, so the skill is **self-contained** — it does **not** require the `advertiser-platform` repo or any GitHub access to produce output. (Not everyone has repo access; never assume it.)

## Source hierarchy — read this first
1. **Cached tokens/components (in this folder) = what you build from.** `tokens.md` + `components.md` are the on-brand source — self-contained, work offline, no repo needed. Prefer them for every output.
2. **Figma = source of truth + live reference.** For exact layout/spacing, net-new screens, or refreshing the cache, pull from Figma — see `figma.md`. ⚠️ The Figma MCP is **selection-bound** (reads the desktop app's current selection) and accounts may be a **View seat**: bulk remote traversal returns empty pages, so pull **node-specific links** (Figma → right-click → *Copy link to selection*) or have the user select the frame.
3. **The `advertiser-platform` repo is HIGHLY OPTIONAL** — tokens *and* component values are already inlined in `tokens.md` / `components.md`, so the repo adds nothing for normal use. It exists only as a maintainer cross-check for whoever happens to have access. Never make output depend on it; never ask the user for it.
4. **Never invent brand values.** If a value isn't in `tokens.md`, pull it from Figma — don't guess.

## Stack (reference knowledge — baked in, no repo needed; match it for React output)
- **Next.js 16 · React 19 · TypeScript · Tailwind 3.4**; class merging via `cn()` = `twMerge(clsx(...))`.
- Fonts: **Inter** (UI; `next/font/google`), **Lusitana** (serif accent; weights 400/700).
- `darkMode: 'class'`.

## Output modes
- **HTML mockup / prototype** — full standalone HTML artifact using the tokens (inline `<style>` or CDN Tailwind themed with `tokens.md`). Viewable at real viewport; best for fast ideation / stakeholder review.
- **React component** — Next/React + Tailwind using token classes + `cn()`; mirror the existing primitives in `app/components/ui` (`BasicCard`, `StatusMessage`, `Toast`, `Tooltip`, `UserAvatar`, the Badges…). **Reuse before reinventing.**
- **Tokens / component reference** — `tokens.md` + `components.md` are the cached source; refresh from Figma on request (maintainers with repo access may also cross-check the code).

## Ideation mode
Sequential, interactive: classify → intake (what surface, who's it for, constraints) → confirm → render 1–3 directions. Use the tokens and existing components for every direction. Offer an escape hatch to jump straight to execution.

## Execution mode
Skip ideation; normalize the brief; render in the requested output mode using the cache + existing primitives. Pull the specific Figma frame if pixel-exactness matters.

## Figma live-pull procedure (hybrid)
When a request references a specific frame or needs pixel-exact layout:
1. Obtain a node-specific URL (ask the user to *Copy link to selection*, or have them select it in Figma desktop). Extract `fileKey` + `nodeId`.
2. Call: `get_screenshot` (visual truth) · `get_design_context` (reference code/measurements — may be gated on a View seat; fall back to screenshot+metadata) · `get_variable_defs` (tokens used by that node) · `download_assets` (icons/images).
3. Translate to the platform stack (Tailwind + `cn()` + tokens) — do **not** paste raw Figma CSS.
4. Fold reusable findings back into `tokens.md` / `components.md`.

## Refresh procedure
- **Primary — Figma:** file keys + library key are in `figma.md`; use `search_design_system` scoped to the Almedia library key + node-specific pulls to update `tokens.md` / `components.md`.
- **Optional — repo (maintainers with access only):** cross-check against `advertiser-platform/frontend` (`tailwind.config.ts`, `global.css`, `app/ui/global.css`, `app/components/**`). Skip entirely if you don't have the repo — it is never required.

## Rules
- Match the platform's existing patterns (Tailwind + `cn()`, the primitives) — reuse before creating.
- HTML artifacts are full documents at real viewport, token-accurate.
- Note the platform's distinctive `font-normal = 350` (lighter than the usual 400).
- Don't guess brand values; pull from `tokens.md` or Figma (never depend on the repo).
