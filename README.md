# 4News

一个客观、独立、适合 GitHub Pages、手机桌面安装和后续 iOS/Android 打包的跨平台澳洲新闻简报 App：

- 本地拉取多个澳洲新闻来源
- 自动把相近标题合并成同一新闻簇
- 为每个新闻簇生成约 1 分钟语音稿
- 保留每个原始来源链接
- 总结不同媒体的报道角度差异
- 支持 PWA 安装、离线缓存和 Capacitor 移动端外壳
- 支持按当前语言进行浏览器语音朗读
- 可为每条新闻后补公开社交媒体热门讨论入口

## 内容更新

内容由 Codex 定时任务每小时更新一次。任务会维护按语言拆分的数据文件，再构建 `docs/` 供 GitHub Pages 发布。

定时任务生成完成后必须先确认多语言数据一致性：

```bash
npm run validate:news
npm run build
```

`validate:news` 会检查所有语言文件的新闻数量、ID 顺序、语言字段、明显未翻译文本和发布目录同步状态。检查失败时不要发布。

## SEO / GEO 周维护

另有一个每周 Codex 定时任务维护搜索和生成式搜索可见性。任务提示文件是 `codex-weekly-seo-geo.prompt.md`。

维护边界：

- 只能围绕 4News 的真实定位优化：极简、客观、独立、多源、AI 驱动的澳洲新闻简报。
- 每周 SEO / GEO 优化必须覆盖所有已支持语言，并统一体现三个核心用途：简单学习英语、寻找聊天话题、快速了解澳洲。
- 优先维护 `index.html` 的基础 meta/结构化数据、`robots.txt`、`sitemap.xml`、`llms.txt`、政策页和 README 规则。
- 可以参考当周澳洲新闻搜索趋势来调整描述语言，但不能追热点堆关键词。
- 不能复制新闻原文、标题党化、伪装原创报道、加入隐藏关键词或创建 doorway pages。
- 没有明确收益时不提交改动。

### 4News 点评生成规则

`fourNewsCommentary` 是可选字段，不是每条新闻都要生成。没有具体、专业、可辩护的新角度时，应留空，让页面不显示点评。

生成要求：

- 点评必须针对当前新闻本身，不要套用“这类问题”“发达国家经验表明”之类通用开头。
- 先判断这条新闻有没有值得 4News 单独补充的专业视角：制度漏洞、激励错位、执行难点、可借鉴的行业实践、可验证的政策选项，或媒体报道没有展开的关键约束。
- 跨国例子只在方向高度一致时使用；不要把不相干的国家案例拼在一起。成功经验和失败经验必须服务于同一个判断。
- 不要主动提 AI。只有当新闻本身涉及 AI、自动化系统、数据治理、算法决策或技术落地方案时，才可以具体说明技术能做什么、不能做什么。
- 避免“早期预警、信息整合、资源分配、人工负责”这类泛化句式，除非能写出具体场景、责任主体和可验证指标。
- 点评长度最多约 2 分钟；优先短而有判断。写不出有新意的观点时不写。
- 各语言版本必须表达同一个判断，不要英文、中文、日文各自换方向。

### 社交媒体讨论后补

每条新闻簇可以带一个可选字段 `socialDiscussions`，用于列出已经出现的公开热门讨论贴。没有真实讨论时不要显示占位内容，也不要放普通搜索结果入口。社媒讨论可以按语言分别维护；页面会优先显示当前界面语言的讨论链接，并把英文或通用链接作为缺省补充排在后面。

字段结构：

```json
"socialDiscussions": [
  {
    "platform": "Reddit",
    "community": "r/australia",
    "title": "Discussion title or post text summary",
    "url": "https://...",
    "postedAt": "2026-07-31T08:10:00+10:00",
    "comments": 128,
    "likes": 420,
    "shares": 12,
    "score": 804
  }
]
```

也可以使用按语言分组的结构：

```json
"socialDiscussions": {
  "en": [{ "platform": "Reddit", "title": "English discussion", "url": "https://...", "score": 120 }],
  "zh-Hans": [{ "platform": "YouTube", "title": "中文讨论", "url": "https://...", "score": 80 }]
}
```

兼容字段 `localizedSocialDiscussions` 和 `socialDiscussionsByLanguage` 也按同样结构读取。

生成规则：

- 社交讨论通常滞后于新闻发布，定时任务应把它作为后补字段，而不是新闻首次生成时一次性定稿。
- 对新新闻执行错时扫描：入库时快速扫一次，约 2 小时、6 小时、24 小时后各补扫一次；之后只在最近两周保留期内低频刷新。
- 只列公开可访问、能直接打开的讨论贴；不要抓取私密群组、登录后才可见的内容或 Meta 明确限制自动化访问的页面。
- 搜索范围应覆盖当前支持语言。英文优先 Reddit、公开 X 帖、公开 YouTube 视频评论入口、公开 Facebook Page 帖；中文可补充公开 YouTube、Facebook Page、X、Threads、Reddit 中文讨论；日语、韩语、越南语、泰语、西班牙语、僧伽罗语也应优先找对应语言的公开帖子或评论入口。Facebook Groups、Instagram、TikTok 只有在公开且合规可访问时才记录。
- 热度按互动速度和总量综合判断，不只看点赞总数。建议基础分：`comments * 3 + shares/reposts * 2 + likes/upvotes`，再按发布时间衰减。
- 每条新闻最多保留 5 个代表性讨论，按 `score` 降序。
- 不同语言可以有不同的 `socialDiscussions`。同一语言的 `public/news.{lang}.json` 和 `docs/news.{lang}.json` 必须保持一致；`public/news.json` 作为旧入口，跟随简体中文。

### 人物链接规则

新闻中出现的人名都应先进入人物识别和账号查找流程。对名人、政客、运动员、艺术家、企业高管等新闻相关公共人物，要尽量查找可核实的个人/公开自媒体账号；找不到可靠归属时不要硬加。`PEOPLE_CONTEXT` 的链接字段要区分用途：

- `profile` 或 `officialProfile`：官方介绍页、议会页面、机构 biography、运动员官方档案等，用于人物背景卡片。
- `social` 或 `personalSocial`：已核实的个人/公开社交媒体账号，例如 X、Instagram、Facebook、YouTube、TikTok、Threads、LinkedIn、Bluesky，用于简闻正文里人名上的链接。没有可靠社媒账号时，可以使用本人公开个人网站、竞选/公益项目网站或募款主页，但不能用媒体报道页、普通搜索结果或未核实账号冒充个人账号。
- 多语言简报中的人名默认保留英文原名，不主动音译；已有音译别名只能用于识别，不能作为标题或正文显示文本，也不要写成“英文名（音译名）”。`validate:news` 会把已知音译别名视为错误。
- 如果只有机构官方 profile、没有个人社媒账号或个人公开项目页，简闻正文里的人名不要链接到官方 profile；官方 profile 仍显示在人物背景卡片里。
- 不要给私人账号、未核实账号、未成年人、受害者、证人或普通员工添加人物链接。

当前语言文件：

- `public/news.en.json`
- `public/news.zh-Hans.json`
- `public/news.zh-Hant.json`
- `public/news.si.json`
- `public/news.ja.json`
- `public/news.ko.json`
- `public/news.vi.json`
- `public/news.th.json`
- `public/news.json`：兼容旧入口，保持为简体中文内容

## 数据源网站

App 默认按当前语言读取当前站点里的 `news.{lang}.json`。如果要把一个线上网站作为数据源，复制 `.env.example` 为 `.env`，设置：

```bash
VITE_NEWS_SOURCE_URL=https://your-site.example/news.{lang}.json
```

`{lang}` 会被替换成 `en`、`es`、`zh-Hans`、`zh-Hant`、`si`、`ja`、`ko`、`vi` 或 `th`。这个地址需要返回与 `public/news.zh-Hans.json` 相同结构的数据。

## 本地预览

```bash
npm install
npm run dev
```

页面：<http://localhost:5173/>

## 跨平台 App

当前版本是 React + Vite PWA，可直接在支持的浏览器里安装到桌面或手机主屏幕。构建：

```bash
npm run build
```

如果要继续生成原生 iOS/Android 项目，可使用 Capacitor：

```bash
npm run cap:sync
```

之后按需添加平台：

```bash
npx cap add ios
npx cap add android
```

## 发布到 GitHub Pages

Codex 定时任务会更新 `public/news.*.json` 并构建 `docs/`。把仓库推送到 GitHub 后，在 GitHub Pages 设置里选择：

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/docs`

## 来源配置

新闻源记录在 `public/news.json` 的 `sources` 字段里。Codex 定时任务更新内容时会维护这些来源信息：

- `id`
- `name`
- `region`
- `feed`
- `tone`

## 收录优先级

4News 优先关注澳洲社会问题和发展问题，而不是追求所有热点的完整覆盖。新闻进入候选池和最终排序时，优先级按以下方向判断：

- 社会问题：住房、医疗、教育、治安、移民、原住民事务、贫困、劳动条件、家庭暴力、歧视、社区安全、公共服务失灵。
- 发展问题：基础设施、城市规划、能源转型、电网与水资源、AI 和数字基础设施、产业政策、区域发展、生产率、公共财政、长期竞争力。
- 公共政策和制度问题：法律、监管、政府预算、公共问责、选举、腐败调查、行政能力和跨部门治理。
- 商业和科技新闻只有在影响就业、产业结构、公共服务、隐私、安全、能源、环境或澳洲长期发展时优先收录。
- 体育、娱乐、名人、灾害和犯罪新闻，只有在反映更大的社会问题、公共安全、制度缺口或广泛社区影响时才优先展示。

每轮定时任务应保留一定数量的突发和高热度新闻，但默认排序要让社会/发展议题靠前。

news.com.au 的 `latest-news-rss` 经常返回网页或漏掉分类新闻，不能作为唯一入口。定时任务每轮都要额外做 search-assisted fallback，至少覆盖：

- `site:news.com.au/technology/environment Australia`
- `site:news.com.au/technology/environment/sustainability Australia`
- `site:news.com.au/technology AI data centre Australia`
- `site:news.com.au/national NSW planning development environment`
- 最近 24-48 小时内的 `news.com.au Australia local planning data centre environment community objections`

这类本地规划、环境、AI 基础设施、电网和社区冲突新闻，即使只有一个来源，也应进入候选池；是否展示再由澳洲相关性、公共影响和重复度过滤决定。

## 商业运行降风险规则

- 只基于公开来源中的事实重新撰写简报，不复制新闻原文、原始标题、图片、视频、音频或官方 logo。
- `headline` 和 `voiceScript` 必须使用自己的结构和措辞，不照搬任一来源文章的句子、段落顺序或独特表达。
- `links` 只保存 `source` 和 `url`，不保存原文 `title`、`excerpt`、`description`、图片或 favicon。
- 来源图标由前端用本地文字缩写生成，不请求或展示媒体官方图标。
- 页面提供站点级内容说明，明确本站是基于事实重写的简报和来源链接，不替代原始报道。

## 后续可接入

- 历史归档：按日期保存多份 JSON
- 模型摘要：把 `makeVoiceScript` 和 `makeDifferences` 换成 LLM 调用
- 语音：用 TTS 把语音稿生成音频文件
- 管理脚本：添加、暂停、排序新闻源
