# Almedia Platform — Figma Reference

Org: **Almedia GmbH** (`organization::1349672123018746032`). Access via the **claude.ai Figma** connector.

⚠️ **Constraints:** the account is a **View seat** and this MCP is **selection-bound** — it reads the Figma *desktop app's current selection*. Bulk remote traversal returns empty pages (`get_metadata` on a page shows an empty canvas). So always work from **node-specific links**: in Figma → right-click the frame → **Copy link to selection** → that URL has `?node-id=…`. `get_design_context` (full design-to-code) may be gated on a View seat; fall back to `get_screenshot` + `get_metadata` + `get_variable_defs` + `download_assets`.

## Files
| File | fileKey | Holds |
|---|---|---|
| **Core Design System Almedia 2025** | `M6CXJf97ljcdxZBqYXc4gM` | tokens + components (page `601:2263 — 🟪 FOUNDATION`) |
| 🔵 Almedia \| Guidelines | `sOyF4Nd6I50SDqodMuMN82` | brand guidelines |
| Design Guidelines | `rEub9nNmOMvFu32n0LDe04` | usage / layout guidance |

## Almedia design-system library key (for `search_design_system`)
```
lk-bb9d19d687eca0ebc2f36d3c7daf351a943c4108c77f744615c2311a1567590d424707c8565c76c6e8d75e85ec26470fd23ed4d14cfe9f4482e09c2148c02c0a
```
(The other libraries on the file — Material 3, iOS, etc. — are unused community kits; ignore them.)

## Pull workflow
1. Get a node-specific URL (Copy link to selection) → extract `fileKey` + `nodeId`.
2. `get_screenshot(fileKey, nodeId)` — visual truth · `get_variable_defs(fileKey, nodeId)` — tokens on that node · `get_design_context(fileKey, nodeId)` — reference code (if seat allows) · `download_assets(fileKey, nodeId)` — icons/images.
3. `search_design_system(query, fileKey, includeLibraryKeys=[<key above>])` — locate a component/variable by name.
4. Translate to the platform stack (Tailwind + `cn()` + `tokens.md`) — never paste raw Figma CSS.

> Code is the primary source of truth (see `tokens.md` / `components.md`); Figma is for visual exactness and net-new screens.
