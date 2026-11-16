# Extraction provenance

Retrieved November 16, 2026 from:

- Submissions: https://itch.io/jam/pixel-forge-jam-3/entries
- Official public JSON endpoint, discovered in the submissions page's `R.Jam.BrowseEntries` configuration: https://itch.io/jam/417337/entries.json

## Counts and completeness

- The page configuration says `total_entries_count: 73`.
- Its initially rendered HTML embeds 60 records.
- The fully rendered page exposes 68 `.game_cell` elements.
- The official JSON endpoint contains 68 `jam_games` records, with 68 unique game IDs and direct game URLs. Every one is included in the gallery and exports.
- 65 records have a `game.cover` URL; all 65 thumbnails were downloaded unchanged.
- WILDQUEST (5004001), Bird wings (4997998), and Grand Hotel Runner (5004138) have no `game.cover` field. Their cards use text covers, not invented images.
- The five records implied by the advertised total are not exposed by the public data. Their titles, links, and thumbnails cannot be inferred from that count.

## Captures

- `entries-original.html`: original public HTML, including the initial React data and total count.
- `entries-page-1.json`: Firecrawl-rendered HTML and markdown of the supplied URL.
- `entries-title.json`: second rendered capture confirming the same 68 IDs.
- `entries-api.json`: complete official public entries response.
- `build-catalog.py`: deterministic extractor and thumbnail downloader. Run from any directory after updating the captured API JSON to rebuild the gallery records and exports.

Titles, creators, URLs, and thumbnails come from the source payload. Titles are not corrected or normalized beyond JSON encoding. The gallery assets were not generated or recolored. No main-site files were changed for this extraction.
