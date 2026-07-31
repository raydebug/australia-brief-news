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
    name: "Jess Wilson",
    aliases: ["Jess Wilson", "Jessica Wilson", "Jessica Kate Wilson", "杰斯·威尔逊", "傑斯·威爾遜", "ジェス・ウィルソン", "제스 윌슨"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.parliament.vic.gov.au/members/jess-wilson/" },
    background: {
      "zh-Hans": "维州自由党政治人物，Kew 选区州议员，2025 年起任维州反对党领袖和自由党领袖。进入议会前曾任商业委员会政策主管，也曾为联邦自由党财长 Josh Frydenberg 工作。",
      "zh-Hant": "維州自由黨政治人物，Kew 選區州議員，2025 年起任維州反對黨領袖和自由黨領袖。進入議會前曾任商業委員會政策主管，也曾為聯邦自由黨財長 Josh Frydenberg 工作。",
      en: "Victorian Liberal politician, MP for Kew and Leader of the Opposition and Liberal Party in Victoria since 2025. Before parliament she worked in policy at the Business Council of Australia and for federal Liberal treasurer Josh Frydenberg.",
      es: "Política liberal de Victoria, diputada por Kew y líder de la oposición y del Partido Liberal en Victoria desde 2025. Antes del parlamento trabajó en políticas en el Business Council of Australia y para el tesorero federal liberal Josh Frydenberg.",
      ja: "ビクトリア州自由党の政治家。Kew 選出州議員で、2025年から同州の野党党首・自由党党首です。議会入り前は Business Council of Australia の政策部門や連邦自由党財務相 Josh Frydenberg の下で働きました。",
      ko: "빅토리아주 자유당 정치인으로 Kew 지역구 의원이며 2025년부터 빅토리아 야당 대표와 자유당 대표입니다. 의회 입성 전에는 Business Council of Australia 정책 업무와 연방 자유당 재무장관 Josh Frydenberg 보좌 업무를 했습니다.",
      vi: "Chính trị gia Liberal tại Victoria, nghị sĩ bang khu Kew và là Leader of the Opposition cùng lãnh đạo Liberal Party ở Victoria từ năm 2025. Trước quốc hội, bà làm chính sách tại Business Council of Australia và cho bộ trưởng ngân khố liên bang Josh Frydenberg.",
      th: "นักการเมือง Liberal ของรัฐวิกตอเรีย ส.ส. เขต Kew และเป็น Leader of the Opposition กับหัวหน้า Liberal Party ของรัฐตั้งแต่ปี 2025 ก่อนเข้าสภาทำงานด้านนโยบายที่ Business Council of Australia และให้ Josh Frydenberg รัฐมนตรีคลัง Liberal ระดับรัฐบาลกลาง",
      si: "Victorian Liberal දේශපාලනඥයෙකු වන Jess Wilson Kew MP වන අතර 2025 සිට Victoria හි Leader of the Opposition සහ Liberal Party leader වේ. Parliament ට පෙර Business Council of Australia හි policy roles සහ federal Liberal treasurer Josh Frydenberg සමඟ කටයුතු කළාය."
    },
    positions: {
      "zh-Hans": "主打“Fresh Start”，强调降低犯罪、财政纪律、商业投资和住房可负担性；在治安议题上支持扩大“Adult Crime, Adult Time”和更严的保释规则。",
      "zh-Hant": "主打「Fresh Start」，強調降低犯罪、財政紀律、商業投資和住房可負擔性；在治安議題上支持擴大「Adult Crime, Adult Time」和更嚴的保釋規則。",
      en: "She campaigns on a Fresh Start message focused on crime reduction, budget discipline, business investment and housing affordability; on law and order she backs expanded Adult Crime, Adult Time laws and tougher bail rules.",
      es: "Hace campaña con el mensaje Fresh Start, centrado en reducir el delito, disciplina fiscal, inversión empresarial y vivienda asequible; en seguridad respalda ampliar Adult Crime, Adult Time y endurecer la fianza.",
      ja: "Fresh Start を掲げ、犯罪抑止、財政規律、企業投資、住宅取得可能性を重視します。治安では Adult Crime, Adult Time の拡大と保釈規則の厳格化を支持しています。",
      ko: "Fresh Start 메시지로 범죄 감소, 재정 규율, 기업 투자, 주거 affordability를 내세웁니다. 치안 분야에서는 Adult Crime, Adult Time 확대와 더 엄격한 보석 규정을 지지합니다.",
      vi: "Bà vận động với thông điệp Fresh Start, tập trung giảm tội phạm, kỷ luật ngân sách, đầu tư doanh nghiệp và khả năng mua nhà; về law and order, bà ủng hộ mở rộng Adult Crime, Adult Time và siết quy định tại ngoại.",
      th: "เธอหาเสียงด้วยข้อความ Fresh Start เน้นลดอาชญากรรม วินัยงบประมาณ การลงทุนธุรกิจ และ housing affordability ด้าน law and order สนับสนุนการขยาย Adult Crime, Adult Time และกฎประกันตัวที่เข้มขึ้น",
      si: "ඇය Fresh Start message එකක් යටතේ crime reduction, budget discipline, business investment සහ housing affordability අවධාරණය කරයි; law and order සම්බන්ධයෙන් Adult Crime, Adult Time නීති පුළුල් කිරීම සහ tougher bail rules සහාය දක්වයි."
    }
  },
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
    name: "Luke Gosling",
    aliases: ["Luke Gosling", "卢克·戈斯林", "盧克·戈斯林", "ルーク・ゴスリング", "루크 고슬링"],
    type: "politician",
    social: { label: "X", url: "https://x.com/LukeGoslingMP" },
    background: {
      "zh-Hans": "澳洲工党联邦议员，代表北领地 Solomon 选区，自 2016 年进入联邦议会。进入政界前曾在澳洲陆军服役，包括突击队、伞兵和 NORFORCE 相关岗位，也做过国际援助和社区组织工作。",
      "zh-Hant": "澳洲工黨聯邦議員，代表北領地 Solomon 選區，自 2016 年進入聯邦議會。進入政界前曾在澳洲陸軍服役，包括突擊隊、傘兵和 NORFORCE 相關崗位，也做過國際援助和社區組織工作。",
      en: "Federal Labor MP for Solomon in the Northern Territory since 2016. Before politics he served in the Australian Army, including commando, parachute infantry and NORFORCE-related roles, and worked in international aid and community organisations.",
      es: "Diputado federal laborista por Solomon, en el Territorio del Norte, desde 2016. Antes de la política sirvió en el ejército australiano, incluidos roles de comandos, infantería paracaidista y NORFORCE, y trabajó en ayuda internacional y organizaciones comunitarias.",
      ja: "北部準州 Solomon 選出の連邦労働党議員で、2016年から連邦議会議員。政界入り前は豪陸軍でコマンドー、落下傘歩兵、NORFORCE 関連任務に就き、国際支援や地域団体でも活動しました。",
      ko: "2016년부터 노던준주 Solomon 지역구를 대표하는 연방 노동당 하원의원입니다. 정계 전에는 호주 육군에서 특공대, 낙하산 보병, NORFORCE 관련 역할을 맡았고 국제 원조와 지역사회 조직에서도 일했습니다.",
      vi: "Nghị sĩ Labor liên bang khu Solomon ở Lãnh thổ Bắc từ năm 2016. Trước khi vào chính trị, ông phục vụ trong quân đội Úc, gồm các vai trò commando, parachute infantry và NORFORCE, đồng thời làm việc trong viện trợ quốc tế và tổ chức cộng đồng.",
      th: "ส.ส. Labor รัฐบาลกลางเขต Solomon ใน Northern Territory ตั้งแต่ปี 2016 ก่อนเข้าสู่การเมืองเคยรับราชการในกองทัพออสเตรเลีย รวมถึงบทบาท commando, parachute infantry และ NORFORCE และทำงานด้านความช่วยเหลือระหว่างประเทศกับองค์กรชุมชน",
      si: "2016 සිට Northern Territory හි Solomon නියෝජනය කරන Federal Labor MP. දේශපාලනයට පෙර Australian Army හි commando, parachute infantry සහ NORFORCE සම්බන්ධ භූමිකාවල සේවය කළ අතර international aid සහ community organisations වලද කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "主要围绕国防、退伍军人事务、北澳发展、达尔文和 Palmerston 基础设施、就业和偏远地区服务发声；政治定位属于工党北领地地方型议员，强调国防联系、社区服务和北部开发。",
      "zh-Hant": "主要圍繞國防、退伍軍人事務、北澳發展、達爾文和 Palmerston 基礎設施、就業和偏遠地區服務發聲；政治定位屬於工黨北領地地方型議員，強調國防聯繫、社區服務和北部開發。",
      en: "His public themes centre on defence, veterans' affairs, northern Australia, Darwin and Palmerston infrastructure, jobs and remote-area services. Politically, he fits the Northern Territory local Labor profile: defence-connected, community-service focused and pro-northern development.",
      es: "Sus temas públicos se centran en defensa, veteranos, norte de Australia, infraestructura de Darwin y Palmerston, empleo y servicios en zonas remotas. Políticamente encaja en el perfil laborista local del Territorio del Norte: vinculado a defensa, servicio comunitario y desarrollo del norte.",
      ja: "国防、退役軍人、北部豪州、Darwin と Palmerston のインフラ、雇用、遠隔地サービスを主な論点にしています。政治的には、国防との結びつき、地域奉仕、北部開発を重視する北部準州型の労働党議員です。",
      ko: "국방, 보훈, 호주 북부, Darwin과 Palmerston 인프라, 일자리, 원격지 서비스를 주요 의제로 삼습니다. 정치적으로는 국방 연계, 지역사회 봉사, 북부 개발을 중시하는 노던준주 지역 노동당 의원에 가깝습니다.",
      vi: "Các chủ đề chính là quốc phòng, cựu chiến binh, miền bắc Úc, hạ tầng Darwin và Palmerston, việc làm và dịch vụ vùng xa. Về chính trị, ông thuộc kiểu nghị sĩ Labor địa phương ở Lãnh thổ Bắc: gắn với quốc phòng, dịch vụ cộng đồng và phát triển miền bắc.",
      th: "ประเด็นหลักคือกลาโหม ทหารผ่านศึก northern Australia โครงสร้างพื้นฐาน Darwin และ Palmerston งาน และบริการพื้นที่ห่างไกล ทางการเมืองเป็น Labor แบบท้องถิ่นของ Northern Territory ที่เน้นความเชื่อมโยงด้านกลาโหม งานชุมชน และการพัฒนาภาคเหนือ",
      si: "ඔහුගේ public themes defence, veterans' affairs, northern Australia, Darwin/Palmerston infrastructure, jobs සහ remote-area services වටා වේ. Political profile එක Northern Territory local Labor: defence-connected, community-service focused සහ pro-northern development ලෙස දැක්විය හැක."
    }
  },
  {
    name: "David Connolly",
    aliases: ["David Connolly", "大卫·康诺利", "大衛·康諾利", "デービッド・コノリー", "데이비드 코널리"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://govhouse.nt.gov.au/the-administrator/about-the-administrator" },
    background: {
      "zh-Hans": "北领地第 24 任行政长官，2026 年 2 月宣誓就职，角色类似州督，代表王权且不参与政治程序。任职前长期在牧业、农业投资和乡村产业机构任职，曾任 NT Cattlemen's Association 主席。",
      "zh-Hant": "北領地第 24 任行政長官，2026 年 2 月宣誓就職，角色類似州督，代表王權且不參與政治程序。任職前長期在牧業、農業投資和鄉村產業機構任職，曾任 NT Cattlemen's Association 主席。",
      en: "The 24th Administrator of the Northern Territory, sworn in in February 2026. The role is similar to a state governor, represents the Crown and does not participate in the political process. Before appointment he worked across pastoral operations, agricultural investment and rural industry bodies, including as president of the NT Cattlemen's Association.",
      es: "El 24.º Administrador del Territorio del Norte, juramentado en febrero de 2026. El cargo es similar al de un gobernador estatal, representa a la Corona y no participa en el proceso político. Antes trabajó en operaciones pastorales, inversión agrícola y entidades rurales, incluida la presidencia de la NT Cattlemen's Association.",
      ja: "2026年2月に就任した第24代北部準州行政官。州総督に近い役割で、王権を代表し、政治過程には参加しません。就任前は牧畜、農業投資、農村産業団体で活動し、NT Cattlemen's Association 会長も務めました。",
      ko: "2026년 2월 취임한 제24대 노던준주 행정관입니다. 주 총독과 비슷한 역할로 왕권을 대표하며 정치 과정에는 참여하지 않습니다. 임명 전에는 목축 운영, 농업 투자, 농촌 산업 단체에서 일했고 NT Cattlemen's Association 회장을 지냈습니다.",
      vi: "Quản trị viên thứ 24 của Lãnh thổ Bắc, tuyên thệ tháng 2 năm 2026. Vai trò tương tự thống đốc bang, đại diện cho Crown và không tham gia tiến trình chính trị. Trước khi được bổ nhiệm, ông làm trong lĩnh vực pastoral operations, đầu tư nông nghiệp và các tổ chức ngành nông thôn, gồm cả chủ tịch NT Cattlemen's Association.",
      th: "Administrator คนที่ 24 ของ Northern Territory สาบานตนในเดือนกุมภาพันธ์ 2026 บทบาทคล้ายผู้ว่าการรัฐ เป็นตัวแทน Crown และไม่เข้าร่วมกระบวนการการเมือง ก่อนรับตำแหน่งทำงานด้าน pastoral operations การลงทุนเกษตร และองค์กรอุตสาหกรรมชนบท รวมถึงเคยเป็นประธาน NT Cattlemen's Association",
      si: "2026 පෙබරවාරි මාසයේ දිවුරුම් දුන් Northern Territory හි 24 වන Administrator. State governor ට සමාන භූමිකාවක් වන අතර Crown නියෝජනය කර political process එකට සහභාගී නොවේ. පත් කිරීමට පෙර pastoral operations, agricultural investment සහ rural industry bodies වල, NT Cattlemen's Association president ලෙසද, කටයුතු කළේය."
    }
  },
  {
    name: "Jillian Segal",
    aliases: ["Jillian Segal", "Jillian Shirley Segal", "Jillian Segal AO", "吉莉安·西格尔", "吉莉安·西格爾", "ジリアン・シーガル", "질리언 시걸"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://www.aseca.gov.au/about" },
    background: {
      "zh-Hans": "澳大利亚律师、企业董事和社区领袖，2024 年被任命为澳大利亚首任打击反犹太主义特别特使。她曾任澳大利亚证券与投资委员会副主席、澳大利亚犹太人执行委员会主席，并长期参与企业和非营利机构治理。",
      "zh-Hant": "澳洲律師、企業董事和社區領袖，2024 年被任命為澳洲首任打擊反猶太主義特別特使。她曾任澳洲證券與投資委員會副主席、澳洲猶太人執行委員會主席，並長期參與企業和非營利機構治理。",
      en: "Australian lawyer, company director and community leader appointed in 2024 as Australia's first Special Envoy to Combat Antisemitism. She previously served as deputy chair of ASIC, president of the Executive Council of Australian Jewry and on corporate and non-profit boards.",
      es: "Abogada, directora empresarial y líder comunitaria australiana, nombrada en 2024 primera Special Envoy to Combat Antisemitism de Australia. Antes fue vicepresidenta de ASIC, presidenta del Executive Council of Australian Jewry y miembro de consejos corporativos y sin ánimo de lucro.",
      ja: "オーストラリアの弁護士、企業取締役、コミュニティ指導者。2024年に同国初の反ユダヤ主義対策特使に任命されました。ASIC 副委員長、Executive Council of Australian Jewry 会長、企業・非営利団体の理事を務めました。",
      ko: "호주의 변호사, 기업 이사, 커뮤니티 리더로 2024년 호주 최초의 반유대주의 대응 특별특사로 임명됐습니다. ASIC 부의장, Executive Council of Australian Jewry 회장, 기업 및 비영리 이사회 직책을 지냈습니다.",
      vi: "Luật sư, giám đốc doanh nghiệp và lãnh đạo cộng đồng tại Úc, được bổ nhiệm năm 2024 làm Special Envoy to Combat Antisemitism đầu tiên của Australia. Bà từng là phó chủ tịch ASIC, chủ tịch Executive Council of Australian Jewry và tham gia các hội đồng doanh nghiệp, phi lợi nhuận.",
      th: "นักกฎหมาย กรรมการบริษัท และผู้นำชุมชนของออสเตรเลีย ได้รับแต่งตั้งในปี 2024 เป็น Special Envoy to Combat Antisemitism คนแรกของประเทศ เคยเป็นรองประธาน ASIC ประธาน Executive Council of Australian Jewry และกรรมการองค์กรธุรกิจกับไม่แสวงกำไร",
      si: "Australian lawyer, company director සහ community leader කෙනෙකි. 2024 දී Australia හි පළමු Special Envoy to Combat Antisemitism ලෙස පත් විය. ඇය ASIC deputy chair, Executive Council of Australian Jewry president සහ corporate/non-profit boards වල සේවය කර ඇත."
    }
  },
  {
    name: "Nina Sanadze",
    aliases: ["Nina Sanadze", "尼娜·萨纳泽", "尼娜·薩納澤", "ニナ・サナゼ", "니나 사나제"],
    type: "public-figure",
    social: { label: "Official website", url: "https://ninasanadze.com/bio/" },
    background: {
      "zh-Hans": "苏联出生、现居墨尔本的视觉艺术家和雕塑家，作品常围绕纪念碑、档案、冲突记忆与和平建设。她曾获 2021 年 churchie emerging art prize 主要奖项，并在澳大利亚艺术机构展出。",
      "zh-Hant": "蘇聯出生、現居墨爾本的視覺藝術家和雕塑家，作品常圍繞紀念碑、檔案、衝突記憶與和平建設。她曾獲 2021 年 churchie emerging art prize 主要獎項，並在澳洲藝術機構展出。",
      en: "Soviet-born, Melbourne-based visual artist and sculptor whose work often deals with monuments, archives, conflict memory and peacebuilding. She won the major 2021 churchie emerging art prize and has exhibited with Australian arts institutions.",
      es: "Artista visual y escultora nacida en la Unión Soviética y radicada en Melbourne, cuya obra aborda monumentos, archivos, memoria del conflicto y construcción de paz. Ganó el premio principal churchie emerging art prize 2021 y ha expuesto en instituciones artísticas australianas.",
      ja: "ソビエト生まれ、メルボルン拠点の視覚芸術家・彫刻家。記念碑、アーカイブ、紛争の記憶、平和構築を扱う作品で知られます。2021年の churchie emerging art prize 主要賞を受賞し、豪州の芸術機関で展示しています。",
      ko: "소련 출생으로 멜버른에서 활동하는 시각예술가이자 조각가입니다. 기념비, 아카이브, 분쟁 기억, 평화 구축을 다루는 작업을 해왔습니다. 2021년 churchie emerging art prize 주요상을 받았고 호주 예술기관에서 전시했습니다.",
      vi: "Nghệ sĩ thị giác và nhà điêu khắc sinh ở Liên Xô, sống tại Melbourne, với tác phẩm thường xoay quanh tượng đài, lưu trữ, ký ức xung đột và xây dựng hòa bình. Bà đoạt giải chính churchie emerging art prize 2021 và đã triển lãm tại các tổ chức nghệ thuật Úc.",
      th: "ศิลปินทัศนศิลป์และประติมากรที่เกิดในสหภาพโซเวียตและทำงานในเมลเบิร์น ผลงานมักเกี่ยวกับอนุสาวรีย์ เอกสารจดหมายเหตุ ความทรงจำจากความขัดแย้ง และ peacebuilding เธอชนะรางวัลหลัก churchie emerging art prize ปี 2021 และจัดแสดงกับสถาบันศิลปะในออสเตรเลีย",
      si: "Soviet-born, Melbourne-based visual artist සහ sculptor කෙනෙකි. ඇගේ කෘති monuments, archives, conflict memory සහ peacebuilding වටා බොහෝවිට වේ. 2021 churchie emerging art prize major award දිනාගෙන Australian arts institutions සමඟ ප්‍රදර්ශනය කර ඇත."
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
    name: "Mick Gatto",
    aliases: ["Mick Gatto", "Domenic Gatto", "米克·加托", "ミック・ガットー", "믹 개토"],
    type: "public-figure",
    social: { label: "Profile", url: "https://en.wikipedia.org/wiki/Mick_Gatto" },
    background: {
      "zh-Hans": "墨尔本商人、调解人和前拳击手，长期因墨尔本黑社会、建筑业劳资争议和公开调查中的指称而受到媒体关注。他否认多项不法指称，2005 年曾在谋杀案审判中获无罪。",
      "zh-Hant": "墨爾本商人、調解人和前拳擊手，長期因墨爾本黑社會、建築業勞資爭議和公開調查中的指稱而受到媒體關注。他否認多項不法指稱，2005 年曾在謀殺案審判中獲無罪。",
      en: "Melbourne businessman, mediator and former boxer who has long attracted media attention over Melbourne underworld links, construction-industry labour disputes and allegations raised in public inquiries. He denies many allegations of wrongdoing and was acquitted in a 2005 murder trial.",
      es: "Empresario, mediador y exboxeador de Melbourne, conocido por la atención mediática sobre vínculos con el underworld local, disputas laborales en la construcción y acusaciones planteadas en investigaciones públicas. Niega muchas acusaciones y fue absuelto en un juicio por asesinato en 2005.",
      ja: "メルボルンの実業家、調停人、元ボクサー。メルボルンの裏社会との関係、建設業界の労使紛争、公的調査での指摘を巡り長く報道されてきました。多くの不正疑惑を否定し、2005年の殺人裁判では無罪となりました。",
      ko: "멜버른의 사업가, 중재인, 전직 복서입니다. 멜버른 범죄 세계와의 연계, 건설업 노사 분쟁, 공개 조사에서 제기된 의혹으로 오랫동안 언론의 주목을 받았습니다. 여러 위법 의혹을 부인해 왔고 2005년 살인 재판에서 무죄를 선고받았습니다.",
      vi: "Doanh nhân, người hòa giải và cựu võ sĩ tại Melbourne, lâu nay được chú ý vì các liên hệ với underworld Melbourne, tranh chấp lao động ngành xây dựng và cáo buộc trong các cuộc điều tra công khai. Ông phủ nhận nhiều cáo buộc sai phạm và được tuyên trắng án trong một phiên tòa giết người năm 2005.",
      th: "นักธุรกิจ คนกลางไกล่เกลี่ย และอดีตนักมวยในเมลเบิร์น เป็นที่สนใจจากสื่อมายาวนานเรื่องความเชื่อมโยงกับ underworld เมลเบิร์น ข้อพิพาทแรงงานก่อสร้าง และข้อกล่าวหาใน inquiry สาธารณะ เขาปฏิเสธข้อกล่าวหาหลายเรื่องและพ้นผิดในคดีฆาตกรรมปี 2005",
      si: "Melbourne businessman, mediator සහ former boxer කෙනෙකි. Melbourne underworld links, construction-industry labour disputes සහ public inquiries වල allegations නිසා දිගු කලක් මාධ්‍ය අවධානයට ලක්ව ඇත. ඔහු wrongdoing allegations බොහොමයක් ප්‍රතික්ෂේප කරන අතර 2005 murder trial එකකින් නිදහස් විය."
    }
  },
  {
    name: "Geoffrey Watson",
    aliases: ["Geoffrey Watson", "Geoffrey Watson SC", "杰弗里·沃森", "ジェフリー・ワトソン", "제프리 왓슨"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://publicintegrity.org.au/person/geoffrey-watson/" },
    background: {
      "zh-Hans": "澳大利亚资深大律师和反腐倡议者，Centre for Public Integrity 创始董事之一，曾在多项公共调查中担任协助调查的律师，领域包括政治腐败和警务不当行为。",
      "zh-Hant": "澳洲資深大律師和反腐倡議者，Centre for Public Integrity 創始董事之一，曾在多項公共調查中擔任協助調查的律師，領域包括政治腐敗和警務不當行為。",
      en: "Australian senior counsel and anti-corruption advocate, a founding board director of the Centre for Public Integrity. He has served as counsel assisting in public inquiries into issues including political corruption and police misconduct.",
      es: "Senior counsel australiano y defensor anticorrupción, director fundador del Centre for Public Integrity. Ha actuado como counsel assisting en investigaciones públicas sobre corrupción política y mala conducta policial.",
      ja: "オーストラリアの上級法廷弁護士で反汚職活動家。Centre for Public Integrity の創設理事の一人です。政治腐敗や警察不正を含む公的調査で調査補佐の弁護士を務めてきました。",
      ko: "호주의 선임 변호사이자 반부패 활동가로 Centre for Public Integrity 창립 이사 중 한 명입니다. 정치 부패와 경찰 비위 등을 다룬 공개 조사에서 조사 보조 변호사로 활동했습니다.",
      vi: "Senior counsel và nhà vận động chống tham nhũng tại Úc, thành viên sáng lập hội đồng của Centre for Public Integrity. Ông từng là counsel assisting trong các cuộc điều tra công khai về tham nhũng chính trị và sai phạm cảnh sát.",
      th: "Senior counsel และผู้ผลักดันงานต่อต้านคอร์รัปชันของออสเตรเลีย เป็น founding board director ของ Centre for Public Integrity เคยทำหน้าที่ counsel assisting ใน inquiry สาธารณะเกี่ยวกับคอร์รัปชันทางการเมืองและ misconduct ของตำรวจ",
      si: "Australian senior counsel සහ anti-corruption advocate කෙනෙකි; Centre for Public Integrity හි founding board director කෙනෙකි. Political corruption සහ police misconduct ඇතුළු public inquiries වල counsel assisting ලෙස කටයුතු කර ඇත."
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
    name: "Jenny McAllister",
    aliases: ["Jenny McAllister", "Jennifer McAllister", "Jennifer Ryll McAllister", "珍妮·麦卡利斯特", "珍妮·麥卡利斯特", "ジェニー・マカリスター", "제니 매캘리스터"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.health.gov.au/ministers/senator-the-hon-jenny-mcallister?language=en" },
    background: {
      "zh-Hans": "澳洲工党参议员，2015 年起代表新州，现任国家残障保险计划部长。她曾任紧急事务和城市部长、气候变化与能源助理部长，也曾担任工党全国主席。",
      "zh-Hant": "澳洲工黨參議員，2015 年起代表新州，現任國家殘障保險計畫部長。她曾任緊急事務和城市部長、氣候變遷與能源助理部長，也曾擔任工黨全國主席。",
      en: "Australian Labor senator for New South Wales since 2015 and Minister for the National Disability Insurance Scheme. She previously held emergency management, cities, climate and energy roles and was national president of the Labor Party.",
      es: "Senadora laborista por Nueva Gales del Sur desde 2015 y ministra del National Disability Insurance Scheme. Antes ocupó carteras de emergencias, ciudades, clima y energía, y fue presidenta nacional de Labor.",
      ja: "2015年からニューサウスウェールズ州選出の労働党上院議員で、国家障害保険制度担当相。以前は緊急管理、都市、気候・エネルギー関連の職務を担い、労働党全国議長も務めました。",
      ko: "2015년부터 뉴사우스웨일스주를 대표하는 노동당 상원의원이며 National Disability Insurance Scheme 장관입니다. 이전에는 재난관리, 도시, 기후·에너지 관련 직책을 맡았고 노동당 전국 의장을 지냈습니다.",
      vi: "Thượng nghị sĩ Labor của New South Wales từ năm 2015 và là Bộ trưởng National Disability Insurance Scheme. Bà từng phụ trách emergency management, cities, climate and energy và là chủ tịch toàn quốc của Labor.",
      th: "วุฒิสมาชิก Labor ของ New South Wales ตั้งแต่ปี 2015 และเป็นรัฐมนตรี National Disability Insurance Scheme เคยรับผิดชอบ emergency management, cities, climate and energy และเคยเป็นประธานระดับชาติของ Labor",
      si: "2015 සිට New South Wales නියෝජනය කරන Australian Labor senator සහ National Disability Insurance Scheme minister. ඇය emergency management, cities, climate and energy roles දැරූ අතර Labor Party national president ලෙසද කටයුතු කළාය."
    },
    positions: {
      "zh-Hans": "在 NDIS 议题上强调资金应流向高质量、合规的残障支持服务，支持加强注册、价格设置和反欺诈监管，同时把改革描述为保护参与者和计划可持续性。",
      "zh-Hant": "在 NDIS 議題上強調資金應流向高品質、合規的殘障支持服務，支持加強註冊、價格設定和反詐欺監管，同時把改革描述為保護參與者和計畫可持續性。",
      en: "On the NDIS she argues scheme funding should go to quality, compliant disability supports, backs stronger registration, pricing and anti-fraud oversight, and frames reform as protecting participants and scheme sustainability.",
      es: "Sobre el NDIS sostiene que los fondos deben ir a apoyos de discapacidad de calidad y conformes a las reglas, respalda más registro, precios y control antifraude, y presenta la reforma como protección de participantes y sostenibilidad.",
      ja: "NDIS では、資金は質が高く規則に沿った障害支援に使われるべきだとし、登録、価格設定、不正対策の強化を支持し、改革を参加者保護と制度の持続性として位置付けています。",
      ko: "NDIS에 대해서는 재원이 양질의 규정 준수 장애 지원에 쓰여야 한다고 주장하며 등록, 가격 책정, 사기 방지 감독 강화를 지지하고 개혁을 참여자 보호와 제도 지속가능성으로 설명합니다.",
      vi: "Về NDIS, bà nói tiền của chương trình phải vào các hỗ trợ khuyết tật chất lượng và đúng quy định, ủng hộ siết đăng ký, giá và chống gian lận, coi cải cách là bảo vệ người tham gia và tính bền vững.",
      th: "ในเรื่อง NDIS เธอเน้นว่าเงินควรไปสู่บริการสนับสนุนคนพิการที่มีคุณภาพและถูกกฎ สนับสนุนการเข้มงวดเรื่อง registration, pricing และ anti-fraud oversight และอธิบายการปฏิรูปว่าเพื่อปกป้อง participants และความยั่งยืนของโครงการ",
      si: "NDIS සම්බන්ධයෙන් funding quality, compliant disability supports වෙත යා යුතු බව කියා stronger registration, pricing සහ anti-fraud oversight සහාය දක්වයි; reform එක participants සහ scheme sustainability ආරක්ෂා කිරීම ලෙස ඉදිරිපත් කරයි."
    }
  },
  {
    name: "Rachael McCririck",
    aliases: ["Rachael McCririck", "雷切尔·麦克里里克", "雷切爾·麥克里里克", "レイチェル・マクリリック", "레이철 맥크리릭"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://www.abs.gov.au/about/our-organisation/organisation-chart/insights-and-statistics-group" },
    background: {
      "zh-Hans": "澳大利亚统计局价格分部项目经理，常以 ABS 价格统计负责人身份解释 CPI、通胀构成和价格变动数据。她此前也参与过澳储行经济研究。",
      "zh-Hant": "澳洲統計局價格分部專案經理，常以 ABS 價格統計負責人身分解釋 CPI、通膨構成和價格變動資料。她此前也參與過澳儲行經濟研究。",
      en: "Program manager for the Prices Branch at the Australian Bureau of Statistics, commonly quoted as the ABS head of price statistics on CPI, inflation composition and price movements. She has also co-authored Reserve Bank economic research.",
      es: "Responsable de programa de la Prices Branch en la Australian Bureau of Statistics, citada habitualmente como jefa de estadísticas de precios del ABS sobre CPI, composición de inflación y cambios de precios. También ha coescrito investigación económica del Reserve Bank.",
      ja: "オーストラリア統計局 Prices Branch のプログラムマネージャーで、CPI、インフレ構成、価格変動について ABS の価格統計責任者としてよく引用されます。Reserve Bank の経済研究にも共著があります。",
      ko: "호주통계청 Prices Branch 프로그램 매니저로, CPI와 인플레이션 구성, 가격 변동에 대해 ABS 가격통계 책임자로 자주 인용됩니다. Reserve Bank 경제 연구 공동 저자이기도 합니다.",
      vi: "Program manager của Prices Branch tại Australian Bureau of Statistics, thường được trích dẫn là người đứng đầu price statistics của ABS về CPI, cấu phần lạm phát và biến động giá. Bà cũng từng đồng tác giả nghiên cứu kinh tế của Reserve Bank.",
      th: "Program manager ของ Prices Branch ที่ Australian Bureau of Statistics มักถูกอ้างในฐานะหัวหน้าสถิติราคา ABS เรื่อง CPI องค์ประกอบเงินเฟ้อ และการเปลี่ยนแปลงราคา และเคยร่วมเขียนงานวิจัยเศรษฐกิจของ Reserve Bank",
      si: "Australian Bureau of Statistics හි Prices Branch program manager; CPI, inflation composition සහ price movements පිළිබඳ ABS head of price statistics ලෙස නිතර උපුටා දැක්වේ. Reserve Bank economic research ලිපිද सह-ලියා ඇත."
    }
  },
  {
    name: "Tara Moriarty",
    aliases: ["Tara Moriarty", "Tara Elizabeth Moriarty", "Agriculture Minister Tara Moriarty", "塔拉·莫里亚蒂", "塔拉·莫里亞蒂", "タラ・モリアーティ", "타라 모리아티"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers/members-details?memberId=2250&ref=1845" },
    background: {
      "zh-Hans": "新州工党上议院议员，2023 年起任农业、区域新州和西部新州部长。进入议会前曾在工会和劳动党组织任职。",
      "zh-Hant": "新州工黨上議院議員，2023 年起任農業、區域新州和西部新州部長。進入議會前曾在工會和工黨組織任職。",
      en: "NSW Labor member of the Legislative Council and minister for agriculture, regional NSW and western NSW since 2023. Before parliament she held union and Labor Party organisational roles.",
      es: "Miembro laborista del Consejo Legislativo de NSW y ministra de agricultura, NSW regional y NSW occidental desde 2023. Antes del parlamento ocupó cargos sindicales y organizativos en Labor.",
      ja: "NSW 労働党の上院議員で、2023年から農業、地域 NSW、西部 NSW 担当相。議会入り前は労組と労働党組織で役職を務めました。",
      ko: "NSW 노동당 상원의원이며 2023년부터 농업, 지역 NSW, 서부 NSW 장관입니다. 의회 전에는 노조와 노동당 조직에서 일했습니다.",
      vi: "Thành viên Labor của Hội đồng Lập pháp NSW, bộ trưởng nông nghiệp, regional NSW và western NSW từ năm 2023. Trước quốc hội bà giữ các vai trò trong công đoàn và tổ chức Labor.",
      th: "สมาชิก Labor ใน Legislative Council ของ NSW และรัฐมนตรีเกษตร regional NSW และ western NSW ตั้งแต่ปี 2023 ก่อนเข้าสภาเคยทำบทบาทในสหภาพและองค์กร Labor",
      si: "NSW Labor Legislative Council member සහ 2023 සිට agriculture, regional NSW, western NSW minister. Parliament ට පෙර union සහ Labor Party organisational roles දැරීය."
    },
    positions: {
      "zh-Hans": "主要围绕农业、生物安全、区域服务和西部新州经济发声；近期议题包括野猪控制、牲畜和农业产业安全。",
      "zh-Hant": "主要圍繞農業、生物安全、區域服務和西部新州經濟發聲；近期議題包括野豬控制、牲畜和農業產業安全。",
      en: "Her portfolio themes include agriculture, biosecurity, regional services and the western NSW economy; recent issues include feral-pig control, livestock and farm-industry security.",
      es: "Sus temas de cartera incluyen agricultura, bioseguridad, servicios regionales y la economía del oeste de NSW; asuntos recientes incluyen control de cerdos salvajes, ganadería y seguridad agrícola.",
      ja: "農業、バイオセキュリティ、地域サービス、西部 NSW 経済を担当し、近年は野生豚対策、畜産、農業産業の安全が焦点です。",
      ko: "농업, 생물보안, 지역 서비스, 서부 NSW 경제가 주요 포트폴리오이며 최근에는 야생돼지 통제, 축산, 농업 안전을 다룹니다.",
      vi: "Các chủ đề chính gồm nông nghiệp, an toàn sinh học, dịch vụ vùng và kinh tế western NSW; gần đây là kiểm soát lợn hoang, chăn nuôi và an ninh ngành nông nghiệp.",
      th: "ประเด็นงานหลักคือเกษตร biosecurity บริการภูมิภาค และเศรษฐกิจ western NSW ประเด็นล่าสุดรวมถึงการควบคุมหมูป่า ปศุสัตว์ และความมั่นคงภาคเกษตร",
      si: "ඇයගේ portfolio themes agriculture, biosecurity, regional services සහ western NSW economy වේ; recent issues feral-pig control, livestock සහ farm-industry security ඇතුළත් වේ."
    }
  },
  {
    name: "Gianni Infantino",
    aliases: ["Gianni Infantino", "Giovanni Vincenzo Infantino", "詹尼·因凡蒂诺", "詹尼·因凡蒂諾", "ジャンニ・インファンティーノ", "잔니 인판티노"],
    type: "public-figure",
    social: { label: "FIFA profile", url: "https://inside.fifa.com/organisation/president" },
    background: {
      "zh-Hans": "瑞士、意大利和黎巴嫩籍足球行政人物，2016 年起任 FIFA 主席，曾任 UEFA 秘书长，也是国际奥委会委员。",
      "zh-Hant": "瑞士、義大利和黎巴嫩籍足球行政人物，2016 年起任 FIFA 主席，曾任 UEFA 秘書長，也是國際奧委會委員。",
      en: "Swiss, Italian and Lebanese football administrator, FIFA president since 2016, former UEFA secretary general and an International Olympic Committee member.",
      es: "Administrador futbolístico suizo, italiano y libanés, presidente de FIFA desde 2016, ex secretario general de UEFA y miembro del Comité Olímpico Internacional.",
      ja: "スイス、イタリア、レバノン国籍のサッカー運営者。2016年から FIFA 会長で、元 UEFA 事務局長、IOC 委員です。",
      ko: "스위스·이탈리아·레바논 국적의 축구 행정가로 2016년부터 FIFA 회장입니다. UEFA 사무총장을 지냈고 IOC 위원이기도 합니다.",
      vi: "Nhà quản lý bóng đá mang quốc tịch Thụy Sĩ, Ý và Lebanon, chủ tịch FIFA từ năm 2016, cựu tổng thư ký UEFA và thành viên Ủy ban Olympic Quốc tế.",
      th: "ผู้บริหารฟุตบอลสัญชาติสวิส อิตาลี และเลบานอน เป็นประธาน FIFA ตั้งแต่ปี 2016 อดีตเลขาธิการ UEFA และสมาชิก IOC",
      si: "Swiss, Italian සහ Lebanese football administrator; 2016 සිට FIFA president, former UEFA secretary general සහ International Olympic Committee member කෙනෙකි."
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
    social: { label: "Hancock Prospecting", url: "https://www.hancockprospecting.com.au/" },
    background: {
      "zh-Hans": "澳洲矿业企业家，Hancock Prospecting 执行主席，是澳洲最知名的商业人物之一。",
      "zh-Hant": "澳洲礦業企業家，Hancock Prospecting 執行主席，是澳洲最知名的商業人物之一。",
      en: "Australian mining entrepreneur and executive chair of Hancock Prospecting, one of the country's best-known business figures.",
      es: "Empresaria minera australiana y presidenta ejecutiva de Hancock Prospecting, una de las figuras empresariales más conocidas del país.",
      ja: "豪州の鉱業実業家で Hancock Prospecting の会長。国内で最も知られたビジネス人物の一人です。",
      ko: "호주 광산 기업가이자 Hancock Prospecting 회장으로, 호주의 대표적 기업인 중 한 명입니다.",
      vi: "Doanh nhân khai khoáng Úc, chủ tịch điều hành Hancock Prospecting, một trong những gương mặt kinh doanh nổi tiếng nhất nước.",
      th: "นักธุรกิจเหมืองแร่ชาวออสเตรเลีย ประธานบริหาร Hancock Prospecting และเป็นหนึ่งในนักธุรกิจที่เป็นที่รู้จักที่สุดของประเทศ",
      si: "Australian mining entrepreneur සහ Hancock Prospecting executive chair; රටේ ප්‍රසිද්ධ business figures අතර කෙනෙකි."
    }
  },
  {
    name: "Alan Jones",
    aliases: ["Alan Jones", "Alan Belford Jones", "艾伦·琼斯", "艾倫·瓊斯", "アラン・ジョーンズ", "앨런 존스"],
    type: "public-figure",
    social: { label: "Wikipedia profile", url: "https://en.wikipedia.org/wiki/Alan_Jones_(talkback_host)" },
    background: {
      "zh-Hans": "澳洲前电台和电视评论员、前 Wallabies 教练，长期主持悉尼 2GB 早餐节目，是澳洲最有影响力也最具争议的媒体人物之一。",
      "zh-Hant": "澳洲前電台和電視評論員、前 Wallabies 教練，長期主持雪梨 2GB 早餐節目，是澳洲最有影響力也最具爭議的媒體人物之一。",
      en: "Australian former radio and television commentator and former Wallabies coach, long associated with Sydney's 2GB breakfast program and one of the country's most influential and controversial media figures.",
      es: "Excomentarista australiano de radio y televisión y exentrenador de los Wallabies, vinculado durante años al programa matinal de 2GB en Sídney y una de las figuras mediáticas más influyentes y polémicas del país.",
      ja: "豪州の元ラジオ・テレビ評論家で元 Wallabies 監督。シドニー 2GB の朝番組で長く知られ、国内で最も影響力があり論争的なメディア人物の一人です。",
      ko: "호주의 전 라디오·TV 논평가이자 전 Wallabies 감독입니다. 시드니 2GB 아침 프로그램으로 오래 알려졌고, 호주에서 가장 영향력 있고 논란 많은 미디어 인물 중 한 명입니다.",
      vi: "Cựu bình luận viên phát thanh và truyền hình Úc, cựu HLV Wallabies, gắn lâu với chương trình buổi sáng của 2GB ở Sydney và là một trong những nhân vật truyền thông có ảnh hưởng và gây tranh cãi nhất nước.",
      th: "อดีตผู้วิจารณ์วิทยุและโทรทัศน์ของออสเตรเลีย และอดีตโค้ช Wallabies เป็นที่รู้จักจากรายการเช้าของ 2GB ในซิดนีย์ และเป็นหนึ่งในบุคคลสื่อที่มีอิทธิพลและก่อข้อถกเถียงมากที่สุดของประเทศ",
      si: "Australian former radio/television commentator සහ former Wallabies coach. Sydney 2GB breakfast program සමඟ දිගු කලක් සම්බන්ධ වූ අතර රටේ බලවත් සහ controversy ඇති media figures අතර කෙනෙකි."
    }
  },
  {
    name: "Brett Blundy",
    aliases: ["Brett Blundy", "布雷特·布伦迪", "布雷特·布倫迪", "ブレット・ブランディ", "브렛 블런디"],
    type: "public-figure",
    social: { label: "Forbes profile", url: "https://www.forbes.com/profile/brett-blundy/" },
    background: {
      "zh-Hans": "澳洲零售和投资企业家，BBRC 创始人，与 Bras N Things、Lovisa、Sanity、Bonds 和 Sheridan 等消费品牌交易相关，是澳洲富豪榜上的知名商业人物。",
      "zh-Hant": "澳洲零售和投資企業家，BBRC 創辦人，與 Bras N Things、Lovisa、Sanity、Bonds 和 Sheridan 等消費品牌交易相關，是澳洲富豪榜上的知名商業人物。",
      en: "Australian retail and investment entrepreneur, founder of BBRC and a prominent Rich List business figure linked to brands and deals including Bras N Things, Lovisa, Sanity, Bonds and Sheridan.",
      es: "Empresario australiano de retail e inversión, fundador de BBRC y figura destacada de las listas de riqueza, vinculado a marcas y operaciones como Bras N Things, Lovisa, Sanity, Bonds y Sheridan.",
      ja: "豪州の小売・投資起業家。BBRC 創業者で、Bras N Things、Lovisa、Sanity、Bonds、Sheridan などのブランドや取引に関わる富豪リスト常連の実業家です。",
      ko: "호주의 소매 및 투자 기업가로 BBRC 창업자입니다. Bras N Things, Lovisa, Sanity, Bonds, Sheridan 등 브랜드와 거래로 알려진 부호 명단의 주요 기업인입니다.",
      vi: "Doanh nhân bán lẻ và đầu tư người Úc, nhà sáng lập BBRC và là gương mặt nổi bật trên Rich List, gắn với các thương hiệu và thương vụ như Bras N Things, Lovisa, Sanity, Bonds và Sheridan.",
      th: "ผู้ประกอบการค้าปลีกและการลงทุนชาวออสเตรเลีย ผู้ก่อตั้ง BBRC และนักธุรกิจที่ติด Rich List ซึ่งเกี่ยวข้องกับแบรนด์และดีลอย่าง Bras N Things, Lovisa, Sanity, Bonds และ Sheridan",
      si: "Australian retail සහ investment entrepreneur, BBRC founder සහ Rich List business figure කෙනෙකි; Bras N Things, Lovisa, Sanity, Bonds සහ Sheridan වැනි brands/deals සමඟ සම්බන්ධය ඇත."
    }
  },
  {
    name: "Glenn A. Baker",
    aliases: ["Glenn A. Baker", "Glenn A Baker", "Glenn Baker", "格伦·贝克", "格倫·貝克", "グレン・A・ベーカー", "글렌 A. 베이커"],
    type: "public-figure",
    social: { label: "Wikipedia profile", url: "https://en.wikipedia.org/wiki/Glenn_A._Baker" },
    background: {
      "zh-Hans": "澳洲音乐记者、广播人、作者和历史记录者，长期记录本地摇滚和流行音乐，也曾任 Billboard 澳洲版编辑并参与 Raven Records。",
      "zh-Hant": "澳洲音樂記者、廣播人、作者和歷史記錄者，長期記錄本地搖滾和流行音樂，也曾任 Billboard 澳洲版編輯並參與 Raven Records。",
      en: "Australian music journalist, broadcaster, author and historian who documented local rock and pop for decades, edited Billboard's Australian edition and was linked to Raven Records.",
      es: "Periodista musical, locutor, autor e historiador australiano que documentó el rock y pop local durante décadas, editó la edición australiana de Billboard y estuvo vinculado a Raven Records.",
      ja: "豪州の音楽ジャーナリスト、放送人、著者、歴史記録者。国内ロックとポップを長年記録し、Billboard 豪州版編集や Raven Records にも関わりました。",
      ko: "호주의 음악 저널리스트, 방송인, 작가, 역사가로 수십 년간 현지 록과 팝을 기록했고 Billboard 호주판 편집과 Raven Records 활동으로도 알려졌습니다.",
      vi: "Nhà báo âm nhạc, phát thanh viên, tác giả và sử gia người Úc, nhiều thập kỷ ghi chép rock và pop trong nước, từng biên tập Billboard bản Úc và gắn với Raven Records.",
      th: "นักข่าวดนตรี ผู้จัดรายการ นักเขียน และนักประวัติศาสตร์ชาวออสเตรเลีย ผู้บันทึกเพลงร็อกและป๊อปท้องถิ่นมาหลายทศวรรษ เคยแก้ไข Billboard ฉบับออสเตรเลียและเกี่ยวข้องกับ Raven Records",
      si: "Australian music journalist, broadcaster, author සහ historian; දශක ගණනාවක් local rock/pop ලේඛනගත කළ අතර Billboard Australian edition edit කර Raven Records සමඟ සම්බන්ධ විය."
    }
  },
  {
    name: "Stuart Coupe",
    aliases: ["Stuart Coupe", "斯图尔特·库普", "斯圖爾特·庫普", "スチュアート・クープ", "스튜어트 쿠프"],
    type: "public-figure",
    social: { label: "Publisher profile", url: "https://www.penguin.com.au/authors/stuart-coupe" },
    background: {
      "zh-Hans": "澳洲音乐记者、作者、广播人和公关人，长期参与本地摇滚和流行音乐报道，也写过 Michael Gudinski、Paul Kelly 和摇滚巡演产业相关书籍。",
      "zh-Hant": "澳洲音樂記者、作者、廣播人和公關人，長期參與本地搖滾和流行音樂報導，也寫過 Michael Gudinski、Paul Kelly 和搖滾巡演產業相關書籍。",
      en: "Australian music journalist, author, broadcaster and publicist with long involvement in local rock and pop coverage, including books on Michael Gudinski, Paul Kelly and the touring industry.",
      es: "Periodista musical, autor, locutor y publicista australiano con larga trayectoria en rock y pop local, incluidos libros sobre Michael Gudinski, Paul Kelly y la industria de giras.",
      ja: "豪州の音楽ジャーナリスト、著者、放送人、広報担当者。国内ロックとポップに長く関わり、Michael Gudinski、Paul Kelly、ツアー業界に関する本も書いています。",
      ko: "호주 음악 저널리스트, 작가, 방송인, 홍보인으로 현지 록과 팝 보도에 오래 관여했고 Michael Gudinski, Paul Kelly, 투어 산업 관련 책을 썼습니다.",
      vi: "Nhà báo âm nhạc, tác giả, phát thanh viên và publicist người Úc, gắn lâu với rock và pop trong nước, gồm sách về Michael Gudinski, Paul Kelly và ngành lưu diễn.",
      th: "นักข่าวเพลง นักเขียน ผู้จัดรายการ และ publicist ชาวออสเตรเลีย ทำงานกับวงการ rock และ pop ท้องถิ่นมายาวนาน รวมถึงหนังสือเกี่ยวกับ Michael Gudinski, Paul Kelly และอุตสาหกรรมทัวร์",
      si: "Australian music journalist, author, broadcaster සහ publicist; local rock/pop coverage සමඟ දිගු කාලයක් සම්බන්ධ වී Michael Gudinski, Paul Kelly සහ touring industry ගැන පොත් ලියා ඇත."
    }
  },
  {
    name: "Lia Finocchiaro",
    aliases: ["Lia Finocchiaro", "Lia Emele Finocchiaro", "莉娅·菲诺基亚罗", "莉婭·菲諾基亞羅", "リア・フィノキアーロ", "리아 피노키아로"],
    type: "politician",
    social: { label: "Official profile", url: "https://parliament.nt.gov.au/members/by-name/lia-finocchiaro" },
    background: {
      "zh-Hans": "北领地 Country Liberal Party 政治人物，Spillett 选区 MLA，2024 年起任北领地首席部长。进入政界前曾从事法律工作，是北领地首位非工党女性首席部长。",
      "zh-Hant": "北領地 Country Liberal Party 政治人物，Spillett 選區 MLA，2024 年起任北領地首席部長。進入政界前曾從事法律工作，是北領地首位非工黨女性首席部長。",
      en: "Country Liberal Party politician, MLA for Spillett and Chief Minister of the Northern Territory since 2024. Before politics she worked in law and became the Territory's first non-Labor woman chief minister.",
      es: "Política del Country Liberal Party, MLA por Spillett y jefa de Gobierno del Territorio del Norte desde 2024. Antes trabajó en derecho y es la primera mujer no laborista en ocupar ese cargo en el Territorio.",
      ja: "北部準州 Country Liberal Party の政治家。Spillett 選出 MLA で、2024年から北部準州首席大臣。政界入り前は法律分野で働き、同準州初の非労働党女性首席大臣です。",
      ko: "노던준주 Country Liberal Party 정치인으로 Spillett 지역구 MLA이며 2024년부터 노던준주 수석장관입니다. 정계 전에는 법률 분야에서 일했고 준주 최초의 비노동당 여성 수석장관이 됐습니다.",
      vi: "Chính trị gia Country Liberal Party, MLA khu Spillett và Chief Minister của Northern Territory từ năm 2024. Trước chính trị bà làm trong ngành luật và là nữ chief minister không thuộc Labor đầu tiên của Territory.",
      th: "นักการเมือง Country Liberal Party ของ Northern Territory, MLA เขต Spillett และ Chief Minister ตั้งแต่ปี 2024 ก่อนเข้าสู่การเมืองทำงานด้านกฎหมาย และเป็นผู้หญิงนอก Labor คนแรกที่เป็น chief minister ของ Territory",
      si: "Country Liberal Party දේශපාලනඥයෙකු වන Lia Finocchiaro Spillett MLA සහ 2024 සිට Northern Territory Chief Minister වේ. දේශපාලනයට පෙර law ක්ෂේත්‍රයේ කටයුතු කළ අතර Territory හි පළමු non-Labor woman chief minister විය."
    },
    positions: {
      "zh-Hans": "主要强调治安、警务和刑责年龄改革、北澳产业与国防发展、审批提速和经济投资；在原住民事务和传统土地承认议题上经常面对争议。",
      "zh-Hant": "主要強調治安、警務和刑責年齡改革、北澳產業與國防發展、審批提速和經濟投資；在原住民事務和傳統土地承認議題上經常面對爭議。",
      en: "Her main themes include law and order, policing and age-of-criminal-responsibility reform, northern industry and defence development, faster approvals and investment; Indigenous affairs and acknowledgements of Country often test her government.",
      es: "Sus temas centrales incluyen seguridad, policía y edad de responsabilidad penal, desarrollo industrial y de defensa del norte, aprobaciones más rápidas e inversión; asuntos indígenas y acknowledgements of Country suelen poner a prueba a su gobierno.",
      ja: "治安、警察、刑事責任年齢改革、北部産業と防衛開発、承認手続きの迅速化、投資を重視します。先住民政策と土地承認を巡る問題が政権の課題です。",
      ko: "법질서, 치안, 형사책임연령 개혁, 북부 산업과 국방 개발, 인허가 신속화와 투자를 강조합니다. 원주민 문제와 Country 인정 발언은 정부를 자주 시험합니다.",
      vi: "Bà nhấn mạnh law and order, policing, cải cách tuổi chịu trách nhiệm hình sự, phát triển công nghiệp và quốc phòng miền bắc, đẩy nhanh phê duyệt và đầu tư; vấn đề Indigenous và acknowledgements of Country thường gây áp lực cho chính phủ.",
      th: "ประเด็นหลักคือ law and order ตำรวจ การปฏิรูปอายุความรับผิดทางอาญา อุตสาหกรรมและกลาโหมภาคเหนือ การเร่งอนุมัติ และการลงทุน ส่วนประเด็น Indigenous affairs และ acknowledgements of Country มักทดสอบรัฐบาลของเธอ",
      si: "ඇය law and order, policing, age-of-criminal-responsibility reform, northern industry/defence development, faster approvals සහ investment අවධාරණය කරයි; Indigenous affairs සහ acknowledgements of Country රජයට නිතර පීඩනයක් වේ."
    }
  },
  {
    name: "Sam Mostyn",
    aliases: [
      "Sam Mostyn",
      "Samantha Mostyn",
      "Samantha Joy Mostyn",
      "萨姆·莫斯廷",
      "萨曼莎·莫斯廷",
      "薩姆·莫斯廷",
      "サム・モスティン",
      "샘 모스틴"
    ],
    type: "public-figure",
    social: { label: "Official biography", url: "https://www.gg.gov.au/about-governor-general/governor-generals-biography" },
    background: {
      "zh-Hans": "澳大利亚第 28 任总督，2024 年 7 月就职，代表澳大利亚君主履行宪法和礼仪职责。任职前曾任企业董事、性别平等和气候议题倡导者，也是首位女性 AFL 委员。",
      "zh-Hant": "澳洲第 28 任總督，2024 年 7 月就職，代表澳洲君主履行憲法和禮儀職責。任職前曾任企業董事、性別平等和氣候議題倡議者，也是首位女性 AFL 委員。",
      en: "Australia's 28th Governor-General, sworn in in July 2024 to perform constitutional and ceremonial duties on behalf of the Australian monarch. Before the role she was a company director, gender-equality and climate advocate, and the first female AFL commissioner.",
      es: "La 28.ª gobernadora general de Australia, juramentada en julio de 2024 para cumplir funciones constitucionales y ceremoniales en nombre del monarca australiano. Antes fue directora empresarial, defensora de igualdad de género y clima, y la primera comisionada mujer de la AFL.",
      ja: "2024年7月に就任した第28代オーストラリア総督。豪州君主を代表して憲法上・儀礼上の職務を担います。就任前は企業取締役、ジェンダー平等と気候分野の提唱者で、AFL 初の女性コミッショナーでした。",
      ko: "2024년 7월 취임한 호주 제28대 총독으로, 호주 군주를 대신해 헌법상 및 의전상 직무를 수행합니다. 취임 전에는 기업 이사, 성평등 및 기후 의제 옹호자였고 AFL 최초 여성 커미셔너였습니다.",
      vi: "Toan quyen thu 28 cua Uc, nham chuc thang 7 nam 2024 de thuc hien vai tro hien dinh va nghi le thay mat quan chu Uc. Truoc do ba la giam doc doanh nghiep, nha van dong binh dang gioi va khi hau, va nu uy vien AFL dau tien.",
      th: "Governor-General คนที่ 28 ของออสเตรเลีย เข้ารับตำแหน่งในเดือนกรกฎาคม 2024 เพื่อทำหน้าที่ตามรัฐธรรมนูญและพิธีการแทนพระมหากษัตริย์ออสเตรเลีย ก่อนหน้านี้เป็นกรรมการบริษัท ผู้สนับสนุนความเท่าเทียมทางเพศและภูมิอากาศ และเป็นกรรมาธิการหญิงคนแรกของ AFL",
      si: "2024 ජූලි මාසයේ දිවුරුම් දුන් Australia හි 28 වැනි Governor-General. Australian monarch වෙනුවෙන් constitutional සහ ceremonial duties ඉටු කරයි. එයට පෙර company director, gender-equality/climate advocate සහ AFL හි පළමු female commissioner විය."
    }
  },
  {
    name: "Benji Marshall",
    aliases: ["Benji Marshall", "本吉·马歇尔", "本吉·馬歇爾", "ベンジー・マーシャル", "벤지 마셜"],
    type: "public-figure",
    social: { label: "Instagram", url: "https://www.instagram.com/benji6marshall/" },
    background: {
      "zh-Hans": "前职业橄榄球联盟球员、现任 NRL 教练，长期与 Wests Tigers 和新西兰国家队联系紧密。",
      "zh-Hant": "前職業橄欖球聯盟球員、現任 NRL 教練，長期與 Wests Tigers 和紐西蘭國家隊聯繫緊密。",
      en: "Former professional rugby league player and current NRL coach, strongly associated with Wests Tigers and New Zealand representative rugby league.",
      es: "Exjugador profesional de rugby league y actual entrenador de NRL, muy asociado con Wests Tigers y la selección neozelandesa.",
      ja: "元プロ・ラグビーリーグ選手で現 NRL コーチ。Wests Tigers とニュージーランド代表で知られています。",
      ko: "전 프로 럭비리그 선수이자 현 NRL 코치로, Wests Tigers와 뉴질랜드 대표 경력으로 잘 알려져 있습니다.",
      vi: "Cựu cầu thủ rugby league chuyên nghiệp và hiện là HLV NRL, gắn nhiều với Wests Tigers và đội tuyển New Zealand.",
      th: "อดีตนักรักบี้ลีกอาชีพและปัจจุบันเป็นโค้ช NRL เป็นที่รู้จักจาก Wests Tigers และทีมชาตินิวซีแลนด์",
      si: "Former professional rugby league player සහ current NRL coach; Wests Tigers සහ New Zealand representative rugby league සමඟ දැඩි සම්බන්ධය ඇත."
    }
  },
  {
    name: "Sam Walker",
    aliases: ["Sam Walker", "Samuel Walker", "萨姆·沃克", "薩姆·沃克", "サム・ウォーカー", "샘 워커"],
    type: "athlete",
    social: { label: "Official profile", url: "https://www.roosters.com.au/teams/nrl-premiership/sydney-roosters/sam-walker/" },
    background: {
      "zh-Hans": "澳洲职业橄榄球联盟球员，司职 halfback，效力 Sydney Roosters，并代表过 Queensland 和 Prime Minister's XIII。",
      "zh-Hant": "澳洲職業橄欖球聯盟球員，司職 halfback，效力 Sydney Roosters，並代表過 Queensland 和 Prime Minister's XIII。",
      en: "Australian professional rugby league halfback for the Sydney Roosters, with representative appearances for Queensland and the Prime Minister's XIII.",
      es: "Jugador australiano profesional de rugby league, halfback de Sydney Roosters, con apariciones representativas para Queensland y Prime Minister's XIII.",
      ja: "Sydney Roosters 所属の豪州プロ・ラグビーリーグ halfback。Queensland と Prime Minister's XIII の代表経験があります。",
      ko: "Sydney Roosters에서 뛰는 호주 프로 럭비리그 하프백으로 Queensland와 Prime Minister's XIII 대표 경험이 있습니다.",
      vi: "Cầu thủ rugby league chuyên nghiệp của Úc, chơi halfback cho Sydney Roosters, từng đại diện Queensland và Prime Minister's XIII.",
      th: "นักรักบี้ลีกอาชีพออสเตรเลีย ตำแหน่ง halfback ของ Sydney Roosters และเคยเล่นตัวแทน Queensland กับ Prime Minister's XIII",
      si: "Sydney Roosters හි Australian professional rugby league halfback; Queensland සහ Prime Minister's XIII නියෝජනය කර ඇත."
    }
  },
  {
    name: "Korey Boddington",
    aliases: [
      "Korey Boddington",
      "科里·博丁顿",
      "科里·博丁頓",
      "コーリー・ボディントン",
      "코리 보딩턴",
      "කොරී බොඩිංටන්"
    ],
    type: "athlete",
    social: { label: "Instagram", url: "https://www.instagram.com/koreyboddington/" },
    background: {
      "zh-Hans": "澳洲残疾人场地自行车运动员，巴黎残奥会冠军，曾在世界锦标赛和大洋洲赛事中刷新纪录。",
      "zh-Hant": "澳洲殘疾人場地自行車運動員，巴黎帕運冠軍，曾在世界錦標賽和大洋洲賽事中刷新紀錄。",
      en: "Australian para-track cyclist and Paris Paralympic champion, with world and Oceania records in para-cycling events.",
      es: "Paraciclista de pista australiano y campeón paralímpico en París, con récords mundiales y de Oceanía en pruebas de paraciclismo.",
      ja: "豪州のパラ・トラックサイクリストでパリ・パラリンピック金メダリスト。世界記録やオセアニア記録も持つ選手です。",
      ko: "호주 파라 트랙 사이클 선수이자 파리 패럴림픽 금메달리스트로, 세계 및 오세아니아 기록을 보유했습니다.",
      vi: "VĐV para track cycling của Úc, nhà vô địch Paralympic Paris, từng lập kỷ lục thế giới và châu Đại Dương.",
      th: "นักปั่นพาราแทร็กของออสเตรเลีย แชมป์พาราลิมปิกปารีส และเจ้าของสถิติโลกกับโอเชียเนียในรายการพาราไซคลิง",
      si: "Australian para-track cyclist සහ Paris Paralympic champion; para-cycling events වල world/Oceania records තැබූ ක්‍රීඩකයෙකි."
    }
  },
  {
    name: "Tony Burke",
    aliases: ["Tony Burke", "The Hon Tony Burke", "托尼·伯克", "トニー・バーク", "토니 버크"],
    type: "politician",
    social: { label: "Parliament profile", url: "https://www.aph.gov.au/T_Burke_MP" },
    background: {
      "zh-Hans": "澳洲工党联邦议员，代表新州 Watson，自 2004 年进入联邦议会，长期担任前座和内阁职务。",
      "zh-Hant": "澳洲工黨聯邦議員，代表新州 Watson，自 2004 年進入聯邦議會，長期擔任前座和內閣職務。",
      en: "Federal Labor MP for Watson in New South Wales since 2004, with long service on Labor's frontbench and in cabinet.",
      es: "Diputado federal laborista por Watson, en Nueva Gales del Sur, desde 2004, con larga trayectoria en el frontbench y el gabinete laborista.",
      ja: "2004年からニューサウスウェールズ州 Watson 選出の連邦労働党議員。労働党の前線・閣僚職を長く務めています。",
      ko: "2004년부터 뉴사우스웨일스 Watson을 대표하는 연방 노동당 하원의원으로, 노동당 전면과 내각에서 오래 활동했습니다.",
      vi: "Nghị sĩ Labor liên bang khu Watson ở NSW từ năm 2004, có thời gian dài trên frontbench và trong nội các Labor.",
      th: "ส.ส. Labor รัฐบาลกลางเขต Watson ใน NSW ตั้งแต่ปี 2004 และทำงานใน frontbench กับคณะรัฐมนตรี Labor มายาวนาน",
      si: "2004 සිට NSW Watson නියෝජනය කරන Federal Labor MP; Labor frontbench සහ cabinet භූමිකාවල දිගු කාලයක් කටයුතු කරයි."
    },
    positions: {
      "zh-Hans": "主要负责内政、移民、公民身份、网络安全、艺术和众议院事务，常围绕国家安全、移民制度、文化政策和议会管理发声。",
      "zh-Hant": "主要負責內政、移民、公民身份、網絡安全、藝術和眾議院事務，常圍繞國家安全、移民制度、文化政策和議會管理發聲。",
      en: "His portfolio themes include home affairs, immigration, citizenship, cyber security, the arts and management of the House of Representatives.",
      es: "Sus áreas incluyen interior, inmigración, ciudadanía, ciberseguridad, artes y gestión de la Cámara de Representantes.",
      ja: "内務、移民、市民権、サイバーセキュリティ、芸術、下院運営を主な担当分野としています。",
      ko: "내무, 이민, 시민권, 사이버 보안, 예술, 하원 운영을 주요 포트폴리오로 다룹니다.",
      vi: "Các mảng chính gồm nội vụ, di trú, quốc tịch, an ninh mạng, nghệ thuật và điều phối Hạ viện.",
      th: "ประเด็นหลักคือ home affairs, immigration, citizenship, cyber security, arts และการจัดการ House of Representatives",
      si: "Home affairs, immigration, citizenship, cyber security, arts සහ House of Representatives management ඔහුගේ ප්‍රධාන portfolios වේ."
    }
  },
  {
    name: "Harriet Shing",
    aliases: ["Harriet Shing", "Hon Harriet Shing", "哈丽雅特·欣", "ハリエット・シング", "해리엇 싱"],
    type: "politician",
    social: { label: "Parliament profile", url: "https://www.parliament.vic.gov.au/members/harriet-shing/" },
    background: {
      "zh-Hans": "维州工党政治人物，2014 年起代表 Eastern Victoria 进入维州上议院，曾任卫生、救护服务、水务、住房、平等和区域发展等部长职务。",
      "zh-Hant": "維州工黨政治人物，2014 年起代表 Eastern Victoria 進入維州上議院，曾任衛生、救護服務、水務、住房、平等和區域發展等部長職務。",
      en: "Victorian Labor politician and Legislative Council member for Eastern Victoria since 2014, with ministerial roles across health, ambulance services, water, housing, equality and regional development.",
      es: "Política laborista de Victoria y miembro del Consejo Legislativo por Eastern Victoria desde 2014, con carteras de salud, ambulancias, agua, vivienda, igualdad y desarrollo regional.",
      ja: "2014年から Eastern Victoria 選出のビクトリア州労働党上院議員。保健、救急、水、住宅、平等、地域開発などの閣僚職を担いました。",
      ko: "2014년부터 Eastern Victoria를 대표하는 빅토리아주 노동당 상원의원으로, 보건, 구급, 물, 주택, 평등, 지역 개발 장관직을 맡았습니다.",
      vi: "Chính trị gia Labor tại Victoria, nghị sĩ Legislative Council khu Eastern Victoria từ năm 2014, từng phụ trách y tế, xe cứu thương, nước, nhà ở, bình đẳng và phát triển vùng.",
      th: "นักการเมือง Labor ของ Victoria เป็นสมาชิก Legislative Council เขต Eastern Victoria ตั้งแต่ปี 2014 เคยดูแล health, ambulance services, water, housing, equality และ regional development",
      si: "2014 සිට Eastern Victoria නියෝජනය කරන Victorian Labor Legislative Council member; health, ambulance services, water, housing, equality සහ regional development portfolios දරා ඇත."
    },
    positions: {
      "zh-Hans": "公开工作重点包括公共医疗、救护系统、水务管理、区域投资、住房供应和平等政策。",
      "zh-Hant": "公開工作重點包括公共醫療、救護系統、水務管理、區域投資、住房供應和平等政策。",
      en: "Her public priorities have included public health, ambulance services, water management, regional investment, housing supply and equality policy.",
      es: "Sus prioridades públicas incluyen salud pública, ambulancias, gestión del agua, inversión regional, oferta de vivienda e igualdad.",
      ja: "公衆衛生、救急サービス、水管理、地域投資、住宅供給、平等政策を重視してきました。",
      ko: "공공 보건, 구급 서비스, 물 관리, 지역 투자, 주택 공급, 평등 정책을 중시해 왔습니다.",
      vi: "Các ưu tiên gồm y tế công, cứu thương, quản lý nước, đầu tư vùng, nguồn cung nhà ở và chính sách bình đẳng.",
      th: "ประเด็นสำคัญคือสาธารณสุข ระบบรถพยาบาล การจัดการน้ำ การลงทุนภูมิภาค อุปทานที่อยู่อาศัย และนโยบายความเท่าเทียม",
      si: "Public health, ambulance services, water management, regional investment, housing supply සහ equality policy ඇයගේ priorities වේ."
    }
  },
  {
    name: "Jessica Hull",
    aliases: ["Jessica Hull", "Jess Hull", "杰西卡·赫尔", "ジェシカ・ハル", "제시카 헐"],
    type: "athlete",
    social: { label: "Australian Athletics", url: "https://www.athletics.com.au/athlete/jessica-hull/" },
    background: {
      "zh-Hans": "澳洲中长跑运动员，奥运银牌得主和澳洲纪录保持者，主项包括 1500 米、3000 米和 5000 米。",
      "zh-Hant": "澳洲中長跑運動員，奧運銀牌得主和澳洲紀錄保持者，主項包括 1500 米、3000 米和 5000 米。",
      en: "Australian middle-distance runner, Olympic silver medallist and Australian record holder across events including 1500m, 3000m and 5000m.",
      es: "Mediofondista australiana, medallista olímpica de plata y plusmarquista nacional en pruebas como 1500 m, 3000 m y 5000 m.",
      ja: "オーストラリアの中距離選手。五輪銀メダリストで、1500m、3000m、5000m などの豪州記録保持者です。",
      ko: "호주 중거리 육상 선수로 올림픽 은메달리스트이며 1500m, 3000m, 5000m 등에서 호주 기록을 보유했습니다.",
      vi: "VĐV chạy trung bình của Úc, huy chương bạc Olympic và giữ kỷ lục Úc ở các cự ly như 1500m, 3000m và 5000m.",
      th: "นักวิ่งระยะกลางของออสเตรเลีย เจ้าของเหรียญเงินโอลิมปิกและสถิติออสเตรเลียในรายการ 1500m, 3000m และ 5000m",
      si: "Australian middle-distance runner; Olympic silver medallist සහ 1500m, 3000m, 5000m ඇතුළු events වල Australian record holder."
    }
  },
  {
    name: "Michelle Jenneke",
    aliases: ["Michelle Jenneke", "米歇尔·詹内克", "ミシェル・ジェネキー", "미셸 제네키"],
    type: "athlete",
    social: { label: "Australian Athletics", url: "https://www.athletics.com.au/athlete/michelle-jenneke/" },
    background: {
      "zh-Hans": "澳洲 100 米栏运动员，多届奥运会和世锦赛代表，曾多次获得澳洲全国 100 米栏冠军。",
      "zh-Hant": "澳洲 100 米欄運動員，多屆奧運會和世錦賽代表，曾多次獲得澳洲全國 100 米欄冠軍。",
      en: "Australian 100m hurdler, multiple-time Olympian and world championships representative, and a multiple national 100m hurdles champion.",
      es: "Vallista australiana de 100 m, olímpica y mundialista en varias ocasiones, y múltiple campeona nacional de 100 m vallas.",
      ja: "オーストラリアの100mハードル選手。複数回の五輪・世界選手権代表で、国内100mハードル王者です。",
      ko: "호주 100m 허들 선수로 여러 차례 올림픽과 세계선수권에 출전했고 전국 100m 허들 챔피언을 지냈습니다.",
      vi: "VĐV 100m rào của Úc, nhiều lần dự Olympic và giải thế giới, nhiều lần vô địch quốc gia 100m rào.",
      th: "นักวิ่งข้ามรั้ว 100 เมตรของออสเตรเลีย เป็นตัวแทนโอลิมปิกและชิงแชมป์โลกหลายครั้ง และแชมป์ประเทศหลายสมัย",
      si: "Australian 100m hurdler; multiple Olympian/world championships representative සහ multiple national 100m hurdles champion."
    }
  },
  {
    name: "Glenn A. Baker",
    aliases: ["Glenn A. Baker", "Glenn A Baker", "Glenn Baker", "格伦·A·贝克", "格倫·A·貝克", "グレン・A・ベイカー", "글렌 A. 베이커"],
    type: "artist",
    social: { label: "National Portrait Gallery", url: "https://www.portrait.gov.au/portraits/2018.117/glenn-a-baker" },
    background: {
      "zh-Hans": "澳洲音乐记者、作家和广播人，长期记录摇滚和流行音乐，曾任 Billboard 澳大利亚编辑 20 多年，并共同创办 Raven Records。",
      "zh-Hant": "澳洲音樂記者、作家和廣播人，長期記錄搖滾和流行音樂，曾任 Billboard 澳洲編輯 20 多年，並共同創辦 Raven Records。",
      en: "Australian music journalist, author and broadcaster who chronicled rock and pop music, served for more than 20 years as Billboard's Australian editor and co-founded Raven Records.",
      es: "Periodista musical, autor y locutor australiano que documentó el rock y el pop, fue editor australiano de Billboard durante más de 20 años y cofundó Raven Records.",
      ja: "豪州の音楽ジャーナリスト、作家、放送人。ロックとポップを長年記録し、Billboard 豪州編集者を20年以上務め、Raven Records を共同設立しました。",
      ko: "호주 음악 저널리스트, 작가, 방송인으로 록과 팝 음악을 기록했고 Billboard 호주 편집자로 20년 넘게 일했으며 Raven Records를 공동 설립했습니다.",
      vi: "Nhà báo âm nhạc, tác giả và phát thanh viên Úc, người ghi chép về rock và pop, làm biên tập viên Australia của Billboard hơn 20 năm và đồng sáng lập Raven Records.",
      th: "นักข่าวเพลง นักเขียน และผู้จัดรายการชาวออสเตรเลีย ผู้บันทึกวงการ rock และ pop เป็นบรรณาธิการ Billboard Australia กว่า 20 ปี และร่วมก่อตั้ง Raven Records",
      si: "Australian music journalist, author සහ broadcaster; rock/pop music chronicler කෙනෙකු වූ ඔහු Billboard Australian editor ලෙස වසර 20කට වැඩි කාලයක් කටයුතු කර Raven Records co-founded කළේය."
    }
  },
  {
    name: "Ridge Barredo",
    aliases: ["Ridge Barredo", "里奇·巴雷多", "リッジ・バレド", "리지 바레도"],
    type: "athlete",
    social: { label: "Instagram", url: "https://www.instagram.com/ridgebarredo/" },
    background: {
      "zh-Hans": "澳洲举重运动员，代表澳洲参加国际举重赛事，也因参加澳洲真人秀节目而有公众知名度。",
      "zh-Hant": "澳洲舉重運動員，代表澳洲參加國際舉重賽事，也因參加澳洲真人秀節目而有公眾知名度。",
      en: "Australian weightlifter who has represented Australia in international competition and is also publicly known from Australian reality television.",
      es: "Halterófilo australiano que ha representado al país en competición internacional y también es conocido por la televisión de realidad australiana.",
      ja: "国際大会で豪州を代表する重量挙げ選手。豪州のリアリティ番組出演でも知られています。",
      ko: "국제 대회에서 호주를 대표한 역도 선수이며 호주 리얼리티 TV 출연으로도 알려져 있습니다.",
      vi: "VĐV cử tạ Úc từng đại diện Australia thi đấu quốc tế, đồng thời được công chúng biết tới qua truyền hình thực tế Úc.",
      th: "นักยกน้ำหนักออสเตรเลียที่เคยเป็นตัวแทนประเทศในการแข่งขันนานาชาติ และเป็นที่รู้จักจากรายการเรียลลิตี้ทีวีของออสเตรเลีย",
      si: "Australian weightlifter; international competition වල Australia නියෝජනය කර ඇති අතර Australian reality television හරහාද public profile එකක් ඇත."
    }
  },
  {
    name: "Cameron McEntyre",
    aliases: ["Cameron McEntyre", "卡梅伦·麦肯泰尔", "キャメロン・マッケンタイア", "캐머런 매킨타이어"],
    type: "athlete",
    social: { label: "Australian Athletics", url: "https://www.athletics.com.au/athlete/cameron-mcentyre/" },
    background: {
      "zh-Hans": "澳洲标枪运动员，代表澳洲参加奥运会和世界田径锦标赛，所属项目为男子标枪。",
      "zh-Hant": "澳洲標槍運動員，代表澳洲參加奧運會和世界田徑錦標賽，所屬項目為男子標槍。",
      en: "Australian javelin thrower who has represented Australia at the Olympic Games and World Athletics Championships.",
      es: "Lanzador de jabalina australiano que ha representado a Australia en Juegos Olímpicos y campeonatos mundiales de atletismo.",
      ja: "オーストラリアのやり投げ選手。五輪と世界陸上で豪州代表を務めています。",
      ko: "호주 창던지기 선수로 올림픽과 세계육상선수권에서 호주를 대표했습니다.",
      vi: "VĐV ném lao của Úc, từng đại diện Australia tại Olympic và Giải vô địch điền kinh thế giới.",
      th: "นักขว้างแหลนออสเตรเลีย เคยเป็นตัวแทนประเทศในโอลิมปิกและ World Athletics Championships",
      si: "Australian javelin thrower; Olympic Games සහ World Athletics Championships වල Australia නියෝජනය කර ඇත."
    }
  },
  {
    name: "Alex Ryvchin",
    aliases: ["Alex Ryvchin", "Alexander Ryvchin", "亚历克斯·里夫钦", "アレックス・リブチン", "알렉스 리브친"],
    type: "public-figure",
    social: { label: "Instagram", url: "https://www.instagram.com/AlexRyvchin/" },
    background: {
      "zh-Hans": "澳洲作家、律师和公共倡议者，担任澳洲犹太人执行委员会联合首席执行官，经常就反犹主义、以色列和澳洲犹太社区事务发声。",
      "zh-Hant": "澳洲作家、律師和公共倡議者，擔任澳洲猶太人執行委員會聯合行政總裁，經常就反猶主義、以色列和澳洲猶太社區事務發聲。",
      en: "Australian author, lawyer and public advocate, serving as co-chief executive of the Executive Council of Australian Jewry and frequently commenting on antisemitism, Israel and Australian Jewish community affairs.",
      es: "Autor, abogado y defensor público australiano, co-CEO del Executive Council of Australian Jewry, con frecuentes intervenciones sobre antisemitismo, Israel y la comunidad judía australiana.",
      ja: "オーストラリアの作家、弁護士、公共的な提唱者。Executive Council of Australian Jewry の共同 CEO として、反ユダヤ主義、イスラエル、豪州ユダヤ人社会について発言しています。",
      ko: "호주 작가, 변호사, 공공 옹호자로 Executive Council of Australian Jewry 공동 CEO를 맡고 있으며 반유대주의, 이스라엘, 호주 유대인 공동체 문제를 자주 논평합니다.",
      vi: "Tác giả, luật sư và nhà vận động công chúng ở Úc, đồng CEO Executive Council of Australian Jewry, thường bình luận về bài Do Thái, Israel và cộng đồng Do Thái Úc.",
      th: "นักเขียน ทนาย และผู้รณรงค์สาธารณะชาวออสเตรเลีย เป็น co-CEO ของ Executive Council of Australian Jewry และมักให้ความเห็นเรื่อง antisemitism, Israel และชุมชนยิวในออสเตรเลีย",
      si: "Australian author, lawyer සහ public advocate; Executive Council of Australian Jewry හි co-chief executive ලෙස කටයුතු කර antisemitism, Israel සහ Australian Jewish community affairs ගැන නිතර අදහස් දක්වයි."
    }
  },
  {
    name: "Michael Zavros",
    aliases: ["Michael Zavros", "迈克尔·扎夫罗斯", "マイケル・ザブロス", "마이클 자브로스"],
    type: "artist",
    social: { label: "Official biography", url: "https://www.michaelzavros.com/biography/" },
    background: {
      "zh-Hans": "澳洲当代艺术家，以绘画、素描和雕塑创作知名，作品在澳洲和海外主要美术馆展出，曾获 Doug Moran National Portrait Prize。",
      "zh-Hant": "澳洲當代藝術家，以繪畫、素描和雕塑創作知名，作品在澳洲和海外主要美術館展出，曾獲 Doug Moran National Portrait Prize。",
      en: "Australian contemporary artist known for painting, drawing and sculpture, with work shown in major Australian and international museums and a Doug Moran National Portrait Prize win.",
      es: "Artista contemporáneo australiano conocido por pintura, dibujo y escultura, con obras en museos australianos e internacionales y ganador del Doug Moran National Portrait Prize.",
      ja: "絵画、素描、彫刻で知られる豪州の現代美術家。国内外の主要美術館で展示され、Doug Moran National Portrait Prize を受賞しています。",
      ko: "회화, 드로잉, 조각으로 알려진 호주 현대미술가이며 주요 국내외 미술관에서 전시했고 Doug Moran National Portrait Prize를 수상했습니다.",
      vi: "Nghệ sĩ đương đại Úc, nổi tiếng với hội họa, ký họa và điêu khắc, có tác phẩm trưng bày tại các bảo tàng lớn ở Úc và quốc tế, từng thắng Doug Moran National Portrait Prize.",
      th: "ศิลปินร่วมสมัยชาวออสเตรเลีย เป็นที่รู้จักจากงาน painting, drawing และ sculpture ผลงานจัดแสดงในพิพิธภัณฑ์สำคัญในออสเตรเลียและต่างประเทศ และเคยชนะ Doug Moran National Portrait Prize",
      si: "Australian contemporary artist; painting, drawing සහ sculpture සඳහා ප්‍රසිද්ධය. Australian/international museums වල කෘති පෙන්වා ඇති අතර Doug Moran National Portrait Prize දිනා ඇත."
    }
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

function socialHeat(cluster) {
  const discussions = validSocialDiscussions(cluster);
  const score = discussions.reduce((total, item) => total + Number(item.score || 0), 0);
  const level = score >= 1800 ? 4 : score >= 800 ? 3 : score >= 250 ? 2 : score > 0 ? 1 : 0;
  return { score, level, count: discussions.length };
}

function HeatIndicator({ cluster }) {
  const heat = socialHeat(cluster);
  const title = heat.count
    ? `Social heat ${heat.level}/4, score ${heat.score}, ${heat.count} discussion links`
    : "Social heat 0/4, no tracked discussion links yet";

  return (
    <span className={`heat-indicator heat-${heat.level}`} title={title} aria-label={title}>
      <Flame size={13} />
      <span>{heat.level}</span>
    </span>
  );
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
        const positions = person.type === "politician" ? localizedPersonValue(person, "positions", language) : "";

        return (
          <section className="person-card" key={person.name}>
            <div className="person-card-top">
              <strong>{person.name}</strong>
              {person.social?.url && (
                <a href={person.social.url} target="_blank" rel="noreferrer">
                  {person.social.label || labels.socialProfile}
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
  const clusterCardRefs = useRef(new Map());

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

  function setClusterCardRef(id, node) {
    if (node) {
      clusterCardRefs.current.set(id, node);
    } else {
      clusterCardRefs.current.delete(id);
    }
  }

  function toggleClusterExpansion(id) {
    setActiveId(id);
    setExpandedId((current) => (current === id ? null : id));
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
  const activePeople = showPeopleContext ? mentionedPeople(displayActive) : [];
  const activeSocialDiscussions = validSocialDiscussions(displayActive);

  useEffect(() => {
    if (activeId && clusters.length && !clusters.some((cluster) => cluster.id === activeId)) {
      setActiveId(clusters[0].id);
    }
  }, [activeId, clusters]);

  useEffect(() => {
    if (!expandedId || !window.matchMedia("(max-width: 760px)").matches) return undefined;

    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        const card = clusterCardRefs.current.get(expandedId);
        if (!card) return;

        const anchor = card.querySelector(".cluster-title-row") || card;
        const rect = anchor.getBoundingClientRect();
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const targetY = viewportHeight * 0.45;
        const currentY = rect.top + rect.height / 2;
        const delta = currentY - targetY;

        if (Math.abs(delta) > 8) {
          window.scrollBy({ top: delta, behavior: "smooth" });
        }
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [expandedId]);

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
            const people = showPeopleContext ? mentionedPeople(displayCluster) : [];
            const socialDiscussions = validSocialDiscussions(displayCluster);

            return (
              <article
                className={`cluster-card ${cluster.id === active?.id ? "selected" : ""} ${
                  cluster.id === expandedId ? "expanded" : ""
                }`}
                key={cluster.id}
                ref={(node) => setClusterCardRef(cluster.id, node)}
              >
              <div className="cluster-card-content">
                <div className="cluster-title-row">
                  <button
                    className="cluster-title-button"
                    onClick={() => toggleClusterExpansion(cluster.id)}
                  >
                    <h3>
                      <span>{displayCluster.headline}</span>
                      <HeatIndicator cluster={displayCluster} />
                    </h3>
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
                  onClick={() => toggleClusterExpansion(cluster.id)}
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
                <h2>
                  <span>{linkifyPeopleText(displayActive.headline, showPeopleContext)}</span>
                  <HeatIndicator cluster={displayActive} />
                </h2>
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
