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
  { code: "en", label: "EN" },
  { code: "zh-Hans", label: "简体" },
  { code: "zh-Hant", label: "繁體" },
  { code: "si", label: "සිංහල" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "th", label: "ไทย" }
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
    noticeTitle: "内容说明",
    noticeText: "本站只提供基于公开来源事实重新撰写的简报和原始链接，不复制新闻原文、图片、视频、音频或官方标志。",
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
    noticeTitle: "內容說明",
    noticeText: "本站只提供基於公開來源事實重新撰寫的簡報和原始連結，不複製新聞原文、圖片、影片、音訊或官方標誌。",
    readAloud: "朗讀",
    stopReading: "停止朗讀",
    noMatches: "暫無匹配新聞",
    dataError: "暫時讀不到新聞資料。連線後會自動從資料來源重新讀取。"
  },
  si: {
    appName: "ඕස්ට්‍රේලියා කෙටි පුවත්",
    appSubtitle: "Australia Brief",
    toolsTitle: "පෙරහන් සහ දත්ත තත්ත්වය",
    localData: "දේශීය දත්ත",
    pending: "යාවත්කාලීන වීමට නියමිතයි",
    online: "සබැඳි",
    offline: "නොබැඳි",
    searchPlaceholder: "ශීර්ෂය හෝ සාරාංශය සොයන්න",
    filterLabel: "පුවත් පෙරහන් කරන්න",
    all: "සියල්ල",
    multi: "බහු මූලාශ්‍ර",
    single: "එක් මූලාශ්‍රයක්",
    reload: "නැවත පූරණය",
    install: "ස්ථාපනය",
    sources: "මූලාශ්‍ර",
    noticeTitle: "අන්තර්ගත සටහන",
    noticeText: "මෙම අඩවිය පොදු මූලාශ්‍රවලින් තහවුරු කළ කරුණු මත නැවත ලියූ කෙටි පුවත් සහ මුල් සබැඳි පමණක් සපයයි; මුල් පුවත් පෙළ, රූප, වීඩියෝ, ශ්‍රව්‍ය හෝ නිල ලාංඡන පිටපත් නොකරයි.",
    readAloud: "ශබ්දයෙන් කියවන්න",
    stopReading: "කියවීම නවත්වන්න",
    noMatches: "ගැළපෙන පුවත් නැත",
    dataError: "පුවත් දත්ත තාවකාලිකව ලබාගත නොහැක. සබැඳි වූ විට දත්ත මූලාශ්‍රයෙන් නැවත පූරණය වේ."
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
    noticeTitle: "Content note",
    noticeText: "This site provides rewritten briefings based on facts from public sources plus source links. It does not copy article text, images, video, audio, or official logos.",
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
    noticeTitle: "コンテンツ注記",
    noticeText: "このサイトは公開ソースの事実に基づいて書き直した簡報と元リンクのみを提供し、記事本文、画像、動画、音声、公式ロゴはコピーしません。",
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
    noticeTitle: "콘텐츠 안내",
    noticeText: "이 사이트는 공개 출처의 사실을 바탕으로 다시 작성한 브리핑과 원문 링크만 제공하며 기사 본문, 이미지, 동영상, 오디오, 공식 로고를 복사하지 않습니다.",
    readAloud: "읽어주기",
    stopReading: "읽기 중지",
    noMatches: "일치하는 뉴스가 없습니다",
    dataError: "뉴스 데이터를 일시적으로 읽을 수 없습니다. 온라인 상태가 되면 데이터 소스에서 다시 불러옵니다."
  },
  vi: {
    appName: "Tin Úc tóm lược",
    appSubtitle: "Australia Brief",
    toolsTitle: "Bộ lọc và trạng thái dữ liệu",
    localData: "Dữ liệu cục bộ",
    pending: "Chờ cập nhật",
    online: "Trực tuyến",
    offline: "Ngoại tuyến",
    searchPlaceholder: "Tìm tiêu đề hoặc tóm tắt",
    filterLabel: "Lọc tin tức",
    all: "Tất cả",
    multi: "Nhiều nguồn",
    single: "Một nguồn",
    reload: "Tải lại",
    install: "Cài đặt",
    sources: "Nguồn",
    noticeTitle: "Ghi chú nội dung",
    noticeText: "Trang này chỉ cung cấp bản tin được viết lại dựa trên sự kiện từ các nguồn công khai và liên kết gốc; không sao chép văn bản bài báo, hình ảnh, video, âm thanh hoặc logo chính thức.",
    readAloud: "Đọc thành tiếng",
    stopReading: "Dừng đọc",
    noMatches: "Không có tin phù hợp",
    dataError: "Tạm thời không đọc được dữ liệu tin tức. Khi có mạng, dữ liệu sẽ được tải lại từ nguồn."
  },
  th: {
    appName: "ข่าวออสเตรเลียแบบย่อ",
    appSubtitle: "Australia Brief",
    toolsTitle: "ตัวกรองและสถานะข้อมูล",
    localData: "ข้อมูลในเครื่อง",
    pending: "รออัปเดต",
    online: "ออนไลน์",
    offline: "ออฟไลน์",
    searchPlaceholder: "ค้นหาหัวข้อหรือสรุป",
    filterLabel: "กรองข่าว",
    all: "ทั้งหมด",
    multi: "หลายแหล่ง",
    single: "แหล่งเดียว",
    reload: "โหลดใหม่",
    install: "ติดตั้ง",
    sources: "แหล่งข่าว",
    noticeTitle: "หมายเหตุเนื้อหา",
    noticeText: "ไซต์นี้ให้เฉพาะสรุปข่าวที่เขียนใหม่จากข้อเท็จจริงในแหล่งข้อมูลสาธารณะพร้อมลิงก์ต้นทาง ไม่คัดลอกข้อความข่าว รูปภาพ วิดีโอ เสียง หรือโลโก้ทางการ",
    readAloud: "อ่านออกเสียง",
    stopReading: "หยุดอ่าน",
    noMatches: "ไม่พบข่าวที่ตรงกัน",
    dataError: "ไม่สามารถอ่านข้อมูลข่าวได้ชั่วคราว เมื่อออนไลน์แล้วจะโหลดข้อมูลใหม่จากแหล่งข่าว"
  }
};

const NEWS_SOURCE_TEMPLATE = import.meta.env.VITE_NEWS_SOURCE_URL || "./news.{lang}.json";
const SPEECH_LANGUAGES = {
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
  en: "en-AU",
  si: "si-LK",
  ja: "ja-JP",
  ko: "ko-KR",
  vi: "vi-VN",
  th: "th-TH"
};
const SPEECH_VOICE_MATCHERS = {
  "zh-Hans": {
    langs: ["zh-cn", "zh_cn", "cmn-hans-cn", "cmn-cn", "zh-hans"],
    names: ["mandarin", "chinese", "普通话", "國語", "中文", "xiaoxiao", "huihui", "kangkang", "tingting"]
  },
  "zh-Hant": {
    langs: ["zh-tw", "zh_tw", "zh-hk", "zh_hk", "cmn-hant-tw", "cmn-tw", "yue-hk", "zh-hant"],
    names: ["mandarin", "chinese", "cantonese", "國語", "普通話", "粵語", "中文", "hanhan", "tracy", "sinji"]
  },
  en: {
    langs: ["en-au", "en_us", "en-us", "en-gb", "en"],
    names: ["english", "australia", "australian", "samantha", "daniel", "zira", "aria"]
  },
  si: {
    langs: ["si-lk", "si_lk", "si"],
    names: ["sinhala", "සිංහල"]
  },
  ja: {
    langs: ["ja-jp", "ja_jp", "ja"],
    names: ["japanese", "日本語", "kyoko", "nanami", "haruka", "ichiro"]
  },
  ko: {
    langs: ["ko-kr", "ko_kr", "ko"],
    names: ["korean", "한국어", "heami", "sunhi", "inho"]
  },
  vi: {
    langs: ["vi-vn", "vi_vn", "vi"],
    names: ["vietnamese", "tiếng việt", "vietnam", "an", "linh"]
  },
  th: {
    langs: ["th-th", "th_th", "th"],
    names: ["thai", "ไทย", "kanya", "pattara", "narisa"]
  }
};

function normalizeLanguage(value) {
  const lower = String(value || "").toLowerCase();
  if (lower.startsWith("zh-hant") || lower.includes("tw") || lower.includes("hk")) return "zh-Hant";
  if (lower.startsWith("si")) return "si";
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("ko")) return "ko";
  if (lower.startsWith("vi")) return "vi";
  if (lower.startsWith("th")) return "th";
  if (lower.startsWith("en")) return "en";
  return "en";
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

async function fetchNewsPayload(language) {
  const url = newsSourceUrl(language);
  let response = await fetch(cacheBustedUrl(url), { cache: "no-store" });
  if (!response.ok && url !== "./news.json") {
    response = await fetch(cacheBustedUrl("./news.json"), { cache: "no-store" });
  }
  if (!response.ok) throw new Error("news.json not found");
  return response.json();
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

function pickSpeechVoice(language, locale, voices) {
  const matcher = SPEECH_VOICE_MATCHERS[language];
  const primaryLanguage = locale.split("-")[0].toLowerCase();
  const normalizedLocale = locale.toLowerCase();
  const normalizedVoices = voices.map((voice) => ({
    voice,
    lang: String(voice.lang || "").toLowerCase(),
    name: String(voice.name || "").toLowerCase()
  }));

  if (matcher) {
    return (
      normalizedVoices.find(({ lang }) => matcher.langs.includes(lang))?.voice ||
      normalizedVoices.find(({ lang }) => matcher.langs.some((candidate) => lang.startsWith(candidate)))?.voice ||
      normalizedVoices.find(({ name }) => matcher.names.some((candidate) => name.includes(candidate)))?.voice ||
      null
    );
  }

  return (
    normalizedVoices.find(({ lang }) => lang === normalizedLocale)?.voice ||
    normalizedVoices.find(({ lang }) => lang.startsWith(`${primaryLanguage}-`))?.voice ||
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

const SOURCE_BADGES = {
  "ABC News": "ABC",
  "SBS News": "SBS",
  "The Guardian Australia": "GUA",
  "news.com.au": "NCA",
  "The Australian": "AUS",
  "Yahoo News Australia": "YAH",
  "Australian Financial Review": "AFR",
  "Sky News Australia": "SKY",
  "9News": "9",
  "7NEWS": "7",
  "The Sydney Morning Herald": "SMH",
  "The Age": "AGE",
  "Brisbane Times": "BNE",
  WAtoday: "WA",
  "The Canberra Times": "CBR",
  AAP: "AAP",
  "AAP News": "AAP"
};

const SOURCE_COLORS = {
  "ABC News": "#111827",
  "SBS News": "#0f5f6a",
  "The Guardian Australia": "#052962",
  "news.com.au": "#7c2d12",
  "The Australian": "#991b1b",
  "Yahoo News Australia": "#4c1d95",
  "Australian Financial Review": "#164e63",
  "Sky News Australia": "#7f1d1d",
  "9News": "#1d4ed8",
  "7NEWS": "#b91c1c",
  "The Sydney Morning Herald": "#334155",
  "The Age": "#365314",
  "Brisbane Times": "#115e59",
  WAtoday: "#854d0e",
  "The Canberra Times": "#3730a3",
  AAP: "#14532d",
  "AAP News": "#14532d"
};

function sourceBadge(name) {
  if (SOURCE_BADGES[name]) return SOURCE_BADGES[name];

  const cleaned = String(name || "")
    .replace(/\.(com|net|org)(\.au)?/gi, "")
    .replace(/^the\s+/i, "")
    .trim();

  const compact = cleaned.replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (compact.length <= 4 && compact) return compact;

  const words = cleaned.match(/[a-z0-9]+/gi) || [];
  return words
    .filter((word) => !["news", "australia", "australian", "the"].includes(word.toLowerCase()))
    .map((word) => word[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

function SourceLogo({ name }) {
  const label = sourceBadge(name);
  const color = SOURCE_COLORS[name] || "#27606a";

  return (
    <span className="source-logo" style={{ "--source-color": color }} aria-label={name}>
      <span className="source-initials">{label}</span>
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
  const [speechVoices, setSpeechVoices] = useState([]);

  const labels = I18N[language];
  const activeNewsSourceUrl = newsSourceUrl(language);
  const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  async function loadNews() {
    setLoading(true);
    setError("");
    try {
      const payload = await fetchNewsPayload(language);
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
    if (!canSpeak) return undefined;

    const loadVoices = () => {
      setSpeechVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
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

    const locale = speechLocale(cluster.language || language);
    const utterance = new SpeechSynthesisUtterance(`${cluster.headline}. ${cluster.voiceScript}`);
    utterance.lang = locale;
    utterance.rate = (cluster.language || language) === "en" ? 1 : 0.95;
    utterance.voice = pickSpeechVoice(cluster.language || language, locale, speechVoices);
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
  const displayActive = active ? { ...active, language } : null;
  const activeDifferences = uniqueDifferences(displayActive);

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

          <details className="content-notice">
            <summary>{labels.noticeTitle}</summary>
            <p>{labels.noticeText}</p>
          </details>
        </div>
      </aside>

      <section className="list-pane">
        {error && <div className="data-error">{error}</div>}

        <div className="cluster-list">
          {clusters.map((cluster) => {
            const displayCluster = { ...cluster, language };

            return (
              <article
                className={`cluster-card ${cluster.id === active?.id ? "selected" : ""} ${
                  cluster.id === expandedId ? "expanded" : ""
                }`}
                key={cluster.id}
              >
              <div className="cluster-card-content">
                <div className="cluster-title-row">
                  <button
                    className="cluster-title-button"
                    onClick={() => {
                      setActiveId(cluster.id);
                      setExpandedId((current) => (current === cluster.id ? null : cluster.id));
                    }}
                  >
                    <h3>{displayCluster.headline}</h3>
                  </button>
                  <button
                    className={`icon-button compact card-speak-button ${speakingId === cluster.id ? "active" : ""}`}
                    onClick={() => readCluster(displayCluster)}
                    disabled={!canSpeak}
                    title={speakingId === cluster.id ? labels.stopReading : labels.readAloud}
                    aria-label={speakingId === cluster.id ? labels.stopReading : labels.readAloud}
                    aria-pressed={speakingId === cluster.id}
                  >
                    <Volume2 size={17} />
                  </button>
                </div>

                <button
                  className="cluster-card-button"
                  onClick={() => {
                    setActiveId(cluster.id);
                    setExpandedId((current) => (current === cluster.id ? null : cluster.id));
                  }}
                >
                  <p>{displayCluster.voiceScript}</p>
                </button>
              </div>

              {cluster.id === expandedId && (
                <div className="mobile-card-detail">
                  <div className="mobile-section">
                    <div className="mobile-script-header">
                      <button
                        className={`icon-button compact ${speakingId === cluster.id ? "active" : ""}`}
                        onClick={() => readCluster(displayCluster)}
                        disabled={!canSpeak}
                        title={speakingId === cluster.id ? labels.stopReading : labels.readAloud}
                        aria-label={speakingId === cluster.id ? labels.stopReading : labels.readAloud}
                        aria-pressed={speakingId === cluster.id}
                      >
                        <Volume2 size={17} />
                      </button>
                    </div>
                    <p>{displayCluster.voiceScript}</p>
                  </div>

                  {uniqueDifferences(displayCluster).length > 0 && (
                    <div className="mobile-section">
                      <div className="difference-list">
                        {uniqueDifferences(displayCluster).map((difference) => (
                          <p key={difference}>{difference}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mobile-section">
                    <div className="link-list">
                      {displayCluster.links.map((link) => (
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
            );
          })}
        </div>
      </section>

      <section className="detail-pane">
        {displayActive ? (
          <>
            <div className="detail-top">
              <div>
                <h2>{displayActive.headline}</h2>
              </div>
              <button
                className={`icon-button ${speakingId === displayActive.id ? "active" : ""}`}
                onClick={() => readCluster(displayActive)}
                disabled={!canSpeak}
                title={speakingId === displayActive.id ? labels.stopReading : labels.readAloud}
                aria-label={speakingId === displayActive.id ? labels.stopReading : labels.readAloud}
                aria-pressed={speakingId === displayActive.id}
              >
                <Volume2 size={19} />
              </button>
            </div>

            <article className="script-panel">
              <p>{displayActive.voiceScript}</p>
            </article>

            <div className={`detail-grid ${activeDifferences.length === 0 ? "single-column" : ""}`}>
              {activeDifferences.length > 0 && (
                <section>
                  <div className="difference-list">
                    {activeDifferences.map((difference) => (
                      <p key={difference}>{difference}</p>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="link-list">
                  {displayActive.links.map((link) => (
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
