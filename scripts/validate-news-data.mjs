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
