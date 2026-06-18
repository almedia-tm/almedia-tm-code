# Almedia Platform — Design Tokens

Concrete, self-contained values — **no repo needed.** (Originally derived from `tailwind.config.ts` + `global.css`; maintainers with repo access may cross-check, but that's highly optional. The config carries a note that color names should be refactored to e.g. `primary.blue` — names below are the current Tailwind keys.)

## Brand
| Token | Hex | Tailwind key |
|---|---|---|
| Almedia Blue (primary) | `#0021F3` | `primary` / `mainAlmediaBlue` |
| Almedia Blue — hover | `#334AFF` | `mainAlmediaBlueHover` |
| Midnight Blue (secondary) | `#0D2A4C` | `secondary` / `midnightAlmediaBlue` |
| Midnight Blue — hover | `#26476A` | `midnightAlmediaBlueHover` |
| Sky Blue | `#739AC1` | `skyAlmediaBlue` |
| Sky Blue — hover | `#8AB2D6` | `skyAlmediaBlueHover` |
| on-brand text | `#FFFFFF` | `primary.foreground` / `secondary.foreground` |

## Semantic
| State | Hex | foreground |
|---|---|---|
| success | `#60f642` | `#FFFFFF` |
| warning | `#f6d842` | `#FFFFFF` |
| danger | `#f64260` | `#FFFFFF` |

## Text & surface
- Text: `textPrimary #101820` · `textSecondary #7D7D7D` · `primaryText #172554` · `foreground #000000`
- Surface: `background`/`bgPrimary #FFFFFF` · `bgSecondary #F8F8F8`
- Lines/links: `stroke #E4E4E4` · `linkBlue #3962FF` · `richBlue #3A62FF`

## Grays & accents (named)
`lightGray #F7F8F8` · `cloudGray #EDEDF1` · `concreteGray #D8DAE0` · `basaltGray #DEDFDF` · `ashGray #979797` · `fluffGray #818698` · `dullGray #6F7588` · `darkGray #3F424E`
Blues: `placeboBlue #EEF3FF` · `lightBlue #E3EDFF`
Greens: `lightGreen #DCF2D2` · `vineGreen #c5dbbd` · `darkGreen #158034`

## Typography
- Fonts: **Inter** (UI), **Lusitana** (serif accent, weights 400/700) — both via `next/font/google`.
- `fontWeight.normal = 350` ← distinctive (lighter than the default 400).
- Size scale (px): `xs 10 · sm 12 · base 14 · lg 16 · xl 18 · 2xl 22 · 3xl 28 · 4xl 40`.

## Radius — `--radius: 0.5rem` (8px)
- `rounded-lg` = 8px (`var(--radius)`) · `rounded-md` = 6px · `rounded-sm` = 4px

## Layout / misc
- `borderWidth`: `1` = 1px, `1.5` = 1.5px
- `screens.xl` = **1550px** (custom)
- `darkMode: 'class'`
- animation: `shake 0.6s ease-in-out`; plus toast / subtask / tree keyframes in `global.css`
