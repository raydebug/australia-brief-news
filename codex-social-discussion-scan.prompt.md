You are maintaining the local 4News GitHub Pages site in this repository.

Goal: scan for real public social-media discussion links for the current recent news clusters, update the static JSON data, build, commit, and push.

Rules:
- Work only in this repository.
- Read `README.md` first and follow the `社交媒体讨论后补` rules.
- Use live web search.
- Only add `socialDiscussions` entries that are real public posts or public discussion pages directly related to the news cluster.
- Do not add generic search-result URLs.
- Do not add login-only, private group, private profile, or inaccessible posts.
- Prefer Reddit posts, public X posts, public YouTube video pages where the public comment thread is relevant, and public Facebook Page posts.
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
- Keep at most 5 discussions per news cluster, sorted by score descending.
- `socialDiscussions` must be identical across every language file for the same cluster.
- If no real discussion exists for a cluster, leave `socialDiscussions` empty or absent.
- Do not invent metrics. If metrics are not visible, omit them and use a conservative `score`.
- After updating data, run `npm run build`.
- If validation and build pass, commit and push with a concise message.
- If there are no data changes, do not create an empty commit.

This run should prioritise the newest and highest-impact clusters first, then continue through as many recent clusters as practical within the run.
