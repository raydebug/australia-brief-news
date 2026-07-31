import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Filter,
  Flame,
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
    socialDiscussions: "热门讨论",
    socialDiscussionMeta: "热度",
    socialComments: "评论",
    socialShares: "分享",
    socialLikes: "点赞",
    socialScore: "分数",
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
    socialDiscussions: "熱門討論",
    socialDiscussionMeta: "熱度",
    socialComments: "評論",
    socialShares: "分享",
    socialLikes: "按讚",
    socialScore: "分數",
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
    socialDiscussions: "ජනප්‍රිය සාකච්ඡා",
    socialDiscussionMeta: "උණුසුම",
    socialComments: "අදහස්",
    socialShares: "බෙදාගැනීම්",
    socialLikes: "කැමැත්ත",
    socialScore: "ලකුණු",
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
    socialDiscussions: "Hot discussions",
    socialDiscussionMeta: "Engagement",
    socialComments: "comments",
    socialShares: "shares",
    socialLikes: "likes",
    socialScore: "score",
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
    socialDiscussions: "Debates populares",
    socialDiscussionMeta: "Interacción",
    socialComments: "comentarios",
    socialShares: "compartidos",
    socialLikes: "me gusta",
    socialScore: "puntuación",
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
    socialDiscussions: "話題の議論",
    socialDiscussionMeta: "反応",
    socialComments: "コメント",
    socialShares: "共有",
    socialLikes: "いいね",
    socialScore: "スコア",
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
    socialDiscussions: "인기 토론",
    socialDiscussionMeta: "반응",
    socialComments: "댓글",
    socialShares: "공유",
    socialLikes: "좋아요",
    socialScore: "점수",
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
    socialDiscussions: "Thảo luận nổi bật",
    socialDiscussionMeta: "Tương tác",
    socialComments: "bình luận",
    socialShares: "chia sẻ",
    socialLikes: "thích",
    socialScore: "điểm",
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
    socialDiscussions: "ประเด็นที่คุยกันมาก",
    socialDiscussionMeta: "การมีส่วนร่วม",
    socialComments: "ความคิดเห็น",
    socialShares: "แชร์",
    socialLikes: "ถูกใจ",
    socialScore: "คะแนน",
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

function getFourNewsCommentary(cluster, language) {
  if (!cluster) return "";
  const stored = cluster.fourNewsCommentary;
  const commentary = typeof stored === "string" ? stored : stored?.[language] || stored?.en || "";
  return hasSpecificCommentary(commentary) ? commentary : "";
}

function hasSpecificCommentary(commentary) {
  const text = String(commentary || "").replace(/\s+/g, " ").trim();
  if (!text) return false;

  const lower = text.toLowerCase();
  const aiMentions = (lower.match(/\bai\b|\bia\b|人工智能|算法|演算法|アルゴリズム|알고리즘/g) || []).length;
  if (aiMentions > 1) return false;

  const genericSignals = [
    "这类问题",
    "這類問題",
    "这类社会问题",
    "這類社會問題",
    "这条新闻真正值得追",
    "這條新聞真正值得追",
    "对照其他发达国家",
    "對照其他發達國家",
    "developed countries",
    "developed-country experience",
    "ai should act as radar",
    "ai 的位置",
    "ai は裁判官ではなくレーダー",
    "ai는 판사가 아니라 레이더",
    "new zealand wellbeing budget",
    "phoenix payroll system",
    "public-it failures"
  ];

  return !genericSignals.some((signal) => lower.includes(signal.toLowerCase()));
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

function validSocialDiscussions(cluster) {
  return (cluster?.socialDiscussions || [])
    .filter((item) => item?.platform && item?.title && item?.url)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, 5);
}

function compactNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number <= 0) return "";
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`;
  return String(number);
}

function discussionMeta(item, labels) {
  const parts = [
    compactNumber(item.comments) && `${compactNumber(item.comments)} ${labels.socialComments}`,
    compactNumber(item.shares || item.reposts) && `${compactNumber(item.shares || item.reposts)} ${labels.socialShares}`,
    compactNumber(item.likes || item.upvotes) && `${compactNumber(item.likes || item.upvotes)} ${labels.socialLikes}`
  ].filter(Boolean);

  if (!parts.length && item.score) parts.push(`${labels.socialScore} ${compactNumber(item.score)}`);
  return parts.length ? `${labels.socialDiscussionMeta}: ${parts.join(" · ")}` : item.postedAt || "";
}

function SocialDiscussionList({ discussions, labels }) {
  if (!discussions.length) return null;

  return (
    <article className="social-panel">
      <div className="social-heading">
        <Flame size={17} />
        <strong>{labels.socialDiscussions}</strong>
      </div>
      <div className="social-discussion-list">
        {discussions.map((item) => (
          <SocialDiscussionLink item={item} labels={labels} key={`${item.platform}-${item.url}`} />
        ))}
      </div>
    </article>
  );
}

function SocialDiscussionLink({ item, labels }) {
  const meta = discussionMeta(item, labels);
  const owner = item.community || item.account || item.author;

  return (
    <a href={item.url} target="_blank" rel="noreferrer">
      <span className="social-platform">{item.platform}</span>
      <span className="social-title">{item.title}</span>
      <span className="social-meta">
        {owner}
        {owner && meta ? " · " : ""}
        {meta}
      </span>
      <ExternalLink size={14} />
    </a>
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
  const activeSocialDiscussions = validSocialDiscussions(displayActive);

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
            const socialDiscussions = validSocialDiscussions(displayCluster);

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

                  {socialDiscussions.length > 0 && (
                    <SocialDiscussionList discussions={socialDiscussions} labels={labels} />
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

            <SocialDiscussionList discussions={activeSocialDiscussions} labels={labels} />

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
