# Main website: stacking prize cards

Applied and verified 18 November 2026.

- Promoted the approved standalone prize-stack interaction into the main homepage. The horizontal prize controller is no longer loaded; `prizes-stack.css` and `scripts/prizes-stack.js` provide the scoped replacement.
- Ten cards enter through normal scrolling, pin, and are covered by the following card. Reverse scrolling reverses the stack. Tall phone cards remain readable in normal document flow before pinning; their title bars stay visible.
- Fixed the reported strip beneath navigation: card title bars now stick directly at the header boundary, with an opaque background. Short cards also pin flush to that boundary. The same gap correction was applied to the standalone prototype.
- Compared pre-change source with the main result: all 97 prize entries, all prize headings, the entire prizes section text, and every other main section's markup match in order and wording.
- Verified all ten front-card positions at 320×568, 390×844, 768×900, 1024×900, 1440×900, and 1920×1080. Hit tests immediately below navigation select the active card rather than an earlier card. Measured title-bar gap is zero (within pixel rounding).
- Verified reverse scrolling, no horizontal overflow, fully expanded prize bodies, reduced-motion normal flow, and no browser page errors.
- JavaScript syntax, ten-page SEO audit, and `git diff --check` pass. The existing Farclip URL content warning remains unchanged.

Evidence: `prizes-stack-main-verification.json`, `prizes-stack-main-390.png`, and `prizes-stack-main-1440.png`.

The earlier horizontal/sticky/mobile-grid verification documents describe superseded prize layouts. No deployment or Git merge was performed.
