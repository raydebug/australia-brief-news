import fs from "node:fs";

const languages = [
  { code: "zh-Hans", files: ["public/news.zh-Hans.json", "docs/news.zh-Hans.json", "public/news.json", "docs/news.json"], marker: /[\u4e00-\u9fff]/ },
  { code: "zh-Hant", files: ["public/news.zh-Hant.json", "docs/news.zh-Hant.json"], marker: /[\u4e00-\u9fff]/ },
  { code: "si", files: ["public/news.si.json", "docs/news.si.json"], marker: /[\u0d80-\u0dff]/ },
  { code: "ja", files: ["public/news.ja.json", "docs/news.ja.json"], marker: /[\u3040-\u30ff\u4e00-\u9fff]/ },
  { code: "ko", files: ["public/news.ko.json", "docs/news.ko.json"], marker: /[\uac00-\ud7af]/ },
  { code: "vi", files: ["public/news.vi.json", "docs/news.vi.json"], marker: /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i },
  { code: "th", files: ["public/news.th.json", "docs/news.th.json"], marker: /[\u0e00-\u0e7f]/ }
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function translatedPersonAliasRules() {
  const source = fs.readFileSync("src/main.jsx", "utf8");
  const rules = [];
  const entryPattern = /name:\s*"([^"]+)"[\s\S]*?aliases:\s*\[([^\]]+)\]/g;
  let match;

  while ((match = entryPattern.exec(source))) {
    const name = match[1];
    const aliases = [...match[2].matchAll(/"([^"]+)"/g)].map((aliasMatch) => aliasMatch[1]);

    aliases
      .filter((alias) => alias !== name && /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(alias))
      .forEach((alias) => rules.push({ name, alias }));
  }

  return rules;
}

const translatedPersonAliases = translatedPersonAliasRules();

function fail(message, details = {}) {
  console.error(`news data validation failed: ${message}`);
  if (Object.keys(details).length) console.error(JSON.stringify(details, null, 2));
  process.exitCode = 1;
}

function localizedCommentary(cluster, language) {
  const commentary = cluster?.fourNewsCommentary;
  if (typeof commentary === "string") return commentary;
  return commentary?.[language] || commentary?.en || "";
}

function validateFourNewsCommentary(cluster, language) {
  const commentary = normalize(localizedCommentary(cluster, language));
  if (!commentary) return [];

  const lower = commentary.toLowerCase();
  const aiMentions = lower.match(/\bai\b|\bia\b|人工智能|算法|演算法|アルゴリズム|알고리즘/g) || [];
  const genericSignals = [
    "这类问题",
    "這類問題",
    "这类社会问题",
    "這類社會問題",
    "这条新闻真正值得追",
    "這條新聞真正值得追",
    "对照其他发达国家",
    "對照其他發達國家",
    "developed countries",
    "developed-country experience",
    "ai should act as radar",
    "ai 的位置",
    "ai は裁判官ではなくレーダー",
    "ai는 판사가 아니라 레이더",
    "new zealand wellbeing budget",
    "phoenix payroll system",
    "public-it failures"
  ];

  const errors = [];
  if (aiMentions.length > 1) {
    errors.push({ type: "four-news-commentary-too-many-ai-mentions", id: cluster.id, language, count: aiMentions.length });
  }

  const genericSignal = genericSignals.find((signal) => lower.includes(signal.toLowerCase()));
  if (genericSignal) {
    errors.push({ type: "four-news-commentary-generic-template", id: cluster.id, language, signal: genericSignal });
  }

  return errors;
}

function validateSocialDiscussions(cluster, language, sourceCluster = cluster) {
  const errors = [];
  const socialDiscussions = cluster?.socialDiscussions;
  if (!socialDiscussions) return errors;

  const englishItems = Array.isArray(sourceCluster?.socialDiscussions)
    ? sourceCluster.socialDiscussions
    : sourceCluster?.socialDiscussions?.en || [];
  const englishTitlesByUrl = new Map(
    englishItems
      .filter((item) => item?.url && item?.title)
      .map((item) => [normalizeSocialUrl(item.url), normalize(item.title)])
  );

  const groups = Array.isArray(socialDiscussions)
    ? [["default", socialDiscussions]]
    : Object.entries(socialDiscussions).filter(([, items]) => Array.isArray(items));

  for (const [groupLanguage, items] of groups) {
    for (const item of items) {
      const url = String(item?.url || "");
      if (/reddit\.com\/.+[?&]tl=/i.test(url)) {
        errors.push({
          type: "reddit-machine-translation-url",
          id: cluster.id,
          language,
          groupLanguage,
          url
        });
      }

      const englishTitle = englishTitlesByUrl.get(normalizeSocialUrl(url));
      if (groupLanguage !== "en" && englishTitle && normalize(item?.title) !== englishTitle) {
        errors.push({
          type: "translated-social-title",
          id: cluster.id,
          language,
          groupLanguage,
          url,
          title: normalize(item?.title).slice(0, 120),
          expectedOriginalTitle: englishTitle.slice(0, 120)
        });
      }
    }
  }

  return errors;
}

function normalizeSocialUrl(value) {
  try {
    const url = new URL(String(value || ""));
    url.searchParams.delete("tl");
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return String(value || "").replace(/[?#].*$/, "").replace(/\/$/, "");
  }
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

  const commentaryErrors = validateFourNewsCommentary(cluster, "en");
  if (commentaryErrors.length) {
    fail("public English 4News commentary invalid", { examples: commentaryErrors.slice(0, 10) });
  }

  const commentaryDocsErrors = validateFourNewsCommentary(englishDocs.clusters[index] || {}, "en");
  if (commentaryDocsErrors.length) {
    fail("docs English 4News commentary invalid", { examples: commentaryDocsErrors.slice(0, 10) });
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

      const translatedPersonAlias = translatedPersonAliases.find(
        (rule) => combined.includes(rule.alias) && !combined.includes(rule.name)
      );
      if (translatedPersonAlias) {
        errors.push({
          type: "translated-person-name",
          id: source.id,
          canonical: translatedPersonAlias.name,
          alias: translatedPersonAlias.alias
        });
      }

      errors.push(...validateFourNewsCommentary(translated, config.code));
      errors.push(...validateSocialDiscussions(translated, config.code, source));

    }

    if (errors.length) {
      fail(`${file} has ${errors.length} issue(s)`, { examples: errors.slice(0, 10) });
    } else {
      console.log(`${file}: ok`);
    }
  }
}

for (const config of languages) {
  const publicFile = config.files.find((file) => file.startsWith("public/news."));
  const docsFile = config.files.find((file) => file.startsWith("docs/news."));
  if (!publicFile || !docsFile) continue;

  const publicPayload = readJson(publicFile);
  const docsPayload = readJson(docsFile);
  const errors = [];

  for (let index = 0; index < english.clusters.length; index += 1) {
    const publicCluster = publicPayload.clusters?.[index];
    const docsCluster = docsPayload.clusters?.[index];
    if (!publicCluster || !docsCluster || publicCluster.id !== docsCluster.id) continue;

    if (JSON.stringify(publicCluster.socialDiscussions || null) !== JSON.stringify(docsCluster.socialDiscussions || null)) {
      errors.push({ type: "social-discussions-mismatch", id: publicCluster.id });
    }
  }

  if (errors.length) {
    fail(`${publicFile} and ${docsFile} social discussion data differ`, { examples: errors.slice(0, 10) });
  }
}

if (!process.exitCode) {
  console.log("news data validation passed");
}
