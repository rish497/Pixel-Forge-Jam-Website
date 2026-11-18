# Prize stack prototype

Open `index.html` directly, or serve the workspace and visit `/protype/prizes-stack/`.

This is a standalone preview. It is not connected to the main website.

- Ten cards preserve all 97 prize entries and their original order.
- A card enters with normal page scrolling, then pins. The following card rises over it; reverse scrolling reveals the previous card again.
- Desktop cards share a viewport-sized frame. On phones, taller cards scroll through completely before pinning, with their own title bar kept visible while reading. Prize text is never placed in a clipped area or nested scroll box.
- After the last card, the page continues normally.
- Reduced motion uses an ordinary vertical list. The prototype has `noindex` metadata.

Verified 320, 390, 768, 1440, and 1920px layouts, front-to-back order, reverse scrolling, no horizontal overflow, and no browser page errors. Full content/order comparison against the current main page passed.

See `verification.json`, `preview-390.png`, and `preview-1440.png` for browser evidence.
