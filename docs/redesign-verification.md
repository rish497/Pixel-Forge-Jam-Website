# Timeline content notes

## Possible content errors

- Timeline step 3 says `03 / NOV 8`, while the event dates are Nov 28-Dec 8, 2026. Preserved unchanged for owner review.
- The How it runs heading says `Four moves.` but the section contains five steps, including the workshop. Preserved unchanged for owner review.

This log covers the current timeline change; it is not a verification of the earlier cancelled full-site redesign.

## Stacking timeline verification

- Checked all five active-card positions at 1440×900, 1024×768, and 390×844. Each active card is fully opaque and inside the viewport; no horizontal overflow.
- Replaced the helix with cards sliding upward onto a sticky stack. Previously shown cards remain behind the current card with a small offset and scale reduction.
- Verified the sticky stage remaining below the navigation, reverse scrolling, and keyboard focus bringing the workshop card to the front.
- Reduced-motion mode restores all five items to normal document flow without transforms. Viewports under 600px tall also use ordinary scrolling.
- Timeline copy and the workshop URL are unchanged. No generated assets or new animation dependencies were added.
- JavaScript syntax checks and browser checks passed with no page errors.

## Judging section verification

- The heading stays pinned while Gameplay, Theme, Music, and Atmosphere enter from the right in order. Scrolling upward reverses the sequence; the section releases after Atmosphere.
- All four card positions were checked at 1440×900, 1024×768, and 390×844: fully visible, fully opaque when centered, and no horizontal page overflow.
- All original judging copy and the rating queue note remain. Reduced-motion mode restores the ordinary four-card layout; viewports under 650px tall also use normal scrolling.
- Browser checks completed without page errors.
