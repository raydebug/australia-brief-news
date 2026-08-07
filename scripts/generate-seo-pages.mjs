import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://4news.com.au";
const outDir = path.join("public", "briefs");
const shareDir = path.join("public", "share");
const englishNews = JSON.parse(fs.readFileSync("public/news.en.json", "utf8"));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function clip(value, limit = 155) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit + 1);
  return `${clipped.slice(0, Math.max(clipped.lastIndexOf(" "), limit - 30)).trim()}...`;
}

function clearDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function newsFiles() {
  return fs
    .readdirSync("public")
    .filter((filename) => /^news\.[A-Za-z-]+\.json$/.test(filename))
    .map((filename) => {
      const language = filename.replace(/^news\./, "").replace(/\.json$/, "");
      const payload = JSON.parse(fs.readFileSync(path.join("public", filename), "utf8"));
      return { language, payload };
    });
}

function sourceList(cluster) {
  return (cluster.links || [])
    .map(
      (link) =>
        `<li><a href="${escapeHtml(link.url)}" rel="nofollow noopener noreferrer">${escapeHtml(link.source)}</a></li>`
    )
    .join("\n");
}

function articleJsonLd(cluster, url, news = englishNews, language = "en") {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: cluster.headline,
      description: cluster.voiceScript,
      url,
      datePublished: cluster.publishedAt,
      dateModified: news.updatedAt || cluster.publishedAt,
      inLanguage: language,
      isAccessibleForFree: true,
      publisher: {
        "@type": "Organization",
        name: "4News",
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`
      },
      mainEntityOfPage: url,
      citation: (cluster.links || []).map((link) => link.url)
    },
    null,
    2
  );
}

function pageHtml(cluster, filename) {
  const url = `${SITE_URL}/briefs/${filename}`;
  const title = `${cluster.headline} | 4News`;
  const description = clip(cluster.voiceScript);
  const published = cluster.publishedAt ? new Date(cluster.publishedAt).toISOString() : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <link rel="icon" href="../favicon-32.png" sizes="32x32" type="image/png" />
    <meta property="og:site_name" content="4News" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(cluster.headline)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${SITE_URL}/icon-512.png" />
    <title>${escapeHtml(title)}</title>
    <script type="application/ld+json">${articleJsonLd(cluster, url, englishNews, "en")}</script>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; background: #f7f8f8; color: #172026; }
      main { max-width: 760px; margin: 0 auto; padding: 32px 20px 56px; }
      header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
      header img { width: 40px; height: 40px; border-radius: 8px; }
      header a { color: inherit; text-decoration: none; font-weight: 800; }
      article { background: #fff; border: 1px solid #d8dde2; border-radius: 8px; padding: 24px; }
      h1 { font-size: clamp(28px, 5vw, 44px); line-height: 1.08; margin: 0 0 18px; }
      h2 { font-size: 18px; margin: 28px 0 10px; }
      p, li { font-size: 18px; line-height: 1.65; }
      .meta { color: #66727a; font-size: 14px; }
      a { color: #0b63ce; }
      .notice { color: #66727a; font-size: 14px; margin-top: 28px; }
    </style>
  </head>
  <body>
    <main>
      <header>
        <img src="../icon.svg" alt="4News" />
        <a href="../">4News</a>
      </header>
      <article>
        <p class="meta">${published ? `Published ${escapeHtml(published)}` : "Australian news brief"}</p>
        <h1>${escapeHtml(cluster.headline)}</h1>
        <p>${escapeHtml(cluster.voiceScript)}</p>
        ${
          (cluster.differences || []).length
            ? `<section><h2>Source differences</h2><ul>${cluster.differences
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("\n")}</ul></section>`
            : ""
        }
        <section>
          <h2>Original sources</h2>
          <ul>${sourceList(cluster)}</ul>
        </section>
        <p class="notice">This 4News page is a rewritten brief based on public sources. It does not reproduce full news articles. Use original source links for full context.</p>
      </article>
    </main>
  </body>
</html>
`;
}

function sharePageHtml(cluster, language, news) {
  const filename = `${slug(cluster.id)}.html`;
  const url = `${SITE_URL}/share/${encodeURIComponent(language)}/${filename}`;
  const appUrl = `${SITE_URL}/?lang=${encodeURIComponent(language)}&id=${encodeURIComponent(
    cluster.id
  )}#${new URLSearchParams({ lang: language, id: cluster.id }).toString()}`;
  const title = cluster.headline;
  const description = clip(cluster.voiceScript, 180);

  return `<!doctype html>
<html lang="${escapeHtml(language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,follow,max-snippet:-1,max-image-preview:large" />
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(appUrl)}" />
    <link rel="icon" href="../../favicon-32.png" sizes="32x32" type="image/png" />
    <meta property="og:site_name" content="4News" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${SITE_URL}/icon-512.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/icon-512.png" />
    <title>${escapeHtml(title)} | 4News</title>
    <script type="application/ld+json">${articleJsonLd(cluster, url, news, language)}</script>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; background: #f7f8f8; color: #172026; }
      main { max-width: 720px; margin: 0 auto; padding: 32px 20px 56px; }
      header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
      header img { width: 44px; height: 44px; border-radius: 8px; }
      h1 { font-size: clamp(28px, 5vw, 42px); line-height: 1.12; margin: 0 0 18px; }
      p { font-size: 18px; line-height: 1.65; }
      a { color: #0b63ce; font-weight: 700; }
      .meta { color: #66727a; font-size: 15px; }
      .card { background: #fff; border: 1px solid #d8dde2; border-radius: 8px; padding: 24px; }
    </style>
  </head>
  <body>
    <main>
      <header>
        <img src="../../icon.svg" alt="4News" />
        <strong>4News</strong>
      </header>
      <article class="card">
        <h1>${escapeHtml(cluster.headline)}</h1>
        <p>${escapeHtml(cluster.voiceScript)}</p>
        <p><a href="${escapeHtml(appUrl)}">Open this brief in 4News</a></p>
      </article>
    </main>
  </body>
</html>
`;
}

function indexHtml(items) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index,follow" />
    <meta name="description" content="Latest crawlable 4News Australian news brief pages." />
    <link rel="canonical" href="${SITE_URL}/briefs/" />
    <link rel="icon" href="../favicon-32.png" sizes="32x32" type="image/png" />
    <title>Latest Australian News Briefs | 4News</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; background: #f7f8f8; color: #172026; }
      main { max-width: 860px; margin: 0 auto; padding: 32px 20px 56px; }
      header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
      header img { width: 40px; height: 40px; border-radius: 8px; }
      header a { color: inherit; text-decoration: none; font-weight: 800; }
      h1 { font-size: clamp(30px, 5vw, 48px); line-height: 1.08; margin: 0 0 12px; }
      p { color: #66727a; line-height: 1.6; }
      ul { list-style: none; padding: 0; display: grid; gap: 12px; }
      li { background: #fff; border: 1px solid #d8dde2; border-radius: 8px; padding: 16px; }
      li a { color: #172026; font-size: 20px; font-weight: 800; text-decoration: none; }
      li a:hover { color: #0b63ce; }
      time { display: block; color: #66727a; font-size: 14px; margin-top: 8px; }
    </style>
  </head>
  <body>
    <main>
      <header>
        <img src="../icon.svg" alt="4News" />
        <a href="../">4News</a>
      </header>
      <h1>Latest Australian News Briefs</h1>
      <p>Crawlable 4News brief pages generated from current multi-source Australian news summaries.</p>
      <ul>
        ${items
          .map(
            (item) => `<li>
          <a href="./${escapeHtml(item.filename)}">${escapeHtml(item.headline)}</a>
          <time datetime="${escapeHtml(item.publishedAt || "")}">${escapeHtml(item.publishedAt || "Recent brief")}</time>
        </li>`
          )
          .join("\n")}
      </ul>
    </main>
  </body>
</html>
`;
}

function sitemapXml(items) {
  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: "hourly", priority: "1.0" },
    { loc: `${SITE_URL}/briefs/`, changefreq: "hourly", priority: "0.9" },
    { loc: `${SITE_URL}/about.html`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/editorial-policy.html`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/corrections.html`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/privacy.html`, changefreq: "yearly", priority: "0.4" },
    { loc: `${SITE_URL}/terms.html`, changefreq: "yearly", priority: "0.4" },
    { loc: `${SITE_URL}/llms.txt`, changefreq: "weekly", priority: "0.7" }
  ];
  const urls = [
    ...staticUrls,
    ...items.map((item) => ({
      loc: item.url,
      lastmod: item.lastmod,
      changefreq: "weekly",
      priority: "0.8"
    }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${escapeHtml(item.loc)}</loc>
    ${item.lastmod ? `<lastmod>${escapeHtml(item.lastmod)}</lastmod>` : ""}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

clearDir(outDir);
clearDir(shareDir);

const sitemapItems = [];
for (const cluster of englishNews.clusters || []) {
  if (!cluster.id || !cluster.headline || !cluster.voiceScript) continue;
  const filename = `${slug(cluster.id)}.html`;
  fs.writeFileSync(path.join(outDir, filename), pageHtml(cluster, filename));
  sitemapItems.push({
    url: `${SITE_URL}/briefs/${filename}`,
    filename,
    headline: cluster.headline,
    publishedAt: cluster.publishedAt,
    lastmod: englishNews.updatedAt ? new Date(englishNews.updatedAt).toISOString() : cluster.publishedAt
  });
}

fs.writeFileSync(path.join(outDir, "index.html"), indexHtml(sitemapItems));
fs.writeFileSync("public/sitemap.xml", sitemapXml(sitemapItems));

let shareCount = 0;
for (const { language, payload } of newsFiles()) {
  const languageDir = path.join(shareDir, language);
  fs.mkdirSync(languageDir, { recursive: true });
  for (const cluster of payload.clusters || []) {
    if (!cluster.id || !cluster.headline || !cluster.voiceScript) continue;
    fs.writeFileSync(path.join(languageDir, `${slug(cluster.id)}.html`), sharePageHtml(cluster, language, payload));
    shareCount += 1;
  }
}

console.log(`Generated ${sitemapItems.length} SEO brief pages and ${shareCount} share preview pages.`);
