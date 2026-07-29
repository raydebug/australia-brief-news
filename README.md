# 4News

一个客观、独立、适合 GitHub Pages、手机桌面安装和后续 iOS/Android 打包的跨平台澳洲新闻简报 App：

- 本地拉取多个澳洲新闻来源
- 自动把相近标题合并成同一新闻簇
- 为每个新闻簇生成约 1 分钟语音稿
- 保留每个原始来源链接
- 总结不同媒体的报道角度差异
- 支持 PWA 安装、离线缓存和 Capacitor 移动端外壳
- 支持按当前语言进行浏览器语音朗读

## 内容更新

内容由 Codex 定时任务每小时更新一次。任务会维护按语言拆分的数据文件，再构建 `docs/` 供 GitHub Pages 发布。

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

`{lang}` 会被替换成 `en`、`zh-Hans`、`zh-Hant`、`si`、`ja`、`ko`、`vi` 或 `th`。这个地址需要返回与 `public/news.zh-Hans.json` 相同结构的数据。

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
