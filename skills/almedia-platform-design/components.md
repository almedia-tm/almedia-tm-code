# Almedia Platform — Component Reference (self-contained)

Real component values inlined from the platform. **You do not need the repo** — build from these. (Maintainers with repo access may cross-check `advertiser-platform/frontend/app/components/**`; that's highly optional.)
Styling: **Tailwind + `cn()`** (`cn` = `twMerge(clsx(...))`, imported from `@/app/helpers/utils`). Variant components use `class-variance-authority` (`cva`) + Radix `Slot`. Icons: `lucide-react` (+ local icons in `app/ui`).

> ⚠️ **Filled CTA = midnight blue, not Almedia Blue.** The platform has **no solid `#0021F3` button** by default — `#0021F3` (Almedia Blue) is the **focus ring** and **link text** color. Filled buttons use **midnight blue** (`secondary` / `rich`). Match this.

## Button — `cta/Button.tsx` (cva + Slot; props: `variant`, `size`, `asChild`)
Base: `font-medium text-sm transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 [&_svg]:size-4 disabled:opacity-50 disabled:pointer-events-none`

Variants:
- `default` — `rounded-md border-1 text-textPrimary border-stroke hover:bg-bgSecondary` (outlined/neutral)
- `secondary` — `rounded-md bg-midnightAlmediaBlue text-zinc-50 hover:bg-midnightAlmediaBlueHover disabled:opacity-30` ← **primary filled CTA**
- `rich` — `rounded-md border-none bg-midnightAlmediaBlue hover:bg-midnightAlmediaBlueHover text-white`
- `muted` — `rounded-lg border border-stroke bg-white text-dullGray hover:border-ashGray hover:bg-bgSecondary hover:text-darkGray active:bg-cloudGray`
- `destructive` — `rounded-md border-1 bg-red-500 text-neutral-50 hover:bg-red-500/90`
- `outline` — `rounded-md border-1 border-neutral-200 bg-white hover:bg-neutral-100`
- `ghost` — `rounded-md hover:bg-neutral-100 hover:text-neutral-900`
- `link` — `rounded-md text-neutral-900 underline-offset-4 hover:underline`
- `linkStyle` — `rounded-md text-mainAlmediaBlue underline underline-offset-4 hover:text-mainAlmediaBlueHover` ← Almedia-Blue link
- `grayed` — `rounded-md bg-cloudGray`
- `tab` / `currentTab` — transparent tabs, `data-[state=active]:font-bold`, `border-ashGray` on active

Sizes: `default h-10 px-4 py-2` · `xs h-8 px-3` · `sm h-9 px-3` · `lg h-11 px-8` · `icon h-10 w-10`

## Badge — `feedback/Badge.tsx` (cva; props: `variant`, `size`)
Base: `inline-flex items-center gap-2 border border-stroke rounded-lg font-normal transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden`

Variants:
- `default` — `border-transparent bg-bgPrimary text-textPrimary hover:border-stroke`
- `inline` — `bg-bgSecondary border-stroke border rounded-md px-1 py-0.5 text-textSecondary font-medium gap-1.5 pe-1.5 h-6` ← used by PlatformBadge / UserTypeBadge / CountryBadge
- `dropdown` — `bg-bgSecondary border-stroke border rounded-md px-2 py-1.5 text-textSecondary font-medium`
- `secondary` — `bg-neutral-100 text-neutral-900` · `destructive` — `bg-red-500 text-neutral-50` · `grayed` — `bg-basaltGray rounded-md` · `white` — `bg-white text-ashGray border-1 rounded-md font-bold`
Sizes (skipped for inline/dropdown/grayed/white which are fixed): `sm px-2 py-0.5 text-xs` · `md px-2.5 py-0.5 text-sm` · `lg px-3.5 py-1.5 text-base`

## BasicCard — `ui/BasicCard.tsx`
`flex flex-col p-5 bg-bgSecondary shadow-none gap-3 rounded-md` (+ className). Note: card surface is **bgSecondary `#F8F8F8`**, radius `md` (6px), no shadow.

## StatusMessage — `ui/StatusMessage.tsx` (props: `status{type,text}`, `onDismiss`)
Wrapper: `p-3 rounded-lg flex items-center space-x-3 border`. Per type (uses raw Tailwind palette, not brand tokens):
- success `bg-green-50 text-green-700 border-green-200` (icon `Check`)
- error `bg-red-50 text-red-700 border-red-200` (icon `AlertCircle`)
- info `bg-blue-50 text-blue-700 border-blue-200` (icon `Info`)
Dismiss `X` button tinted to match. Icons `w-5 h-5` from `lucide-react`.

## EmptyState — `ui/EmptyState.tsx` (props: `title`, `description?`, `action?`)
`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-stroke px-6 py-12 text-center`; title `text-sm font-semibold text-gray-700`; description `max-w-sm text-sm text-gray-500`.

## Badge-based wrappers (`app/components/ui`)
- **PlatformBadge** — `<Badge variant="inline">` + `<PlatformIcon size="sm">` + platform name.
- **UserTypeBadge** — `<Badge variant="inline" className="font-medium text-textPrimary gap-1.5 pl-1.5">`; shows Almedia symbol for internal user types.
- **CountryBadge** — `<Badge variant="inline">` + country flag/icon + name.

## Other inventory (pull the file only if you need exact internals)
Primitives `app/components/ui`: `AboutPopup`, `PublisherTab(+Switcher)`, `Toast`, `Tooltip`, `UserAvatar`, `UserDropdown`, `UserModalManager`, `dropdown/`; `components/ui/switch.tsx`; `app/components/Command.tsx`, `ContextMenu.tsx`, `Popover.tsx`, `ErrorPage.tsx`.
Domain groups `app/components/<group>`: `admin · auth · brands · cta · dashboard(+tables) · feedback · form · growth-manager · invite · layout · marketing · navigation · user-action-popup` (+ `app/onboarding/components`).
Icons `app/ui`: `almediaLogo`, `logo`, `platformIcon`, `userIcons`, `eyeIcons`.

## Conventions
- **Reuse a primitive before building new.** Compose with `cn()` + token classes (`bg-primary`, `text-textSecondary`, `border-stroke`, `rounded-md`, `text-sm`, `font-normal` = 350).
- Filled CTA → `Button variant="secondary"` (midnight). Link → `variant="linkStyle"` (Almedia Blue). Tags/labels → `Badge variant="inline"`. Card → BasicCard (bgSecondary).
