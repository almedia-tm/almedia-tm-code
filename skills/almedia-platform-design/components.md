# Almedia Platform — Component Inventory

Source: `advertiser-platform/frontend/app/components/**` (reusable primitives in `app/components/ui`; icons in `app/ui`). Styling: **Tailwind + `cn()`** = `twMerge(clsx(...))`. Refresh by re-listing the directories.

## Reusable primitives — `app/components/ui/`
`AboutPopup` · `BasicCard` · `CountryBadge` · `CountryIcon` · `EmptyState` · `PlatformBadge` · `PublisherTab` · `PublisherTabSwitcher` · `StatusMessage` · `Toast` · `Tooltip` · `UserAvatar` · `UserDropdown` · `UserModalManager` · `UserTypeBadge` · `dropdown/`
Also: `components/ui/switch.tsx`, `app/components/Command.tsx`, `ContextMenu.tsx`, `Popover.tsx`, `ErrorPage.tsx`.

## Icons — `app/ui/`
`almediaLogo.tsx` · `logo.tsx` · `platformIcon.tsx` · `userIcons.tsx` · `eyeIcons.tsx`

## Domain component groups — `app/components/<group>/`
`admin` · `auth` · `brands` · `cta` · `dashboard` (+ `dashboard/tables/components`) · `feedback` · `form` · `growth-manager` · `invite` · `layout` · `marketing` · `navigation` · `user-action-popup` · (`app/onboarding/components`)

## Conventions
- **Reuse a primitive before building new.** Compose with `cn()` and token classes: `bg-primary text-primary-foreground`, `text-textSecondary`, `border-stroke`, `rounded-lg`, `text-sm`, `font-normal` (= 350).
- New components mirror the structure/props of the nearest existing primitive.
- For exact props/markup of any component, open its file in the repo (or pull the matching Figma node — see `figma.md`).
- This list is an index, not full specs — it's the hybrid cache. Deep-dive a component on demand.
