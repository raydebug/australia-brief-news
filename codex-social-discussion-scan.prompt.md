You are maintaining the local 4News GitHub Pages site in this repository.

Goal: scan for real public social-media discussion links for the current recent news clusters, update the static JSON data, build, commit, and push.

Rules:
- Work only in this repository.
- Read `README.md` first and follow the `社交媒体讨论后补` rules.
- Use live web search.
- Only add `socialDiscussions` entries that are real public posts or public discussion pages directly related to the news cluster.
- Do not add generic search-result URLs.
- Do not add login-only, private group, private profile, or inaccessible posts.
- Search across all currently supported languages, not only English. Prefer discussion links matching each language file when available.
- Prefer Reddit posts, public X posts, public YouTube video pages where the public comment thread is relevant, and public Facebook Page posts.
- For Chinese, Japanese, Korean, Vietnamese, Thai, Sinhala, and Spanish runs, include public discussion posts or comment-entry pages in that language when directly related to the same news cluster.
- Facebook Groups, Instagram, and TikTok are allowed only if the post is public and directly accessible without logging in.
- For each entry include:
  - `platform`
  - `community`, `account`, or `author` when visible
  - `title`
  - `url`
  - `postedAt` if visible
  - visible metrics such as `comments`, `likes`, `shares`, `reposts`, `upvotes`
  - `score`
- Score formula: `comments * 3 + shares/reposts * 2 + likes/upvotes`, adjusted down if the match is indirect.
- Keep at most 5 discussions per language per news cluster, sorted by score descending.
- `socialDiscussions` may differ by language. Prefer this structure when language-specific links exist:
  - `socialDiscussions.en`
  - `socialDiscussions.zh-Hans`
  - `socialDiscussions.zh-Hant`
  - `socialDiscussions.si`
  - `socialDiscussions.ja`
  - `socialDiscussions.ko`
  - `socialDiscussions.vi`
  - `socialDiscussions.th`
  - `socialDiscussions.es`
- If a cluster only has language-neutral or English discussion links, keeping the legacy array form is allowed.
- Keep `public/news.{lang}.json` and `docs/news.{lang}.json` identical for the same language. Keep `public/news.json` and `docs/news.json` aligned with Simplified Chinese.
- If no real discussion exists for a cluster, leave `socialDiscussions` empty or absent.
- Do not invent metrics. If metrics are not visible, omit them and use a conservative `score`.
- People context must not be silently ignored:
  - For every newest or high-impact cluster you touch, extract named people from the headline, voice script, source differences, and source titles.
  - If a named person is a politician, elected official, senior public office-holder, public company executive, athlete, artist, or otherwise news-relevant public figure, check whether they are already covered by `PEOPLE_CONTEXT` in `src/main.jsx`.
  - If not covered, add them with aliases, `type`, verified link fields, and concise multilingual background. For politicians, also add concise multilingual `positions`.
  - Use `profile` or `officialProfile` for official biography/profile pages.
  - Use `social` or `personalSocial` only for a verified personal/public social-media account such as X, Instagram, Facebook, YouTube, TikTok, Threads, LinkedIn, or Bluesky.
  - In brief text, linked names should point to the personal/public social-media account when available; official profile links belong in the person context card.
  - Do not add private individuals, victims, minors, witnesses, ordinary staff, or people whose identity should not be amplified.
  - If no reliable public social/profile URL is found, use the most authoritative official biography page. Do not fabricate social accounts.
  - Non-political public office holders should get background only, not political positions.
- Run `npm run audit:people` after data updates. Treat its output as a review queue: resolve obvious public figures and leave ordinary/private names alone.
- After updating data, run `npm run build`.
- If validation and build pass, commit and push with a concise message.
- If there are no data changes, do not create an empty commit.

This run should prioritise the newest and highest-impact clusters first, then continue through as many recent clusters as practical within the run.
