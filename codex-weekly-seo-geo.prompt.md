You are maintaining the local 4News GitHub Pages site in this repository.

Goal: once per week, review and improve 4News SEO and GEO (generative engine optimisation) based on the site's product position, current Australian news/search trends, and current machine-readable site assets.

Definitions:
- SEO: help search engines understand and index 4News accurately.
- GEO: help AI search engines, answer engines, and LLM crawlers understand 4News accurately enough to cite or summarise it without misrepresenting the site.

Rules:
- Work only in this repository.
- Use live web search for current search/trend context.
- Keep the 4News positioning consistent: minimal, objective, independent, multi-source Australian news briefs, AI-powered.
- Do not use clickbait, keyword stuffing, misleading claims, fake freshness, fake authority, hidden text, doorway pages, copied publisher text, copied article bodies, copied images, or copied logos.
- Do not claim original reporting unless the site actually produced it.
- Do not add speculative search keywords that are not supported by current 4News content.
- Prefer durable, high-signal changes over weekly churn.
- If there is no clear improvement, make no commit.

Weekly checklist:
1. Read `README.md`, `index.html`, `public/llms.txt`, `public/sitemap.xml`, `public/robots.txt`, `public/about.html`, `public/editorial-policy.html`, `public/corrections.html`, and the latest `public/news.en.json`.
2. Search the web for current Australian news search themes and how similar Australian news-summary/briefing products are described. Use this only to identify language gaps and query intent, not to copy competitors.
3. Check whether homepage metadata still matches actual product features and current reader intent.
4. Check structured data in `index.html` for validity and conservative wording.
5. Check `public/sitemap.xml` includes all public static pages and is not listing internal build assets.
6. Check `public/robots.txt` allows important pages and points to the sitemap.
7. Check `public/llms.txt` describes the site accurately, links machine-readable news data, and avoids overclaiming.
8. If policy or trust pages need minor updates for clarity, update both `public/` source files and ensure the build copies them to `docs/`.
9. If new language files are added, update `hreflang`, `llms.txt`, and relevant metadata.
10. Run `npm run audit:people` to identify public-figure coverage gaps that may affect entity understanding. Do not add private individuals.
11. Run `npm run build`.
12. If validation and build pass and changes are meaningful, commit and push with a concise message.

Suggested output changes when justified:
- `index.html` meta description, Open Graph, Twitter card, canonical/hreflang, or JSON-LD.
- `public/robots.txt`
- `public/sitemap.xml`
- `public/llms.txt`
- `public/about.html`, `public/editorial-policy.html`, `public/corrections.html`
- `README.md` rules for future SEO/GEO maintenance.

Before committing:
- Confirm no copied news article body text was added.
- Confirm no claims of first-party reporting were added.
- Confirm `docs/` reflects the built output.
- Confirm `git diff` is scoped to SEO/GEO maintenance.
