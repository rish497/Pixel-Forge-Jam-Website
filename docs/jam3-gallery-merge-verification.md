# Jam #3 gallery merge verification

Merged the approved diagonal gallery into the main index.html. Production CSS is scoped to #judging.jam-gallery; game records, gallery script, and thumbnails are independent of prototypes/. The prototype remains in place.

## Result

- 68 direct game links, 65 unchanged source thumbnails, and three explicit text covers for entries without thumbnails.
- Cards keep their existing width calculation and use height = width × 500 / 630, preserving the 630:500 (1.26:1) proportion.
- Tight diagonal down-left motion and the hover gap are preserved. The selected card stays at its original position, angle, and size; motion pauses on hover.
- The owner subsequently requested removal of the judging guide, browse-all catalog, source note, counters, descriptions, and pause control; those elements and their obsolete JavaScript hooks have been removed from main. The standalone prototype remains available.
- Cards are direct children of the section, with no inner frame. The section uses the site's #0d131c background and has height calc(100svh - var(--header)).
- Main order is now: Hero, About/Theme, Timeline, Prizes, Jam #3 Games, Rules, Sponsors, Partners, FAQ, final CTA/footer. Original section anchors are retained.
- Prize text matches the pre-merge snapshot exactly. All 68 direct game links remain.
- Checked 390, 768, 1024, 1440, and 1920px: 68 unique linked cards, all 65 thumbnails loaded, correct computed aspect ratio, and no horizontal overflow.
- Hover pause, stationary selection, reduced-motion pause, direct-child card structure, section order, full viewport fit, and absence of the removed UI passed browser checks without page errors. No generated imagery was used.

## Sponsor and partner logo comparison

### Motion engine revision

- Replaced frame-by-frame JavaScript travel with synchronized native Web Animations using linear, infinite transform animations. JavaScript no longer drives the travel frames or repeatedly rewrites every card's layer order, focus attributes, and tab order.
- Set a moderate 52 CSS pixels/second. Hover gaps use native translation transitions and preserve the selected card's position and angle, including when selection changes mid-transition.
- Verified uninterrupted animation progress across the previous one-second stutter interval and while the page's JavaScript thread was deliberately occupied for 1.2 seconds. Hover pause/resume, stationary selection, keyboard focus, offscreen pause, and reduced motion passed.
- All 68 links remain, with no horizontal page overflow at 390, 768, 1024, 1440, or 1920px. The script URL is versioned so refreshing loads the revised engine.

Resting rendered sizes after the existing reveal animations finish; every result is identical to its pre-merge measurement.

|Viewport|Logo|Before width × height|After width × height|Result|
|---|---|---|---|---|
|390|Spine|350 × 105.4375|350 × 105.4375|Identical|
|390|Houdini|350 × 58.78125|350 × 58.78125|Identical|
|390|CodeCrafters|350 × 44.84375|350 × 44.84375|Identical|
|390|Farclip|310 × 134.171875|310 × 134.171875|Identical|
|390|Defold|310 × 65.046875|310 × 65.046875|Identical|
|390|Synty|310 × 97.765625|310 × 97.765625|Identical|
|390|Render|310 × 127.875|310 × 127.875|Identical|
|390|Fly.io|230 × 68.1875|230 × 68.1875|Identical|
|390|Easel|230 × 27.578125|230 × 27.578125|Identical|
|390|WeLoveIndies|230 × 55.703125|230 × 55.703125|Identical|
|390|AssetHoard|230 × 43|230 × 43|Identical|
|390|Minifantasy|230 × 57.5|230 × 57.5|Identical|
|390|1BITDRAGON|76 × 76|76 × 76|Identical|
|390|reactorcore|230 × 71.875|230 × 71.875|Identical|
|390|Craftpix|230 × 56.03125|230 × 56.03125|Identical|
|390|Aseprite|100.03125 × 40.28125|100.03125 × 40.28125|Identical|
|390|Pyxel Edit|97.3125 × 40.28125|97.3125 × 40.28125|Identical|
|390|Kronnect|180 × 38.703125|180 × 38.703125|Identical|
|390|GameDev|180 × 37.1875|180 × 37.1875|Identical|
|390|Karma Play|210 × 62|210 × 62|Identical|
|390|Kodin|210 × 62|210 × 62|Identical|
|1024|Spine|389.109375 × 117.21875|389.109375 × 117.21875|Identical|
|1024|Houdini|389.109375 × 65.359375|389.109375 × 65.359375|Identical|
|1024|CodeCrafters|389.109375 × 49.84375|389.109375 × 49.84375|Identical|
|1024|Farclip|286.71875 × 124.09375|286.71875 × 124.09375|Identical|
|1024|Defold|286.71875 × 60.171875|286.71875 × 60.171875|Identical|
|1024|Synty|286.71875 × 90.421875|286.71875 × 90.421875|Identical|
|1024|Render|286.71875 × 118.265625|286.71875 × 118.265625|Identical|
|1024|Fly.io|194.546875 × 57.671875|194.546875 × 57.671875|Identical|
|1024|Easel|194.546875 × 23.328125|194.546875 × 23.328125|Identical|
|1024|WeLoveIndies|194.546875 × 47.109375|194.546875 × 47.109375|Identical|
|1024|AssetHoard|194.546875 × 36.375|194.546875 × 36.375|Identical|
|1024|Minifantasy|194.546875 × 48.625|194.546875 × 48.625|Identical|
|1024|1BITDRAGON|194.546875 × 100|194.546875 × 100|Identical|
|1024|reactorcore|194.546875 × 60.78125|194.546875 × 60.78125|Identical|
|1024|Craftpix|194.546875 × 47.390625|194.546875 × 47.390625|Identical|
|1024|Aseprite|122.875 × 49.484375|122.875 × 49.484375|Identical|
|1024|Pyxel Edit|122.875 × 50.875|122.875 × 50.875|Identical|
|1024|Kronnect|122.875 × 26.40625|122.875 × 26.40625|Identical|
|1024|GameDev|122.875 × 25.390625|122.875 × 25.390625|Identical|
|1024|Karma Play|210 × 62|210 × 62|Identical|
|1024|Kodin|210 × 62|210 × 62|Identical|
|1440|Spine|530 × 159.671875|530 × 159.671875|Identical|
|1440|Houdini|530 × 89.03125|530 × 89.03125|Identical|
|1440|CodeCrafters|530 × 67.90625|530 × 67.90625|Identical|
|1440|Farclip|390 × 165|390 × 165|Identical|
|1440|Defold|390 × 81.84375|390 × 81.84375|Identical|
|1440|Synty|390 × 123|390 × 123|Identical|
|1440|Render|390 × 160.875|390 × 160.875|Identical|
|1440|Fly.io|250 × 74.125|250 × 74.125|Identical|
|1440|Easel|250 × 29.984375|250 × 29.984375|Identical|
|1440|WeLoveIndies|250 × 60.546875|250 × 60.546875|Identical|
|1440|AssetHoard|250 × 46.75|250 × 46.75|Identical|
|1440|Minifantasy|250 × 62.5|250 × 62.5|Identical|
|1440|1BITDRAGON|250 × 100|250 × 100|Identical|
|1440|reactorcore|250 × 78.125|250 × 78.125|Identical|
|1440|Craftpix|250 × 60.890625|250 × 60.890625|Identical|
|1440|Aseprite|165 × 65|165 × 65|Identical|
|1440|Pyxel Edit|165 × 65|165 × 65|Identical|
|1440|Kronnect|165 × 35.46875|165 × 35.46875|Identical|
|1440|GameDev|165 × 34.09375|165 × 34.09375|Identical|
|1440|Karma Play|210 × 62|210 × 62|Identical|
|1440|Kodin|210 × 62|210 × 62|Identical|

## Prize comparison

128 prize text blocks compared in DOM order. Zero removals or changes. Raw before/after results are in jam3-gallery-before.json and jam3-gallery-after.json.

## Possible content errors

- Timeline step 3 still reads `03 / NOV 8`, while event dates are Nov 28-Dec 8, 2026. Preserved unchanged.
- The itch.io page reports 73 total entries, while its official public JSON exposes 68 unique games. All 68 exposed records are included; the other five records are not publicly supplied by that payload. See prototypes/jam3-gallery/source/README.md.
