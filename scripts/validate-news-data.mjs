import fs from "node:fs";

const languages = [
  { code: "zh-Hans", files: ["public/news.zh-Hans.json", "docs/news.zh-Hans.json", "public/news.json", "docs/news.json"], marker: /[\u4e00-\u9fff]/ },
  { code: "zh-Hant", files: ["public/news.zh-Hant.json", "docs/news.zh-Hant.json"], marker: /[\u4e00-\u9fff]/ },
  { code: "si", files: ["public/news.si.json", "docs/news.si.json"], marker: /[\u0d80-\u0dff]/ },
  { code: "ja", files: ["public/news.ja.json", "docs/news.ja.json"], marker: /[\u3040-\u30ff\u4e00-\u9fff]/ },
  { code: "ko", files: ["public/news.ko.json", "docs/news.ko.json"], marker: /[\uac00-\ud7af]/ },
  { code: "vi", files: ["public/news.vi.json", "docs/news.vi.json"], marker: /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i },
  { code: "th", files: ["public/news.th.json", "docs/news.th.json"], marker: /[\u0e00-\u0e7f]/ },
  { code: "es", files: ["public/news.es.json", "docs/news.es.json"], marker: /\b(el|la|los|las|un|una|que|de|del|para|con|por|sobre|despu[eé]s|gobierno|polic[ií]a|tribunal)\b/i }
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function fail(message, details = {}) {
  console.error(`news data validation failed: ${message}`);
  if (Object.keys(details).length) console.error(JSON.stringify(details, null, 2));
  process.exitCode = 1;
}

function validateSocialDiscussions(cluster) {
  const errors = [];
  if (cluster.socialDiscussions == null) return errors;

  if (!Array.isArray(cluster.socialDiscussions)) {
    return [{ type: "social-discussions-not-array", id: cluster.id }];
  }

  cluster.socialDiscussions.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      errors.push({ type: "social-discussion-not-object", id: cluster.id, index });
      return;
    }

    for (const field of ["platform", "title", "url"]) {
      if (!normalize(item[field])) {
        errors.push({ type: "social-discussion-missing-field", id: cluster.id, index, field });
      }
    }

    try {
      const url = new URL(item.url);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.push({ type: "social-discussion-invalid-url-protocol", id: cluster.id, index, url: item.url });
      }
    } catch {
      errors.push({ type: "social-discussion-invalid-url", id: cluster.id, index, url: item.url });
    }

    for (const field of ["comments", "likes", "upvotes", "shares", "reposts", "score"]) {
      if (item[field] == null) continue;
      const value = Number(item[field]);
      if (!Number.isFinite(value) || value < 0) {
        errors.push({ type: "social-discussion-invalid-metric", id: cluster.id, index, field, value: item[field] });
      }
    }
  });

  return errors;
}

const english = readJson("public/news.en.json");
const englishDocs = readJson("docs/news.en.json");

if (english.clusters.length !== englishDocs.clusters.length) {
  fail("public/docs English cluster count mismatch", {
    public: english.clusters.length,
    docs: englishDocs.clusters.length
  });
}

english.clusters.forEach((cluster, index) => {
  if (cluster.id !== englishDocs.clusters[index]?.id) {
    fail("public/docs English id order mismatch", { index, public: cluster.id, docs: englishDocs.clusters[index]?.id });
  }

  const socialErrors = validateSocialDiscussions(cluster);
  if (socialErrors.length) {
    fail("public English social discussions invalid", { examples: socialErrors.slice(0, 10) });
  }

  const socialDocsErrors = validateSocialDiscussions(englishDocs.clusters[index] || {});
  if (socialDocsErrors.length) {
    fail("docs English social discussions invalid", { examples: socialDocsErrors.slice(0, 10) });
  }

  const socialPublic = JSON.stringify(cluster.socialDiscussions || []);
  const socialDocs = JSON.stringify(englishDocs.clusters[index]?.socialDiscussions || []);
  if (socialPublic !== socialDocs) {
    fail("public/docs English social discussions mismatch", { id: cluster.id });
  }
});

for (const config of languages) {
  for (const file of config.files) {
    const payload = readJson(file);
    const errors = [];

    if (payload.language !== config.code) {
      errors.push({ type: "language", expected: config.code, actual: payload.language });
    }

    if ((payload.clusters || []).length !== english.clusters.length) {
      errors.push({ type: "cluster-count", expected: english.clusters.length, actual: payload.clusters?.length });
    }

    for (let index = 0; index < english.clusters.length; index += 1) {
      const translated = payload.clusters?.[index];
      const source = english.clusters[index];
      if (!translated) continue;

      if (translated.id !== source.id) {
        errors.push({ type: "id-order", index, expected: source.id, actual: translated.id });
        continue;
      }

      const translatedHeadline = normalize(translated.headline);
      const translatedScript = normalize(translated.voiceScript);
      const sourceHeadline = normalize(source.headline);
      const sourceScript = normalize(source.voiceScript);
      const combined = `${translatedHeadline} ${translatedScript}`;

      if (translated.language !== config.code) {
        errors.push({ type: "cluster-language", id: source.id, expected: config.code, actual: translated.language });
      }

      if (translatedHeadline === sourceHeadline || translatedScript === sourceScript) {
        errors.push({ type: "untranslated", id: source.id, headline: translatedHeadline.slice(0, 120) });
      }

      if (!config.marker.test(combined)) {
        errors.push({ type: "missing-language-marker", id: source.id, headline: translatedHeadline.slice(0, 120) });
      }

      errors.push(...validateSocialDiscussions(translated));

      const translatedSocial = JSON.stringify(translated.socialDiscussions || []);
      const sourceSocial = JSON.stringify(source.socialDiscussions || []);
      if (translatedSocial !== sourceSocial) {
        errors.push({ type: "social-discussions-not-synced", id: source.id });
      }
    }

    if (errors.length) {
      fail(`${file} has ${errors.length} issue(s)`, { examples: errors.slice(0, 10) });
    } else {
      console.log(`${file}: ok`);
    }
  }
}

if (!process.exitCode) {
  console.log("news data validation passed");
}
