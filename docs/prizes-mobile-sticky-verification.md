# Mobile sticky prize layout

Verified 18 November 2026. This supersedes the earlier phone/tablet manual-scroll fallback.

- Sticky horizontal scrolling is enabled on phones and tablets. Scrolling the page down advances the prize rail; scrolling up reverses it. The stage fills the viewport below the navigation and releases at the end.
- Long lists flow down readable, phone-width columns, then continue in the next horizontal column. Row counts adapt to the actual available height rather than clipping prizes or making the font tiny. Fourth and fifth place remain together and follow the same column layout.
- The five extra award categories are no longer a tall vertical stack. They use a two-row horizontal grid where space permits, or one horizontal row on the shortest viewports. Each view fits vertically. DOM and reading order remain unchanged.
- Fixed the mobile percentage-width grid rule that could create oversized empty tracks between panels. Measured panel gaps are consistently 16px.
- Kept column/row choices stable when browser chrome expands the viewport. Resize and font-load checks recalculate safely; content that genuinely cannot fit, and reduced-motion preferences, retain an accessible manual layout.
- Before/after source comparison confirms all 97 prize entries and their headings retain the same text and order.

Browser checks passed at 320×568, 360×640, 390×700, 390×844, 430×932, 768×900, 1024×900, and 1440×900. At first, intermediate, final, and reverse positions: stage stays below navigation, prize text stays within its vertical viewport, the final content is reachable, and the page has no horizontal overflow. No browser page errors.

An actual emulated finger swipe moved the page 305px and advanced the pinned horizontal rail. Browser-height resize retained pinning and readable content. Reduced-motion mode restores manual scrolling.

Evidence: `prizes-mobile-sticky-verification.json`, `prizes-mobile-touch-verification.json`, `prizes-mobile-first.png`, and `prizes-mobile-extras.png`.

JavaScript syntax, the ten-page SEO audit, and `git diff --check` pass. The pre-existing Farclip URL warning remains documented and unchanged. No deployment or merge was performed.
