# Sticky prizes and aligned award grid

Phone/tablet behavior below was superseded by `prizes-mobile-sticky-verification.md`; mobile pinning is now enabled.

Verified 18 November 2026.

- Desktop scrolling pins the prizes below navigation, moves the row horizontally, and releases after the final award grid. Reverse scrolling reverses the movement. The existing native scroll-animation approach is reused; no animation library was added.
- First, second, and third place retain individual boxes. Fourth and fifth place share an aligned two-column box.
- Awards after fifth place retain their original reading order in a shared grid: Defold and Art above; Render Workflows, judges’ picks, and participation below. Art spans two columns to accommodate its longer entries. The final grid fits the 1240px desktop content width.
- Compared before/after source: all 97 prize entries, all prize headings, the full section copy, and sponsor/partner image markup are unchanged in order and text.
- Checked 390×844, 768×900, 1024×900, 1440×900, 1920×1080, and 1440×650. Desktop stages at 1024/1440/1920 remain pinned and all prize content fits. Phones, tablets, reduced motion, and viewports too short to contain the text use normal manual horizontal scrolling instead of clipping content.
- Checked first, intermediate, and final scroll positions plus reverse motion: stage stays below the navigation, cards remain inside the stage, and the final grid is fully reachable. Keyboard Home/End and arrows navigate the pinned sequence.
- No horizontal page overflow or browser page errors. JavaScript syntax, the 10-page SEO audit, and `git diff --check` pass. The existing Farclip content warning is preserved.
- Browser measurements: `prizes-sticky-verification.json`. Desktop grid screenshot: `prizes-sticky-desktop.png`. External font availability was not certified; runtime layout checks run again after the font-loading promise resolves.

Earlier `prizes-horizontal-verification.*` files describe the previous manual-only design.
