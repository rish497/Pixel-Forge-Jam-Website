# Manual horizontal prizes row

Verified 17 November 2026.

- The prizes section remains in normal document flow. No sticky/pinned stage, automatic travel, or vertical-wheel interception.
- All 97 prize-list entries and the full section copy match the pre-change source, including their order. Ten award categories appear in their original order: first, second, third, fourth, fifth, Defold, Art, Render Workflows, judges’ picks, participation.
- Formerly grouped awards are separate cards in one horizontal row. Cards keep their natural content height; no prize text is truncated or hidden inside vertical card scrollbars.
- Native horizontal scrollbar, trackpad, keyboard arrows, and touch swipes provide manual navigation. The scroller is a labelled, focusable region. Mobile heading copy stacks above the row.
- Checked 390, 768, 1024, 1440, and 1920 pixels: ten cards, last card reachable, no page overflow, no clipped card content. Vertical mouse-wheel scrolling remains ordinary page scrolling.
- Native touch swiping also passed with JavaScript disabled. Sponsor/partner image markup is unchanged. No browser page errors.
- Detailed results: `prizes-horizontal-verification.json`. SEO verification and `git diff --check` pass; the existing Farclip content warning remains unchanged.
