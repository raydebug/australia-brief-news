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
  UserRound,
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
    showPeopleContext: "人物链接",
    peopleContextTitle: "人物背景",
    socialProfile: "主要账号",
    background: "背景",
    politicalPositions: "主要言论",
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
    showPeopleContext: "人物連結",
    peopleContextTitle: "人物背景",
    socialProfile: "主要帳號",
    background: "背景",
    politicalPositions: "主要言論",
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
    showPeopleContext: "පුද්ගල සබැඳි",
    peopleContextTitle: "පුද්ගල පසුබිම",
    socialProfile: "ප්‍රධාන ගිණුම",
    background: "පසුබිම",
    politicalPositions: "ප්‍රධාන අදහස්",
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
    showPeopleContext: "People links",
    peopleContextTitle: "People context",
    socialProfile: "Main account",
    background: "Background",
    politicalPositions: "Main positions",
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
    showPeopleContext: "Enlaces de personas",
    peopleContextTitle: "Contexto de personas",
    socialProfile: "Cuenta principal",
    background: "Contexto",
    politicalPositions: "Posturas principales",
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
    showPeopleContext: "人物リンク",
    peopleContextTitle: "人物背景",
    socialProfile: "主なアカウント",
    background: "背景",
    politicalPositions: "主な主張",
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
    showPeopleContext: "인물 링크",
    peopleContextTitle: "인물 배경",
    socialProfile: "주요 계정",
    background: "배경",
    politicalPositions: "주요 입장",
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
    showPeopleContext: "Liên kết nhân vật",
    peopleContextTitle: "Bối cảnh nhân vật",
    socialProfile: "Tài khoản chính",
    background: "Bối cảnh",
    politicalPositions: "Lập trường chính",
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
    showPeopleContext: "ลิงก์บุคคล",
    peopleContextTitle: "ข้อมูลบุคคล",
    socialProfile: "บัญชีหลัก",
    background: "พื้นหลัง",
    politicalPositions: "จุดยืนหลัก",
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

function initialShowPeopleContext() {
  return window.localStorage.getItem("brief-show-people-context") === "true";
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

const DEVELOPED_COUNTRY_EXPERIENCE = {
  housing: {
    "zh-Hans":
      "可参考芬兰 Housing First 的经验：先稳定住房，再处理成瘾、就业和医疗，效果通常比让人先满足复杂条件更好；维也纳长期公营和非营利住房说明，供给本身要足够大才会压住价格。反面教训是英国部分地区长期规划拖延和存量住房安全修复缓慢，证明只喊加快审批不够。AI 更适合做三件事：找出审批真正卡在哪个环节，预测哪些家庭会先掉入无家可归风险，并监测补贴是否被房租上涨吞掉。",
    "zh-Hant":
      "可參考芬蘭 Housing First 的經驗：先穩定住房，再處理成癮、就業和醫療，效果通常比讓人先滿足複雜條件更好；維也納長期公營和非營利住房說明，供給本身要足夠大才會壓住價格。反面教訓是英國部分地區長期規劃拖延和存量住房安全修復緩慢，證明只喊加快審批不夠。AI 更適合做三件事：找出審批真正卡在哪個環節，預測哪些家庭會先掉入無家可歸風險，並監測補貼是否被房租上漲吞掉。",
    en:
      "Finland's Housing First approach is useful here: stabilise housing first, then deal with addiction, work and health, instead of making vulnerable people clear every condition before they get a home. Vienna also shows that large, durable public and non-profit supply can shape prices. The warning case is the UK, where planning delays and slow remediation of unsafe housing stock show that slogans about faster approvals are not enough. AI is most useful for finding the exact approval bottleneck, forecasting which households are closest to homelessness, and checking whether subsidies are being swallowed by rent rises.",
    es:
      "La experiencia finlandesa de Housing First es relevante: estabilizar primero la vivienda y luego tratar adicciones, empleo y salud suele funcionar mejor que exigir condiciones previas complejas. Viena muestra que una oferta pública y sin ánimo de lucro suficientemente grande puede contener precios. La advertencia viene del Reino Unido, donde retrasos urbanísticos y reparación lenta de viviendas inseguras muestran que acelerar aprobaciones no basta. La IA puede detectar el cuello de botella real, prever qué hogares se acercan al sinhogarismo y vigilar si los subsidios acaban absorbidos por subidas de alquiler.",
    ja:
      "参考になるのはフィンランドの Housing First です。先に住まいを安定させ、その後に依存、仕事、医療を扱う方が、複雑な条件を先に満たさせるより機能しやすい。ウィーンの公的・非営利住宅も、十分な供給が価格を左右することを示します。逆に英国では、計画遅延や危険住宅の修復遅れが、承認を速くするだけでは足りないと示しました。AI は承認の詰まり、ホームレス化リスクの高い世帯、補助金が家賃上昇に吸収されていないかを監視するのに向いています。",
    ko:
      "핀란드의 Housing First 경험이 참고됩니다. 먼저 주거를 안정시키고 그다음 중독, 고용, 의료를 다루는 방식이 복잡한 조건을 먼저 요구하는 방식보다 효과적인 경우가 많습니다. 비엔나의 공공·비영리 주택은 충분한 공급 자체가 가격을 움직인다는 점을 보여줍니다. 반대로 영국 일부 지역의 계획 지연과 위험 주택 보수 지연은 승인 속도 구호만으로는 부족하다는 교훈입니다. AI는 승인 병목, 노숙 위험 가구, 보조금이 임대료 상승에 흡수되는지를 감시하는 데 적합합니다.",
    vi:
      "Kinh nghiệm Housing First của Phần Lan đáng tham khảo: ổn định chỗ ở trước, rồi xử lý nghiện, việc làm và y tế, thường tốt hơn việc bắt người yếu thế đáp ứng nhiều điều kiện trước. Vienna cho thấy nguồn cung công và phi lợi nhuận đủ lớn có thể tác động giá. Bài học ngược là Anh, nơi trì hoãn quy hoạch và sửa nhà không an toàn quá chậm cho thấy khẩu hiệu đẩy nhanh phê duyệt là chưa đủ. AI nên dùng để tìm nút thắt phê duyệt, dự báo hộ sắp rơi vào vô gia cư và kiểm tra trợ cấp có bị tiền thuê nuốt mất không.",
    th:
      "บทเรียนจาก Housing First ของฟินแลนด์คือให้ที่อยู่อาศัยมั่นคงก่อน แล้วค่อยจัดการเรื่องเสพติด งาน และสุขภาพ มักได้ผลกว่าการให้คนเปราะบางผ่านเงื่อนไขซับซ้อนก่อน เวียนนาก็ชี้ว่าที่อยู่อาศัยภาครัฐและไม่แสวงกำไรจำนวนมากพอช่วยกดราคาได้ บทเรียนด้านลบคืออังกฤษที่เจอความล่าช้าเรื่องผังเมืองและการซ่อมบ้านไม่ปลอดภัย AI เหมาะกับการหาคอขวดอนุมัติ คาดการณ์ครัวเรือนเสี่ยงไร้บ้าน และดูว่าเงินช่วยเหลือถูกค่าเช่ากลืนไปหรือไม่",
    si:
      "ෆින්ලන්තයේ Housing First අත්දැකීම මෙහි ප්‍රයෝජනවත්ය: පළමුව නිවාස ස්ථාවර කර, පසුව addiction, work සහ health ගැටලු සලකයි. Vienna පෙන්වන්නේ public/non-profit housing supply විශාල නම් මිල පාලනයට බලපෑ හැකි බවයි. UK හි planning delays සහ unsafe housing remediation මන්දගාමී වීමෙන් approvals වේගවත් කිරීම පමණක් ප්‍රමාණවත් නොවන බව පෙනේ. AI හොඳින් භාවිතා කළ හැක්කේ approval bottlenecks, homelessness risk households සහ subsidies rent rises වලට ගිලී යනවාද යන්න සොයා ගැනීමටය."
  },
  health: {
    "zh-Hans":
      "国际经验的关键不是“多上系统”，而是系统是否接入临床流程。丹麦、芬兰等北欧国家的健康数据基础较强，能支持更连续的随访和研究；英国 NHS 的排队和急诊压力则说明，数字入口不能替代真实床位、人手和问责。荷兰儿童福利算法丑闻也提醒，医疗和福利数据一旦用于自动判定风险，必须能解释、能申诉、能停用。AI 在澳洲更应先做低风险环节：分诊排序、漏诊/漏随访提醒、异常处方提示和隐私泄露预警。",
    "zh-Hant":
      "國際經驗的關鍵不是「多上系統」，而是系統是否接入臨床流程。丹麥、芬蘭等北歐國家的健康資料基礎較強，能支持更連續的追蹤和研究；英國 NHS 的排隊和急診壓力則說明，數位入口不能替代真實床位、人手和問責。荷蘭兒童福利演算法醜聞也提醒，醫療和福利資料一旦用於自動判定風險，必須能解釋、能申訴、能停用。AI 在澳洲更應先做低風險環節：分診排序、漏診/漏追蹤提醒、異常處方提示和隱私外洩預警。",
    en:
      "The lesson from other developed systems is that software only helps if it is inside the clinical workflow. Denmark and Finland show the value of strong health-data infrastructure for follow-up and research. The NHS shows the limit: digital front doors do not create beds, clinicians or accountability. The Dutch childcare-benefits scandal is also relevant, because health and welfare risk scoring must be explainable, appealable and stoppable. In Australia, AI should start in lower-risk layers: triage prioritisation, missed follow-up alerts, prescribing anomaly warnings and privacy-leak detection.",
    es:
      "La lección internacional es que el software solo ayuda si entra en el flujo clínico. Dinamarca y Finlandia muestran el valor de una infraestructura fuerte de datos sanitarios para seguimiento e investigación. El NHS británico muestra el límite: una puerta digital no crea camas, personal ni responsabilidad. El escándalo neerlandés de subsidios infantiles recuerda que puntuar riesgos en salud o bienestar debe ser explicable, apelable y reversible. En Australia, la IA debería empezar por usos de menor riesgo: priorizar triaje, alertar seguimientos perdidos, detectar prescripciones anómalas y fugas de privacidad.",
    ja:
      "他国の教訓は、ソフトウェアは臨床の流れに入って初めて役立つという点です。デンマークやフィンランドは、強い医療データ基盤が追跡や研究に有効だと示します。一方、英国 NHS はデジタル窓口だけでは病床、人員、責任は増えないことを示します。オランダの給付アルゴリズム問題も、医療・福祉のリスク判定には説明、異議申し立て、停止可能性が必要だと教えます。豪州ではまず、トリアージ、未追跡警告、処方異常、情報漏れ検知から始めるべきです。",
    ko:
      "다른 선진국의 교훈은 소프트웨어가 임상 흐름 안에 들어갈 때만 효과가 있다는 점입니다. 덴마크와 핀란드는 강한 보건 데이터 기반이 추적 관리와 연구에 도움이 됨을 보여줍니다. 영국 NHS는 디지털 창구만으로 병상, 인력, 책임이 생기지 않는다는 한계를 보여줍니다. 네덜란드 보육수당 알고리즘 사건은 의료·복지 위험 점수가 설명 가능하고 이의 제기와 중단이 가능해야 함을 경고합니다. 호주에서는 분류 우선순위, 미추적 알림, 처방 이상, 개인정보 유출 감지부터 적용하는 편이 낫습니다.",
    vi:
      "Bài học từ các hệ thống phát triển là phần mềm chỉ hữu ích khi nằm trong quy trình lâm sàng. Đan Mạch và Phần Lan cho thấy hạ tầng dữ liệu y tế mạnh giúp theo dõi và nghiên cứu. NHS của Anh cho thấy giới hạn: cổng số không tự tạo ra giường bệnh, nhân lực hay trách nhiệm. Vụ thuật toán trợ cấp trẻ em ở Hà Lan nhắc rằng chấm điểm rủi ro y tế và phúc lợi phải giải thích được, khiếu nại được và dừng được. Ở Úc, AI nên bắt đầu từ phân luồng, nhắc theo dõi bỏ sót, cảnh báo kê đơn bất thường và phát hiện rò rỉ riêng tư.",
    th:
      "บทเรียนจากประเทศพัฒนาแล้วคือซอฟต์แวร์ช่วยได้ต่อเมื่ออยู่ใน workflow การรักษาจริง เดนมาร์กและฟินแลนด์แสดงว่าฐานข้อมูลสุขภาพที่ดีช่วยติดตามและวิจัยได้ ส่วน NHS อังกฤษชี้ว่าประตูดิจิทัลไม่ได้สร้างเตียง บุคลากร หรือความรับผิดชอบเอง กรณีอัลกอริทึมสวัสดิการเด็กของเนเธอร์แลนด์เตือนว่าการให้คะแนนความเสี่ยงด้านสุขภาพและสวัสดิการต้องอธิบาย อุทธรณ์ และหยุดได้ ในออสเตรเลีย AI ควรเริ่มจากจัดลำดับ triage เตือน follow-up ที่หาย เตือนใบสั่งยาผิดปกติ และจับความเสี่ยงข้อมูลรั่ว",
    si:
      "අනෙකුත් developed health systems වල පාඩම software clinical workflow තුළ ඇතුළත් වූ විට පමණක් ප්‍රයෝජනවත් බවයි. Denmark සහ Finland strong health-data infrastructure මඟින් follow-up සහ research සඳහා වටිනාකම පෙන්වයි. UK NHS පෙන්වන්නේ digital front door එක beds, clinicians හෝ accountability නිර්මාණය නොකරන බවයි. Netherlands childcare-benefits algorithm scandal ද health/welfare risk scoring explainable, appealable, stoppable විය යුතු බව මතක් කරයි. Australia හි AI පළමුව triage, missed follow-up alerts, prescribing warnings සහ privacy leak detection වැනි අඩු අවදානම් තැන්වල යොදා ගත යුතුය."
  },
  justice: {
    "zh-Hans":
      "发达国家的经验很清楚：公共安全系统如果只追求“更硬”，很容易把问题推迟到下一次悲剧。美国 COMPAS 等算法量刑争议说明，黑箱风险评分会放大种族和阶层偏见；荷兰福利算法丑闻说明，错误模型可以毁掉无辜家庭。相对可取的是把 AI 限制在辅助层：整理证据时间线、发现多机构之间未共享的风险信号、提醒保释或保护令条件是否被违反。最终判断必须由人承担，并接受独立审计。",
    "zh-Hant":
      "發達國家的經驗很清楚：公共安全系統如果只追求「更硬」，很容易把問題推遲到下一次悲劇。美國 COMPAS 等演算法量刑爭議說明，黑箱風險評分會放大種族和階層偏見；荷蘭福利演算法醜聞說明，錯誤模型可以毀掉無辜家庭。相對可取的是把 AI 限制在輔助層：整理證據時間線、發現多機構之間未共享的風險信號、提醒保釋或保護令條件是否被違反。最終判斷必須由人承擔，並接受獨立審計。",
    en:
      "The developed-country record is clear: if public safety only becomes tougher after each case, it often postpones failure rather than prevents it. US risk-scoring controversies around tools such as COMPAS show how black-box models can amplify race and class bias. The Dutch welfare-algorithm scandal shows how automated suspicion can damage innocent families. The safer use of AI is narrower: evidence timelines, cross-agency risk signals, and alerts when bail or protection-order conditions may have been breached. Final judgement must stay with accountable people and independent audits.",
    es:
      "La experiencia de países desarrollados es clara: si la seguridad pública solo se endurece después de cada caso, suele posponer el fracaso en vez de prevenirlo. Las controversias en EE. UU. sobre herramientas como COMPAS muestran cómo modelos opacos pueden amplificar sesgos raciales y de clase. El escándalo neerlandés de bienestar muestra cómo la sospecha automatizada puede dañar familias inocentes. El uso seguro de IA es más estrecho: cronologías de pruebas, señales de riesgo entre agencias y alertas sobre incumplimientos de fianzas u órdenes de protección. El juicio final debe quedar en personas responsables y auditorías independientes.",
    ja:
      "先進国の経験は明確です。事件のたびに厳罰化だけを進めても、失敗を防ぐより先送りしがちです。米国の COMPAS などのリスク評価論争は、ブラックボックスモデルが人種や階層の偏りを増幅し得ることを示しました。オランダの福祉アルゴリズム問題は、自動化された疑いが無実の家庭を傷つける危険を示します。AI の安全な使い方は、証拠の時系列整理、機関間のリスク信号、保釈や保護命令違反の警告に限定すべきです。最終判断は責任ある人と独立監査に残す必要があります。",
    ko:
      "선진국의 경험은 분명합니다. 공공안전이 사건 뒤마다 더 강한 처벌만 추구하면 실패를 막기보다 다음 사건으로 미룰 수 있습니다. 미국 COMPAS 같은 위험 점수 논란은 블랙박스 모델이 인종과 계층 편향을 키울 수 있음을 보여줍니다. 네덜란드 복지 알고리즘 사건은 자동화된 의심이 무고한 가정을 파괴할 수 있음을 보여줍니다. AI는 증거 타임라인, 기관 간 위험 신호, 보석이나 보호명령 위반 알림 같은 보조 역할로 제한해야 합니다. 최종 판단은 책임 있는 사람과 독립 감사가 맡아야 합니다.",
    vi:
      "Kinh nghiệm các nước phát triển khá rõ: nếu an toàn công cộng chỉ cứng rắn hơn sau mỗi vụ, thất bại thường bị trì hoãn chứ không được ngăn chặn. Tranh cãi ở Mỹ quanh các công cụ như COMPAS cho thấy mô hình hộp đen có thể khuếch đại thiên lệch chủng tộc và giai tầng. Vụ thuật toán phúc lợi ở Hà Lan cho thấy nghi ngờ tự động có thể làm hại gia đình vô tội. AI nên giới hạn ở vai trò phụ trợ: dòng thời gian chứng cứ, tín hiệu rủi ro giữa cơ quan, cảnh báo vi phạm bảo lãnh hoặc lệnh bảo vệ. Phán đoán cuối cùng phải thuộc về người chịu trách nhiệm và kiểm toán độc lập.",
    th:
      "ประสบการณ์ประเทศพัฒนาแล้วชัดเจนว่า ถ้าความปลอดภัยสาธารณะตอบโต้ด้วยความเข้มงวดหลังเกิดคดีเท่านั้น มักเลื่อนความล้มเหลวไปครั้งหน้า ไม่ได้ป้องกันจริง ข้อถกเถียงเรื่อง COMPAS ในสหรัฐฯ แสดงว่าโมเดลกล่องดำเพิ่มอคติทางเชื้อชาติและชนชั้นได้ กรณีอัลกอริทึมสวัสดิการของเนเธอร์แลนด์ชี้ว่าความสงสัยอัตโนมัติทำร้ายครอบครัวบริสุทธิ์ได้ AI ควรจำกัดไว้ที่ไทม์ไลน์หลักฐาน สัญญาณเสี่ยงข้ามหน่วยงาน และเตือนการฝ่าฝืนเงื่อนไขประกันหรือคำสั่งคุ้มครอง การตัดสินสุดท้ายต้องเป็นของคนที่รับผิดชอบและถูก audit ได้",
    si:
      "Developed countries වල අත්දැකීම පැහැදිලිය: public safety එක සෑම සිද්ධියකට පසුම තවත් 'hard' වීමෙන් පමණක් අසාර්ථකත්වය වැළැක්වීම වෙනුවට පසුතල්ලු විය හැක. US හි COMPAS වැනි risk-scoring controversies black-box models race/class bias වැඩි කළ හැකි බව පෙන්වයි. Dutch welfare-algorithm scandal automated suspicion නිර්දෝෂී පවුල්ට හානි කළ හැකි බව පෙන්වයි. AI ආරක්ෂිත භාවිතය evidence timelines, cross-agency risk signals සහ bail/protection-order breach alerts වැනි auxiliary layer එකට සීමා විය යුතුය. අවසන් තීරණය accountable people සහ independent audits යටතේ තිබිය යුතුය."
  },
  community: {
    "zh-Hans":
      "这类问题可以参考新西兰 Wellbeing Budget 和部分北欧市政服务的做法：把儿童、老人、残障、移民和社区服务放在同一张结果表里看，而不是每个部门各算各的。失败经验也很重要：加拿大凤凰工资系统和英国一些大型公共 IT 项目说明，集中系统如果上线太急，会把弱势群体先伤到。AI 的位置应是“雷达”而不是“裁判”：发现同一家庭在学校、医院、福利和警务系统里反复出现的风险信号，再交给本地服务人员核实。",
    "zh-Hant":
      "這類問題可以參考紐西蘭 Wellbeing Budget 和部分北歐市政服務的做法：把兒童、老人、殘障、移民和社區服務放在同一張結果表裡看，而不是每個部門各算各的。失敗經驗也很重要：加拿大 Phoenix 工資系統和英國一些大型公共 IT 項目說明，集中系統如果上線太急，會把弱勢群體先傷到。AI 的位置應是「雷達」而不是「裁判」：發現同一家庭在學校、醫院、福利和警務系統裡反覆出現的風險信號，再交給本地服務人員核實。",
    en:
      "A useful comparison is New Zealand's wellbeing-budget approach and some Nordic municipal models: look at children, older people, disability, migrants and community services through shared outcomes, not departmental silos. The failure cases matter too. Canada's Phoenix payroll system and several large UK public-IT failures show that centralised systems rushed into production can hurt vulnerable users first. AI should act as radar, not judge: detect repeated risk signals across schools, hospitals, welfare and policing, then send them to local workers for verification.",
    es:
      "Una comparación útil es el enfoque de presupuesto de bienestar de Nueva Zelanda y algunos modelos municipales nórdicos: mirar infancia, mayores, discapacidad, migrantes y servicios comunitarios con resultados compartidos, no en silos. Los fracasos también importan. El sistema Phoenix de nóminas en Canadá y varios grandes fallos de TI pública en Reino Unido muestran que sistemas centralizados lanzados con prisa dañan primero a usuarios vulnerables. La IA debe ser radar, no juez: detectar señales repetidas entre escuelas, hospitales, bienestar y policía, y enviarlas a trabajadores locales para verificar.",
    ja:
      "参考になるのはニュージーランドの Wellbeing Budget や北欧の自治体モデルです。子ども、高齢者、障害、移民、地域サービスを部門別ではなく共通の成果で見る発想です。一方、カナダの Phoenix 給与システムや英国の大型公共 IT 失敗は、中央集権システムを急いで導入すると弱い利用者が先に傷つくことを示します。AI は裁判官ではなくレーダーであるべきです。学校、病院、福祉、警察にまたがる繰り返しのリスク信号を見つけ、地域の担当者が確認する形が安全です。",
    ko:
      "뉴질랜드의 Wellbeing Budget 접근과 일부 북유럽 지자체 모델이 참고됩니다. 아동, 노인, 장애, 이민자, 지역 서비스를 부처별 칸막이가 아니라 공동 성과로 보는 방식입니다. 실패 사례도 중요합니다. 캐나다 Phoenix 급여 시스템과 영국의 대형 공공 IT 실패는 중앙 시스템을 급하게 도입하면 취약 이용자가 먼저 피해를 입을 수 있음을 보여줍니다. AI는 판사가 아니라 레이더여야 합니다. 학교, 병원, 복지, 경찰에 반복적으로 나타나는 위험 신호를 감지하고 지역 담당자가 확인하게 해야 합니다.",
    vi:
      "Có thể so với cách tiếp cận ngân sách wellbeing của New Zealand và một số mô hình đô thị Bắc Âu: nhìn trẻ em, người già, khuyết tật, di dân và dịch vụ cộng đồng bằng kết quả chung, không theo từng silo. Bài học thất bại cũng quan trọng. Hệ thống lương Phoenix của Canada và nhiều dự án CNTT công ở Anh cho thấy hệ thống tập trung triển khai vội có thể làm hại người yếu thế trước. AI nên là radar, không phải thẩm phán: phát hiện tín hiệu rủi ro lặp lại giữa trường học, bệnh viện, phúc lợi và cảnh sát, rồi chuyển cho nhân viên địa phương xác minh.",
    th:
      "เทียบได้กับแนวทาง Wellbeing Budget ของนิวซีแลนด์และบริการเทศบาลบางแบบของนอร์ดิก คือดูเด็ก ผู้สูงอายุ คนพิการ ผู้อพยพ และบริการชุมชนผ่านผลลัพธ์ร่วม ไม่ใช่แยกเป็นหน่วยงาน บทเรียนล้มเหลวก็สำคัญ เช่นระบบเงินเดือน Phoenix ของแคนาดาและโครงการ IT ภาครัฐขนาดใหญ่บางแห่งในอังกฤษ ชี้ว่าระบบรวมศูนย์ที่รีบเปิดใช้ทำร้ายผู้เปราะบางก่อน AI ควรเป็นเรดาร์ ไม่ใช่ผู้ตัดสิน: เห็นสัญญาณเสี่ยงซ้ำในโรงเรียน โรงพยาบาล สวัสดิการ และตำรวจ แล้วส่งให้เจ้าหน้าที่ท้องถิ่นตรวจสอบ",
    si:
      "New Zealand Wellbeing Budget approach සහ Nordic municipal models මෙහි ප්‍රයෝජනවත් සංසන්දනයකි: children, older people, disability, migrants සහ community services departmental silos වෙනුවට shared outcomes මත බැලීම. Failure cases ද වැදගත්ය. Canada's Phoenix payroll system සහ UK public-IT failures පෙන්වන්නේ rushed centralised systems vulnerable users මුලින්ම හානියට පත් කළ හැකි බවයි. AI radar එකක් විය යුතුය, judge එකක් නොවේ: schools, hospitals, welfare සහ policing හරහා නැවත නැවත පෙනෙන risk signals හඳුනාගෙන local workers වෙත verification සඳහා යැවීම."
  },
  environment: {
    "zh-Hans":
      "发达国家的经验是，环境风险管理靠早发现和可信沟通。日本的地震、海啸预警系统说明，明确触发规则和公众反复演练会救命；韩国和台湾的疫情数据工具说明，实时数据很有用，但隐私边界必须事先讲清。反面是欧洲部分地区热浪、野火和洪水中，预警和撤离信息到达太晚。AI 在澳洲可以把实验室、野外巡查、热线、传感器和天气数据合成风险图，但每一次封锁、清理或补偿决定都要有公开阈值。",
    "zh-Hant":
      "發達國家的經驗是，環境風險管理靠早發現和可信溝通。日本的地震、海嘯預警系統說明，明確觸發規則和公眾反覆演練會救命；韓國和台灣的疫情資料工具說明，即時資料很有用，但隱私邊界必須事先講清。反面是歐洲部分地區熱浪、野火和洪水中，預警和撤離資訊到達太晚。AI 在澳洲可以把實驗室、野外巡查、熱線、感測器和天氣資料合成風險圖，但每一次封鎖、清理或補償決定都要有公開門檻。",
    en:
      "Developed-country experience says environmental risk management depends on early detection and trusted communication. Japan's earthquake and tsunami warnings show that clear trigger rules and public drills save lives. South Korea and Taiwan's pandemic data tools show the value of real-time data, but also the need to define privacy boundaries before the crisis. The warning cases are European heatwaves, wildfires and floods where alerts or evacuation messages arrived too late. In Australia, AI can combine labs, field checks, hotlines, sensors and weather into risk maps, but restrictions, clean-ups and compensation should still use published thresholds.",
    es:
      "La experiencia de países desarrollados muestra que el riesgo ambiental depende de detección temprana y comunicación confiable. Las alertas de terremoto y tsunami de Japón muestran que reglas claras y simulacros salvan vidas. Las herramientas de datos de pandemia de Corea del Sur y Taiwán muestran el valor de datos en tiempo real, pero también la necesidad de límites de privacidad previos. Los casos negativos son olas de calor, incendios e inundaciones en Europa donde alertas o evacuaciones llegaron tarde. En Australia, la IA puede unir laboratorios, inspecciones, líneas de aviso, sensores y clima en mapas de riesgo, pero restricciones, limpieza y compensación deben usar umbrales públicos.",
    ja:
      "先進国の経験では、環境リスク管理は早期発見と信頼できる説明にかかっています。日本の地震・津波警報は、明確な発動基準と訓練が命を救うことを示します。韓国や台湾の感染症データ活用はリアルタイムデータの価値を示す一方、危機前にプライバシー境界を決める必要も示しました。欧州の熱波、山火事、洪水では警報や避難情報が遅れた例があります。豪州では AI が検査、巡回、通報、センサー、気象をリスク地図にできますが、規制、清掃、補償は公開基準で決めるべきです。",
    ko:
      "선진국 경험은 환경 위험 관리가 조기 발견과 신뢰할 수 있는 소통에 달려 있음을 보여줍니다. 일본의 지진·쓰나미 경보는 명확한 기준과 반복 훈련이 생명을 구한다는 점을 보여줍니다. 한국과 대만의 팬데믹 데이터 도구는 실시간 데이터의 가치를 보여주지만 위기 전에 개인정보 경계를 정해야 함도 보여줍니다. 유럽의 폭염, 산불, 홍수에서는 경보나 대피 메시지가 늦은 사례가 있었습니다. 호주에서는 AI가 실험실, 현장 점검, 신고, 센서, 기상 데이터를 위험 지도로 합칠 수 있지만 제한, 정화, 보상 결정은 공개 기준을 써야 합니다.",
    vi:
      "Kinh nghiệm các nước phát triển cho thấy quản lý rủi ro môi trường phụ thuộc vào phát hiện sớm và truyền thông đáng tin. Cảnh báo động đất, sóng thần của Nhật cho thấy quy tắc kích hoạt rõ và diễn tập cứu mạng. Công cụ dữ liệu dịch bệnh của Hàn Quốc và Đài Loan cho thấy dữ liệu thời gian thực hữu ích, nhưng ranh giới riêng tư phải có trước khủng hoảng. Bài học xấu là nắng nóng, cháy rừng và lũ ở châu Âu khi cảnh báo hoặc sơ tán đến muộn. Ở Úc, AI có thể ghép phòng thí nghiệm, kiểm tra hiện trường, hotline, cảm biến và thời tiết thành bản đồ rủi ro, nhưng hạn chế, dọn dẹp và bồi thường cần ngưỡng công khai.",
    th:
      "ประสบการณ์ประเทศพัฒนาแล้วบอกว่าการจัดการความเสี่ยงสิ่งแวดล้อมขึ้นกับการพบเร็วและสื่อสารให้เชื่อถือได้ ระบบเตือนแผ่นดินไหวและสึนามิของญี่ปุ่นแสดงว่าเกณฑ์ trigger ชัดและการซ้อมช่วยชีวิตได้ เครื่องมือข้อมูลโควิดของเกาหลีใต้และไต้หวันแสดงว่าข้อมูล realtime มีค่า แต่ต้องกำหนดขอบเขตความเป็นส่วนตัวก่อนวิกฤต บทเรียนด้านลบคือคลื่นความร้อน ไฟป่า และน้ำท่วมในยุโรปที่คำเตือนหรืออพยพมาช้า ในออสเตรเลีย AI รวมแล็บ ภาคสนาม hotline sensor และอากาศเป็นแผนที่เสี่ยงได้ แต่การปิดพื้นที่ ทำความสะอาด และชดเชยต้องมี threshold สาธารณะ",
    si:
      "Developed-country experience පෙන්වන්නේ environmental risk management early detection සහ trusted communication මත රඳා පවතින බවයි. Japan earthquake/tsunami warnings පැහැදිලි trigger rules සහ public drills ජීවිත බේරාගන්නා බව පෙන්වයි. South Korea සහ Taiwan pandemic data tools real-time data වටිනාකම පෙන්වූ නමුත් privacy boundaries crisis එකට පෙර නිර්වචනය කළ යුතු බවත් පෙන්වයි. Europe heatwaves, wildfires සහ floods වල alerts/evacuation messages ප්‍රමාද වූ cases warning වේ. Australia හි AI labs, field checks, hotlines, sensors සහ weather data risk maps බවට කළ හැකි නමුත් restrictions, clean-ups සහ compensation published thresholds මත විය යුතුය."
  },
  "economic-harm": {
    "zh-Hans":
      "金融和消费伤害的国际经验很直接：监管不能等媒体曝光后才动作。英国开放银行和反诈骗协作说明，标准化数据接口能让消费者更容易发现异常；欧盟 GDPR 的罚款机制说明，隐私违规必须有真实成本。反面经验是美国信用评分和荷兰福利算法争议，自动化系统如果不透明，会把错误长期压在弱势群体身上。AI 可以帮澳洲做交易异常、误收费、诈骗话术和高风险合同预警，但企业必须解释模型依据，并自动退还可确认损失。",
    "zh-Hant":
      "金融和消費傷害的國際經驗很直接：監管不能等媒體曝光後才動作。英國開放銀行和反詐協作說明，標準化資料介面能讓消費者更容易發現異常；歐盟 GDPR 的罰款機制說明，隱私違規必須有真實成本。反面經驗是美國信用評分和荷蘭福利演算法爭議，自動化系統如果不透明，會把錯誤長期壓在弱勢群體身上。AI 可以幫澳洲做交易異常、誤收費、詐騙話術和高風險合約預警，但企業必須解釋模型依據，並自動退還可確認損失。",
    en:
      "The international lesson is direct: regulators should not wait for media exposure before acting. UK open-banking and anti-scam coordination show how standardised data can help consumers and banks spot anomalies earlier. The EU's GDPR enforcement shows that privacy breaches need real financial cost. The warning cases are US credit scoring and the Dutch welfare-algorithm scandal, where opaque automation can trap weaker users in error. AI can help Australia flag abnormal transactions, fee mistakes, scam language and risky contracts, but firms should explain the model basis and automatically refund confirmed losses.",
    es:
      "La lección internacional es directa: los reguladores no deben esperar a que la prensa revele el problema. La banca abierta y coordinación antifraude del Reino Unido muestran cómo datos estandarizados ayudan a consumidores y bancos a detectar anomalías antes. El GDPR europeo muestra que violar privacidad debe tener coste real. Los casos negativos son el scoring crediticio de EE. UU. y el escándalo neerlandés de bienestar, donde automatización opaca atrapa a usuarios débiles en errores. La IA puede alertar transacciones anómalas, cobros erróneos, lenguaje de estafa y contratos riesgosos, pero las empresas deben explicar el modelo y reembolsar pérdidas confirmadas.",
    ja:
      "国際的な教訓は明確です。規制当局は報道で発覚してから動くべきではありません。英国のオープンバンキングや詐欺対策連携は、標準化データが消費者と銀行の異常検知を早めることを示します。EU の GDPR 執行は、個人情報違反に実際の費用を負わせる必要を示します。米国の信用スコアやオランダの福祉アルゴリズム問題は、不透明な自動化が弱い利用者を誤りに閉じ込める危険を示します。豪州では AI が異常取引、誤課金、詐欺文句、危険契約を警告できますが、企業は根拠を説明し、確認済み損失を自動返金すべきです。",
    ko:
      "국제적 교훈은 분명합니다. 규제기관은 언론 보도 뒤에야 움직여서는 안 됩니다. 영국의 오픈뱅킹과 사기 대응 협력은 표준화 데이터가 소비자와 은행의 이상 탐지를 앞당길 수 있음을 보여줍니다. EU GDPR 집행은 개인정보 침해에 실제 비용이 있어야 함을 보여줍니다. 미국 신용점수와 네덜란드 복지 알고리즘 사건은 불투명한 자동화가 약한 이용자를 오류에 가둘 수 있음을 경고합니다. AI는 이상 거래, 수수료 오류, 사기 문구, 위험 계약을 경고할 수 있지만 기업은 모델 근거를 설명하고 확인된 손실은 자동 환불해야 합니다.",
    vi:
      "Bài học quốc tế rất thẳng: cơ quan quản lý không nên chờ báo chí phanh phui mới hành động. Open banking và phối hợp chống lừa đảo của Anh cho thấy dữ liệu chuẩn hóa giúp người tiêu dùng và ngân hàng phát hiện bất thường sớm hơn. GDPR của EU cho thấy vi phạm riêng tư phải có chi phí thật. Bài học xấu là chấm điểm tín dụng ở Mỹ và thuật toán phúc lợi Hà Lan, nơi tự động hóa mờ đục khiến người yếu thế mắc kẹt trong lỗi. AI có thể cảnh báo giao dịch bất thường, lỗi phí, ngôn ngữ lừa đảo và hợp đồng rủi ro, nhưng doanh nghiệp phải giải thích căn cứ mô hình và tự hoàn tiền tổn thất xác nhận được.",
    th:
      "บทเรียนสากลตรงมาก: regulator ไม่ควรรอให้สื่อเปิดโปงก่อนค่อยขยับ Open banking และความร่วมมือต้าน scam ของอังกฤษแสดงว่าข้อมูลมาตรฐานช่วยให้ผู้บริโภคและธนาคารเจอความผิดปกติเร็วขึ้น GDPR ของยุโรปชี้ว่าการละเมิด privacy ต้องมีต้นทุนจริง บทเรียนด้านลบคือ credit scoring ในสหรัฐฯ และอัลกอริทึมสวัสดิการเนเธอร์แลนด์ที่ระบบอัตโนมัติไม่โปร่งใสขังผู้เปราะบางไว้กับความผิดพลาด AI ช่วยเตือนธุรกรรมผิดปกติ ค่าธรรมเนียมผิด คำพูด scam และสัญญาเสี่ยงได้ แต่บริษัทต้องอธิบายเหตุผลของโมเดลและคืนเงินความเสียหายที่ยืนยันได้อัตโนมัติ",
    si:
      "International lesson එක සෘජුය: regulators මාධ්‍යයෙන් හෙළි වූ පසු පමණක් ක්‍රියා නොකළ යුතුය. UK open-banking සහ anti-scam coordination standardised data මඟින් consumers/banks anomalies ඉක්මනින් දැකිය හැකි බව පෙන්වයි. EU GDPR enforcement privacy breaches සඳහා real financial cost අවශ්‍ය බව පෙන්වයි. US credit scoring සහ Dutch welfare-algorithm scandal opaque automation දුර්වල users error තුළ තබා ගත හැකි බව warning වේ. Australia හි AI abnormal transactions, fee mistakes, scam language සහ risky contracts flag කළ හැකි නමුත් firms model basis පැහැදිලි කර confirmed losses automatic refund කළ යුතුය."
  }
};

const FALLBACK_DEVELOPED_COUNTRY_EXPERIENCE = {
  "zh-Hans":
    "对照其他发达国家，成功经验通常不是某个新部门，而是可验证的目标、公开数据和持续迭代；失败经验则多发生在系统上线太急、数据不透明、受影响者没有申诉渠道。AI 可以提高发现问题的速度，但不能替代政治选择和公共责任。最稳妥的做法是先让 AI 做预警、归纳、排队和审计线索，再让有权责的人作最终决定。",
  "zh-Hant":
    "對照其他發達國家，成功經驗通常不是某個新部門，而是可驗證的目標、公開資料和持續迭代；失敗經驗則多發生在系統上線太急、資料不透明、受影響者沒有申訴渠道。AI 可以提高發現問題的速度，但不能替代政治選擇和公共責任。最穩妥的做法是先讓 AI 做預警、歸納、排隊和審計線索，再讓有權責的人作最終決定。",
  en:
    "Across developed countries, the success pattern is rarely a new agency by itself. It is measurable goals, open data and continuous adjustment. The failure pattern is rushed systems, opaque data and no appeal channel for affected people. AI can make problems visible earlier, but it cannot replace public responsibility. The safer model is to use AI for warnings, synthesis, queueing and audit leads, then leave final decisions with accountable people.",
  es:
    "En países desarrollados, el patrón de éxito rara vez es crear una agencia nueva por sí sola. Suele ser metas medibles, datos abiertos y ajuste continuo. El patrón de fracaso es sistemas apresurados, datos opacos y falta de apelación para afectados. La IA puede hacer visibles los problemas antes, pero no sustituye la responsabilidad pública. El modelo más seguro es usar IA para alertas, síntesis, priorización y pistas de auditoría, dejando decisiones finales a personas responsables.",
  ja:
    "先進国を比べると、成功は新しい機関そのものではなく、測れる目標、公開データ、継続的な修正から生まれます。失敗は、急いだシステム、不透明なデータ、被害者の不服申し立て不在で起きがちです。AI は問題を早く見える化できますが、公共責任を置き換えません。安全なのは、警告、要約、優先順位、監査手がかりに使い、最終判断を責任ある人に残すことです。",
  ko:
    "선진국을 비교하면 성공 패턴은 새 기관 자체가 아니라 측정 가능한 목표, 공개 데이터, 지속적 조정입니다. 실패 패턴은 성급한 시스템, 불투명한 데이터, 영향을 받은 사람의 이의 제기 부재입니다. AI는 문제를 더 빨리 보이게 할 수 있지만 공적 책임을 대체할 수 없습니다. 안전한 방식은 AI를 경고, 요약, 우선순위, 감사 단서에 쓰고 최종 결정은 책임 있는 사람에게 남기는 것입니다.",
  vi:
    "So với các nước phát triển, thành công hiếm khi chỉ đến từ một cơ quan mới. Nó thường là mục tiêu đo được, dữ liệu mở và điều chỉnh liên tục. Thất bại thường là hệ thống triển khai vội, dữ liệu mờ và người bị ảnh hưởng không có đường khiếu nại. AI có thể làm vấn đề hiện ra sớm hơn, nhưng không thay thế trách nhiệm công. Cách an toàn là dùng AI cho cảnh báo, tổng hợp, xếp hàng và manh mối kiểm toán, rồi để quyết định cuối cho người chịu trách nhiệm.",
  th:
    "เมื่อเทียบประเทศพัฒนาแล้ว รูปแบบสำเร็จมักไม่ใช่ตั้งหน่วยงานใหม่อย่างเดียว แต่คือเป้าหมายที่วัดได้ ข้อมูลเปิด และปรับปรุงต่อเนื่อง รูปแบบล้มเหลวคือระบบเร่งเปิด ข้อมูลทึบ และผู้ได้รับผลกระทบไม่มีทางอุทธรณ์ AI ทำให้ปัญหาเห็นเร็วขึ้นได้ แต่แทนความรับผิดชอบสาธารณะไม่ได้ วิธีที่ปลอดภัยคือใช้ AI เพื่อเตือน สรุป จัดคิว และหาเบาะแส audit แล้วให้คนที่รับผิดชอบตัดสินสุดท้าย",
  si:
    "Developed countries සසඳද්දී success pattern එක නව agency එකක් පමණක් නොව measurable goals, open data සහ continuous adjustment වේ. Failure pattern එක rushed systems, opaque data සහ affected people සඳහා appeal channel නැති වීමයි. AI ගැටලු ඉක්මනින් පෙන්විය හැකි නමුත් public responsibility වෙනුවට නොවේ. ආරක්ෂිත model එක AI warnings, synthesis, queueing සහ audit leads සඳහා භාවිතා කර final decisions accountable people වෙත තැබීමයි."
};

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
  if (matchedRule) {
    const base = matchedRule.comments[language] || matchedRule.comments.en;
    const experience = DEVELOPED_COUNTRY_EXPERIENCE[matchedRule.topic]?.[language] || DEVELOPED_COUNTRY_EXPERIENCE[matchedRule.topic]?.en;
    return [base, experience].filter(Boolean).join(" ");
  }

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
    return [
      FALLBACK_SOCIAL_COMMENTARY[language] || FALLBACK_SOCIAL_COMMENTARY.en,
      FALLBACK_DEVELOPED_COUNTRY_EXPERIENCE[language] || FALLBACK_DEVELOPED_COUNTRY_EXPERIENCE.en
    ].join(" ");
  }

  return "";
}

const PEOPLE_CONTEXT = [
  {
    name: "Ben Carroll",
    aliases: ["Ben Carroll", "本·卡罗尔", "本·卡羅爾", "ベン・キャロル", "벤 캐럴"],
    type: "politician",
    social: { label: "Facebook", url: "https://www.facebook.com/bencarrollmp/" },
    background: {
      "zh-Hans": "维州工党政治人物，Niddrie 选区州议员，2026 年接替 Jacinta Allan 成为维州州长。进入政界前做过律师和政策顾问，也曾任教育部长。",
      "zh-Hant": "維州工黨政治人物，Niddrie 選區州議員，2026 年接替 Jacinta Allan 成為維州州長。進入政界前做過律師和政策顧問，也曾任教育部長。",
      en: "Victorian Labor politician, MP for Niddrie and Premier of Victoria after replacing Jacinta Allan in 2026. He previously worked as a lawyer and policy adviser and served as education minister.",
      es: "Político laborista de Victoria, diputado por Niddrie y premier de Victoria tras reemplazar a Jacinta Allan en 2026. Antes fue abogado, asesor político y ministro de Educación.",
      ja: "ビクトリア州労働党の政治家。Niddrie 選出州議員で、2026年に Jacinta Allan の後任として州首相となりました。以前は弁護士、政策顧問、教育相を務めました。",
      ko: "빅토리아주 노동당 정치인으로 Niddrie 지역구 의원이며 2026년 Jacinta Allan 후임으로 주총리가 됐습니다. 변호사와 정책 보좌관, 교육장관을 지냈습니다.",
      vi: "Chính trị gia Labor tại Victoria, nghị sĩ bang khu Niddrie và là Premier của Victoria sau khi thay Jacinta Allan năm 2026. Ông từng là luật sư, cố vấn chính sách và bộ trưởng giáo dục.",
      th: "นักการเมือง Labor ของรัฐวิกตอเรีย ส.ส. เขต Niddrie และเป็น Premier of Victoria หลังแทน Jacinta Allan ในปี 2026 ก่อนหน้านี้เป็นทนาย ที่ปรึกษานโยบาย และรัฐมนตรีศึกษา",
      si: "Victorian Labor දේශපාලනඥයෙකු වන Ben Carroll Niddrie MP වන අතර 2026 දී Jacinta Allan වෙනුවට Premier of Victoria විය. ඔහු පෙර lawyer, policy adviser සහ education minister ලෙස කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "主打“换一种做法”，提出建筑行业皇家委员会，推动废除维州上议院 group voting tickets，并把学校、医疗和住房作为民生重点。",
      "zh-Hant": "主打「換一種做法」，提出建築行業皇家委員會，推動廢除維州上議院 group voting tickets，並把學校、醫療和住房作為民生重點。",
      en: "He has framed his leadership as doing things differently, promised a royal commission into the construction sector, moved against group voting tickets and emphasised schools, health and housing.",
      es: "Ha presentado su liderazgo como una forma distinta de gobernar, prometió una comisión real sobre la construcción, impulsó eliminar group voting tickets y destacó escuelas, salud y vivienda.",
      ja: "「やり方を変える」と訴え、建設業界の王立委員会、group voting tickets の廃止、学校・医療・住宅を重視しています。",
      ko: "그는 다른 방식의 리더십을 내세우며 건설 부문 왕립위원회, group voting tickets 폐지, 학교·보건·주거를 강조했습니다.",
      vi: "Ông nói sẽ làm khác đi, hứa lập royal commission về ngành xây dựng, thúc đẩy bỏ group voting tickets và nhấn mạnh trường học, y tế, nhà ở.",
      th: "เขาวางตัวว่าจะทำงานต่างออกไป เสนอ royal commission ด้านก่อสร้าง ผลักดันยกเลิก group voting tickets และเน้นโรงเรียน สุขภาพ และที่อยู่อาศัย",
      si: "ඔහු 'do things differently' ලෙස leadership එක ඉදිරිපත් කර construction sector royal commission, group voting tickets අවලංගු කිරීම සහ schools, health, housing අවධාරණය කරයි."
    }
  },
  {
    name: "Jacinta Allan",
    aliases: ["Jacinta Allan", "贾辛塔·艾伦", "賈辛塔·艾倫", "ジャシンタ・アラン", "재신타 앨런"],
    type: "politician",
    social: { label: "X", url: "https://x.com/JacintaAllanMP" },
    background: {
      "zh-Hans": "维州工党政治人物，Bendigo East 州议员，自 1999 年进入维州议会，2023 年至 2026 年担任维州州长。",
      "zh-Hant": "維州工黨政治人物，Bendigo East 州議員，自 1999 年進入維州議會，2023 年至 2026 年擔任維州州長。",
      en: "Victorian Labor politician and MP for Bendigo East. She entered Victorian parliament in 1999 and served as Premier of Victoria from 2023 to 2026.",
      es: "Política laborista de Victoria y diputada por Bendigo East. Entró al parlamento estatal en 1999 y fue premier de Victoria entre 2023 y 2026.",
      ja: "ビクトリア州労働党の政治家で Bendigo East 選出議員。1999年に州議会入りし、2023年から2026年まで州首相を務めました。",
      ko: "빅토리아 노동당 정치인이자 Bendigo East 의원입니다. 1999년 주의회에 입성했고 2023년부터 2026년까지 주총리를 지냈습니다.",
      vi: "Chính trị gia Labor của Victoria, nghị sĩ Bendigo East. Bà vào quốc hội bang năm 1999 và là Premier của Victoria từ 2023 đến 2026.",
      th: "นักการเมือง Labor รัฐวิกตอเรีย ส.ส. Bendigo East เข้าสภารัฐในปี 1999 และเป็น Premier of Victoria ระหว่าง 2023 ถึง 2026",
      si: "Victorian Labor දේශපාලනඥයෙකු සහ Bendigo East MP. 1999 දී Victorian parliament එකට තේරී පත්ව 2023-2026 අතර Premier of Victoria විය."
    },
    positions: {
      "zh-Hans": "主要与维州基础设施、Suburban Rail Loop、医疗服务扩张和区域发展议题相关，也长期面对大型工程成本和政府治理争议。",
      "zh-Hant": "主要與維州基礎設施、Suburban Rail Loop、醫療服務擴張和區域發展議題相關，也長期面對大型工程成本和政府治理爭議。",
      en: "She is closely associated with Victorian infrastructure, the Suburban Rail Loop, health-service expansion and regional development, while facing criticism over major-project costs and governance.",
      es: "Se asocia con infraestructura victoriana, Suburban Rail Loop, expansión sanitaria y desarrollo regional, aunque enfrentó críticas por costes de grandes proyectos y gobernanza.",
      ja: "インフラ、Suburban Rail Loop、医療サービス拡大、地域開発と結びつきが強く、大型事業費や統治を巡る批判も受けました。",
      ko: "빅토리아 인프라, Suburban Rail Loop, 보건 서비스 확대, 지역 개발과 관련이 깊으며 대형 사업 비용과 거버넌스 비판도 받았습니다.",
      vi: "Bà gắn với hạ tầng Victoria, Suburban Rail Loop, mở rộng dịch vụ y tế và phát triển vùng, đồng thời bị chỉ trích về chi phí dự án lớn và quản trị.",
      th: "เกี่ยวข้องกับโครงสร้างพื้นฐานของวิกตอเรีย Suburban Rail Loop การขยายบริการสุขภาพ และการพัฒนาภูมิภาค รวมถึงถูกวิจารณ์เรื่องต้นทุนโครงการใหญ่และ governance",
      si: "Victorian infrastructure, Suburban Rail Loop, health-service expansion සහ regional development සමඟ සම්බන්ධ අතර major-project costs සහ governance පිළිබඳ විවේචන ලැබීය."
    }
  },
  {
    name: "Anthony Albanese",
    aliases: ["Anthony Albanese", "Albanese", "安东尼·阿尔巴尼斯", "阿尔巴尼斯", "安東尼·阿爾巴尼斯", "阿爾巴尼斯", "アンソニー・アルバニージー", "앨버니지"],
    type: "politician",
    social: { label: "X", url: "https://x.com/AlboMP" },
    background: {
      "zh-Hans": "澳大利亚工党领袖，现任澳大利亚总理，长期代表悉尼内西区选区 Grayndler。",
      "zh-Hant": "澳洲工黨領袖，現任澳洲總理，長期代表雪梨內西區選區 Grayndler。",
      en: "Australian Labor leader and Prime Minister of Australia, long-time federal MP for Grayndler in Sydney's inner west.",
      es: "Líder laborista y primer ministro de Australia, diputado federal de larga trayectoria por Grayndler, en el inner west de Sídney.",
      ja: "オーストラリア労働党党首で首相。シドニー内西部 Grayndler 選出の長年の連邦議員です。",
      ko: "호주 노동당 대표이자 총리로, 시드니 inner west의 Grayndler 지역구 장기 연방 하원의원입니다.",
      vi: "Lãnh đạo Labor và Thủ tướng Úc, nghị sĩ liên bang lâu năm của Grayndler ở inner west Sydney.",
      th: "ผู้นำ Labor และนายกรัฐมนตรีออสเตรเลีย เป็น ส.ส. รัฐบาลกลางเขต Grayndler ใน inner west Sydney มายาวนาน",
      si: "Australian Labor leader සහ Prime Minister of Australia; Sydney inner west හි Grayndler federal MP ලෙස දිගු කාලයක් කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "主要强调生活成本缓解、医保和能源转型、AUKUS 与美国同盟、原住民事务和多边外交；在住房、加沙和政治透明度议题上经常受到压力。",
      "zh-Hant": "主要強調生活成本緩解、醫保和能源轉型、AUKUS 與美國同盟、原住民事務和多邊外交；在住房、加沙和政治透明度議題上經常受到壓力。",
      en: "His main themes include cost-of-living relief, Medicare and energy transition, AUKUS and the US alliance, Indigenous affairs and multilateral diplomacy; housing, Gaza and political transparency often test the government.",
      es: "Sus temas centrales incluyen coste de vida, Medicare y transición energética, AUKUS y alianza con EE. UU., asuntos indígenas y diplomacia multilateral; vivienda, Gaza y transparencia política suelen presionar al gobierno.",
      ja: "生活費対策、Medicare、エネルギー転換、AUKUS と米国同盟、先住民政策、多国間外交を重視します。住宅、ガザ、政治的透明性が政権の課題です。",
      ko: "생활비 완화, Medicare와 에너지 전환, AUKUS와 미국 동맹, 원주민 문제, 다자외교를 강조합니다. 주거, 가자, 정치 투명성이 정부를 시험합니다.",
      vi: "Ông nhấn mạnh giảm áp lực chi phí sinh hoạt, Medicare, chuyển đổi năng lượng, AUKUS và liên minh Mỹ, vấn đề First Nations và ngoại giao đa phương; nhà ở, Gaza và minh bạch chính trị thường gây áp lực.",
      th: "ประเด็นหลักคือค่าครองชีพ Medicare และพลังงาน AUKUS และพันธมิตรสหรัฐฯ ประเด็นชนพื้นเมือง และการทูตพหุภาคี ส่วนที่กดดันรัฐบาลคือที่อยู่อาศัย Gaza และความโปร่งใสทางการเมือง",
      si: "ඔහු cost-of-living relief, Medicare, energy transition, AUKUS/US alliance, Indigenous affairs සහ multilateral diplomacy අවධාරණය කරයි; housing, Gaza සහ political transparency රජය පරීක්ෂා කරන කරුණු වේ."
    }
  },
  {
    name: "Pauline Hanson",
    aliases: ["Pauline Hanson", "保琳·汉森", "保琳·漢森", "ポーリン・ハンソン", "폴린 핸슨"],
    type: "politician",
    social: { label: "X", url: "https://x.com/PaulineHansonOz" },
    background: {
      "zh-Hans": "昆州参议员，One Nation 创始人和领导人，是澳洲右翼民粹政治中最知名人物之一。",
      "zh-Hant": "昆州參議員，One Nation 創辦人和領導人，是澳洲右翼民粹政治中最知名人物之一。",
      en: "Queensland senator, founder and leader of One Nation, and one of Australia's best-known right-wing populist politicians.",
      es: "Senadora por Queensland, fundadora y líder de One Nation, y una de las figuras populistas de derecha más conocidas de Australia.",
      ja: "クイーンズランド州選出上院議員で One Nation の創設者・党首。豪州の右派ポピュリズムを代表する政治家の一人です。",
      ko: "퀸즐랜드 상원의원, One Nation 창립자이자 대표로 호주의 대표적 우파 포퓰리스트 정치인입니다.",
      vi: "Thượng nghị sĩ Queensland, nhà sáng lập và lãnh đạo One Nation, một trong những chính trị gia dân túy cánh hữu nổi tiếng nhất Úc.",
      th: "วุฒิสมาชิกควีนส์แลนด์ ผู้ก่อตั้งและผู้นำ One Nation และเป็นนักการเมืองประชานิยมขวาที่เป็นที่รู้จักมากที่สุดคนหนึ่งของออสเตรเลีย",
      si: "Queensland senator, One Nation founder/leader සහ Australia හි ප්‍රසිද්ධ right-wing populist politician කෙනෙකි."
    },
    positions: {
      "zh-Hans": "主要围绕移民限制、反政治正确、能源和生活成本、对主流两党的不信任发声；其关于种族、宗教和家庭暴力等议题的言论经常引发争议。",
      "zh-Hant": "主要圍繞移民限制、反政治正確、能源和生活成本、對主流兩黨的不信任發聲；其關於種族、宗教和家庭暴力等議題的言論經常引發爭議。",
      en: "Her core messages centre on lower immigration, anti-political-correctness politics, energy and cost-of-living pressure, and distrust of major parties; her remarks on race, religion and domestic violence often trigger controversy.",
      es: "Sus mensajes centrales giran en torno a menor inmigración, rechazo a la corrección política, energía y coste de vida, y desconfianza hacia los partidos grandes; sus dichos sobre raza, religión y violencia doméstica suelen generar controversia.",
      ja: "移民制限、反ポリティカル・コレクトネス、エネルギーと生活費、二大政党不信を訴えます。人種、宗教、家庭内暴力を巡る発言はしばしば論争になります。",
      ko: "이민 제한, 반정치적 올바름, 에너지와 생활비, 주요 정당 불신을 내세웁니다. 인종, 종교, 가정폭력 관련 발언은 자주 논란을 낳습니다.",
      vi: "Thông điệp chính xoay quanh giảm nhập cư, chống political correctness, năng lượng và chi phí sinh hoạt, và nghi ngờ các đảng lớn; phát ngôn về chủng tộc, tôn giáo và bạo lực gia đình thường gây tranh cãi.",
      th: "ประเด็นหลักคือจำกัดคนเข้าเมือง ต่อต้าน political correctness พลังงานและค่าครองชีพ และความไม่ไว้วางใจพรรคใหญ่ คำพูดเรื่องเชื้อชาติ ศาสนา และความรุนแรงในครอบครัวมักก่อข้อถกเถียง",
      si: "ඇයගේ ප්‍රධාන messages immigration අඩු කිරීම, anti-political-correctness, energy/cost-of-living සහ major parties පිළිබඳ අවිශ්වාසය වටා වේ; race, religion සහ domestic violence පිළිබඳ remarks නිතර controversy ඇති කරයි."
    }
  },
  {
    name: "Angus Taylor",
    aliases: ["Angus Taylor", "安格斯·泰勒", "アンガス・テイラー", "앵거스 테일러"],
    type: "politician",
    social: { label: "Facebook", url: "https://www.facebook.com/Angustaylor4hume/" },
    background: {
      "zh-Hans": "澳大利亚自由党领袖，Hume 选区联邦议员，曾任能源、网络安全和影子财长等职务。",
      "zh-Hant": "澳洲自由黨領袖，Hume 選區聯邦議員，曾任能源、網路安全和影子財長等職務。",
      en: "Leader of the Liberal Party, federal MP for Hume and former minister or shadow minister in portfolios including energy, cybersecurity and treasury.",
      es: "Líder del Partido Liberal, diputado federal por Hume y ex ministro o portavoz en áreas como energía, ciberseguridad y tesorería.",
      ja: "自由党党首で Hume 選出連邦議員。エネルギー、サイバーセキュリティ、財務関連の大臣・影の大臣を務めました。",
      ko: "자유당 대표이자 Hume 연방 하원의원으로 에너지, 사이버보안, 재무 분야 장관 또는 예비장관을 지냈습니다.",
      vi: "Lãnh đạo Đảng Liberal, nghị sĩ liên bang Hume, từng giữ hoặc phụ trách đối lập các mảng năng lượng, an ninh mạng và ngân khố.",
      th: "ผู้นำ Liberal Party ส.ส. รัฐบาลกลางเขต Hume เคยรับบทด้านพลังงาน cybersecurity และ treasury",
      si: "Liberal Party leader, Hume federal MP; energy, cybersecurity සහ treasury portfolios හි minister/shadow minister ලෙස කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "强调经济管理、减税、能源可靠性和移民控制，反对工党在能源、税收和监管上的扩张；其领导力也被用来检验联盟党能否重新集中政策方向。",
      "zh-Hant": "強調經濟管理、減稅、能源可靠性和移民控制，反對工黨在能源、稅收和監管上的擴張；其領導力也被用來檢驗聯盟黨能否重新集中政策方向。",
      en: "He stresses economic management, lower taxes, energy reliability and migration control, and opposes Labor's approach to energy, tax and regulation; his leadership is a test of whether the Coalition can sharpen its policy direction.",
      es: "Subraya gestión económica, menores impuestos, fiabilidad energética y control migratorio, y se opone al enfoque laborista sobre energía, impuestos y regulación; su liderazgo prueba si la Coalición puede aclarar su rumbo.",
      ja: "経済運営、減税、エネルギー信頼性、移民管理を重視し、労働党のエネルギー、税、規制方針に反対します。連合が政策軸を明確にできるかの試金石です。",
      ko: "경제 관리, 감세, 에너지 신뢰성, 이민 통제를 강조하고 노동당의 에너지·세금·규제 접근에 반대합니다. 그의 리더십은 연립이 정책 방향을 선명히 할 수 있는지 시험합니다.",
      vi: "Ông nhấn mạnh quản lý kinh tế, giảm thuế, độ tin cậy năng lượng và kiểm soát di cư, phản đối cách Labor xử lý năng lượng, thuế và quy định; lãnh đạo của ông là phép thử cho hướng chính sách của Coalition.",
      th: "เน้นการจัดการเศรษฐกิจ ลดภาษี ความมั่นคงพลังงาน และควบคุม migration ต่อต้านแนวทาง Labor ด้านพลังงาน ภาษี และกฎระเบียบ การนำของเขาทดสอบว่า Coalition จะชัดเรื่องนโยบายได้หรือไม่",
      si: "ඔහු economic management, lower taxes, energy reliability සහ migration control අවධාරණය කරයි; Labor හි energy, tax, regulation approach ට විරුද්ධ වේ. Coalition policy direction sharpen කළ හැකිද යන්න ඔහුගේ leadership එක පරීක්ෂා කරයි."
    }
  },
  {
    name: "Fatima Payman",
    aliases: ["Fatima Payman", "法蒂玛·佩曼", "法蒂瑪·佩曼", "ファティマ・ペイマン", "파티마 페이먼"],
    type: "politician",
    social: { label: "Instagram", url: "https://www.instagram.com/senatorfatimapayman/" },
    background: {
      "zh-Hans": "西澳参议员，出生于阿富汗，曾属工党，后成为独立参议员并成立 Australia's Voice。",
      "zh-Hant": "西澳參議員，出生於阿富汗，曾屬工黨，後成為獨立參議員並成立 Australia's Voice。",
      en: "Western Australian senator, born in Afghanistan. She entered parliament with Labor, later became independent and founded Australia's Voice.",
      es: "Senadora por Australia Occidental, nacida en Afganistán. Entró al parlamento con Labor, luego fue independiente y fundó Australia's Voice.",
      ja: "西オーストラリア州選出上院議員。アフガニスタン生まれで、労働党から議員となり、その後無所属となって Australia's Voice を設立しました。",
      ko: "아프가니스탄 출생의 서호주 상원의원입니다. 노동당으로 의회에 들어갔다가 무소속이 됐고 Australia's Voice를 창당했습니다.",
      vi: "Thượng nghị sĩ Tây Úc, sinh tại Afghanistan. Bà vào quốc hội với Labor, sau đó độc lập và lập Australia's Voice.",
      th: "วุฒิสมาชิกจาก Western Australia เกิดในอัฟกานิสถาน เข้าสภากับ Labor ต่อมาเป็นอิสระและตั้ง Australia's Voice",
      si: "Western Australian senator; Afghanistan හි උපත ලැබූ ඇය Labor හරහා parliament එකට පැමිණ පසුව independent වී Australia's Voice ආරම්භ කළාය."
    },
    positions: {
      "zh-Hans": "以巴勒斯坦、加沙、人权和少数族裔代表性议题最受关注，也常把自己定位为挑战两大党纪律的独立声音。",
      "zh-Hant": "以巴勒斯坦、加沙、人權和少數族裔代表性議題最受關注，也常把自己定位為挑戰兩大黨紀律的獨立聲音。",
      en: "She is most associated with Palestine, Gaza, human rights and minority representation, and presents herself as an independent voice challenging major-party discipline.",
      es: "Se la asocia con Palestina, Gaza, derechos humanos y representación de minorías, y se presenta como una voz independiente que desafía la disciplina de los grandes partidos.",
      ja: "パレスチナ、ガザ、人権、少数派代表を巡る発言で知られ、大政党の規律に挑む独立した声として位置づけています。",
      ko: "팔레스타인, 가자, 인권, 소수자 대표성으로 주목받으며 주요 정당의 규율에 도전하는 독립적 목소리로 자신을 내세웁니다.",
      vi: "Bà gắn với Palestine, Gaza, nhân quyền và đại diện thiểu số, tự xem là tiếng nói độc lập thách thức kỷ luật của các đảng lớn.",
      th: "เป็นที่รู้จักเรื่อง Palestine, Gaza สิทธิมนุษยชน และตัวแทนชนกลุ่มน้อย วางตัวเป็นเสียงอิสระที่ท้าทายวินัยพรรคใหญ่",
      si: "Palestine, Gaza, human rights සහ minority representation සමඟ සම්බන්ධ අතර major-party discipline අභියෝග කරන independent voice ලෙස පෙනී සිටී."
    }
  },
  {
    name: "Mehreen Faruqi",
    aliases: ["Mehreen Faruqi", "梅赫琳·法鲁奇", "梅赫琳·法魯奇", "メフリーン・ファルキ", "메흐린 파루키"],
    type: "politician",
    social: { label: "X", url: "https://x.com/MehreenFaruqi" },
    background: {
      "zh-Hans": "澳洲绿党副领袖、NSW 参议员，工程师背景，是澳洲首位穆斯林女性参议员。",
      "zh-Hant": "澳洲綠黨副領袖、NSW 參議員，工程師背景，是澳洲首位穆斯林女性參議員。",
      en: "Deputy leader of the Australian Greens and NSW senator. She has an engineering background and became Australia's first Muslim woman senator.",
      es: "Vice líder de los Greens y senadora por NSW. Tiene formación en ingeniería y fue la primera senadora musulmana de Australia.",
      ja: "オーストラリア緑の党副党首で NSW 選出上院議員。工学の経歴を持ち、豪州初のムスリム女性上院議員となりました。",
      ko: "호주 녹색당 부대표이자 NSW 상원의원입니다. 공학 배경을 갖고 있으며 호주 최초의 무슬림 여성 상원의원입니다.",
      vi: "Phó lãnh đạo Australian Greens và thượng nghị sĩ NSW. Bà có nền tảng kỹ sư và là nữ thượng nghị sĩ Hồi giáo đầu tiên của Úc.",
      th: "รองหัวหน้า Australian Greens และวุฒิสมาชิก NSW มีพื้นฐานวิศวกร และเป็นวุฒิสมาชิกหญิงมุสลิมคนแรกของออสเตรเลีย",
      si: "Australian Greens deputy leader සහ NSW senator. Engineering background එකක් ඇති ඇය Australia හි පළමු Muslim woman senator විය."
    },
    positions: {
      "zh-Hans": "长期强调反种族主义、女性主义、气候和社会正义，也在加沙、移民和反歧视议题上立场鲜明。",
      "zh-Hant": "長期強調反種族主義、女性主義、氣候和社會正義，也在加沙、移民和反歧視議題上立場鮮明。",
      en: "She emphasises anti-racism, feminism, climate and social justice, with strong positions on Gaza, migration and anti-discrimination.",
      es: "Enfatiza antirracismo, feminismo, clima y justicia social, con posiciones fuertes sobre Gaza, migración y antidiscriminación.",
      ja: "反人種差別、フェミニズム、気候、社会正義を重視し、ガザ、移民、反差別で明確な立場を取ります。",
      ko: "반인종주의, 페미니즘, 기후와 사회 정의를 강조하며 가자, 이민, 차별 반대에 강한 입장을 냅니다.",
      vi: "Bà nhấn mạnh chống phân biệt chủng tộc, nữ quyền, khí hậu và công bằng xã hội, với lập trường mạnh về Gaza, di cư và chống kỳ thị.",
      th: "เน้นต่อต้านการเหยียดเชื้อชาติ เฟมินิสม์ ภูมิอากาศ และความยุติธรรมทางสังคม รวมถึงมีจุดยืนชัดเรื่อง Gaza migration และการต่อต้านการเลือกปฏิบัติ",
      si: "Anti-racism, feminism, climate සහ social justice අවධාරණය කරන අතර Gaza, migration සහ anti-discrimination පිළිබඳ දැඩි ස්ථාවර ඇත."
    }
  },
  {
    name: "Ed Husic",
    aliases: ["Ed Husic", "埃德·胡西克", "エド・ヒュージック", "에드 휴식"],
    type: "politician",
    social: { label: "Instagram", url: "https://www.instagram.com/edhusicmp/" },
    background: {
      "zh-Hans": "澳洲工党联邦议员，代表 Chifley，曾任工业和科学相关部长，是澳洲首批穆斯林联邦前座议员之一。",
      "zh-Hant": "澳洲工黨聯邦議員，代表 Chifley，曾任工業和科學相關部長，是澳洲首批穆斯林聯邦前座議員之一。",
      en: "Federal Labor MP for Chifley and former industry and science minister, one of Australia's prominent Muslim federal frontbench figures.",
      es: "Diputado federal laborista por Chifley y ex ministro de industria y ciencia, una de las figuras musulmanas más visibles del frontbench federal australiano.",
      ja: "Chifley 選出の労働党連邦議員で、産業・科学関連大臣を務めたことがあります。豪州の著名なムスリム前線議員の一人です。",
      ko: "Chifley 지역구 노동당 연방 하원의원이며 산업·과학 장관을 지낸 호주의 대표적 무슬림 전면 정치인 중 한 명입니다.",
      vi: "Nghị sĩ Labor liên bang khu Chifley, cựu bộ trưởng công nghiệp và khoa học, một trong những gương mặt Muslim nổi bật trên frontbench liên bang.",
      th: "ส.ส. Labor รัฐบาลกลางเขต Chifley อดีตรัฐมนตรีด้านอุตสาหกรรมและวิทยาศาสตร์ และเป็นหนึ่งในนักการเมืองมุสลิม frontbench ที่เด่นของออสเตรเลีย",
      si: "Chifley Federal Labor MP සහ former industry/science minister; Australia හි prominent Muslim federal frontbench figures කෙනෙකි."
    },
    positions: {
      "zh-Hans": "常谈制造业、科技主权、住房建设和产业政策；在加沙和工党内部文化议题上也有公开批评。",
      "zh-Hant": "常談製造業、科技主權、住房建設和產業政策；在加沙和工黨內部文化議題上也有公開批評。",
      en: "He often focuses on manufacturing, technology sovereignty, housing construction and industry policy, and has publicly criticised Labor culture and Gaza handling.",
      es: "Suele centrarse en manufactura, soberanía tecnológica, construcción de vivienda y política industrial, y ha criticado públicamente la cultura laborista y el manejo de Gaza.",
      ja: "製造業、技術主権、住宅建設、産業政策を重視し、ガザ対応や労働党文化にも公に批判しています。",
      ko: "제조업, 기술 주권, 주택 건설, 산업 정책을 자주 다루며 노동당 문화와 가자 대응도 공개 비판했습니다.",
      vi: "Ông thường tập trung vào sản xuất, chủ quyền công nghệ, xây dựng nhà ở và chính sách công nghiệp, đồng thời công khai phê bình văn hóa Labor và cách xử lý Gaza.",
      th: "มักพูดเรื่องการผลิต อธิปไตยเทคโนโลยี การสร้างบ้าน และนโยบายอุตสาหกรรม รวมถึงวิจารณ์วัฒนธรรม Labor และการจัดการ Gaza",
      si: "Manufacturing, technology sovereignty, housing construction සහ industry policy අවධාරණය කරන අතර Labor culture සහ Gaza handling පිළිබඳ public criticism කර ඇත."
    }
  },
  {
    name: "Gina Rinehart",
    aliases: ["Gina Rinehart", "吉娜·莱因哈特", "吉娜·萊因哈特", "ジーナ・ラインハート", "지나 라인하트"],
    type: "public-figure",
    social: { label: "Hancock Prospecting", url: "https://www.hancockprospecting.com.au/" }
  },
  {
    name: "Benji Marshall",
    aliases: ["Benji Marshall", "本吉·马歇尔", "本吉·馬歇爾", "ベンジー・マーシャル", "벤지 마셜"],
    type: "public-figure",
    social: { label: "Instagram", url: "https://www.instagram.com/benji6marshall/" }
  }
];

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function personText(cluster) {
  return `${cluster?.headline || ""} ${cluster?.voiceScript || ""} ${(cluster?.differences || []).join(" ")}`;
}

function aliasPattern(alias) {
  const escaped = escapeRegExp(alias);
  if (/^[a-z0-9 .'-]+$/i.test(alias)) return `\\b${escaped}\\b`;
  return escaped;
}

function mentionedPeople(cluster) {
  const text = personText(cluster);
  return PEOPLE_CONTEXT.filter((person) =>
    person.aliases.some((alias) => new RegExp(aliasPattern(alias), "i").test(text))
  );
}

function linkifyPeopleText(text, enabled) {
  if (!enabled || !text) return text;

  const aliases = PEOPLE_CONTEXT.flatMap((person) =>
    person.aliases.map((alias) => ({
      alias,
      person,
      pattern: aliasPattern(alias)
    }))
  ).sort((a, b) => b.alias.length - a.alias.length);

  const matcher = new RegExp(`(${aliases.map((item) => item.pattern).join("|")})`, "gi");
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = matcher.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const value = match[0];
    const entity = aliases.find((item) => new RegExp(`^${item.pattern}$`, "i").test(value))?.person;
    if (entity?.social?.url) {
      parts.push(
        <a className="person-link" href={entity.social.url} target="_blank" rel="noreferrer" key={`${value}-${match.index}`}>
          {value}
        </a>
      );
    } else {
      parts.push(value);
    }
    lastIndex = matcher.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function localizedPersonValue(person, field, language) {
  return person?.[field]?.[language] || person?.[field]?.en || "";
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

function PeopleContextList({ people, labels, language }) {
  return (
    <div className="people-list">
      {people.map((person) => {
        const background = localizedPersonValue(person, "background", language);
        const positions = localizedPersonValue(person, "positions", language);

        return (
          <section className="person-card" key={person.name}>
            <div className="person-card-top">
              <strong>{person.name}</strong>
              {person.social?.url && (
                <a href={person.social.url} target="_blank" rel="noreferrer">
                  {labels.socialProfile}
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            {background && (
              <p>
                <span>{labels.background}: </span>
                {background}
              </p>
            )}
            {positions && (
              <p>
                <span>{labels.politicalPositions}: </span>
                {positions}
              </p>
            )}
          </section>
        );
      })}
    </div>
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
  const [showPeopleContext, setShowPeopleContext] = useState(initialShowPeopleContext);
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
    window.localStorage.setItem("brief-show-people-context", String(showPeopleContext));
  }, [showPeopleContext]);

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
  const activePeople = showPeopleContext ? mentionedPeople(displayActive).filter((person) => person.type === "politician") : [];

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

          <label className="setting-control checkbox-control">
            <span>{labels.showPeopleContext}</span>
            <input
              type="checkbox"
              checked={showPeopleContext}
              onChange={(event) => setShowPeopleContext(event.target.checked)}
              aria-label={labels.showPeopleContext}
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
            const people = showPeopleContext
              ? mentionedPeople(displayCluster).filter((person) => person.type === "politician")
              : [];

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
                    <p>{linkifyPeopleText(displayCluster.voiceScript, showPeopleContext)}</p>
                  </div>

                  {uniqueDifferences(displayCluster).length > 0 && (
                    <div className="mobile-section">
                      <div className="difference-list">
                        {uniqueDifferences(displayCluster).map((difference) => (
                          <p key={difference}>{linkifyPeopleText(difference, showPeopleContext)}</p>
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
                      <p>{linkifyPeopleText(commentary, showPeopleContext)}</p>
                    </div>
                  )}

                  {people.length > 0 && (
                    <div className="mobile-section people-panel">
                      <div className="people-heading">
                        <UserRound size={16} />
                        <strong>{labels.peopleContextTitle}</strong>
                      </div>
                      <PeopleContextList people={people} labels={labels} language={language} />
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
                <h2>{linkifyPeopleText(displayActive.headline, showPeopleContext)}</h2>
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
              <p>{linkifyPeopleText(displayActive.voiceScript, showPeopleContext)}</p>
            </article>

            {activeCommentary && (
              <article className="commentary-panel">
                <div className="commentary-heading">
                  <MessageSquareText size={17} />
                  <strong>{labels.commentaryTitle}</strong>
                </div>
                <p>{linkifyPeopleText(activeCommentary, showPeopleContext)}</p>
              </article>
            )}

            {activePeople.length > 0 && (
              <article className="people-panel">
                <div className="people-heading">
                  <UserRound size={17} />
                  <strong>{labels.peopleContextTitle}</strong>
                </div>
                <PeopleContextList people={activePeople} labels={labels} language={language} />
              </article>
            )}

            <div className={`detail-grid ${activeDifferences.length === 0 ? "single-column" : ""}`}>
              {activeDifferences.length > 0 && (
                <section>
                  <div className="difference-list">
                    {activeDifferences.map((difference) => (
                      <p key={difference}>{linkifyPeopleText(difference, showPeopleContext)}</p>
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
