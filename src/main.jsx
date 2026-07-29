import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Filter,
  MessageSquareText,
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
  { code: "th", label: "ไทย" },
  { code: "es", label: "Español" }
];

const FONT_OPTIONS = [
  {
    code: "system",
    label: "System",
    stack: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  {
    code: "news",
    label: "News Sans",
    stack: '"Avenir Next", Avenir, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif'
  },
  {
    code: "serif",
    label: "Serif",
    stack: 'Georgia, "Times New Roman", "Noto Serif CJK SC", "Songti SC", SimSun, serif'
  },
  {
    code: "mono",
    label: "Mono",
    stack: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'
  }
];

const FONT_SIZE_OPTIONS = [
  { code: "small", label: "Small", scale: 0.92 },
  { code: "standard", label: "Standard", scale: 1 },
  { code: "large", label: "Large", scale: 1.12 },
  { code: "xlarge", label: "XL", scale: 1.24 }
];

const POLICY_LINKS = [
  { href: "./about.html", label: "About" },
  { href: "./editorial-policy.html", label: "Editorial" },
  { href: "./privacy.html", label: "Privacy" },
  { href: "./terms.html", label: "Terms" },
  { href: "./corrections.html", label: "Corrections" }
];

const THEME_OPTIONS = [
  {
    code: "classic",
    label: "Classic",
    vars: {
      "--ink": "#172026",
      "--muted": "#66727a",
      "--line": "#d8dde2",
      "--paper": "#f7f8f8",
      "--panel": "#ffffff",
      "--panel-soft": "#f1f4f6",
      "--sidebar-bg": "#e9eef2",
      "--detail-bg": "#eef2f5",
      "--control-bg": "rgba(255, 255, 255, 0.72)",
      "--brand": "#102a43",
      "--brand-strong": "#0b1f33",
      "--accent": "#b4232a",
      "--accent-dark": "#8f1d25"
    }
  },
  {
    code: "paper",
    label: "Paper",
    vars: {
      "--ink": "#202124",
      "--muted": "#70757a",
      "--line": "#dedbd2",
      "--paper": "#fbfaf6",
      "--panel": "#ffffff",
      "--panel-soft": "#f3f1ea",
      "--sidebar-bg": "#f0eee6",
      "--detail-bg": "#f6f4ee",
      "--control-bg": "rgba(255, 255, 255, 0.76)",
      "--brand": "#27364a",
      "--brand-strong": "#182435",
      "--accent": "#9f2f2f",
      "--accent-dark": "#7c2227"
    }
  },
  {
    code: "sepia",
    label: "Sepia",
    vars: {
      "--ink": "#2a2118",
      "--muted": "#74685c",
      "--line": "#d9cdbd",
      "--paper": "#f5ead8",
      "--panel": "#fff7ea",
      "--panel-soft": "#eee0cb",
      "--sidebar-bg": "#eadcc8",
      "--detail-bg": "#efe2cf",
      "--control-bg": "rgba(255, 247, 234, 0.78)",
      "--brand": "#4a3524",
      "--brand-strong": "#2e2118",
      "--accent": "#9b3a2c",
      "--accent-dark": "#743024"
    }
  },
  {
    code: "green",
    label: "Soft Green",
    vars: {
      "--ink": "#17231d",
      "--muted": "#63716a",
      "--line": "#d3ddd4",
      "--paper": "#f5f8f4",
      "--panel": "#ffffff",
      "--panel-soft": "#edf3ed",
      "--sidebar-bg": "#e5eee5",
      "--detail-bg": "#edf4ed",
      "--control-bg": "rgba(255, 255, 255, 0.74)",
      "--brand": "#1f3a32",
      "--brand-strong": "#142820",
      "--accent": "#9f3438",
      "--accent-dark": "#7d272d"
    }
  },
  {
    code: "night",
    label: "Night",
    vars: {
      "--ink": "#edf2f7",
      "--muted": "#9aa8b5",
      "--line": "#293746",
      "--paper": "#101821",
      "--panel": "#17212c",
      "--panel-soft": "#1f2b38",
      "--sidebar-bg": "#0c141d",
      "--detail-bg": "#111b25",
      "--control-bg": "rgba(23, 33, 44, 0.82)",
      "--brand": "#d6e4f0",
      "--brand-strong": "#0a1118",
      "--accent": "#d45a61",
      "--accent-dark": "#f0a3a8"
    }
  },
  {
    code: "midnight",
    label: "Midnight",
    vars: {
      "--ink": "#e8eef5",
      "--muted": "#9aa9bb",
      "--line": "#26364a",
      "--paper": "#0b1420",
      "--panel": "#111d2b",
      "--panel-soft": "#19283a",
      "--sidebar-bg": "#08111b",
      "--detail-bg": "#0d1824",
      "--control-bg": "rgba(17, 29, 43, 0.86)",
      "--brand": "#c9d8e8",
      "--brand-strong": "#050b12",
      "--accent": "#c44f64",
      "--accent-dark": "#e99aaa"
    }
  },
  {
    code: "charcoal",
    label: "Charcoal",
    vars: {
      "--ink": "#eeeeec",
      "--muted": "#a8a6a0",
      "--line": "#3a3935",
      "--paper": "#161614",
      "--panel": "#20201d",
      "--panel-soft": "#2a2925",
      "--sidebar-bg": "#11110f",
      "--detail-bg": "#181816",
      "--control-bg": "rgba(32, 32, 29, 0.86)",
      "--brand": "#e2dfd4",
      "--brand-strong": "#090908",
      "--accent": "#c65f45",
      "--accent-dark": "#e4a28f"
    }
  }
];

const I18N = {
  "zh-Hans": {
    appName: "4News",
    appSubtitle: "极简，AI 驱动",
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
    font: "字体",
    fontSize: "字号",
    theme: "配色",
    showCommentary: "4News点评",
    commentaryTitle: "4News点评",
    install: "安装到设备",
    sources: "来源",
    noticeTitle: "内容说明",
    noticeText: "摘要和4News点评由 AI 基于公开来源生成，可能存在错误，请以原始来源为准。本站只提供重新撰写的简报、点评和原始链接，不复制新闻原文、图片、视频、音频或官方标志。",
    readAloud: "朗读",
    speechUnavailable: "此设备暂无对应语音",
    stopReading: "停止朗读",
    noMatches: "暂无匹配新闻",
    dataError: "暂时读不到新闻数据。联网后会自动从数据源重新读取。"
  },
  "zh-Hant": {
    appName: "4News",
    appSubtitle: "極簡，AI 驅動",
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
    font: "字體",
    fontSize: "字號",
    theme: "配色",
    showCommentary: "4News點評",
    commentaryTitle: "4News點評",
    install: "安裝到裝置",
    sources: "來源",
    noticeTitle: "內容說明",
    noticeText: "摘要和4News點評由 AI 基於公開來源生成，可能存在錯誤，請以原始來源為準。本站只提供重新撰寫的簡報、點評和原始連結，不複製新聞原文、圖片、影片、音訊或官方標誌。",
    readAloud: "朗讀",
    speechUnavailable: "此裝置暫無對應語音",
    stopReading: "停止朗讀",
    noMatches: "暫無匹配新聞",
    dataError: "暫時讀不到新聞資料。連線後會自動從資料來源重新讀取。"
  },
  si: {
    appName: "4News",
    appSubtitle: "වස්තුනিষ্ঠ, ස්වාධීන ඕස්ට්‍රේලියානු පුවත් සාරාංශය",
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
    font: "අකුරු",
    fontSize: "අකුරු ප්‍රමාණය",
    theme: "තේමාව",
    showCommentary: "4News අදහස",
    commentaryTitle: "4News අදහස",
    install: "ස්ථාපනය",
    sources: "මූලාශ්‍ර",
    noticeTitle: "අන්තර්ගත සටහන",
    noticeText: "Briefs and 4News commentary are AI-generated from public sources and may contain errors. Check original sources for full context. This site provides rewritten briefs, commentary, and source links only.",
    readAloud: "ශබ්දයෙන් කියවන්න",
    speechUnavailable: "මෙම උපාංගයේ ගැළපෙන හඬක් නොමැත",
    stopReading: "කියවීම නවත්වන්න",
    noMatches: "ගැළපෙන පුවත් නැත",
    dataError: "පුවත් දත්ත තාවකාලිකව ලබාගත නොහැක. සබැඳි වූ විට දත්ත මූලාශ්‍රයෙන් නැවත පූරණය වේ."
  },
  en: {
    appName: "4News",
    appSubtitle: "Minimal, powered by AI",
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
    font: "Font",
    fontSize: "Size",
    theme: "Theme",
    showCommentary: "4News view",
    commentaryTitle: "4News view",
    install: "Install",
    sources: "Sources",
    noticeTitle: "Content note",
    noticeText: "Briefs and 4News commentary are AI-generated from public sources and may contain errors. Check original sources for full context. This site provides rewritten briefs, commentary, and source links only.",
    readAloud: "Read aloud",
    speechUnavailable: "No matching voice on this device",
    stopReading: "Stop reading",
    noMatches: "No matching news",
    dataError: "News data is temporarily unavailable. It will reload from the data source when online."
  },
  es: {
    appName: "4News",
    appSubtitle: "Minimal, impulsado por IA",
    toolsTitle: "Filtros y estado de datos",
    localData: "Datos locales",
    pending: "Pendiente",
    online: "En línea",
    offline: "Sin conexión",
    searchPlaceholder: "Buscar titulares o resúmenes",
    filterLabel: "Filtrar noticias",
    all: "Todo",
    multi: "Varias fuentes",
    single: "Una fuente",
    reload: "Recargar",
    font: "Fuente",
    fontSize: "Tamaño",
    theme: "Tema",
    showCommentary: "Comentario de 4News",
    commentaryTitle: "Comentario de 4News",
    install: "Instalar",
    sources: "Fuentes",
    noticeTitle: "Nota de contenido",
    noticeText: "Los resúmenes y comentarios de 4News son generados por IA a partir de fuentes públicas y pueden contener errores. Consulta las fuentes originales para ver el contexto completo. Este sitio solo ofrece resúmenes reescritos, comentarios y enlaces a las fuentes.",
    readAloud: "Leer en voz alta",
    speechUnavailable: "No hay una voz compatible en este dispositivo",
    stopReading: "Detener lectura",
    noMatches: "No hay noticias coincidentes",
    dataError: "Los datos de noticias no están disponibles temporalmente. Se volverán a cargar desde la fuente cuando haya conexión."
  },
  ja: {
    appName: "4News",
    appSubtitle: "客観的で独立した豪州ニュース要約",
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
    font: "フォント",
    fontSize: "サイズ",
    theme: "テーマ",
    showCommentary: "4Newsの見方",
    commentaryTitle: "4Newsの見方",
    install: "インストール",
    sources: "ソース",
    noticeTitle: "コンテンツ注記",
    noticeText: "Briefs and 4News commentary are AI-generated from public sources and may contain errors. Check original sources for full context. This site provides rewritten briefs, commentary, and source links only.",
    readAloud: "読み上げ",
    speechUnavailable: "この端末に対応する音声がありません",
    stopReading: "読み上げを停止",
    noMatches: "一致するニュースはありません",
    dataError: "ニュースデータを一時的に読み込めません。オンラインになるとデータソースから再読み込みします。"
  },
  ko: {
    appName: "4News",
    appSubtitle: "객관적이고 독립적인 호주 뉴스 브리핑",
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
    font: "글꼴",
    fontSize: "크기",
    theme: "테마",
    showCommentary: "4News 관점",
    commentaryTitle: "4News 관점",
    install: "설치",
    sources: "출처",
    noticeTitle: "콘텐츠 안내",
    noticeText: "Briefs and 4News commentary are AI-generated from public sources and may contain errors. Check original sources for full context. This site provides rewritten briefs, commentary, and source links only.",
    readAloud: "읽어주기",
    speechUnavailable: "이 기기에 맞는 음성이 없습니다",
    stopReading: "읽기 중지",
    noMatches: "일치하는 뉴스가 없습니다",
    dataError: "뉴스 데이터를 일시적으로 읽을 수 없습니다. 온라인 상태가 되면 데이터 소스에서 다시 불러옵니다."
  },
  vi: {
    appName: "4News",
    appSubtitle: "Tin Úc tóm lược, khách quan và độc lập",
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
    font: "Phông chữ",
    fontSize: "Cỡ chữ",
    theme: "Giao diện",
    showCommentary: "Góc nhìn 4News",
    commentaryTitle: "Góc nhìn 4News",
    install: "Cài đặt",
    sources: "Nguồn",
    noticeTitle: "Ghi chú nội dung",
    noticeText: "Briefs and 4News commentary are AI-generated from public sources and may contain errors. Check original sources for full context. This site provides rewritten briefs, commentary, and source links only.",
    readAloud: "Đọc thành tiếng",
    speechUnavailable: "Thiết bị này chưa có giọng phù hợp",
    stopReading: "Dừng đọc",
    noMatches: "Không có tin phù hợp",
    dataError: "Tạm thời không đọc được dữ liệu tin tức. Khi có mạng, dữ liệu sẽ được tải lại từ nguồn."
  },
  th: {
    appName: "4News",
    appSubtitle: "สรุปข่าวออสเตรเลียที่เป็นกลางและอิสระ",
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
    font: "ฟอนต์",
    fontSize: "ขนาด",
    theme: "ธีม",
    showCommentary: "มุมมอง 4News",
    commentaryTitle: "มุมมอง 4News",
    install: "ติดตั้ง",
    sources: "แหล่งข่าว",
    noticeTitle: "หมายเหตุเนื้อหา",
    noticeText: "Briefs and 4News commentary are AI-generated from public sources and may contain errors. Check original sources for full context. This site provides rewritten briefs, commentary, and source links only.",
    readAloud: "อ่านออกเสียง",
    speechUnavailable: "อุปกรณ์นี้ไม่มีเสียงที่รองรับ",
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
  es: "es-ES",
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
  es: {
    langs: ["es-es", "es_mx", "es-mx", "es-us", "es"],
    names: ["spanish", "español", "monica", "jorge", "paulina", "marisol"]
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
const STRICT_VOICE_LANGUAGES = new Set(["si"]);

function normalizeLanguage(value) {
  const lower = String(value || "").toLowerCase();
  if (lower.startsWith("zh-hant") || lower.includes("tw") || lower.includes("hk")) return "zh-Hant";
  if (lower.startsWith("si")) return "si";
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("ko")) return "ko";
  if (lower.startsWith("vi")) return "vi";
  if (lower.startsWith("th")) return "th";
  if (lower.startsWith("es")) return "es";
  if (lower.startsWith("en")) return "en";
  return "en";
}

function initialLanguage() {
  const stored = window.localStorage.getItem("brief-language");
  if (stored && I18N[stored]) return stored;
  return normalizeLanguage(navigator.language);
}

function initialFont() {
  const stored = window.localStorage.getItem("brief-font");
  if (FONT_OPTIONS.some((option) => option.code === stored)) return stored;
  return "system";
}

function initialFontSize() {
  const stored = window.localStorage.getItem("brief-font-size");
  if (FONT_SIZE_OPTIONS.some((option) => option.code === stored)) return stored;
  return "standard";
}

function initialTheme() {
  const stored = window.localStorage.getItem("brief-theme");
  if (THEME_OPTIONS.some((option) => option.code === stored)) return stored;
  return "classic";
}

function initialShowCommentary() {
  return window.localStorage.getItem("brief-show-commentary") === "true";
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

function hasSpeechVoice(language, voices) {
  if (!STRICT_VOICE_LANGUAGES.has(language)) return true;
  return Boolean(pickSpeechVoice(language, speechLocale(language), voices));
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

const SOCIAL_TOPIC_RULES = [
  {
    topic: "housing",
    keywords: ["rent", "housing", "apartment", "land-sale", "red-tape", "build-cost", "data-centre"],
    comments: {
      "zh-Hans":
        "这类住房问题不能只靠补贴或审批口号解决。更可行的是把租金、空置、审批时长、施工成本和基础设施容量做成可审计的公开数据。AI 可以帮助发现卡点、预测供应缺口，并把高风险家庭优先转给人工服务。",
      "zh-Hant":
        "這類住房問題不能只靠補貼或審批口號解決。更可行的是把租金、空置、審批時長、施工成本和基礎設施容量做成可審計的公開資料。AI 可以幫助發現卡點、預測供應缺口，並把高風險家庭優先轉給人工服務。",
      en:
        "Housing problems are rarely solved by one subsidy or one planning slogan. A better path is auditable data on rents, vacancies, approval times, build costs and infrastructure capacity. AI can help find bottlenecks, forecast supply gaps and route high-risk households to human support earlier.",
      es:
        "Los problemas de vivienda rara vez se resuelven con un solo subsidio o eslogan urbanístico. Hace falta datos auditables sobre alquileres, vacantes, aprobaciones, costes de construcción e infraestructura. La IA puede detectar cuellos de botella, prever brechas de oferta y derivar antes a hogares en riesgo.",
      ja:
        "住宅問題は、補助金や規制緩和の一言では解けません。家賃、空室、承認期間、建設費、インフラ容量を監査可能なデータにする必要があります。AI は詰まりを見つけ、供給不足を予測し、リスクの高い世帯を早く人の支援につなげられます。",
      ko:
        "주거 문제는 보조금이나 인허가 구호 하나로 풀리지 않습니다. 임대료, 공실, 승인 기간, 건설비, 인프라 용량을 감사 가능한 데이터로 공개해야 합니다. AI는 병목을 찾고 공급 부족을 예측하며 위험 가구를 더 빨리 사람의 지원으로 연결할 수 있습니다.",
      vi:
        "Vấn đề nhà ở hiếm khi được giải quyết bằng một khoản trợ cấp hay khẩu hiệu quy hoạch. Cần dữ liệu có thể kiểm chứng về tiền thuê, nhà trống, thời gian phê duyệt, chi phí xây dựng và hạ tầng. AI có thể tìm điểm nghẽn, dự báo thiếu hụt và chuyển hộ rủi ro cao sang hỗ trợ con người sớm hơn.",
      th:
        "ปัญหาที่อยู่อาศัยแก้ไม่ได้ด้วยเงินอุดหนุนหรือคำขวัญเรื่องผังเมืองเพียงอย่างเดียว ควรมีข้อมูลที่ตรวจสอบได้เรื่องค่าเช่า บ้านว่าง เวลาการอนุมัติ ต้นทุนก่อสร้าง และโครงสร้างพื้นฐาน AI ช่วยหา bottleneck คาดการณ์อุปทานขาดแคลน และส่งต่อครัวเรือนเสี่ยงให้เจ้าหน้าที่เร็วขึ้นได้",
      si:
        "නිවාස ගැටලු subsidy එකකින් හෝ සැලසුම් සටන්පාඨයකින් පමණක් විසඳෙන්නේ නැත. කුලී, හිස් නිවාස, අනුමත කාලය, ඉදිකිරීම් වියදම සහ යටිතල පහසුකම් ධාරිතාව විගණනය කළ හැකි දත්ත ලෙස තිබිය යුතුය. AI මඟින් bottleneck හඳුනාගෙන අවදානම් පවුල් ඉක්මනින් මිනිස් සහායට යොමු කළ හැක."
    }
  },
  {
    topic: "health",
    keywords: ["health", "hospital", "doctor", "medical", "cannabis", "zoladex", "kidney", "surgery", "ivf", "vad", "counselling", "ai-privacy"],
    comments: {
      "zh-Hans":
        "医疗类问题的关键是把安全、速度和隐私同时处理。AI 可以用于排队分诊、异常处方预警、隐私风险提示和患者随访，但不能替代临床责任。真正有用的是可追责的系统：谁看见了警报、谁处理、多久处理完。",
      "zh-Hant":
        "醫療類問題的關鍵是把安全、速度和隱私同時處理。AI 可以用於排隊分診、異常處方預警、隱私風險提示和患者追蹤，但不能替代臨床責任。真正有用的是可追責的系統：誰看見了警報、誰處理、多久處理完。",
      en:
        "Health problems need safety, speed and privacy handled together. AI can help with triage queues, prescribing alerts, privacy warnings and follow-up, but it cannot replace clinical accountability. The useful layer is traceability: who saw the alert, who acted, and how long it took.",
      es:
        "En salud hay que manejar seguridad, rapidez y privacidad al mismo tiempo. La IA puede ayudar con triaje, alertas de prescripción, avisos de privacidad y seguimiento, pero no sustituye la responsabilidad clínica. Lo útil es la trazabilidad: quién vio la alerta, quién actuó y cuánto tardó.",
      ja:
        "医療では安全、速さ、プライバシーを同時に扱う必要があります。AI はトリアージ、処方警告、個人情報リスク、フォローアップに役立ちますが、臨床上の責任を置き換えるものではありません。重要なのは、誰が警告を見て、誰が対応し、どれだけ時間がかかったかを追えることです。",
      ko:
        "의료 문제는 안전, 속도, 개인정보 보호를 함께 다뤄야 합니다. AI는 분류 대기열, 처방 경고, 개인정보 위험 알림, 사후 관리를 도울 수 있지만 임상 책임을 대체할 수는 없습니다. 핵심은 누가 경고를 봤고, 누가 조치했으며, 얼마나 걸렸는지 추적하는 것입니다.",
      vi:
        "Vấn đề y tế cần xử lý đồng thời an toàn, tốc độ và quyền riêng tư. AI có thể hỗ trợ phân luồng, cảnh báo kê đơn, cảnh báo riêng tư và theo dõi bệnh nhân, nhưng không thay thế trách nhiệm lâm sàng. Điều hữu ích là truy vết được ai thấy cảnh báo, ai xử lý và mất bao lâu.",
      th:
        "ปัญหาสุขภาพต้องจัดการความปลอดภัย ความเร็ว และความเป็นส่วนตัวพร้อมกัน AI ช่วยคัดกรองคิว แจ้งเตือนใบสั่งยา เตือนความเสี่ยงข้อมูล และติดตามผู้ป่วยได้ แต่แทนความรับผิดชอบทางคลินิกไม่ได้ สิ่งสำคัญคือระบบต้องบอกได้ว่าใครเห็นเตือน ใครจัดการ และใช้เวลานานแค่ไหน",
      si:
        "සෞඛ්‍ය ගැටලුවලදී ආරක්ෂාව, වේගය සහ පෞද්ගලිකත්වය එකට සැලකිය යුතුය. AI මඟින් triage, prescription alerts, privacy warnings සහ follow-up සහාය විය හැකි නමුත් සායනික වගකීම වෙනුවට නොවේ. ප්‍රයෝජනවත් දේ වන්නේ alert එක කවුද දැක්කේ, කවුද ක්‍රියා කළේ, කොපමණ කල් ගියාද යන්න පසුපස යා හැකි වීමයි."
    }
  },
  {
    topic: "justice",
    keywords: ["court", "jail", "trial", "murder", "rape", "stabbing", "police", "shooting", "death-penalty", "paedophile", "crash", "icac", "fraud", "discrimination", "antisemitism", "river-to-the-sea", "higgins"],
    comments: {
      "zh-Hans":
        "司法和公共安全新闻最容易被情绪带偏。解决问题需要更好的早期风险识别、证据管理和受害者支持，而不是只在事后加重惩罚。AI 可以辅助整理案情时间线、识别重复风险和资源缺口，但必须保留人工复核和偏见审计。",
      "zh-Hant":
        "司法和公共安全新聞最容易被情緒帶偏。解決問題需要更好的早期風險識別、證據管理和受害者支持，而不是只在事後加重懲罰。AI 可以輔助整理案情時間線、識別重複風險和資源缺口，但必須保留人工覆核和偏見審計。",
      en:
        "Justice and public-safety stories are easy to read only through outrage. The practical fixes are earlier risk flags, cleaner evidence handling and better victim support, not just harsher penalties after harm is done. AI can help map timelines, repeat-risk patterns and service gaps, with human review and bias audits mandatory.",
      es:
        "Las noticias de justicia y seguridad pública suelen leerse solo desde la indignación. Las soluciones prácticas son alertas tempranas de riesgo, mejor manejo de pruebas y apoyo a víctimas, no solo penas más duras después del daño. La IA puede ordenar cronologías, patrones de riesgo y brechas de servicios, con revisión humana y auditoría de sesgos.",
      ja:
        "司法や公共安全のニュースは怒りだけで読まれがちです。実際の改善は、早期のリスク発見、証拠管理、被害者支援であり、被害後の厳罰化だけではありません。AI は時系列整理、再発リスク、支援の穴を見つける助けになりますが、人の確認と偏り監査が不可欠です。",
      ko:
        "사법과 공공안전 뉴스는 분노만으로 읽히기 쉽습니다. 실질적 해법은 피해 뒤 처벌 강화만이 아니라 조기 위험 신호, 증거 관리, 피해자 지원입니다. AI는 사건 타임라인, 반복 위험, 서비스 공백을 찾는 데 도움을 줄 수 있지만 사람의 검토와 편향 감사가 필수입니다.",
      vi:
        "Tin về tư pháp và an toàn công cộng rất dễ bị nhìn chỉ qua sự phẫn nộ. Cách sửa thực tế là cảnh báo rủi ro sớm, quản lý chứng cứ tốt hơn và hỗ trợ nạn nhân, không chỉ tăng hình phạt sau khi đã có tổn hại. AI có thể lập dòng thời gian, phát hiện rủi ro lặp lại và lỗ hổng dịch vụ, nhưng cần con người rà soát và kiểm toán thiên lệch.",
      th:
        "ข่าวยุติธรรมและความปลอดภัยสาธารณะมักถูกอ่านผ่านความโกรธเท่านั้น ทางแก้จริงคือสัญญาณเตือนความเสี่ยงเร็วขึ้น การจัดการหลักฐานดีขึ้น และการช่วยเหลือเหยื่อ ไม่ใช่แค่เพิ่มโทษหลังเกิดความเสียหาย AI ช่วยเรียงไทม์ไลน์ หา pattern ความเสี่ยงซ้ำ และช่องว่างบริการได้ แต่ต้องมีมนุษย์ตรวจและ audit อคติ",
      si:
        "නීතිය හා පොදු ආරක්ෂාව පිළිබඳ පුවත් කෝපයෙන් පමණක් කියවීමට පහසුය. ප්‍රායෝගික විසඳුම් වන්නේ හානියෙන් පසු දඬුවම් වැඩි කිරීම පමණක් නොව, ඉක්මන් risk flags, සාක්ෂි කළමනාකරණය සහ වින්දිත සහායයි. AI මඟින් timeline, නැවත සිදුවන අවදානම් සහ සේවා හිඟ හඳුනාගත හැකි නමුත් human review සහ bias audit අනිවාර්යය."
    }
  },
  {
    topic: "community",
    keywords: ["disability", "elder", "children", "first-nations", "closing-the-gap", "census", "school", "deepfake", "gambling", "pokie", "abuse", "cult", "coercive", "sikh", "jewish", "gaza", "migration", "alert"],
    comments: {
      "zh-Hans":
        "这类社会问题往往不是缺一个部门，而是信息断裂。可行方向是把投诉、服务等待、补助、学校和社区机构的数据打通，同时限定用途和隐私边界。AI 可以做早期预警和个案分流，但最终要由本地服务和可问责的人员完成干预。",
      "zh-Hant":
        "這類社會問題往往不是缺一個部門，而是資訊斷裂。可行方向是把投訴、服務等待、補助、學校和社區機構的資料打通，同時限定用途和隱私邊界。AI 可以做早期預警和個案分流，但最終要由本地服務和可問責的人員完成介入。",
      en:
        "These social problems are often not about one missing agency, but broken information flow. The useful path is linking complaints, service waits, payments, schools and community providers with strict purpose and privacy limits. AI can support early warnings and case triage, but accountable local services must make the intervention.",
      es:
        "Estos problemas sociales no suelen deberse a una sola agencia ausente, sino a flujos de información rotos. El camino útil es conectar quejas, esperas de servicios, pagos, escuelas y organizaciones comunitarias con límites estrictos de uso y privacidad. La IA puede apoyar alertas tempranas y triaje de casos, pero la intervención debe quedar en servicios locales responsables.",
      ja:
        "こうした社会問題は、担当機関が一つ足りないというより情報の断絶で起きがちです。苦情、待機時間、給付、学校、地域団体のデータを、目的とプライバシーを厳しく限定してつなぐことが有効です。AI は早期警告や振り分けを助けますが、介入は責任ある地域サービスが担うべきです。",
      ko:
        "이런 사회 문제는 기관 하나가 없어서라기보다 정보 흐름이 끊겨 생기는 경우가 많습니다. 민원, 서비스 대기, 지급, 학교, 지역 단체 데이터를 목적과 개인정보 한계를 분명히 두고 연결해야 합니다. AI는 조기 경고와 사례 분류를 도울 수 있지만 개입은 책임 있는 지역 서비스가 해야 합니다.",
      vi:
        "Những vấn đề xã hội này thường không phải do thiếu một cơ quan, mà do luồng thông tin bị đứt gãy. Hướng hữu ích là kết nối khiếu nại, thời gian chờ dịch vụ, chi trả, trường học và tổ chức cộng đồng với giới hạn mục đích và riêng tư rõ ràng. AI có thể hỗ trợ cảnh báo sớm và phân luồng ca, nhưng can thiệp phải do dịch vụ địa phương có trách nhiệm thực hiện.",
      th:
        "ปัญหาสังคมแบบนี้มักไม่ได้เกิดจากขาดหน่วยงานเดียว แต่เกิดจากข้อมูลขาดตอน แนวทางที่ใช้ได้คือเชื่อมข้อมูลร้องเรียน เวลารอบริการ เงินช่วยเหลือ โรงเรียน และองค์กรชุมชน โดยจำกัดวัตถุประสงค์และความเป็นส่วนตัวให้ชัด AI ช่วยเตือนล่วงหน้าและคัดแยกเคสได้ แต่การช่วยเหลือต้องมาจากบริการท้องถิ่นที่รับผิดชอบได้",
      si:
        "මෙවැනි සමාජ ගැටලු බොහෝ විට ආයතනයක් අඩුවීම නොව තොරතුරු ගලායාම කැඩී යාමයි. පැමිණිලි, සේවා රැඳී සිටීම්, ගෙවීම්, පාසල් සහ community providers දත්ත purpose/privacy සීමා සහිතව සම්බන්ධ කිරීම ප්‍රයෝජනවත්ය. AI මඟින් early warnings සහ case triage කළ හැකි නමුත් මැදිහත්වීම වගකිව යුතු local services කළ යුතුය."
    }
  },
  {
    topic: "environment",
    keywords: ["bird-flu", "varroa", "renewables", "landfill", "snail", "bat", "wildfire", "herbicide", "paraquat", "solar", "energy"],
    comments: {
      "zh-Hans":
        "环境和公共卫生风险的难点在于发现早、行动快、沟通准。AI 可以把传感器、实验室、热线、野外报告和气象数据合在一起做风险地图，但不能变成黑箱决策。政府需要公开触发标准，让企业和家庭知道什么时候该改变行为。",
      "zh-Hant":
        "環境和公共衛生風險的難點在於發現早、行動快、溝通準。AI 可以把感測器、實驗室、熱線、野外報告和氣象資料合在一起做風險地圖，但不能變成黑箱決策。政府需要公開觸發標準，讓企業和家庭知道什麼時候該改變行為。",
      en:
        "Environmental and public-health risks are about early detection, fast action and clear communication. AI can combine sensors, labs, hotlines, field reports and weather data into risk maps, but it should not become a black box. Governments need published trigger rules so households and businesses know when to change behaviour.",
      es:
        "Los riesgos ambientales y de salud pública dependen de detección temprana, acción rápida y comunicación clara. La IA puede combinar sensores, laboratorios, líneas de ayuda, reportes de campo y clima en mapas de riesgo, pero no debe ser una caja negra. Los gobiernos necesitan reglas públicas para que hogares y empresas sepan cuándo cambiar conductas.",
      ja:
        "環境と公衆衛生のリスクでは、早期発見、迅速な対応、明確な説明が重要です。AI はセンサー、検査、通報、現地報告、気象データを統合してリスク地図を作れますが、ブラックボックスにしてはいけません。政府は発動基準を公開し、家庭や企業が行動を変える時点を分かるようにすべきです。",
      ko:
        "환경과 공중보건 위험은 조기 발견, 빠른 조치, 명확한 소통이 핵심입니다. AI는 센서, 실험실, 신고, 현장 보고, 기상 데이터를 결합해 위험 지도를 만들 수 있지만 블랙박스가 되어서는 안 됩니다. 정부는 가정과 기업이 언제 행동을 바꿔야 하는지 알 수 있도록 기준을 공개해야 합니다.",
      vi:
        "Rủi ro môi trường và y tế công cộng phụ thuộc vào phát hiện sớm, hành động nhanh và truyền thông rõ. AI có thể kết hợp cảm biến, phòng thí nghiệm, đường dây nóng, báo cáo thực địa và thời tiết thành bản đồ rủi ro, nhưng không được thành hộp đen. Chính phủ cần công bố ngưỡng kích hoạt để hộ gia đình và doanh nghiệp biết khi nào phải thay đổi hành vi.",
      th:
        "ความเสี่ยงด้านสิ่งแวดล้อมและสาธารณสุขอยู่ที่พบเร็ว ทำเร็ว และสื่อสารชัด AI รวมข้อมูลจาก sensor ห้องแล็บ สายด่วน รายงานภาคสนาม และอากาศเป็นแผนที่ความเสี่ยงได้ แต่ไม่ควรเป็นกล่องดำ รัฐต้องประกาศเกณฑ์ trigger ให้ครัวเรือนและธุรกิจรู้ว่าควรเปลี่ยนพฤติกรรมเมื่อไร",
      si:
        "පරිසර හා පොදු සෞඛ්‍ය අවදානම්වල මූලික කරුණු early detection, fast action සහ clear communication වේ. AI මඟින් sensors, labs, hotlines, field reports සහ weather data එකතු කර risk maps කළ හැකි නමුත් black box තීරණ නොවිය යුතුය. පවුල් සහ ව්‍යාපාර හැසිරීම වෙනස් කළ යුතු වේලාව දැනගැනීමට රජය trigger rules ප්‍රසිද්ධ කළ යුතුය."
    }
  },
  {
    topic: "economic-harm",
    keywords: ["borrower", "offset", "scam", "breach", "fraud", "investor", "unpaid", "kogan", "latitude", "credit", "mortgage", "cost", "price"],
    comments: {
      "zh-Hans":
        "经济伤害类新闻的重点不是谁道歉，而是损失能否被及时发现和自动纠正。AI 可以用于异常交易、误收费、诈骗话术和高风险合同的预警，也可以帮助监管机构排序调查线索。前提是模型结果可解释，企业不能把责任推给算法。",
      "zh-Hant":
        "經濟傷害類新聞的重點不是誰道歉，而是損失能否被及時發現和自動糾正。AI 可以用於異常交易、誤收費、詐騙話術和高風險合約的預警，也可以幫助監管機構排序調查線索。前提是模型結果可解釋，企業不能把責任推給演算法。",
      en:
        "For financial harm, the key question is not who apologises, but whether losses are detected and corrected early. AI can flag abnormal transactions, fee errors, scam scripts and risky contracts, and help regulators rank leads. The condition is explainability: companies cannot outsource responsibility to an algorithm.",
      es:
        "En daños financieros, la pregunta clave no es quién se disculpa, sino si las pérdidas se detectan y corrigen temprano. La IA puede señalar transacciones anómalas, errores de cobro, guiones de estafa y contratos riesgosos, y ayudar a reguladores a priorizar pistas. La condición es explicabilidad: las empresas no pueden trasladar la responsabilidad al algoritmo.",
      ja:
        "経済的被害では、誰が謝るかより、損失を早く見つけて修正できるかが重要です。AI は異常取引、手数料ミス、詐欺文句、危険な契約を検知し、規制当局の調査優先度づけにも使えます。ただし説明可能性が条件で、企業が責任をアルゴリズムに押しつけてはいけません。",
      ko:
        "금전 피해에서는 누가 사과하느냐보다 손실을 빨리 발견하고 고칠 수 있느냐가 핵심입니다. AI는 이상 거래, 수수료 오류, 사기 문구, 위험 계약을 표시하고 규제기관의 조사 우선순위도 도울 수 있습니다. 단, 설명 가능해야 하며 기업이 책임을 알고리즘에 떠넘겨서는 안 됩니다.",
      vi:
        "Với thiệt hại tài chính, câu hỏi chính không phải ai xin lỗi, mà là tổn thất có được phát hiện và sửa sớm không. AI có thể cảnh báo giao dịch bất thường, lỗi phí, kịch bản lừa đảo và hợp đồng rủi ro, đồng thời giúp cơ quan quản lý xếp ưu tiên đầu mối. Điều kiện là phải giải thích được; doanh nghiệp không thể đẩy trách nhiệm cho thuật toán.",
      th:
        "ข่าวความเสียหายทางการเงินไม่ได้สำคัญแค่ว่าใครขอโทษ แต่สำคัญว่าพบและแก้ความเสียหายเร็วหรือไม่ AI ช่วยจับธุรกรรมผิดปกติ ค่าธรรมเนียมผิด บทพูดหลอกลวง และสัญญาเสี่ยง รวมถึงช่วย regulator จัดลำดับเบาะแสได้ เงื่อนไขคือผลต้องอธิบายได้ บริษัทโทษอัลกอริทึมแทนตัวเองไม่ได้",
      si:
        "මූල්‍ය හානියේදී ප්‍රධාන ප්‍රශ්නය කවුද සමාව ඉල්ලන්නේ නොව, පාඩු ඉක්මනින් හඳුනාගෙන නිවැරදි කළ හැකිද යන්නයි. AI මඟින් abnormal transactions, fee errors, scam scripts සහ risky contracts flag කළ හැකි අතර regulators ට leads prioritorise කිරීමට උපකාරී වේ. නමුත් explainability අවශ්‍යය; සමාගම් වගකීම algorithm එකට දමන්න බැහැ."
    }
  }
];

const FALLBACK_SOCIAL_COMMENTARY = {
  "zh-Hans":
    "这条新闻真正值得追的是制度怎样更早发现问题、减少伤害、把责任落实到人。AI 可以帮助做风险预警、信息整合和资源分配，但前提是透明、可审计，并且把最终判断留给可问责的人。",
  "zh-Hant":
    "這條新聞真正值得追的是制度怎樣更早發現問題、減少傷害、把責任落實到人。AI 可以幫助做風險預警、資訊整合和資源分配，但前提是透明、可審計，並且把最終判斷留給可問責的人。",
  en:
    "The issue to watch is how the system can detect harm earlier, reduce damage and assign responsibility clearly. AI can help with risk warnings, information matching and resource allocation, but only if the process is transparent, auditable and leaves final judgement with accountable people.",
  es:
    "Lo importante es cómo el sistema puede detectar daño antes, reducirlo y asignar responsabilidades con claridad. La IA puede ayudar con alertas de riesgo, cruce de información y distribución de recursos, pero solo si el proceso es transparente, auditable y mantiene el juicio final en personas responsables.",
  ja:
    "見るべき点は、制度がどう早く問題を見つけ、被害を減らし、責任を明確にするかです。AI はリスク警告、情報照合、資源配分を助けられますが、透明で監査可能であり、最終判断を責任ある人に残すことが条件です。",
  ko:
    "핵심은 제도가 어떻게 피해를 더 일찍 발견하고 줄이며 책임을 분명히 하느냐입니다. AI는 위험 경고, 정보 연결, 자원 배분을 도울 수 있지만 과정이 투명하고 감사 가능하며 최종 판단은 책임 있는 사람이 해야 합니다.",
  vi:
    "Điều đáng theo dõi là hệ thống phát hiện tổn hại sớm hơn, giảm thiệt hại và gắn trách nhiệm rõ hơn như thế nào. AI có thể hỗ trợ cảnh báo rủi ro, nối dữ liệu và phân bổ nguồn lực, nhưng quy trình phải minh bạch, kiểm toán được và để phán đoán cuối cùng cho người có trách nhiệm.",
  th:
    "ประเด็นที่ควรติดตามคือระบบจะพบความเสียหายเร็วขึ้น ลดผลกระทบ และกำหนดความรับผิดชอบชัดเจนได้อย่างไร AI ช่วยเตือนความเสี่ยง เชื่อมข้อมูล และจัดสรรทรัพยากรได้ แต่กระบวนการต้องโปร่งใส ตรวจสอบได้ และให้คนที่รับผิดชอบตัดสินสุดท้าย",
  si:
    "නිරීක්ෂණය කළ යුතු දෙය වන්නේ පද්ධතිය හානිය ඉක්මනින් හඳුනාගෙන, හානිය අඩු කර, වගකීම පැහැදිලි කරන ආකාරයයි. AI මඟින් risk warnings, information matching සහ resource allocation කළ හැකි නමුත් ක්‍රියාවලිය transparent, auditable වී අවසන් තීරණය වගකිව යුතු මිනිසුන්ට තිබිය යුතුය."
};

function getFourNewsCommentary(cluster, language) {
  if (!cluster) return "";
  const stored = cluster.fourNewsCommentary;
  if (typeof stored === "string") return stored;
  if (stored?.[language]) return stored[language];
  if (stored?.en) return stored.en;

  const haystack = `${cluster.id || ""} ${cluster.headline || ""} ${cluster.voiceScript || ""}`.toLowerCase();
  const matchedRule = SOCIAL_TOPIC_RULES.find((rule) => rule.keywords.some((keyword) => haystack.includes(keyword)));
  if (matchedRule) return matchedRule.comments[language] || matchedRule.comments.en;

  const socialSignals = [
    "abuse",
    "safety",
    "school",
    "children",
    "elder",
    "disability",
    "health",
    "hospital",
    "housing",
    "rent",
    "police",
    "court",
    "fraud",
    "privacy",
    "community",
    "victim"
  ];
  if (socialSignals.some((signal) => haystack.includes(signal))) {
    return FALLBACK_SOCIAL_COMMENTARY[language] || FALLBACK_SOCIAL_COMMENTARY.en;
  }

  return "";
}

const SOURCE_BADGES = {
  "ABC News": "ABC",
  "SBS News": "SBS",
  "The Guardian Australia": "GDN",
  "news.com.au": "NEWS",
  "The Australian": "AUS",
  "Yahoo News Australia": "Y!",
  "Australian Financial Review": "AFR",
  "Sky News Australia": "SKY",
  "9News": "9",
  "7NEWS": "7",
  "The Sydney Morning Herald": "SMH",
  "The Age": "AGE",
  "Brisbane Times": "BT",
  WAtoday: "WA",
  "The Canberra Times": "CBR",
  AAP: "AAP",
  "AAP News": "AAP"
};

const SOURCE_ALIASES = {
  "abc": "ABC News",
  "abc news": "ABC News",
  "sbs": "SBS News",
  "sbs news": "SBS News",
  "guardian au": "The Guardian Australia",
  "the guardian": "The Guardian Australia",
  "the guardian australia": "The Guardian Australia",
  "guardian australia": "The Guardian Australia",
  "news.com.au": "news.com.au",
  "news com au": "news.com.au",
  "the australian": "The Australian",
  "yahoo au": "Yahoo News Australia",
  "yahoo news australia": "Yahoo News Australia",
  "australian financial review": "Australian Financial Review",
  "afr": "Australian Financial Review",
  "sky news": "Sky News Australia",
  "sky news australia": "Sky News Australia",
  "9news": "9News",
  "nine news": "9News",
  "7news": "7NEWS",
  "seven news": "7NEWS",
  "the sydney morning herald": "The Sydney Morning Herald",
  "smh": "The Sydney Morning Herald",
  "the age": "The Age",
  "brisbane times": "Brisbane Times",
  "watoday": "WAtoday",
  "wa today": "WAtoday",
  "the canberra times": "The Canberra Times",
  "canberra times": "The Canberra Times",
  "aap": "AAP",
  "aap news": "AAP"
};

const SOURCE_DISPLAY_NAMES = {
  "ABC News": "ABC News",
  "SBS News": "SBS News",
  "The Guardian Australia": "Guardian AU",
  "news.com.au": "news.com.au",
  "The Australian": "The Australian",
  "Yahoo News Australia": "Yahoo AU",
  "Australian Financial Review": "AFR",
  "Sky News Australia": "Sky News",
  "9News": "9News",
  "7NEWS": "7NEWS",
  "The Sydney Morning Herald": "SMH",
  "The Age": "The Age",
  "Brisbane Times": "Brisbane Times",
  WAtoday: "WAtoday",
  "The Canberra Times": "Canberra Times",
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

function normalizeSourceKey(name) {
  return String(name || "")
    .trim()
    .replace(/https?:\/\//gi, "")
    .replace(/^www\./i, "")
    .replace(/\.(com|net|org)(\.au)?$/i, (match) => match.toLowerCase())
    .replace(/[^a-z0-9.]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function canonicalSourceName(name) {
  const raw = String(name || "").trim();
  const key = normalizeSourceKey(raw);
  return SOURCE_ALIASES[key] || raw;
}

function sourceBadge(name) {
  const canonical = canonicalSourceName(name);
  if (SOURCE_BADGES[canonical]) return SOURCE_BADGES[canonical];

  const cleaned = canonical
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

function sourceDisplayName(name) {
  const canonical = canonicalSourceName(name);
  return SOURCE_DISPLAY_NAMES[canonical] || canonical;
}

function SourceLogo({ name }) {
  const canonical = canonicalSourceName(name);
  const label = sourceBadge(canonical);
  const color = SOURCE_COLORS[canonical] || "#102a43";

  return (
    <span className="source-logo" style={{ "--source-color": color }} aria-label={canonical}>
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
  const [font, setFont] = useState(initialFont);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [theme, setTheme] = useState(initialTheme);
  const [showCommentary, setShowCommentary] = useState(initialShowCommentary);
  const [speakingId, setSpeakingId] = useState(null);
  const [speechVoices, setSpeechVoices] = useState([]);
  const speechRunRef = useRef(0);

  const labels = I18N[language];
  const selectedFont = FONT_OPTIONS.find((option) => option.code === font) || FONT_OPTIONS[0];
  const selectedFontSize = FONT_SIZE_OPTIONS.find((option) => option.code === fontSize) || FONT_SIZE_OPTIONS[1];
  const selectedTheme = THEME_OPTIONS.find((option) => option.code === theme) || THEME_OPTIONS[0];
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
      speechRunRef.current += 1;
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem("brief-font", font);
  }, [font]);

  useEffect(() => {
    window.localStorage.setItem("brief-font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    window.localStorage.setItem("brief-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("brief-show-commentary", String(showCommentary));
  }, [showCommentary]);

  useEffect(() => {
    return () => {
      speechRunRef.current += 1;
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

  function canReadCluster(cluster) {
    const clusterLanguage = cluster?.language || language;
    return canSpeak && Boolean(cluster?.voiceScript) && hasSpeechVoice(clusterLanguage, speechVoices);
  }

  function speechButtonState(cluster) {
    const canRead = canReadCluster(cluster);
    const active = speakingId === cluster?.id;
    const label = !canRead ? labels.speechUnavailable : active ? labels.stopReading : labels.readAloud;
    return { canRead, active, label };
  }

  function readCluster(cluster) {
    if (!canReadCluster(cluster)) return;

    if (speakingId === cluster.id) {
      speechRunRef.current += 1;
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    startReading(cluster, speechRunRef.current + 1);
  }

  function startReading(cluster, runId) {
    if (!canReadCluster(cluster)) {
      setSpeakingId(null);
      return;
    }

    speechRunRef.current = runId;
    window.speechSynthesis.cancel();

    const locale = speechLocale(cluster.language || language);
    const utterance = new SpeechSynthesisUtterance(`${cluster.headline}. ${cluster.voiceScript}`);
    utterance.lang = locale;
    utterance.rate = (cluster.language || language) === "en" ? 1 : 0.95;
    utterance.voice = pickSpeechVoice(cluster.language || language, locale, speechVoices);
    utterance.onend = () => {
      if (speechRunRef.current !== runId) return;

      const currentIndex = clusters.findIndex((item) => item.id === cluster.id);
      const nextCluster = clusters.slice(currentIndex + 1).find((item) => canReadCluster({ ...item, language }));

      if (!nextCluster) {
        setSpeakingId(null);
        return;
      }

      const displayNext = { ...nextCluster, language };
      setActiveId(displayNext.id);
      startReading(displayNext, runId);
    };
    utterance.onerror = () => {
      if (speechRunRef.current === runId) setSpeakingId(null);
    };

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
  const activeCommentary = showCommentary ? getFourNewsCommentary(displayActive, language) : "";

  useEffect(() => {
    if (activeId && clusters.length && !clusters.some((cluster) => cluster.id === activeId)) {
      setActiveId(clusters[0].id);
    }
  }, [activeId, clusters]);

  return (
    <main
      className="app-shell"
      style={{
        ...selectedTheme.vars,
        "--app-font-family": selectedFont.stack,
        "--font-scale": selectedFontSize.scale
      }}
    >
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-identity">
            <img className="brand-mark" src="./icon.svg" alt="4News" />
            <div>
              <h1>{labels.appName}</h1>
              <span className="brand-subtitle">{labels.appSubtitle}</span>
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

          <div className="setting-control">
            <span>{labels.font}</span>
            <select value={font} onChange={(event) => setFont(event.target.value)} aria-label={labels.font}>
              {FONT_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-control">
            <span>{labels.fontSize}</span>
            <select
              value={fontSize}
              onChange={(event) => setFontSize(event.target.value)}
              aria-label={labels.fontSize}
            >
              {FONT_SIZE_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-control">
            <span>{labels.theme}</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value)} aria-label={labels.theme}>
              {THEME_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <label className="setting-control checkbox-control">
            <span>{labels.showCommentary}</span>
            <input
              type="checkbox"
              checked={showCommentary}
              onChange={(event) => setShowCommentary(event.target.checked)}
              aria-label={labels.showCommentary}
            />
          </label>

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
              <div className="source-row" key={source.id} title={source.name}>
                <SourceLogo name={source.name} url={source.feed} />
                <div>
                  <strong>{sourceDisplayName(source.name)}</strong>
                  <span>{source.region}</span>
                </div>
              </div>
            ))}
          </div>

          <details className="content-notice">
            <summary>{labels.noticeTitle}</summary>
            <p>{labels.noticeText}</p>
          </details>

          <nav className="policy-links" aria-label="Site policies">
            {POLICY_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <section className="list-pane">
        {error && <div className="data-error">{error}</div>}

        <div className="cluster-list">
          {clusters.map((cluster) => {
            const displayCluster = { ...cluster, language };
            const speechState = speechButtonState(displayCluster);
            const commentary = showCommentary ? getFourNewsCommentary(displayCluster, language) : "";

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
                    className={`icon-button compact card-speak-button ${speechState.active ? "active" : ""}`}
                    onClick={() => readCluster(displayCluster)}
                    disabled={!speechState.canRead}
                    title={speechState.label}
                    aria-label={speechState.label}
                    aria-pressed={speechState.active}
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

                  {commentary && (
                    <div className="mobile-section commentary-panel">
                      <div className="commentary-heading">
                        <MessageSquareText size={16} />
                        <strong>{labels.commentaryTitle}</strong>
                      </div>
                      <p>{commentary}</p>
                    </div>
                  )}

                  <div className="mobile-section">
                    <div className="link-list">
                      {displayCluster.links.map((link) => (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          title={sourceDisplayName(link.source)}
                          aria-label={sourceDisplayName(link.source)}
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
          (() => {
            const speechState = speechButtonState(displayActive);
            return (
          <>
            <div className="detail-top">
              <div>
                <h2>{displayActive.headline}</h2>
              </div>
              <button
                className={`icon-button ${speechState.active ? "active" : ""}`}
                onClick={() => readCluster(displayActive)}
                disabled={!speechState.canRead}
                title={speechState.label}
                aria-label={speechState.label}
                aria-pressed={speechState.active}
              >
                <Volume2 size={19} />
              </button>
            </div>

            <article className="script-panel">
              <p>{displayActive.voiceScript}</p>
            </article>

            {activeCommentary && (
              <article className="commentary-panel">
                <div className="commentary-heading">
                  <MessageSquareText size={17} />
                  <strong>{labels.commentaryTitle}</strong>
                </div>
                <p>{activeCommentary}</p>
              </article>
            )}

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
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      title={sourceDisplayName(link.source)}
                      aria-label={sourceDisplayName(link.source)}
                      key={`${link.source}-${link.url}`}
                    >
                      <SourceLogo name={link.source} url={link.url} />
                      <span>{link.source}</span>
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </>
            );
          })()
        ) : (
          <div className="empty-state">{labels.noMatches}</div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
