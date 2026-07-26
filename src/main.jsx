import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Filter,
  Globe2,
  Radio,
  RefreshCw,
  Search,
  TimerReset,
  Volume2
} from "lucide-react";
import "./styles.css";
import "./register-sw.js";

const LANGUAGES = [
  { code: "zh-Hans", label: "简体" },
  { code: "zh-Hant", label: "繁體" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" }
];

const I18N = {
  "zh-Hans": {
    appName: "澳洲简约新闻",
    appSubtitle: "Australia Brief",
    toolsTitle: "筛选和数据状态",
    localData: "本地数据",
    pending: "待更新",
    online: "在线",
    offline: "离线",
    searchPlaceholder: "搜索标题或摘要",
    filterLabel: "过滤新闻",
    all: "全部",
    multi: "多源",
    single: "单源",
    reload: "重新读取",
    install: "安装到设备",
    sources: "来源",
    sourceDifferences: "来源差异",
    originalLinks: "原始链接",
    voiceScript: "语音稿",
    readAloud: "朗读",
    stopReading: "停止朗读",
    noMatches: "暂无匹配新闻",
    dataError: "暂时读不到新闻数据。联网后会自动从数据源重新读取。"
  },
  "zh-Hant": {
    appName: "澳洲簡約新聞",
    appSubtitle: "Australia Brief",
    toolsTitle: "篩選和資料狀態",
    localData: "本機資料",
    pending: "待更新",
    online: "線上",
    offline: "離線",
    searchPlaceholder: "搜尋標題或摘要",
    filterLabel: "篩選新聞",
    all: "全部",
    multi: "多源",
    single: "單源",
    reload: "重新讀取",
    install: "安裝到裝置",
    sources: "來源",
    sourceDifferences: "來源差異",
    originalLinks: "原始連結",
    voiceScript: "語音稿",
    readAloud: "朗讀",
    stopReading: "停止朗讀",
    noMatches: "暫無匹配新聞",
    dataError: "暫時讀不到新聞資料。連線後會自動從資料來源重新讀取。"
  },
  en: {
    appName: "Australia Brief",
    appSubtitle: "Concise Australian news",
    toolsTitle: "Filters and data status",
    localData: "Local data",
    pending: "Pending",
    online: "Online",
    offline: "Offline",
    searchPlaceholder: "Search headlines or summaries",
    filterLabel: "Filter news",
    all: "All",
    multi: "Multi-source",
    single: "Single-source",
    reload: "Reload",
    install: "Install",
    sources: "Sources",
    sourceDifferences: "Source differences",
    originalLinks: "Original links",
    voiceScript: "Briefing script",
    readAloud: "Read aloud",
    stopReading: "Stop reading",
    noMatches: "No matching news",
    dataError: "News data is temporarily unavailable. It will reload from the data source when online."
  },
  ja: {
    appName: "オーストラリア簡潔ニュース",
    appSubtitle: "Australia Brief",
    toolsTitle: "フィルターとデータ状態",
    localData: "ローカルデータ",
    pending: "更新待ち",
    online: "オンライン",
    offline: "オフライン",
    searchPlaceholder: "見出しまたは要約を検索",
    filterLabel: "ニュースを絞り込む",
    all: "すべて",
    multi: "複数ソース",
    single: "単一ソース",
    reload: "再読み込み",
    install: "インストール",
    sources: "ソース",
    sourceDifferences: "報道の違い",
    originalLinks: "元リンク",
    voiceScript: "音声原稿",
    readAloud: "読み上げ",
    stopReading: "読み上げを停止",
    noMatches: "一致するニュースはありません",
    dataError: "ニュースデータを一時的に読み込めません。オンラインになるとデータソースから再読み込みします。"
  },
  ko: {
    appName: "호주 간략 뉴스",
    appSubtitle: "Australia Brief",
    toolsTitle: "필터 및 데이터 상태",
    localData: "로컬 데이터",
    pending: "업데이트 대기",
    online: "온라인",
    offline: "오프라인",
    searchPlaceholder: "제목 또는 요약 검색",
    filterLabel: "뉴스 필터",
    all: "전체",
    multi: "복수 출처",
    single: "단일 출처",
    reload: "다시 읽기",
    install: "설치",
    sources: "출처",
    sourceDifferences: "보도 차이",
    originalLinks: "원문 링크",
    voiceScript: "음성 원고",
    readAloud: "읽어주기",
    stopReading: "읽기 중지",
    noMatches: "일치하는 뉴스가 없습니다",
    dataError: "뉴스 데이터를 일시적으로 읽을 수 없습니다. 온라인 상태가 되면 데이터 소스에서 다시 불러옵니다."
  }
};

const NEWS_SOURCE_TEMPLATE = import.meta.env.VITE_NEWS_SOURCE_URL || "./news.{lang}.json";
const SPEECH_LANGUAGES = {
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
  en: "en-AU",
  ja: "ja-JP",
  ko: "ko-KR"
};

function normalizeLanguage(value) {
  const lower = String(value || "").toLowerCase();
  if (lower.startsWith("zh-hant") || lower.includes("tw") || lower.includes("hk")) return "zh-Hant";
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("ko")) return "ko";
  if (lower.startsWith("en")) return "en";
  return "zh-Hans";
}

function initialLanguage() {
  const stored = window.localStorage.getItem("brief-language");
  if (stored && I18N[stored]) return stored;
  return normalizeLanguage(navigator.language);
}

function newsSourceUrl(language) {
  if (NEWS_SOURCE_TEMPLATE.includes("{lang}")) {
    return NEWS_SOURCE_TEMPLATE.replace("{lang}", language);
  }
  if (NEWS_SOURCE_TEMPLATE.endsWith("news.json")) {
    return NEWS_SOURCE_TEMPLATE.replace(/news\.json$/, `news.${language}.json`);
  }
  return NEWS_SOURCE_TEMPLATE;
}

function cacheBustedUrl(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Date.now()}`;
}

function sourceLabel(url, labels) {
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.hostname || labels.localData;
  } catch {
    return labels.localData;
  }
}

function formatTime(value, language, labels) {
  if (!value) return labels.pending;
  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

function speechLocale(language) {
  return SPEECH_LANGUAGES[language] || language;
}

function pickSpeechVoice(locale) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const language = locale.split("-")[0];
  return (
    voices.find((voice) => voice.lang === locale) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(`${language}-`)) ||
    null
  );
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

  if (displaySourceCount(cluster) <= 1) return [];

  return differences;
}

function sourceIconUrl(name, url) {
  const lowerName = String(name || "").toLowerCase();
  if (lowerName.includes("abc")) return "https://www.abc.net.au/favicon.ico";
  if (lowerName.includes("sbs")) return "https://www.sbs.com.au/favicon.ico";
  if (lowerName.includes("guardian")) return "https://www.theguardian.com/favicon.ico";

  try {
    const domain = new URL(url).origin;
    return `${domain}/favicon.ico`;
  } catch {
    return "";
  }
}

function SourceLogo({ name, url }) {
  const letters = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const iconUrl = sourceIconUrl(name, url);

  return (
    <span className={`source-logo ${iconUrl ? "" : "no-icon"}`} aria-label={name}>
      {iconUrl && (
        <img
          alt=""
          src={iconUrl}
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling.style.display = "block";
          }}
        />
      )}
      <span className="source-initials">{letters}</span>
    </span>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [language, setLanguage] = useState(initialLanguage);
  const [speakingId, setSpeakingId] = useState(null);

  const labels = I18N[language];
  const activeNewsSourceUrl = newsSourceUrl(language);
  const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  async function loadNews() {
    setLoading(true);
    setError("");
    try {
      let response = await fetch(cacheBustedUrl(activeNewsSourceUrl), { cache: "no-store" });
      if (!response.ok && activeNewsSourceUrl !== "./news.json") {
        response = await fetch(cacheBustedUrl("./news.json"), { cache: "no-store" });
      }
      if (!response.ok) throw new Error("news.json not found");
      const payload = await response.json();
      setData(payload);
      setActiveId((current) => current || payload.clusters?.[0]?.id);
    } catch {
      setError(labels.dataError);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNews();
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem("brief-language", language);
    document.documentElement.lang = language;
    if (canSpeak) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  }, [language]);

  useEffect(() => {
    return () => {
      if (canSpeak) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  function readCluster(cluster) {
    if (!canSpeak || !cluster?.voiceScript) return;

    if (speakingId === cluster.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const locale = speechLocale(language);
    const utterance = new SpeechSynthesisUtterance(`${cluster.headline}. ${cluster.voiceScript}`);
    utterance.lang = locale;
    utterance.rate = language === "en" ? 1 : 0.95;
    utterance.voice = pickSpeechVoice(locale);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(cluster.id);
    window.speechSynthesis.speak(utterance);
  }

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
  const activeDifferences = uniqueDifferences(active);

  useEffect(() => {
    if (activeId && clusters.length && !clusters.some((cluster) => cluster.id === activeId)) {
      setActiveId(clusters[0].id);
    }
  }, [activeId, clusters]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-identity">
            <div className="brand-mark">
              <Globe2 size={24} />
            </div>
            <div>
              <h1>{labels.appName}</h1>
              <span>{labels.appSubtitle}</span>
            </div>
          </div>
          <select
            className="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Language"
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            className={`mobile-tools-toggle ${toolsOpen ? "open" : ""}`}
            onClick={() => setToolsOpen((open) => !open)}
            aria-expanded={toolsOpen}
            aria-controls="sidebar-tools"
            title={labels.toolsTitle}
          >
            <Filter size={18} />
            <ChevronDown size={16} />
          </button>
        </div>

        <div className={`sidebar-tools ${toolsOpen ? "open" : ""}`} id="sidebar-tools">
          <div className="status-strip">
            <div>
              <Clock size={16} />
              <span>{formatTime(data?.updatedAt, language, labels)}</span>
            </div>
            <div>
              <TimerReset size={16} />
              <span>{formatTime(data?.nextRunAt, language, labels)}</span>
            </div>
          </div>

          <div className="app-status">
            <div>
              <Radio size={16} />
              <span>{online ? labels.online : labels.offline}</span>
            </div>
            <span>{sourceLabel(activeNewsSourceUrl, labels)}</span>
          </div>

          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
            />
          </div>

          <div className="segmented" aria-label={labels.filterLabel}>
            <button className={mode === "all" ? "active" : ""} onClick={() => setMode("all")}>
              {labels.all}
            </button>
            <button className={mode === "multi" ? "active" : ""} onClick={() => setMode("multi")}>
              {labels.multi}
            </button>
            <button className={mode === "single" ? "active" : ""} onClick={() => setMode("single")}>
              {labels.single}
            </button>
          </div>

          <button className="refresh-button" onClick={() => loadNews()} disabled={loading}>
            <RefreshCw size={17} className={loading ? "spin" : ""} />
            {labels.reload}
          </button>

          {installPrompt && (
            <button className="install-button" onClick={installApp}>
              <Download size={17} />
              {labels.install}
            </button>
          )}

          <div className={`source-list ${sourcesOpen ? "open" : ""}`}>
            <button className="section-label source-toggle" onClick={() => setSourcesOpen((open) => !open)}>
              <Filter size={14} />
              {labels.sources}
            </button>
            {(data?.sources || []).map((source) => (
              <div className="source-row" key={source.id}>
                <SourceLogo name={source.name} url={source.feed} />
                <div>
                  <strong>{source.name}</strong>
                  <span>{source.region}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="list-pane">
        {error && <div className="data-error">{error}</div>}

        <div className="cluster-list">
          {clusters.map((cluster) => (
            <article
              className={`cluster-card ${cluster.id === active?.id ? "selected" : ""} ${
                cluster.id === expandedId ? "expanded" : ""
              }`}
              key={cluster.id}
            >
              <button
                className="cluster-card-button"
                onClick={() => {
                  setActiveId(cluster.id);
                  setExpandedId((current) => (current === cluster.id ? null : cluster.id));
                }}
              >
                <h3>{cluster.headline}</h3>
                <p>{cluster.voiceScript}</p>
              </button>

              {cluster.id === expandedId && (
                <div className="mobile-card-detail">
                  <div className="mobile-section">
                    <div className="mobile-script-header">
                      <span>{labels.voiceScript}</span>
                      <button
                        className={`icon-button compact ${speakingId === cluster.id ? "active" : ""}`}
                        onClick={() => readCluster(cluster)}
                        disabled={!canSpeak}
                        title={speakingId === cluster.id ? labels.stopReading : labels.readAloud}
                        aria-label={speakingId === cluster.id ? labels.stopReading : labels.readAloud}
                        aria-pressed={speakingId === cluster.id}
                      >
                        <Volume2 size={17} />
                      </button>
                    </div>
                    <p>{cluster.voiceScript}</p>
                  </div>

                  {uniqueDifferences(cluster).length > 0 && (
                    <div className="mobile-section">
                      <h4>{labels.sourceDifferences}</h4>
                      <div className="difference-list">
                        {uniqueDifferences(cluster).map((difference) => (
                          <p key={difference}>{difference}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mobile-section">
                    <h4>{labels.originalLinks}</h4>
                    <div className="link-list">
                      {cluster.links.map((link) => (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          title={link.source}
                          aria-label={link.source}
                          key={`${link.source}-${link.url}`}
                        >
                          <SourceLogo name={link.source} url={link.url} />
                          <span>{link.source}</span>
                          <ExternalLink size={15} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="detail-pane">
        {active ? (
          <>
            <div className="detail-top">
              <div>
                <span className="eyebrow">{labels.voiceScript}</span>
                <h2>{active.headline}</h2>
              </div>
              <button
                className={`icon-button ${speakingId === active.id ? "active" : ""}`}
                onClick={() => readCluster(active)}
                disabled={!canSpeak}
                title={speakingId === active.id ? labels.stopReading : labels.readAloud}
                aria-label={speakingId === active.id ? labels.stopReading : labels.readAloud}
                aria-pressed={speakingId === active.id}
              >
                <Volume2 size={19} />
              </button>
            </div>

            <article className="script-panel">
              <p>{active.voiceScript}</p>
            </article>

            <div className={`detail-grid ${activeDifferences.length === 0 ? "single-column" : ""}`}>
              {activeDifferences.length > 0 && (
                <section>
                  <h3>{labels.sourceDifferences}</h3>
                  <div className="difference-list">
                    {activeDifferences.map((difference) => (
                      <p key={difference}>{difference}</p>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3>{labels.originalLinks}</h3>
                <div className="link-list">
                  {active.links.map((link) => (
                    <a href={link.url} target="_blank" rel="noreferrer" key={`${link.source}-${link.url}`}>
                      <SourceLogo name={link.source} url={link.url} />
                      <span>{link.source}</span>
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="empty-state">{labels.noMatches}</div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
