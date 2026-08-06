You are maintaining the local 4News GitHub Pages site in this repository.

Goal: once per day, scan the past 24 hours of public social-media activity for the top non-news discussions about Australia, update the static social-trends JSON files, build, commit, and push.

Rules:
- Work only in this repository.
- Read `README.md` first and follow the `每日非新闻社媒热议` rules.
- Use live web search. Do not invent posts, metrics, timestamps, or languages.
- Scan public, directly openable social posts or discussion pages only. Do not add login-only, private group, private profile, generic search result, or inaccessible URLs.
- This task is for non-news social discussion, not story-specific news links. Exclude posts whose main purpose is reposting or discussing a current news article, breaking-news item, publisher headline, or official news report.
- Suitable topics include Australia-related daily life, housing/renting experience, migration/study/work discussion, sport fan chatter, food/travel, culture, community problems, public-service experience, memes, practical advice, and broader social/development issues when the post itself is a social discussion rather than a news item.
- Always produce an English top 3 in `public/social-trends.en.json`.
- For each currently supported non-English language, search for public discussions in that language and write the best top 3 to:
  - `public/social-trends.zh-Hans.json`
  - `public/social-trends.zh-Hant.json`
  - `public/social-trends.si.json`
  - `public/social-trends.ja.json`
  - `public/social-trends.ko.json`
  - `public/social-trends.vi.json`
  - `public/social-trends.th.json`
  - `public/social-trends.es.json`
- If a language has fewer than three credible public posts, include only the credible posts. If none are credible, use an empty `items` array.
- Keep `docs/social-trends.{lang}.json` identical to `public/social-trends.{lang}.json` after build.
- Each JSON file must use this structure:

```json
{
  "language": "en",
  "updatedAt": "2026-08-07T09:00:00+10:00",
  "windowHours": 24,
  "items": [
    {
      "id": "stable-slug",
      "language": "en",
      "platform": "Reddit",
      "community": "r/australia",
      "title": "Visible post title or concise public post summary",
      "url": "https://...",
      "postedAt": "2026-08-07T06:30:00+10:00",
      "comments": 120,
      "likes": 80,
      "shares": 5,
      "score": 450,
      "topic": "housing",
      "summary": "One short sentence explaining why Australians are discussing it."
    }
  ]
}
```

Ranking:
- Score formula: `comments * 3 + shares/reposts * 2 + likes/upvotes`, adjusted down if the topic is only weakly Australia-specific.
- Prefer posts with visible discussion depth over passive likes.
- Prefer posts from the past 24 hours. Do not include stale posts unless the visible discussion surge is clearly within the past 24 hours.
- Sort each file by `score` descending and keep at most 3 items.

Language display requirement:
- The site shows English trends in every language.
- It only shows the selected UI language's additional trends, never all languages at once.
- Therefore language-specific files should contain that language's own public discussions only, not translated copies of English posts.

Validation:
- Before build, check every URL opens publicly and every `postedAt` is within the intended 24-hour window or has a visible recent activity reason.
- Confirm every included item is non-news social discussion.
- Run `npm run build`.
- If build passes and data changed, commit and push with a concise message such as `Update daily social trends`.
- If no credible trend data changed, do not create an empty commit.
