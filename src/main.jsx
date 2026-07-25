import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Clock,
  ExternalLink,
  FileAudio,
  Filter,
  Globe2,
  RefreshCw,
  Search,
  TimerReset,
  Volume2
} from "lucide-react";
import "./styles.css";

function formatTime(value) {
  if (!value) return "待更新";
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

function readMinutes(text) {
  const chars = [...String(text || "")].length;
  return Math.max(1, Math.round(chars / 280));
}

function isRecentCluster(cluster) {
  if (!cluster?.publishedAt) return true;
  const published = new Date(cluster.publishedAt).getTime();
  if (Number.isNaN(published)) return true;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - published <= sevenDays;
}

function uniqueSources(cluster) {
  return new Set((cluster?.links || []).map((link) => link.source).filter(Boolean));
}

function displaySourceCount(cluster) {
  const count = uniqueSources(cluster).size;
  return count || cluster?.sourceCount || 0;
}

function uniqueDifferences(cluster) {
  const seen = new Set();
  const differences = [];

  for (const difference of cluster?.differences || []) {
    const normalized = String(difference || "")
      .replace(/\s+/g, " ")
      .replace(/[。.!?！？]+$/g, "")
      .trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    differences.push(difference);
  }

  if (displaySourceCount(cluster) <= 1) {
    return ["只有一个新闻来源，暂无可比较的表述差异。"];
  }

  return differences.length ? differences : ["暂无可比较的表述差异。"];
}

function SourceLogo({ name }) {
  const letters = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <span className="source-logo">{letters}</span>;
}

function App() {
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNews() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`./news.json?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("news.json not found");
      const payload = await response.json();
      setData(payload);
      setActiveId((current) => current || payload.clusters?.[0]?.id);
    } catch {
      setError("还没有新闻数据。等待 Codex 定时任务生成 public/news.json 后即可显示。");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNews();
  }, []);

  const clusters = useMemo(() => {
    const list = data?.clusters || [];
    return list.filter((cluster) => {
      const text = `${cluster.headline} ${cluster.voiceScript}`.toLowerCase();
      const matchesSearch = text.includes(query.toLowerCase());
      const sourceCount = displaySourceCount(cluster);
      const matchesMode = mode === "all" || (mode === "multi" ? sourceCount > 1 : sourceCount === 1);
      return isRecentCluster(cluster) && matchesSearch && matchesMode;
    });
  }, [data, mode, query]);

  const active = clusters.find((cluster) => cluster.id === activeId) || clusters[0];

  useEffect(() => {
    if (activeId && clusters.length && !clusters.some((cluster) => cluster.id === activeId)) {
      setActiveId(clusters[0].id);
    }
  }, [activeId, clusters]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">
            <Globe2 size={24} />
          </div>
          <div>
            <h1>澳洲简约新闻</h1>
            <span>Australia Brief</span>
          </div>
        </div>

        <div className="status-strip">
          <div>
            <Clock size={16} />
            <span>{formatTime(data?.updatedAt)}</span>
          </div>
          <div>
            <TimerReset size={16} />
            <span>{formatTime(data?.nextRunAt)}</span>
          </div>
        </div>

        <div className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题或摘要"
          />
        </div>

        <div className="segmented" aria-label="过滤新闻">
          <button className={mode === "all" ? "active" : ""} onClick={() => setMode("all")}>
            全部
          </button>
          <button className={mode === "multi" ? "active" : ""} onClick={() => setMode("multi")}>
            多源
          </button>
          <button className={mode === "single" ? "active" : ""} onClick={() => setMode("single")}>
            单源
          </button>
        </div>

        <button className="refresh-button" onClick={() => loadNews()} disabled={loading}>
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          重新读取
        </button>

        <div className="source-list">
          <div className="section-label">
            <Filter size={14} />
            来源
          </div>
          {(data?.sources || []).map((source) => (
            <div className="source-row" key={source.id}>
              <SourceLogo name={source.name} />
              <div>
                <strong>{source.name}</strong>
                <span>{source.region}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="list-pane">
        <div className="pane-head">
          <div>
            <p>今日聚合</p>
            <h2>{clusters.length} 条新闻簇</h2>
          </div>
          <Activity size={22} />
        </div>

        {error && <div className="data-error">{error}</div>}

        <div className="cluster-list">
          {clusters.map((cluster) => (
            <button
              className={`cluster-card ${cluster.id === active?.id ? "selected" : ""}`}
              key={cluster.id}
              onClick={() => setActiveId(cluster.id)}
            >
              <div className="cluster-meta">
                <span>{displaySourceCount(cluster)} 个来源</span>
                <span>{readMinutes(cluster.voiceScript)} 分钟</span>
              </div>
              <h3>{cluster.headline}</h3>
              <p>{cluster.voiceScript}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="detail-pane">
        {active ? (
          <>
            <div className="detail-top">
              <div>
                <span className="eyebrow">语音稿</span>
                <h2>{active.headline}</h2>
              </div>
              <button className="icon-button" title="朗读">
                <Volume2 size={19} />
              </button>
            </div>

            <article className="script-panel">
              <div className="script-meta">
                <FileAudio size={18} />
                <span>约 {readMinutes(active.voiceScript)} 分钟</span>
              </div>
              <p>{active.voiceScript}</p>
            </article>

            <div className="detail-grid">
              <section>
                <h3>来源差异</h3>
                <div className="difference-list">
                  {uniqueDifferences(active).map((difference) => (
                    <p key={difference}>{difference}</p>
                  ))}
                </div>
              </section>

              <section>
                <h3>原始链接</h3>
                <div className="link-list">
                  {active.links.map((link) => (
                    <a href={link.url} target="_blank" rel="noreferrer" key={`${link.source}-${link.url}`}>
                      <SourceLogo name={link.source} />
                      <span>{link.source}</span>
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="empty-state">暂无匹配新闻</div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
