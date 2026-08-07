You are maintaining the local 4News GitHub Pages site in this repository.

Goal: scan for real public social-media discussion links for current recent news clusters, update each news cluster's `socialDiscussions` data, build, commit, and push.

Scope boundary:
- Restore and maintain per-news social discussion data only.
- Do not recreate, update, or reference any removed site-level daily social hot-post/trends feature.
- Do not add `social-trends.*` files, `dailySocialTrends`, daily hot-post panels, or standalone non-news social trend data.

Rules:
- Work only in this repository.
- Read `README.md` first and follow its content, people-link, copyright, and publication rules.
- Use live web search.
- Only add `socialDiscussions` entries that are real public posts or public discussion pages directly related to the news cluster.
- Do not add generic search-result URLs.
- Do not add login-only, private group, private profile, or inaccessible posts.
- Search across all currently supported languages, not only English. Prefer discussion links matching each language file when available.
- English discussion links are default-visible in every non-English UI and should remain as fallback/context after language-specific links.
- Prioritise non-official public discussion over official/media/source posts.
- Rank candidate links primarily by visible engagement score and discussion activity.
- Prefer Reddit threads, public posts from ordinary users or community accounts on X/Threads/Bluesky, public forum discussions, public Facebook group/page posts with active public comments, and public YouTube videos where the comment thread is clearly active and relevant.
- Official media, government, company, source, politician, and organisation posts are fallback only, unless their public comment thread is visibly the main active discussion around that news item.
- If an official/media post has lower engagement than a directly related non-official/community post, keep the non-official/community post above it.
- Existing official/media discussion links may be replaced or pushed down when better non-official, higher-engagement, directly related links are found.
- For Chinese, Japanese, Korean, Vietnamese, Thai, Sinhala, and Spanish runs, include public discussion posts or comment-entry pages in that language when directly related to the same news cluster.
- Facebook Groups, Instagram, and TikTok are allowed only if the post is public and directly accessible without logging in.

For each `socialDiscussions` entry include:
- `platform`
- `community`, `account`, or `author` when visible
- `title`
- `url`
- `postedAt` if visible
- visible metrics such as `comments`, `likes`, `shares`, `reposts`, `upvotes`
- `score`

Scoring:
- Use `comments * 3 + shares/reposts * 2 + likes/upvotes`.
- Adjust the score down if the match is indirect.
- Apply a source-priority adjustment after relevance is confirmed: non-official/community discussion can keep its full score; official/media/government/source posts should be discounted unless their visible comment thread is clearly the main public discussion.
- Do not invent metrics. If metrics are not visible, omit them and use a conservative score.
- Keep at most 5 discussions per language per news cluster, sorted by score descending.

Data shape:
- `socialDiscussions` may differ by language.
- Prefer this object structure when language-specific links exist:
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
- If no real discussion exists for a cluster, leave `socialDiscussions` empty or absent.
- Keep `public/news.{lang}.json` and `docs/news.{lang}.json` identical for the same language.
- Keep `public/news.json` and `docs/news.json` aligned with Simplified Chinese.

People context must not be silently ignored:
- For every newest or high-impact cluster you touch, extract named people from the headline, voice script, source differences, and source titles.
- For every named person, first decide whether they are a news-relevant public figure or a private/protected person.
- For public figures, actively search for a verified personal/public social-media account before falling back to an official profile.
- If a named person is a politician, elected official, senior public office-holder, public company executive, athlete, artist, or otherwise news-relevant public figure, check whether they are already covered by `PEOPLE_CONTEXT` in `src/main.jsx`.
- If not covered, add them with aliases, `type`, verified link fields, and concise multilingual background.
- For politicians, also add concise multilingual `positions` with their most important policy views, no more than three.
- Use `profile` or `officialProfile` for official biography/profile pages.
- Use `social` or `personalSocial` for a verified personal/public social-media account such as X, Instagram, Facebook, YouTube, TikTok, Threads, LinkedIn, or Bluesky.
- If no reliable social account exists, a clearly personal public website, campaign site, charity project site, or fundraiser page may be used.
- Do not use publisher article pages, ordinary search results, or unverified accounts as person links.
- In brief text, linked names should point to the personal/public social-media account or personal public presence when available.
- Official profile links belong in the person context card.
- In translated brief text, keep person names in their English canonical form where practical. Transliterated aliases may be kept only for matching, not as the preferred display form.
- Do not add private individuals, victims, minors, witnesses, ordinary staff, or people whose identity should not be amplified.
- If no reliable public social/profile URL is found, use the most authoritative official biography page. Do not fabricate social accounts.
- Non-political public office holders should get background only, not political positions.

Checks:
- Run `npm run audit:people` after data updates. Treat its output as a review queue: resolve obvious public figures and leave ordinary/private names alone.
- Run `npm run build`.
- If validation and build pass, commit and push with a concise message.
- If there are no data changes, do not create an empty commit.

Priority:
- Prioritise newest and highest-impact clusters first.
- 4News should prioritise Australian social issues and development issues, while still preserving a limited number of breaking or high-heat stories.
- Continue through as many recent clusters as practical within the run.
