# Horizontal timeline verification

The main Timeline section now uses a sticky horizontal rail. Downward page scrolling translates the rail right-to-left; its five cards alternate above and below a central hairline. The section releases back to normal page scrolling at the end.

- Flat navy backgrounds, fine borders, restrained blue progress markers, and no gradients, glow effects, rotation, or stacked cards in this section.
- Existing five timeline items compared against the immediately preceding main HTML: zero text changes. The current owner-edited label `03 / Dec 8` is preserved exactly. The workshop registration URL and checkout attributes are unchanged.
- Checked 390×844, 768×1024, 1024×768, 1440×900, and 1920×1080. Desktop/tablet uses the horizontal rail; phones use a readable vertical stack. Short viewports also fall back to the vertical layout when both alternating rows cannot fit.
- Checked all five scroll positions: card bodies remain vertically inside the visible rail, alternating above/below their nodes; first and final cards are reachable without clipping. No horizontal page overflow.
- Reverse scrolling, keyboard focus bringing the workshop into view, and reduced-motion restoration to the static stack passed.
- JavaScript syntax checks and browser checks passed with no page errors. Styling is scoped to #process; other sections and prototype files were not restyled.

Implementation: `scripts/timeline-horizontal.js` and `timeline-horizontal.css`. Main no longer loads the previous timeline-stack script.
