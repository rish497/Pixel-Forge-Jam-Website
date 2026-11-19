# Desktop prizes: compact aligned grid

Updated 19 November 2026.

- Desktop remains ordinary vertical page scrolling. No sticky or horizontal prize behavior is enabled at widths of 768px and above.
- Reduced the spacing between the first three prize boxes from up to 100px to 24px.
- Fourth place through participation now share a compact aligned grid. Fourth/fifth occupy the first row; Defold/Art the next row; Render/judges/participation the final row. Natural reading order and source order match.
- Prize text may wrap. Card heights remain content-driven, with no clipping, fixed text heights, or nested scrolling. Desktop grid gutters are 12px (8px on narrower screens).
- Phone grouping uses a layout-transparent wrapper (`display: contents`), preserving the existing vertical stack, original 64px mobile card spacing, and all ten cards' order.
- All 97 prize entries and all prize headings match the pre-change source.
- Verified phone behavior at 390×844 and desktop grid behavior at 768×900, 1024×768, 1440×900, and 1920×1080. The desktop grid fits within each tested screen beneath navigation, with no horizontal page overflow or truncated prize content.
- SEO verification and `git diff --check` pass. The pre-existing Farclip link warning is unchanged.

Measurements: `prizes-desktop-grid-verification.json`. Screenshot: `prizes-desktop-grid.png`.
