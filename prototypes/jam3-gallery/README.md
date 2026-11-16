# Jam #3 diagonal gallery — isolated motion sample

Open `index.html` in this folder. No build step or server is needed. Main and the existing prototypes are unchanged.

- A tightly overlapped stream travels continuously down-left and wraps outside the visible frame.
- Hover pauses the stream and opens a gap in front of the selected cover by moving the leading cards down-left. The hovered cover keeps its exact position, angle, size, depth, and row order. Leaving the gallery restores the compact stream and resumes motion.
- Keyboard: Tab selects a cover; Left/Right explores the games; Escape dismisses focus. If needed, the entire row moves along its axis to bring a keyboard-selected cover into view. Touch: tap once to focus, again to open the game; tap outside to release.
- Pause/Resume provides a persistent motion control. Reduced motion disables autoplay and transition movement. Offscreen and hidden-tab motion stops.
- `games.js`, `games.json`, and `games.csv` hold all 68 records exposed by the official public entry payload on November 16, 2026. Every card links directly to its game on itch.io.
- 65 source thumbnails are stored locally in `assets/games/`. Three entries without source thumbnails use text covers: WILDQUEST, Bird wings, and Grand Hotel Runner.
- The expandable Browse all games view contains a complete, keyboard-accessible card list in addition to the diagonal stream.

The page advertises 73 total entries, but both its rendered list and its public entries JSON expose 68 unique games. The other five records are not present in the public payload. No missing games or images were invented. See `source/README.md` for provenance and the captured data.
