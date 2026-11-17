# SEO implementation and verification

Implemented locally on 16 November 2026. Nothing was deployed or merged.

## Public-page coverage

All 10 canonical public pages are included: the Mega Jam homepage, Jam #2 and Jam #3 archives, press kit, blog listing, and five published articles.

- Unique, content-specific titles and descriptions; absolute HTTPS canonical URLs.
- Open Graph and Twitter large-image previews, including image alternative text and the existing real 1200×630 branded press asset. No generated assets.
- JSON-LD for Organization, WebSite, WebPage/CollectionPage, BreadcrumbList, and BlogPosting where applicable. Article authors and publication dates follow visible article copy. The Jam #2 winners post only supplies a month, so no exact publication day was invented. No fabricated ratings, prices, or freshness dates.
- `sitemap.xml` lists canonical public pages only. No arbitrary `lastmod`, priority, or change-frequency claims.
- `robots.txt` advertises the sitemap and excludes internal documentation and captured prototype source material. Demo/template HTML receives `noindex`; it remains crawlable so that instruction can be read. Existing 404 and legacy `/mega-jam/` redirect noindex behavior is preserved.
- Repaired broken local image/favicon paths in archive pages. Every public-page image has an alt attribute. Game covers and blog previews have descriptive alternatives; decorative brand duplicates and title artwork with an existing equivalent text label intentionally use empty alt text.
- Added intrinsic dimensions and asynchronous decoding to 16 local article images; later article images load lazily. Sponsor image sizing was not changed. Gallery covers retain eager loading to preserve smooth stream playback.
- The source HTML now contains all 68 game links and 65 cover images. The existing animation reuses these elements; it does not duplicate them. Without JavaScript the gallery becomes a readable responsive grid.
- Blog cards are present in source HTML before the existing search/filter renderer runs. Added ordinary internal links to the two additional published articles and both archived jam-detail pages.
- Archive sponsor-tier headings now use h2 with the former h1 visual sizing preserved. Each public page has one h1.

## Verification

Run `python scripts/verify-seo.py` from the repository root. It validates all sitemap pages, canonical URLs, required metadata, JSON-LD syntax, h1 count, alt attributes, local assets, internal file links, and draft/demo noindex instructions. Results are in `verification.json`.

Browser results are in `browser-verification.json`:

- All 10 public pages load with one h1, no missing alt attributes, and no broken local images.
- Homepage checked at 390, 768, 1024, 1440, and 1920 pixels: no horizontal overflow, exactly 68 game cards.
- Sponsor/partner logo dimensions match the current pre-change `HEAD:index.html` baseline at 390, 1024, and 1440 pixels, after their reveal animations finish.
- All 68 native gallery stream animations remain present and advance continuously during the sampled interval.
- JavaScript-disabled check: all 68 games and three initial blog cards remain available; the mobile homepage has no overflow.
- No browser page errors. External scripts, fonts, and remote images were isolated during these local smoke checks; third-party availability is not certified by this test.
- Homepage Lighthouse automated SEO audit: **100/100**, with no failed automated checks. Full output is in `lighthouse.json`. This score covers automated SEO checks only; it does not certify rankings, all third-party links, or real-user performance.
- `git diff --check` passes.

`before.json` records the initial source inventory. `live-site-map.json` records the live site's discovered URLs before these local changes; it is a crawl snapshot, not a deployment verification.

## Owner follow-through after deployment

1. Check the canonical HTTPS domain and its HTTP/www redirects on the actual host. Verify real missing URLs return HTTP 404 rather than a 200 response containing the error page.
2. Add/verify the domain in Google Search Console and submit `https://pixelforgejam.org/sitemap.xml`. Inspect representative homepage/article URLs after deployment and request indexing as needed.
3. Check deployed structured data with Google's Rich Results Test and Schema.org Validator. This implementation does not claim event rich-result eligibility: Google's event experience excludes virtual-only events, so no physical venue or Event markup was fabricated.
4. Review real-user Core Web Vitals in Search Console when data is available. Local structural SEO checks do not measure real-user performance or guarantee rankings.
5. Review the preserved content issues under “Possible content errors” in `../redesign-verification.md`, especially the malformed Farclip sponsor URL and conflicting blog date.

## Primary references

- [Google image SEO and alternative text](https://developers.google.com/search/docs/appearance/google-images)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google robots meta guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google event eligibility and date guidance](https://developers.google.com/search/docs/appearance/structured-data/event)
