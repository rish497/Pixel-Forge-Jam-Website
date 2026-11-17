# Previous-games gallery drag fix

Verified 17 November 2026 in headless Chrome using real mouse and touch input.

- Disabled native browser link/image dragging on the 68 game cards, both in source HTML and JavaScript. Prevented native drag/drop navigation within the gallery.
- Added mouse dragging along the existing diagonal. A six-pixel threshold separates clicks from drags; dragging captures the pointer and directly seeks the existing paused native animations. Automatic movement still uses the compositor, without a new continuous JavaScript frame loop.
- Releasing a drag suppresses the resulting accidental click. A subsequent normal click still opens the game. Hover/gap behavior returns after dragging, with cards staying in the row.
- Clears gesture/capture state after outside release, pointer cancellation, lost capture, window blur, hidden document, Escape, and resize. A pointer returning with no button pressed also recovers a missed release.
- Touch scrolling and tap-to-focus / tap-to-open remain available. Reduced motion disables automatic travel while allowing deliberate mouse dragging.
- Added asset cache versions so the browser fetches the corrected gallery script and styles.

All 11 browser regression checks passed; see `gallery-drag-verification.json`. They cover native-drag prevention, pointer-following movement, no accidental game opening, hover recovery, release outside the section, blur, cancellation/capture loss, ordinary clicks, keyboard navigation, reduced motion, resize, and touch interaction. No browser page errors; all 68 game links remain present.

JavaScript syntax, the 10-page SEO verification, and `git diff --check` pass. The existing Farclip URL warning remains documented for owner review. No deployment or merge was performed.
