# Homepage preferred search image

Updated 19 November 2026.

Google's search screenshot selected OATHBOUND's game cover from the previous-jam gallery. The homepage's existing preview preference referenced the older press banner.

Copied the owner's supplied `Untitled design (32).png` unchanged to `images/pixel-forge-jam-poster.png` (300×300). File hashes match the original attachment.

Updated the homepage Open Graph and Twitter image URLs/alternative text, actual image dimensions, WebPage `primaryImageOfPage`/`image` structured data, and the homepage's image-sitemap entry. The SEO checker now distinguishes page URL entries from image URL entries and checks that image-sitemap assets exist. All ten public-page checks pass; the existing Farclip link warning is unchanged.

After deploying the changed HTML, image, and sitemap, use Google Search Console URL Inspection on `https://pixelforgejam.org/` and request indexing. The image URL must be publicly accessible at `https://pixelforgejam.org/images/pixel-forge-jam-poster.png`.

Google chooses result thumbnails automatically. These supported preferences influence selection but cannot guarantee which image Google shows, or when its cached result updates.

References:
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
