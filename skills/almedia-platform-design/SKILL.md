---
name: almedia-platform-design
description: Design and build UI for the Almedia advertiser platform — HTML mockups/prototypes, React components (Next + Tailwind + cn()), and a design-token/component reference. Source of truth is the advertiser-platform repo (tailwind.config.ts, global.css, app/components) for tokens/components/styling; Figma (Core Design System + Guidelines files) for visual reference and pulling specific frames. Use for any Almedia-platform design / build / mockup / prototype / component request, or turning a brief or notes into platform-accurate UI. Hybrid model — cached tokens/components live in this folder, with live-pull of Figma frames on demand.
---

# Almedia Platform Design

Produce **Almedia advertiser-platform-accurate** design output: HTML mockups, React components, and design ideation. Route between two modes like the Freecash skill: **ideation** (explore options) vs **execution** (build a known thing). Default to ideation when unsure — false starts are cheap, rendering the wrong thing is expensive.

## Source hierarchy — read this first
1. **Code = source of truth** — repo `advertiser-platform/frontend`. Tokens: `tailwind.config.ts` + `global.css` + `app/ui/global.css`. Components: `app/components/**` (reusable primitives in `app/components/ui`). The cache in `tokens.md` / `components.md` is extracted from these — prefer the cache, re-read the repo to refresh.
2. **Figma = visual reference** for exact layout/spacing and net-new screens — see `figma.md`. ⚠️ The Figma MCP here is **selection-bound** (reads the desktop app's current selection) and the account is a **View seat**: bulk remote traversal returns empty pages. You must pull **node-specific links** (Figma → right-click → *Copy link to selection*) or ask the user to select the frame, then call the node-scoped tools.
3. **Never invent brand values.** Use the tokens. If a value isn't in `tokens.md`, read the repo or pull from Figma — don't guess.

## Stack (match exactly for React output)
- **Next.js 16 · React 19 · TypeScript · Tailwind 3.4**; class merging via `cn()` = `twMerge(clsx(...))`.
- Fonts: **Inter** (UI; `next/font/google`), **Lusitana** (serif accent; weights 400/700).
- `darkMode: 'class'`.

## Output modes
- **HTML mockup / prototype** — full standalone HTML artifact using the tokens (inline `<style>` or CDN Tailwind themed with `tokens.md`). Viewable at real viewport; best for fast ideation / stakeholder review.
- **React component** — Next/React + Tailwind using token classes + `cn()`; mirror the existing primitives in `app/components/ui` (`BasicCard`, `StatusMessage`, `Toast`, `Tooltip`, `UserAvatar`, the Badges…). **Reuse before reinventing.**
- **Tokens / component reference** — `tokens.md` + `components.md` are the cached source; refresh from repo/Figma on request.

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
- **Tokens** → re-read `frontend/tailwind.config.ts`, `frontend/global.css`, `frontend/app/ui/global.css`.
- **Components** → re-list `frontend/app/components/**` (primitives in `app/components/ui`).
- **Figma** → file keys + library key are in `figma.md`; use `search_design_system` scoped to the Almedia library key.

## Rules
- Match the platform's existing patterns (Tailwind + `cn()`, the primitives) — reuse before creating.
- HTML artifacts are full documents at real viewport, token-accurate.
- Note the platform's distinctive `font-normal = 350` (lighter than the usual 400).
- Don't guess brand values; pull from tokens / repo / Figma.
