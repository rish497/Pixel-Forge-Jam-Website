# Manual horizontal prizes row

Updated and verified 17 November 2026.

- Restored the original five prize boxes while retaining native manual horizontal scrolling and normal vertical page flow. No pinning, automatic movement, or wheel interception.
- First, second, and third place each have their own box. The next box groups fourth place, fifth place, and Defold. The final box groups Art, Render Workflows, judges’ picks, and participation, with the original internal dividers.
- All 97 prize entries and all section copy retain their previous text and order.
- Desktop/tablet boxes are at least 780px wide and expand to their longest entry. Every prize entry is a single line at widths of 768px and above. On phones, boxes fit the viewport and entries wrap to keep the full text readable.
- Checked 390, 768, 1024, 1440, and 1920 pixels: five boxes, correct grouping, reachable final content, no page overflow, no clipped prize text. Wider-than-viewport cards remain fully accessible through the horizontal scroller.
- Keyboard arrows scroll the row; vertical wheel input scrolls the page normally. Sponsor/partner image markup is unchanged. No browser page errors.
- Detailed results are in `prizes-horizontal-verification.json`.
