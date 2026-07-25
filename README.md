# 澳洲简约新闻

一个适合 GitHub Pages 的静态新闻网站 MVP：

- 本地拉取多个澳洲新闻来源
- 自动把相近标题合并成同一新闻簇
- 为每个新闻簇生成约 1 分钟语音稿
- 保留每个原始来源链接
- 总结不同媒体的报道角度差异

## 内容更新

内容由 Codex 定时任务每小时更新一次。任务会直接维护 `public/news.json`，再构建 `docs/` 供 GitHub Pages 发布。

## 本地预览

```bash
npm install
npm run dev
```

页面：<http://localhost:5173/>

## 发布到 GitHub Pages

Codex 定时任务会更新 `public/news.json` 并构建 `docs/`。把仓库推送到 GitHub 后，在 GitHub Pages 设置里选择：

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

## 后续可接入

- 历史归档：按日期保存多份 JSON
- 模型摘要：把 `makeVoiceScript` 和 `makeDifferences` 换成 LLM 调用
- 语音：用 TTS 把语音稿生成音频文件
- 管理脚本：添加、暂停、排序新闻源
