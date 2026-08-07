import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  Share2,
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
    heatFilter: "热度",
    heatAll: "全部热度",
    heatAtLeast: "至少",
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
    shareBrief: "分享",
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
    heatFilter: "熱度",
    heatAll: "全部熱度",
    heatAtLeast: "至少",
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
    shareBrief: "分享",
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
    heatFilter: "උණුසුම",
    heatAll: "සියලු උණුසුම් මට්ටම්",
    heatAtLeast: "අවම",
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
    shareBrief: "බෙදාගන්න",
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
    heatFilter: "Heat",
    heatAll: "All heat",
    heatAtLeast: "At least",
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
    socialDiscussions: "Popular discussions",
    socialDiscussionMeta: "Engagement",
    socialComments: "comments",
    socialShares: "shares",
    socialLikes: "likes",
    socialScore: "score",
    shareBrief: "Share",
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
    heatFilter: "Interés",
    heatAll: "Todo interés",
    heatAtLeast: "Al menos",
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
    shareBrief: "Compartir",
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
    heatFilter: "注目度",
    heatAll: "すべての注目度",
    heatAtLeast: "最低",
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
    socialDiscussions: "注目の議論",
    socialDiscussionMeta: "反応",
    socialComments: "コメント",
    socialShares: "共有",
    socialLikes: "いいね",
    socialScore: "スコア",
    shareBrief: "共有",
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
    heatFilter: "화제성",
    heatAll: "전체 화제성",
    heatAtLeast: "최소",
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
    shareBrief: "공유",
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
    heatFilter: "Độ nóng",
    heatAll: "Mọi độ nóng",
    heatAtLeast: "Ít nhất",
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
    shareBrief: "Chia sẻ",
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
    heatFilter: "กระแส",
    heatAll: "ทุกระดับกระแส",
    heatAtLeast: "อย่างน้อย",
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
    socialDiscussions: "บทสนทนายอดนิยม",
    socialDiscussionMeta: "การมีส่วนร่วม",
    socialComments: "ความคิดเห็น",
    socialShares: "แชร์",
    socialLikes: "ถูกใจ",
    socialScore: "คะแนน",
    shareBrief: "แชร์",
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
  if (lower.startsWith("zh-hans") || lower.startsWith("zh-cn") || lower.startsWith("zh")) return "zh-Hans";
  if (lower.startsWith("si")) return "si";
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("ko")) return "ko";
  if (lower.startsWith("vi")) return "vi";
  if (lower.startsWith("th")) return "th";
  if (lower.startsWith("es")) return "es";
  if (lower.startsWith("en")) return "en";
  return "en";
}

function shareParamsFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
  return {
    id: params.get("id") || params.get("brief") || hashParams.get("id") || hashParams.get("brief") || null,
    language: params.get("lang") || params.get("language") || hashParams.get("lang") || hashParams.get("language") || null
  };
}

function initialLanguage() {
  const requested = shareParamsFromLocation().language;
  if (requested) {
    const normalized = normalizeLanguage(requested);
    if (I18N[normalized]) return normalized;
  }

  const stored = window.localStorage.getItem("brief-language");
  if (stored && I18N[stored]) return stored;
  return normalizeLanguage(navigator.language);
}

function initialSharedId() {
  return shareParamsFromLocation().id;
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

function initialHeatFilter() {
  const value = Number(window.localStorage.getItem("brief-heat-filter") || 0);
  return Number.isInteger(value) && value >= 0 && value <= 4 ? value : 0;
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

function shareSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function shareUrlFor(cluster, language) {
  const url = new URL(
    `./share/${encodeURIComponent(language)}/${encodeURIComponent(shareSlug(cluster.id))}.html`,
    window.location.href
  );
  url.searchParams.set("lang", language);
  url.searchParams.set("id", cluster.id);
  url.hash = new URLSearchParams({ lang: language, id: cluster.id }).toString();
  return url.toString();
}

function shareTextFor(cluster) {
  const script = String(cluster?.voiceScript || "").trim();
  if (!script) return "4News";
  return script.length > 180 ? `${script.slice(0, 177)}...` : script;
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
  const retentionDays = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - published <= retentionDays;
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
    name: "Fatemeh Pasandideh",
    aliases: ["Fatemeh Pasandideh", "PASAND", "fatemehpasandideh10", "فاطمه پسندیده"],
    type: "athlete",
    profile: { label: "Soccerway profile", url: "https://www.soccerway.com/player/pasandideh-fatemeh/bXPK4xXh/" },
    officialProfile: { label: "FotMob profile", url: "https://www.fotmob.com/players/1915051/fatemeh-pasandideh" },
    background: {
      "zh-Hans": "伊朗女子足球运动员，司职中场，曾效力 Bam Khatoon 并代表伊朗女足；2026 年女子亚洲杯期间在澳洲寻求庇护，随后在布里斯班随 Brisbane Roar 训练并入籍澳洲。",
      "zh-Hant": "伊朗女子足球運動員，司職中場，曾效力 Bam Khatoon 並代表伊朗女足；2026 年女子亞洲盃期間在澳洲尋求庇護，隨後在布里斯本隨 Brisbane Roar 訓練並入籍澳洲。",
      en: "Iranian footballer and midfielder who played for Bam Khatoon and Iran's women's national team; during the 2026 Women's Asian Cup she sought asylum in Australia, later trained with Brisbane Roar in Brisbane and became an Australian citizen.",
      es: "Futbolista iraní, mediocampista, ex jugadora de Bam Khatoon y de la selección femenina de Irán; durante la Copa Asiática femenina de 2026 pidió asilo en Australia, después entrenó con Brisbane Roar en Brisbane y obtuvo la ciudadanía australiana.",
      ja: "イランの女子サッカー選手、ミッドフィールダー。Bam Khatoon とイラン女子代表でプレーし、2026年女子アジアカップ期間中に豪州で亡命を求め、その後ブリスベンで Brisbane Roar と練習し、豪州市民権を取得しました。",
      ko: "이란 여자 축구 미드필더로 Bam Khatoon과 이란 여자 대표팀에서 뛰었습니다. 2026년 여자 아시안컵 기간 호주에 망명을 신청했고 이후 브리즈번에서 Brisbane Roar와 훈련하며 호주 시민권을 취득했습니다.",
      vi: "Cầu thủ bóng đá nữ Iran chơi tiền vệ, từng khoác áo Bam Khatoon và đội tuyển nữ Iran; trong Asian Cup nữ 2026 cô xin tị nạn tại Australia, sau đó tập cùng Brisbane Roar ở Brisbane và trở thành công dân Australia.",
      th: "นักฟุตบอลหญิงอิหร่านตำแหน่งกองกลาง อดีตผู้เล่น Bam Khatoon และทีมชาติหญิงอิหร่าน; ระหว่าง Women's Asian Cup 2026 เธอยื่นขอลี้ภัยในออสเตรเลีย ต่อมาฝึกซ้อมกับ Brisbane Roar ที่บริสเบนและได้สัญชาติออสเตรเลีย",
      si: "Iranian women football midfielder කෙනෙකි; Bam Khatoon සහ Iran women's national team සඳහා ක්‍රීඩා කළාය. 2026 Women's Asian Cup අතරතුර Australia හි asylum ඉල්ලා, පසුව Brisbane හි Brisbane Roar සමඟ පුහුණුවී Australian citizen බවට පත්විය."
    }
  },
  {
    name: "Atefeh Ramezanisadeh",
    aliases: ["Atefeh Ramezanisadeh", "Atefeh Ramezanizadeh", "Atefeh Ramezani", "Atefeh Ramezani10", "عاطفه رمضانی‌زاده"],
    type: "athlete",
    social: { label: "Instagram", url: "https://www.instagram.com/atefeh_ramezani10/" },
    profile: { label: "Soccerway profile", url: "https://za.soccerway.com/player/ramezanizadeh-atefeh/jR2glHnC/" },
    background: {
      "zh-Hans": "伊朗女子足球运动员，司职后卫，长期效力 Bam Khatoon 并代表伊朗女足；2026 年女子亚洲杯期间在澳洲寻求庇护，之后留在布里斯班训练并入籍澳洲。",
      "zh-Hant": "伊朗女子足球運動員，司職後衛，長期效力 Bam Khatoon 並代表伊朗女足；2026 年女子亞洲盃期間在澳洲尋求庇護，之後留在布里斯本訓練並入籍澳洲。",
      en: "Iranian footballer and defender who played for Bam Khatoon and Iran's women's national team; during the 2026 Women's Asian Cup she sought asylum in Australia, later stayed in Brisbane to train and became an Australian citizen.",
      es: "Futbolista iraní, defensora, ex jugadora de Bam Khatoon y de la selección femenina de Irán; durante la Copa Asiática femenina de 2026 pidió asilo en Australia, después permaneció en Brisbane para entrenar y obtuvo la ciudadanía australiana.",
      ja: "イランの女子サッカー選手、ディフェンダー。Bam Khatoon とイラン女子代表でプレーし、2026年女子アジアカップ期間中に豪州で亡命を求め、その後ブリスベンに残って練習し、豪州市民権を取得しました。",
      ko: "이란 여자 축구 수비수로 Bam Khatoon과 이란 여자 대표팀에서 뛰었습니다. 2026년 여자 아시안컵 기간 호주에 망명을 신청했고 이후 브리즈번에 남아 훈련하며 호주 시민권을 취득했습니다.",
      vi: "Cầu thủ bóng đá nữ Iran chơi hậu vệ, từng thi đấu cho Bam Khatoon và đội tuyển nữ Iran; trong Asian Cup nữ 2026 cô xin tị nạn tại Australia, sau đó ở lại Brisbane để tập luyện và trở thành công dân Australia.",
      th: "นักฟุตบอลหญิงอิหร่านตำแหน่งกองหลัง อดีตผู้เล่น Bam Khatoon และทีมชาติหญิงอิหร่าน; ระหว่าง Women's Asian Cup 2026 เธอยื่นขอลี้ภัยในออสเตรเลีย ต่อมาอยู่ต่อที่บริสเบนเพื่อฝึกซ้อมและได้สัญชาติออสเตรเลีย",
      si: "Iranian women football defender කෙනෙකි; Bam Khatoon සහ Iran women's national team සඳහා ක්‍රීඩා කළාය. 2026 Women's Asian Cup අතරතුර Australia හි asylum ඉල්ලා, පසුව Brisbane හි පුහුණුවීමට රැඳී Australian citizen බවට පත්විය."
    }
  },
  {
    name: "David Gallop",
    aliases: ["David Gallop", "David Gallop AM", "Former Football Australia boss David Gallop", "大卫·加洛普", "大衛·加洛普", "デイヴィッド・ギャロップ", "데이비드 갤럽"],
    type: "sports executive",
    personalSocial: { label: "LinkedIn", url: "https://www.linkedin.com/pub/dir/David/Gallop" },
    profile: { label: "Alacria profile", url: "https://alacriaglobal.com/david-gallop/" },
    officialProfile: { label: "AICD profile", url: "https://www.aicd.com.au/about-aicd/authors-speakers/a-g/david-gallop.html" },
    background: {
      "zh-Hans": "澳大利亚体育管理人士，曾任 NRL 首席执行官和 Football Federation Australia 首席执行官，后来担任多个体育、场馆和企业董事职位。",
      "zh-Hant": "澳洲體育管理人士，曾任 NRL 行政總裁和 Football Federation Australia 行政總裁，後來擔任多個體育、場館和企業董事職位。",
      en: "Australian sports administrator and lawyer, formerly chief executive of the NRL and Football Federation Australia, later holding board roles across sport, venues and business.",
      es: "Administrador deportivo y abogado australiano; fue director ejecutivo de la NRL y de Football Federation Australia, y después ocupó cargos directivos en deporte, recintos y empresas.",
      ja: "豪州のスポーツ管理者、弁護士。NRL と Football Federation Australia の最高経営責任者を務め、その後はスポーツ、会場運営、企業の取締役職に就いています。",
      ko: "호주의 스포츠 행정가이자 변호사로, NRL과 Football Federation Australia 최고경영자를 지냈고 이후 스포츠, 경기장, 기업 이사회 역할을 맡았습니다.",
      vi: "Nhà quản trị thể thao và luật sư Australia, từng là tổng giám đốc NRL và Football Federation Australia, sau đó giữ các vai trò hội đồng quản trị trong thể thao, địa điểm và doanh nghiệp.",
      th: "นักบริหารกีฬาและทนายความชาวออสเตรเลีย อดีตซีอีโอของ NRL และ Football Federation Australia ต่อมาดำรงตำแหน่งกรรมการในภาคกีฬา สนามกีฬา และธุรกิจ",
      si: "Australian sports administrator සහ lawyer කෙනෙකි; NRL සහ Football Federation Australia හි හිටපු chief executive වන අතර පසුව sport, venues සහ business board roles දැරීය."
    }
  },
  {
    name: "Robert Thomson",
    aliases: ["Robert Thomson", "Robert James Thomson", "Robert J. Thomson", "News Corp CEO Robert Thomson", "罗伯特·汤姆森", "羅伯特·湯姆森", "ロバート・トムソン", "로버트 톰슨"],
    type: "executive",
    officialProfile: { label: "News Corp leadership", url: "https://newscorp.com/news-corp-leadership/" },
    social: { label: "LinkedIn", url: "https://www.linkedin.com/in/robert-thomson-52603a8" },
    background: {
      "zh-Hans": "澳大利亚出生的媒体高管和前记者，2013 年起担任 News Corp 首席执行官；此前曾任 The Wall Street Journal 总编辑和 The Times 编辑。",
      "zh-Hant": "澳洲出生的媒體高管和前記者，2013 年起擔任 News Corp 行政總裁；此前曾任 The Wall Street Journal 總編輯和 The Times 編輯。",
      en: "Australian-born media executive and former journalist who has been chief executive of News Corp since 2013, after senior editorial roles at The Wall Street Journal and The Times.",
      es: "Ejecutivo de medios nacido en Australia y ex periodista; es director ejecutivo de News Corp desde 2013, tras cargos editoriales sénior en The Wall Street Journal y The Times.",
      ja: "豪州出身のメディア経営者、元ジャーナリスト。The Wall Street Journal や The Times の編集幹部を経て、2013年から News Corp の最高経営責任者です。",
      ko: "호주 출신 미디어 경영자이자 전직 기자로, The Wall Street Journal과 The Times의 고위 편집직을 거쳐 2013년부터 News Corp 최고경영자를 맡고 있습니다.",
      vi: "Nhà điều hành truyền thông sinh tại Australia và cựu nhà báo, là CEO News Corp từ năm 2013 sau các vai trò biên tập cấp cao tại The Wall Street Journal và The Times.",
      th: "ผู้บริหารสื่อและอดีตนักข่าวชาวออสเตรเลีย ดำรงตำแหน่ง chief executive ของ News Corp ตั้งแต่ปี 2013 หลังเคยเป็นผู้บริหารบรรณาธิการที่ The Wall Street Journal และ The Times",
      si: "Australian-born media executive සහ former journalist කෙනෙකි; The Wall Street Journal සහ The Times හි senior editorial roles පසු 2013 සිට News Corp chief executive ලෙස කටයුතු කරයි."
    }
  },
  {
    name: "Eddie Obeid",
    aliases: ["Eddie Obeid", "Edward Obeid", "Edward Moses Obeid", "埃迪·奥贝德", "艾迪·奧貝德", "エディー・オベイド", "에디 오베이드"],
    type: "politician",
    officialProfile: { label: "NSW Parliament profile", url: "https://www.parliament.nsw.gov.au/members/Pages/Member-details.aspx?pk=2215" },
    background: {
      "zh-Hans": "前新州工党上议院议员和州部长，曾在 1990 年代至 2000 年代被视为工党内部权力掮客；后来因公职不当行为和煤矿牌照相关腐败案被定罪。",
      "zh-Hant": "前新州工黨上議院議員和州部長，曾在 1990 年代至 2000 年代被視為工黨內部權力掮客；後來因公職不當行為和煤礦牌照相關腐敗案被定罪。",
      en: "Former NSW Labor upper house MP and state minister, long seen as a Labor powerbroker in the 1990s and 2000s, later convicted over misconduct in public office and a coal-licence corruption case.",
      es: "Exdiputado laborista del Consejo Legislativo de NSW y ex ministro estatal, visto durante años como operador de poder laborista; después fue condenado por misconduct in public office y un caso de corrupción ligado a licencias de carbón.",
      ja: "元 NSW Labor 上院議員、州大臣。1990年代から2000年代にかけて党内実力者とされ、その後、公職不正行為と石炭ライセンス関連の汚職事件で有罪となりました。",
      ko: "전 NSW Labor 상원의원 겸 주 장관으로 1990-2000년대 노동당 실세로 여겨졌으며, 이후 공직 부정행위와 석탄 면허 부패 사건으로 유죄 판결을 받았습니다.",
      vi: "Cựu nghị sĩ thượng viện bang NSW của Labor và cựu bộ trưởng bang, từng được xem là powerbroker của Labor trong thập niên 1990-2000, sau đó bị kết án về misconduct in public office và một vụ tham nhũng giấy phép than.",
      th: "อดีตสมาชิกสภาสูงรัฐ NSW ของ Labor และอดีตรัฐมนตรีรัฐ เคยถูกมองเป็นผู้มีอิทธิพลในพรรคช่วงทศวรรษ 1990-2000 ต่อมาถูกตัดสินผิดคดี misconduct in public office และคดีคอร์รัปชันใบอนุญาตเหมืองถ่านหิน",
      si: "හිටපු NSW Labor upper house MP සහ state minister කෙනෙකි; 1990s සහ 2000s වල Labor powerbroker ලෙස සැලකුණු අතර පසුව misconduct in public office සහ coal-licence corruption case සම්බන්ධයෙන් වරදකරු විය."
    },
    positions: {
      "zh-Hans": "政治生涯主要与新州 Labor Right、州内资源和渔业部长职务、以及党内派系操作联系在一起；其后续公共意义更多来自腐败调查、资产冻结和政治问责。",
      "zh-Hant": "政治生涯主要與新州 Labor Right、州內資源和漁業部長職務、以及黨內派系操作聯繫在一起；其後續公共意義更多來自腐敗調查、資產凍結和政治問責。",
      en: "His political career is associated with NSW Labor Right factional power, resources and fisheries portfolios, and later public scrutiny through corruption findings, asset freezes and accountability cases.",
      es: "Su carrera política se asocia con el poder faccional de Labor Right en NSW, las carteras de recursos y pesca, y después con investigaciones de corrupción, congelamiento de activos y rendición de cuentas.",
      ja: "政治経歴は NSW Labor Right の派閥権力、資源・漁業担当相、そして後年の汚職認定、資産凍結、政治責任追及と結び付いています。",
      ko: "그의 정치 경력은 NSW Labor Right 계파 권력, 자원·수산 포트폴리오, 이후 부패 판단과 자산 동결, 책임 추궁 사건으로 설명됩니다.",
      vi: "Sự nghiệp chính trị của ông gắn với quyền lực phe Labor Right ở NSW, các danh mục tài nguyên và thủy sản, rồi sau đó là các phát hiện tham nhũng, phong tỏa tài sản và trách nhiệm giải trình.",
      th: "อาชีพการเมืองของเขาเชื่อมโยงกับอำนาจ faction Labor Right ใน NSW งานด้านทรัพยากรและประมง และต่อมาคือผลสอบคอร์รัปชัน การอายัดทรัพย์ และคดีความรับผิดชอบทางการเมือง",
      si: "ඔහුගේ political career එක NSW Labor Right factional power, resources/fisheries portfolios, පසුව corruption findings, asset freezes සහ accountability cases සමඟ සම්බන්ධය."
    }
  },
  {
    name: "Omar Musa",
    aliases: ["Omar Musa", "Omar bin Musa", "Omar Bin Musa", "奥马尔·穆萨", "奧馬爾·穆薩", "オマー・ムーサ", "오마르 무사"],
    type: "artist",
    profile: { label: "Personal website", url: "https://www.omarmusa.com.au/" },
    social: { label: "Instagram", url: "https://www.instagram.com/omarbinmusa/" },
    background: {
      "zh-Hans": "来自 Queanbeyan 的澳大利亚作家、诗人、艺术家和音乐人，作品横跨小说、诗歌、版画、戏剧和 hip-hop。",
      "zh-Hant": "來自 Queanbeyan 的澳洲作家、詩人、藝術家和音樂人，作品橫跨小說、詩歌、版畫、戲劇和 hip-hop。",
      en: "Australian author, poet, artist and musician from Queanbeyan whose work spans fiction, poetry, printmaking, theatre and hip-hop.",
      es: "Autor, poeta, artista y músico australiano de Queanbeyan, con obra en ficción, poesía, grabado, teatro y hip-hop.",
      ja: "Queanbeyan 出身の豪州の作家、詩人、アーティスト、ミュージシャン。小説、詩、版画、演劇、ヒップホップにまたがって活動しています。",
      ko: "Queanbeyan 출신 호주 작가, 시인, 예술가, 음악가로 소설, 시, 판화, 연극, 힙합을 넘나들며 활동합니다.",
      vi: "Tác giả, nhà thơ, nghệ sĩ và nhạc sĩ Australia từ Queanbeyan, hoạt động trong tiểu thuyết, thơ, khắc in, sân khấu và hip-hop.",
      th: "นักเขียน กวี ศิลปิน และนักดนตรีชาวออสเตรเลียจาก Queanbeyan ทำงานทั้งนิยาย กวีนิพนธ์ ภาพพิมพ์ ละครเวที และฮิปฮอป",
      si: "Queanbeyan සිට Australian author, poet, artist සහ musician කෙනෙකි; fiction, poetry, printmaking, theatre සහ hip-hop අතර වැඩ කරයි."
    }
  },
  {
    name: "Liesl Tesch",
    aliases: ["Liesl Tesch", "Liesl Dorothy Tesch", "Liesl Tesch MP", "Liesl Tesch AM MP", "Paralympian Liesl Tesch", "莉斯尔·泰施", "莉斯爾·泰施", "リーズル・テッシュ", "리즐 테슈"],
    type: "politician",
    profile: { label: "NSW Parliament profile", url: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers/members-details?memberId=2228" },
    officialProfile: { label: "Paralympics Australia profile", url: "https://www.paralympic.org.au/athlete/liesl-tesch/" },
    social: { label: "Facebook", url: "https://www.facebook.com/LieslTeschGosford/" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/liesltesch/" },
    background: {
      "zh-Hans": "澳洲工党新州议员，2017 年起代表 Gosford；进入政坛前是教师和七届残奥会选手，曾在帆船项目夺得两枚残奥金牌。",
      "zh-Hant": "澳洲工黨新州議員，2017 年起代表 Gosford；進入政壇前是教師和七屆帕運選手，曾在帆船項目奪得兩枚帕運金牌。",
      en: "NSW Labor MP for Gosford since 2017, and formerly a teacher and seven-time Paralympian who won two Paralympic gold medals in sailing.",
      es: "Diputada laborista de NSW por Gosford desde 2017; antes fue profesora y siete veces paralímpica, con dos oros paralímpicos en vela.",
      ja: "2017年から Gosford 選出の NSW Labor 州議員。政界入り前は教師で、パラリンピックに7回出場し、セーリングで金メダル2個を獲得しました。",
      ko: "2017년부터 Gosford를 대표하는 NSW Labor 주의원입니다. 정계 입문 전에는 교사였고 패럴림픽에 7차례 출전해 요트에서 금메달 2개를 땄습니다.",
      vi: "Nghị sĩ Labor bang NSW đại diện Gosford từ năm 2017; trước đó là giáo viên và VĐV Paralympic bảy kỳ, giành hai HCV Paralympic môn sailing.",
      th: "ส.ส. NSW Labor เขต Gosford ตั้งแต่ปี 2017 ก่อนเข้าสู่การเมืองเคยเป็นครูและนักกีฬาพาราลิมปิก 7 สมัย ได้เหรียญทองพาราลิมปิกเรือใบ 2 เหรียญ",
      si: "2017 සිට Gosford නියෝජනය කරන NSW Labor MP කෙනෙකි; දේශපාලනයට පෙර ගුරුවරියක් සහ seven-time Paralympian කෙනෙකු වූ අතර sailing වල Paralympic gold medals දෙකක් දිනා ඇත."
    },
    positions: {
      "zh-Hans": [
        "地方代表：在新州议会代表 Gosford，重点关注中央海岸社区服务、家庭、残障包容和本地基础设施。",
        "残障包容：以残奥会经历为背景，支持残障人士参与、无障碍和社区体育机会。",
        "政府职务：在 Minns 工党政府内担任副政府党鞭，并承担家庭、社区和残障包容相关议会秘书职责。"
      ],
      "zh-Hant": [
        "地方代表：在新州議會代表 Gosford，重點關注中央海岸社區服務、家庭、殘障包容和本地基礎設施。",
        "殘障包容：以帕運經歷為背景，支持殘障人士參與、無障礙和社區體育機會。",
        "政府職務：在 Minns 工黨政府內擔任副政府黨鞭，並承擔家庭、社區和殘障包容相關議會秘書職責。"
      ],
      en: [
        "Local representation: represents Gosford in the NSW Parliament, with emphasis on Central Coast community services, families, disability inclusion and local infrastructure.",
        "Disability inclusion: draws on her Paralympic background to support accessibility, participation and community sport opportunities for disabled people.",
        "Government role: serves in the Minns Labor government as Deputy Government Whip and in parliamentary secretary responsibilities covering families, communities and disability inclusion."
      ],
      es: [
        "Representación local: representa a Gosford en el Parlamento de NSW, con foco en servicios comunitarios de Central Coast, familias, inclusión de personas con discapacidad e infraestructura local.",
        "Inclusión: usa su trayectoria paralímpica para apoyar accesibilidad, participación y oportunidades de deporte comunitario para personas con discapacidad.",
        "Cargo gubernamental: sirve en el gobierno laborista de Minns como Deputy Government Whip y con responsabilidades de secretaria parlamentaria en familias, comunidades e inclusión."
      ],
      ja: [
        "地域代表：NSW 議会で Gosford を代表し、Central Coast の地域サービス、家族、障害包摂、地域インフラを重視しています。",
        "障害包摂：パラリンピックでの経験を背景に、アクセシビリティ、参加、地域スポーツ機会を支援しています。",
        "政府内役職：Minns Labor 政権で Deputy Government Whip を務め、家族、地域社会、障害包摂に関わる政務官職も担っています。"
      ],
      ko: [
        "지역 대표: NSW 의회에서 Gosford를 대표하며 Central Coast 지역 서비스, 가족, 장애 포용, 지역 인프라에 초점을 둡니다.",
        "장애 포용: 패럴림픽 경험을 바탕으로 접근성, 참여, 장애인의 지역 스포츠 기회를 지지합니다.",
        "정부 역할: Minns Labor 정부에서 Deputy Government Whip을 맡고 가족, 지역사회, 장애 포용 관련 parliamentary secretary 역할을 수행합니다."
      ],
      vi: [
        "Đại diện địa phương: đại diện Gosford trong Quốc hội NSW, tập trung vào dịch vụ cộng đồng Central Coast, gia đình, hòa nhập người khuyết tật và hạ tầng địa phương.",
        "Hòa nhập người khuyết tật: dựa trên kinh nghiệm Paralympic để ủng hộ tiếp cận, tham gia và cơ hội thể thao cộng đồng cho người khuyết tật.",
        "Vai trò chính phủ: giữ vai trò Deputy Government Whip trong chính phủ Minns Labor và các trách nhiệm parliamentary secretary về gia đình, cộng đồng và hòa nhập."
      ],
      th: [
        "ตัวแทนท้องถิ่น: เป็นตัวแทน Gosford ในรัฐสภา NSW โดยเน้นบริการชุมชน Central Coast ครอบครัว การมีส่วนร่วมของคนพิการ และโครงสร้างพื้นฐานท้องถิ่น",
        "การมีส่วนร่วมของคนพิการ: ใช้ประสบการณ์พาราลิมปิกสนับสนุน accessibility การมีส่วนร่วม และโอกาสกีฬาในชุมชนสำหรับคนพิการ",
        "บทบาทรัฐบาล: ดำรงตำแหน่ง Deputy Government Whip ในรัฐบาล Minns Labor และมีหน้าที่ parliamentary secretary ด้านครอบครัว ชุมชน และ disability inclusion"
      ],
      si: [
        "Local representation: NSW Parliament තුළ Gosford නියෝජනය කරමින් Central Coast community services, families, disability inclusion සහ local infrastructure අවධානයට ගනී.",
        "Disability inclusion: Paralympic පසුබිම මත accessibility, participation සහ disabled people සඳහා community sport opportunities සහාය දක්වයි.",
        "Government role: Minns Labor government තුළ Deputy Government Whip ලෙසත් families, communities සහ disability inclusion ආවරණය කරන parliamentary secretary responsibilities වලත් කටයුතු කරයි."
      ]
    }
  },
  {
    name: "Tony Modra",
    aliases: ["Tony Modra", "Anthony Dale Modra", "Anthony Modra", "Tony Modra official", "Tony Modra Official", "托尼·莫德拉", "東尼·莫德拉", "トニー・モドラ", "토니 모드라"],
    type: "athlete",
    profile: { label: "Adelaide Football Club profile", url: "https://crowshistory.afc.com.au/afl-players/tony-modra" },
    officialProfile: { label: "Adelaide Crows Hall of Fame", url: "https://www.afc.com.au/news/455170/hall-of-fame-tony-modra" },
    social: { label: "Instagram", url: "https://www.instagram.com/tonymodraofficial/" },
    background: {
      "zh-Hans": "澳式足球退役球员，曾效力 Adelaide Crows 和 Fremantle，以高空接球和进球能力闻名，曾获 Coleman Medal、两次入选 All-Australian。",
      "zh-Hant": "澳式足球退役球員，曾效力 Adelaide Crows 和 Fremantle，以高空接球和入球能力聞名，曾獲 Coleman Medal、兩次入選 All-Australian。",
      en: "Retired Australian rules footballer for Adelaide and Fremantle, known for spectacular marking and goalkicking, with a Coleman Medal and two All-Australian selections.",
      es: "Exjugador de fútbol australiano de Adelaide y Fremantle, conocido por sus marcas espectaculares y goles; ganó la Coleman Medal y fue dos veces All-Australian.",
      ja: "Adelaide と Fremantle でプレーした元オーストラリアンフットボール選手。豪快なマークと得点力で知られ、Coleman Medal と All-Australian 選出2回の実績があります。",
      ko: "Adelaide와 Fremantle에서 뛴 전 호주식 풋볼 선수로, 화려한 마크와 득점력으로 유명하며 Coleman Medal과 두 차례 All-Australian 선정 이력이 있습니다.",
      vi: "Cựu cầu thủ bóng bầu dục kiểu Australia của Adelaide và Fremantle, nổi tiếng với các pha bắt bóng trên không và ghi bàn, từng đoạt Coleman Medal và hai lần vào đội All-Australian.",
      th: "อดีตนักกีฬา Australian rules football ของ Adelaide และ Fremantle โดดเด่นเรื่องการกระโดดรับบอลและทำประตู เคยได้ Coleman Medal และติด All-Australian สองครั้ง",
      si: "Adelaide සහ Fremantle සඳහා ක්‍රීඩා කළ විශ්‍රාමික Australian rules footballer කෙනෙකි; spectacular marking සහ goalkicking සඳහා ප්‍රසිද්ධ අතර Coleman Medal සහ All-Australian selections දෙකක් ඇත."
    }
  },
  {
    name: "Charlie Shahin",
    aliases: ["Charlie Shahin", "Charlie Shahin AO", "Billionaire Charlie Shahin", "Khalil Shahin", "Khalil (Charlie) Shahin", "Professor Khalil Shahin AO", "查理·沙欣", "查理·沙欣 AO"],
    type: "executive",
    profile: { label: "Personal website", url: "https://charlieshahin.com/" },
    officialProfile: { label: "LinkedIn profile", url: "https://au.linkedin.com/in/khalil-charlie-shahin-ao" },
    social: { label: "LinkedIn", url: "https://au.linkedin.com/in/khalil-charlie-shahin-ao" },
    background: {
      "zh-Hans": "南澳企业家、慈善人士和 ATAYF Family Office 执行主席；Shahin 家族曾经营 OTR/Peregrine 便利零售业务，并继续投资地产、农业和其他资产。",
      "zh-Hant": "南澳企業家、慈善人士和 ATAYF Family Office 執行主席；Shahin 家族曾經營 OTR/Peregrine 便利零售業務，並繼續投資地產、農業和其他資產。",
      en: "South Australian entrepreneur, philanthropist and executive chairman of ATAYF Family Office; the Shahin family formerly built the OTR/Peregrine convenience retail business and continues to invest in property, agriculture and other assets.",
      es: "Empresario y filántropo de Australia Meridional, presidente ejecutivo de ATAYF Family Office; la familia Shahin desarrolló antes el negocio minorista OTR/Peregrine y sigue invirtiendo en propiedades, agricultura y otros activos.",
      ja: "南オーストラリア州の起業家、慈善家で、ATAYF Family Office のエグゼクティブ・チェアマン。Shahin 家はかつて OTR/Peregrine のコンビニ事業を築き、現在も不動産、農業などに投資しています。",
      ko: "사우스오스트레일리아의 기업가이자 자선가, ATAYF Family Office 집행 회장입니다. Shahin 가문은 과거 OTR/Peregrine 편의점 사업을 키웠고 부동산, 농업 등 자산 투자를 이어가고 있습니다.",
      vi: "Doanh nhân và nhà từ thiện ở Nam Australia, chủ tịch điều hành ATAYF Family Office; gia đình Shahin từng xây dựng mảng bán lẻ tiện lợi OTR/Peregrine và tiếp tục đầu tư vào bất động sản, nông nghiệp cùng các tài sản khác.",
      th: "ผู้ประกอบการและนักการกุศลในรัฐเซาท์ออสเตรเลีย ประธานบริหาร ATAYF Family Office; ครอบครัว Shahin เคยสร้างธุรกิจค้าปลีกสะดวกซื้อ OTR/Peregrine และยังลงทุนในอสังหาริมทรัพย์ เกษตรกรรม และสินทรัพย์อื่น",
      si: "South Australia ව්‍යවසායකයෙකු, philanthropist සහ ATAYF Family Office executive chairman වේ; Shahin පවුල OTR/Peregrine convenience retail business එක ගොඩනැගූ අතර property, agriculture සහ වෙනත් assets වල ආයෝජනය කරයි."
    }
  },
  {
    name: "Richard Marles",
    aliases: ["Richard Marles", "Richard Donald Marles", "The Hon Richard Marles MP", "Deputy Prime Minister Richard Marles", "Defence Minister Richard Marles", "理查德·马尔斯", "理查德·馬爾斯", "リチャード・マールズ", "리처드 말스"],
    type: "politician",
    profile: { label: "Defence Ministers profile", url: "https://www.minister.defence.gov.au/current-ministers/2022-06/richard-marles" },
    officialProfile: { label: "Parliament profile", url: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID=HWQ" },
    social: { label: "X", url: "https://x.com/RichardMarlesMP" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/richardmarlesmp/" },
    background: {
      "zh-Hans": "澳洲工党联邦议员，代表维州 Corio，自 2007 年进入联邦议会；2022 年起任澳大利亚副总理兼国防部长。",
      "zh-Hant": "澳洲工黨聯邦議員，代表維州 Corio，自 2007 年進入聯邦議會；2022 年起任澳洲副總理兼國防部長。",
      en: "Federal Labor MP for Corio in Victoria since 2007, and Australia's Deputy Prime Minister and Minister for Defence since 2022.",
      es: "Diputado federal laborista por Corio, Victoria, desde 2007, y viceprimer ministro y ministro de Defensa de Australia desde 2022.",
      ja: "2007年からビクトリア州 Corio 選出の連邦労働党議員で、2022年から豪州副首相兼国防相です。",
      ko: "2007년부터 빅토리아 Corio를 대표하는 연방 노동당 하원의원이며 2022년부터 호주 부총리 겸 국방장관입니다.",
      vi: "Nghị sĩ Labor liên bang khu Corio ở Victoria từ năm 2007, đồng thời là Phó thủ tướng kiêm Bộ trưởng Quốc phòng Australia từ năm 2022.",
      th: "ส.ส. Labor รัฐบาลกลางเขต Corio ในรัฐวิกตอเรียตั้งแต่ปี 2007 และเป็นรองนายกรัฐมนตรีกับรัฐมนตรีกลาโหมของออสเตรเลียตั้งแต่ปี 2022",
      si: "2007 සිට Victoria හි Corio නියෝජනය කරන Federal Labor MP වන අතර 2022 සිට Australia's Deputy Prime Minister සහ Minister for Defence වේ."
    },
    positions: {
      "zh-Hans": [
        "国防战略：支持按 2024 National Defence Strategy 和后续计划，把军力建设转向远程打击、海上能力和印太威慑。",
        "AUKUS：主导核动力潜艇、先进技术合作和相关产业能力建设。",
        "产业与技术：主张加快国防创新、主权工业能力和与盟友及本地研究机构的合作。"
      ],
      "zh-Hant": [
        "國防戰略：支持按 2024 National Defence Strategy 和後續計畫，把軍力建設轉向遠程打擊、海上能力和印太威懾。",
        "AUKUS：主導核動力潛艇、先進技術合作和相關產業能力建設。",
        "產業與技術：主張加快國防創新、主權工業能力和與盟友及本地研究機構的合作。"
      ],
      en: [
        "Defence strategy: backs shifting force design toward long-range strike, maritime capability and Indo-Pacific deterrence under the 2024 National Defence Strategy and later plans.",
        "AUKUS: leads Australia's nuclear-powered submarine program, advanced-technology cooperation and related industrial build-up.",
        "Industry and technology: argues for faster defence innovation, sovereign industrial capability and deeper work with allies and Australian research partners."
      ],
      es: [
        "Estrategia de defensa: apoya orientar la fuerza hacia ataque de largo alcance, capacidad marítima y disuasión en el Indo-Pacífico bajo la National Defence Strategy de 2024 y planes posteriores.",
        "AUKUS: lidera el programa australiano de submarinos de propulsión nuclear, la cooperación tecnológica avanzada y la expansión industrial relacionada.",
        "Industria y tecnología: defiende acelerar la innovación de defensa, la capacidad industrial soberana y la cooperación con aliados e investigadores australianos."
      ],
      ja: [
        "防衛戦略：2024 National Defence Strategy と後続計画に沿い、長射程攻撃、海洋能力、インド太平洋での抑止へ戦力設計を移す立場です。",
        "AUKUS：原子力潜水艦計画、先端技術協力、関連する産業基盤づくりを担当しています。",
        "産業と技術：防衛イノベーション、主権的産業能力、同盟国や国内研究機関との連携を速めるべきだと主張しています。"
      ],
      ko: [
        "국방 전략: 2024 National Defence Strategy와 후속 계획에 따라 장거리 타격, 해양 전력, 인도태평양 억지로 전력 설계를 전환하는 입장입니다.",
        "AUKUS: 호주의 핵추진 잠수함 계획, 첨단기술 협력, 관련 산업 역량 확충을 이끌고 있습니다.",
        "산업과 기술: 국방 혁신, 주권적 산업 역량, 동맹 및 호주 연구 파트너와의 협력을 더 빠르게 추진해야 한다고 주장합니다."
      ],
      vi: [
        "Chiến lược quốc phòng: ủng hộ chuyển thiết kế lực lượng sang tấn công tầm xa, năng lực hàng hải và răn đe Ấn Độ Dương-Thái Bình Dương theo National Defence Strategy 2024 và các kế hoạch sau đó.",
        "AUKUS: dẫn dắt chương trình tàu ngầm chạy bằng năng lượng hạt nhân, hợp tác công nghệ tiên tiến và xây dựng năng lực công nghiệp liên quan.",
        "Công nghiệp và công nghệ: thúc đẩy đổi mới quốc phòng nhanh hơn, năng lực công nghiệp chủ quyền và hợp tác sâu hơn với đồng minh cùng giới nghiên cứu Australia."
      ],
      th: [
        "ยุทธศาสตร์กลาโหม: สนับสนุนการปรับกำลังไปสู่การโจมตีระยะไกล ขีดความสามารถทางทะเล และการยับยั้งในอินโด-แปซิฟิกตาม National Defence Strategy 2024 และแผนต่อมา",
        "AUKUS: รับผิดชอบโครงการเรือดำน้ำพลังงานนิวเคลียร์ ความร่วมมือเทคโนโลยีขั้นสูง และการสร้างฐานอุตสาหกรรมที่เกี่ยวข้อง",
        "อุตสาหกรรมและเทคโนโลยี: ผลักดันนวัตกรรมกลาโหมที่เร็วขึ้น ขีดความสามารถอุตสาหกรรมในประเทศ และความร่วมมือกับพันธมิตรกับนักวิจัยออสเตรเลีย"
      ],
      si: [
        "Defence strategy: 2024 National Defence Strategy සහ පසුව ඇති plans යටතේ long-range strike, maritime capability සහ Indo-Pacific deterrence වෙත force design මාරු කිරීම සහාය දක්වයි.",
        "AUKUS: Australia's nuclear-powered submarine program, advanced-technology cooperation සහ related industrial build-up නායකත්වය දක්වයි.",
        "Industry and technology: faster defence innovation, sovereign industrial capability සහ allies හා Australian research partners සමඟ deeper work සඳහා තර්ක කරයි."
      ]
    }
  },
  {
    name: "Stephanie Tully",
    aliases: ["Stephanie Tully", "Steph Tully", "斯蒂芬妮·塔利", "史蒂芬妮·塔利", "ステファニー・タリー", "스테퍼니 털리"],
    type: "executive",
    profile: { label: "Jetstar executive biography", url: "https://www.jetstar.com/au/en/about-us/executive-biographies" },
    officialProfile: { label: "Qantas appointment release", url: "https://www.qantasnewsroom.com.au/media-releases/new-jetstar-ceo-announced" },
    social: { label: "LinkedIn", url: "https://au.linkedin.com/in/stephanie-tully-bab11515" },
    background: {
      "zh-Hans": "Jetstar Group 首席执行官，2022 年 11 月上任；此前在 Qantas Group 担任客户、营销和商业相关高管职位。",
      "zh-Hant": "Jetstar Group 行政總裁，2022 年 11 月上任；此前在 Qantas Group 擔任客戶、營銷和商業相關高管職位。",
      en: "Chief executive officer of Jetstar Group since November 2022, after senior customer, marketing and commercial roles across Qantas Group.",
      es: "Directora ejecutiva de Jetstar Group desde noviembre de 2022, tras ocupar cargos sénior de cliente, marketing y área comercial en Qantas Group.",
      ja: "2022年11月から Jetstar Group の最高経営責任者。以前は Qantas Group で顧客、マーケティング、商業部門の上級職を務めました。",
      ko: "2022년 11월부터 Jetstar Group 최고경영자로, 이전에는 Qantas Group에서 고객, 마케팅, 상업 부문의 고위직을 맡았습니다.",
      vi: "Tổng giám đốc Jetstar Group từ tháng 11 năm 2022, sau các vai trò cấp cao về khách hàng, tiếp thị và thương mại trong Qantas Group.",
      th: "ประธานเจ้าหน้าที่บริหารของ Jetstar Group ตั้งแต่พฤศจิกายน 2022 หลังทำงานระดับผู้บริหารด้านลูกค้า การตลาด และพาณิชย์ใน Qantas Group",
      si: "2022 නොවැම්බර් සිට Jetstar Group chief executive officer වේ; ඊට පෙර Qantas Group හි customer, marketing සහ commercial senior roles දැරීය."
    }
  },
  {
    name: "Andrew McDonald",
    aliases: ["Andrew McDonald", "Andrew Barry McDonald", "Andrew McDonald coach", "Ronnie McDonald", "安德鲁·麦克唐纳", "安德魯·麥克唐納", "アンドリュー・マクドナルド", "앤드루 맥도널드"],
    type: "cricket coach",
    profile: { label: "Cricket Australia coaching profile", url: "https://www.cricket.com.au/high-performance/coaching" },
    officialProfile: { label: "ESPNcricinfo profile", url: "https://www.espncricinfo.com/cricketers/andrew-mcdonald-6553" },
    background: {
      "zh-Hans": "澳大利亚男子板球队主教练，2022 年正式上任；球员时代是维州出身的全能型板球运动员，退役后曾执教 Leicestershire、Victoria、Melbourne Renegades 和 Rajasthan Royals。",
      "zh-Hant": "澳洲男子板球隊主教練，2022 年正式上任；球員時代是維州出身的全能型板球運動員，退役後曾執教 Leicestershire、Victoria、Melbourne Renegades 和 Rajasthan Royals。",
      en: "Head coach of the Australian men's cricket team since 2022; a former Victorian all-rounder who later coached Leicestershire, Victoria, Melbourne Renegades and Rajasthan Royals.",
      es: "Seleccionador del equipo masculino de críquet de Australia desde 2022; ex all-rounder de Victoria que después entrenó a Leicestershire, Victoria, Melbourne Renegades y Rajasthan Royals.",
      ja: "2022年から豪州男子クリケット代表のヘッドコーチ。現役時代はビクトリア州出身のオールラウンダーで、引退後は Leicestershire、Victoria、Melbourne Renegades、Rajasthan Royals を率いました。",
      ko: "2022년부터 호주 남자 크리켓 대표팀 감독을 맡고 있습니다. 빅토리아 출신 올라운더 선수였고 은퇴 후 Leicestershire, Victoria, Melbourne Renegades, Rajasthan Royals를 지도했습니다.",
      vi: "Huấn luyện viên trưởng đội cricket nam Australia từ năm 2022; cựu all-rounder của Victoria, sau đó huấn luyện Leicestershire, Victoria, Melbourne Renegades và Rajasthan Royals.",
      th: "หัวหน้าโค้ชทีมคริกเก็ตชายออสเตรเลียตั้งแต่ปี 2022; อดีตผู้เล่น all-rounder จากวิกตอเรีย และเคยคุม Leicestershire, Victoria, Melbourne Renegades และ Rajasthan Royals",
      si: "2022 සිට Australian men's cricket team හි head coach වේ; හිටපු Victorian all-rounder කෙනෙක් වන අතර පසුව Leicestershire, Victoria, Melbourne Renegades සහ Rajasthan Royals පුහුණු කළේය."
    }
  },
  {
    name: "Donald Trump",
    aliases: ["Donald Trump", "Donald J. Trump", "Donald John Trump", "President Donald Trump", "唐纳德·特朗普", "唐納德·特朗普", "ドナルド・トランプ", "도널드 트럼프"],
    type: "politician",
    profile: { label: "White House biography", url: "https://www.whitehouse.gov/administration/donald-j-trump/" },
    officialProfile: { label: "Official biography", url: "https://www.trump.com/leadership/donald-j-trump-biography" },
    social: { label: "X", url: "https://x.com/realDonaldTrump" },
    personalSocial: { label: "Truth Social", url: "https://truthsocial.com/@realDonaldTrump" },
    background: {
      "zh-Hans": "美国共和党政治人物，曾任第 45 任美国总统，并在 2024 年大选后成为第 47 任美国总统；此前长期从事地产、媒体和品牌业务。",
      "zh-Hant": "美國共和黨政治人物，曾任第 45 任美國總統，並在 2024 年大選後成為第 47 任美國總統；此前長期從事地產、媒體和品牌業務。",
      en: "Republican politician serving as the 47th president of the United States after the 2024 election, and previously the 45th president; before politics he was a real-estate, media and branding executive.",
      es: "Político republicano, 47.º presidente de Estados Unidos tras las elecciones de 2024 y antes 45.º presidente; antes de la política fue empresario de bienes raíces, medios y marcas.",
      ja: "共和党の政治家。2024年大統領選後に第47代米大統領となり、以前は第45代大統領も務めました。政界入り前は不動産、メディア、ブランド事業の経営者でした。",
      ko: "공화당 정치인으로 2024년 대선 이후 미국 제47대 대통령을 맡고 있으며, 이전에는 제45대 대통령이었습니다. 정계 입문 전에는 부동산, 미디어, 브랜드 사업가였습니다.",
      vi: "Chính trị gia Cộng hòa, là tổng thống thứ 47 của Hoa Kỳ sau cuộc bầu cử 2024 và từng là tổng thống thứ 45; trước chính trị ông hoạt động trong bất động sản, truyền thông và thương hiệu.",
      th: "นักการเมืองพรรค Republican ประธานาธิบดีสหรัฐฯ คนที่ 47 หลังการเลือกตั้งปี 2024 และเคยเป็นคนที่ 45 ก่อนเข้าสู่การเมืองทำธุรกิจอสังหาริมทรัพย์ สื่อ และแบรนด์",
      si: "Republican දේශපාලනඥයෙකු වන Donald Trump 2024 මැතිවරණයෙන් පසු එක්සත් ජනපදයේ 47 වන ජනාධිපති ලෙස කටයුතු කරයි; පෙර 45 වන ජනාධිපති වූ අතර දේශපාලනයට පෙර real-estate, media සහ branding ව්‍යාපාර කළේය."
    },
    positions: {
      "zh-Hans": "主张更高关税、收紧移民和边境执法、扩大化石能源生产，并以交易式外交和美国优先经济政策作为核心政治路线。",
      "zh-Hant": "主張更高關稅、收緊移民和邊境執法、擴大化石能源生產，並以交易式外交和美國優先經濟政策作為核心政治路線。",
      en: "He advocates higher tariffs, tougher immigration and border enforcement, expanded fossil-fuel production, transactional diplomacy and an America First economic agenda.",
      es: "Defiende aranceles más altos, mayor dureza migratoria y fronteriza, expansión de combustibles fósiles, diplomacia transaccional y una agenda económica America First.",
      ja: "高関税、移民・国境管理の強化、化石燃料生産の拡大、取引型外交、America First の経済政策を掲げています。",
      ko: "높은 관세, 강경한 이민·국경 집행, 화석연료 생산 확대, 거래 중심 외교, America First 경제 의제를 주장합니다.",
      vi: "Ông ủng hộ thuế quan cao hơn, siết nhập cư và biên giới, mở rộng sản xuất nhiên liệu hóa thạch, ngoại giao theo kiểu giao dịch và chương trình kinh tế America First.",
      th: "เขาสนับสนุนภาษีนำเข้าสูงขึ้น การบังคับใช้กฎหมายคนเข้าเมืองและชายแดนที่เข้มขึ้น การขยายการผลิตฟอสซิล การทูตแบบต่อรอง และเศรษฐกิจ America First",
      si: "ඔහු higher tariffs, දැඩි immigration සහ border enforcement, fossil-fuel production පුළුල් කිරීම, transactional diplomacy සහ America First economic agenda සඳහා සහාය දක්වයි."
    }
  },
  {
    name: "Jason Clare",
    aliases: ["Jason Clare", "Jason Dean Clare", "The Hon Jason Clare", "The Hon Jason Clare MP", "杰森·克莱尔", "傑森·克萊爾", "ジェイソン・クレア", "제이슨 클레어"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/j_clare_mp" },
    officialProfile: { label: "Minister biography", url: "https://ministers.education.gov.au/clare" },
    social: { label: "X", url: "https://x.com/JasonClareMP" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/JasonClareMP/" },
    background: {
      "zh-Hans": "澳洲工党联邦议员，代表新州 Blaxland，自 2007 年进入联邦议会，2022 年起任联邦教育部长。",
      "zh-Hant": "澳洲工黨聯邦議員，代表新州 Blaxland，自 2007 年進入聯邦議會，2022 年起任聯邦教育部長。",
      en: "Federal Labor MP for Blaxland in New South Wales since 2007 and Australia's Minister for Education since 2022.",
      es: "Diputado federal laborista por Blaxland, Nueva Gales del Sur, desde 2007 y ministro de Educación de Australia desde 2022.",
      ja: "2007年からニューサウスウェールズ州 Blaxland 選出の連邦労働党議員で、2022年から豪州教育相です。",
      ko: "2007년부터 뉴사우스웨일스 Blaxland를 대표하는 연방 노동당 하원의원이며 2022년부터 호주 교육부 장관입니다.",
      vi: "Nghị sĩ Labor liên bang khu Blaxland ở NSW từ năm 2007 và là Bộ trưởng Giáo dục Australia từ năm 2022.",
      th: "ส.ส. Labor รัฐบาลกลางเขต Blaxland ใน NSW ตั้งแต่ปี 2007 และเป็นรัฐมนตรีศึกษาธิการของออสเตรเลียตั้งแต่ปี 2022",
      si: "2007 සිට NSW Blaxland නියෝජනය කරන Federal Labor MP වන අතර 2022 සිට Australia's Minister for Education වේ."
    },
    positions: {
      "zh-Hans": [
        "教育资金：支持把公立学校推向更高资源标准，并通过联邦与州协议换取识字、算术和出勤等改革。",
        "高等教育：推动 Universities Accord 后续改革，包括学生债务、实习补贴和扩大弱势学生入学机会。",
        "儿童与网络：支持限制未成年人社交媒体使用，并把网络安全与教育成果、校园安全联系起来。"
      ],
      "zh-Hant": [
        "教育資金：支持把公立學校推向更高資源標準，並通過聯邦與州協議換取識字、算術和出勤等改革。",
        "高等教育：推動 Universities Accord 後續改革，包括學生債務、實習補貼和擴大弱勢學生入學機會。",
        "兒童與網絡：支持限制未成年人社交媒體使用，並把網絡安全與教育成果、校園安全聯繫起來。"
      ],
      en: [
        "School funding: backs lifting public schools toward higher resourcing standards, tied to federal-state reform deals on literacy, numeracy and attendance.",
        "Higher education: is driving Universities Accord follow-up changes, including student debt, paid placements and broader access for disadvantaged students.",
        "Children and online safety: supports restrictions on underage social-media use and links online safety with learning and school wellbeing."
      ],
      es: [
        "Financiación escolar: apoya elevar los recursos de las escuelas públicas mediante acuerdos federales-estatales ligados a alfabetización, aritmética y asistencia.",
        "Educación superior: impulsa reformas posteriores al Universities Accord, como deuda estudiantil, prácticas remuneradas y mayor acceso para estudiantes desfavorecidos.",
        "Infancia y seguridad digital: respalda restricciones al uso de redes sociales por menores y vincula la seguridad online con aprendizaje y bienestar escolar."
      ],
      ja: [
        "学校財政：公立学校のリソース水準引き上げを支持し、識字、算数、出席率の改革を連邦・州協定と結びつけています。",
        "高等教育：学生債務、有給実習、低所得・不利な立場の学生の進学拡大など、Universities Accord 後の改革を進めています。",
        "子どもとオンライン安全：未成年のソーシャルメディア利用制限を支持し、オンライン安全を学習と学校の安心につなげています。"
      ],
      ko: [
        "학교 재정: 공립학교 자원 기준을 높이고 문해력, 수리력, 출석 개혁을 연방-주 협약과 연계하는 입장입니다.",
        "고등교육: 학생부채, 유급 실습, 취약계층 학생 접근 확대 등 Universities Accord 후속 개혁을 추진합니다.",
        "아동과 온라인 안전: 미성년자의 소셜미디어 이용 제한을 지지하며 온라인 안전을 학습과 학교 복지와 연결합니다."
      ],
      vi: [
        "Tài trợ trường học: ủng hộ nâng chuẩn nguồn lực cho trường công, gắn với thỏa thuận liên bang-tiểu bang về đọc viết, toán và chuyên cần.",
        "Giáo dục đại học: thúc đẩy các thay đổi sau Universities Accord, gồm nợ sinh viên, hỗ trợ thực tập có trả tiền và mở rộng cơ hội cho sinh viên yếu thế.",
        "Trẻ em và an toàn mạng: ủng hộ hạn chế trẻ vị thành niên dùng mạng xã hội và liên hệ an toàn trực tuyến với học tập, phúc lợi học đường."
      ],
      th: [
        "งบโรงเรียน: สนับสนุนการยกระดับทรัพยากรโรงเรียนรัฐ โดยผูกกับข้อตกลงรัฐบาลกลาง-รัฐเรื่องการอ่านเขียน คณิต และการเข้าเรียน",
        "อุดมศึกษา: ผลักดันการปฏิรูปต่อจาก Universities Accord รวมถึงหนี้นักศึกษา เงินช่วยฝึกงาน และการเข้าถึงของนักศึกษากลุ่มเสียเปรียบ",
        "เด็กและความปลอดภัยออนไลน์: สนับสนุนการจำกัดการใช้โซเชียลมีเดียของผู้เยาว์ และเชื่อมความปลอดภัยออนไลน์กับผลการเรียนและสวัสดิภาพในโรงเรียน"
      ],
      si: [
        "School funding: public schools සඳහා resourcing standards ඉහළ නැංවීම සහ literacy, numeracy, attendance reforms federal-state deals සමඟ සම්බන්ධ කිරීම සහාය දක්වයි.",
        "Higher education: student debt, paid placements සහ disadvantaged students සඳහා access වැඩි කිරීම ඇතුළු Universities Accord follow-up reforms තල්ලු කරයි.",
        "Children and online safety: underage social-media use සීමා කිරීම්ට සහාය දක්වමින් online safety learning සහ school wellbeing සමඟ සම්බන්ධ කරයි."
      ]
    }
  },
  {
    name: "Daniel Andrews",
    aliases: ["Daniel Andrews", "Daniel Michael Andrews", "Dan Andrews", "Daniel Andrews MP", "Dan Andrews MP", "丹尼尔·安德鲁斯", "丹尼爾·安德魯斯", "ダニエル・アンドリュース", "대니얼 앤드루스"],
    type: "politician",
    profile: { label: "Parliament of Victoria profile", url: "https://www.parliament.vic.gov.au/members/daniel-andrews/" },
    officialProfile: { label: "Official website", url: "https://www.danandrews.com.au/" },
    social: { label: "X", url: "https://x.com/DanielAndrewsMP" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/DanielAndrewsMP/" },
    background: {
      "zh-Hans": "前维州工党州长，2014 至 2023 年任第 48 任维州州长，2002 至 2023 年代表 Mulgrave 进入维州议会。",
      "zh-Hant": "前維州工黨州長，2014 至 2023 年任第 48 任維州州長，2002 至 2023 年代表 Mulgrave 進入維州議會。",
      en: "Former Labor premier of Victoria, serving as the state's 48th premier from 2014 to 2023 and as MP for Mulgrave from 2002 to 2023.",
      es: "Ex primer ministro laborista de Victoria; fue el 48.º premier del estado entre 2014 y 2023 y diputado por Mulgrave de 2002 a 2023.",
      ja: "ビクトリア州の元労働党首相。2014年から2023年まで第48代州首相、2002年から2023年まで Mulgrave 選出議員でした。",
      ko: "전 빅토리아주 노동당 주총리로, 2014년부터 2023년까지 제48대 주총리를 지냈고 2002년부터 2023년까지 Mulgrave 의원이었습니다.",
      vi: "Cựu thủ hiến Labor của Victoria, giữ chức thủ hiến thứ 48 của bang từ 2014 đến 2023 và là nghị sĩ khu Mulgrave từ 2002 đến 2023.",
      th: "อดีตนายกรัฐมนตรีรัฐวิกตอเรียจากพรรค Labor ดำรงตำแหน่งนายกรัฐมนตรีรัฐคนที่ 48 ระหว่างปี 2014-2023 และเป็น ส.ส. เขต Mulgrave ระหว่างปี 2002-2023",
      si: "Victoria හි හිටපු Labor premier කෙනෙකි; 2014 සිට 2023 දක්වා 48වන premier ලෙසත් 2002 සිට 2023 දක්වා Mulgrave MP ලෙසත් සේවය කළේය."
    },
    positions: {
      "zh-Hans": [
        "公共服务：任内推动大型基础设施、住房更新和公共交通项目，但相关成本、治理和工会影响力持续受到审查。",
        "社会政策：支持婚姻平权、LGBTQ 权利和维州儿童早教扩张。",
        "能源与气候：支持维州减排目标，并推动复兴 State Electricity Commission。"
      ],
      "zh-Hant": [
        "公共服務：任內推動大型基礎設施、住房更新和公共交通項目，但相關成本、治理和工會影響力持續受到審查。",
        "社會政策：支持婚姻平權、LGBTQ 權利和維州兒童早教擴張。",
        "能源與氣候：支持維州減排目標，並推動復興 State Electricity Commission。"
      ],
      en: [
        "Public services: drove major infrastructure, housing-renewal and transport projects, while their cost, governance and union influence remain heavily scrutinised.",
        "Social policy: backed marriage equality, LGBTQ rights and expanded early-childhood education in Victoria.",
        "Energy and climate: supported Victoria's emissions targets and pushed to revive the State Electricity Commission."
      ],
      es: [
        "Servicios públicos: impulsó grandes proyectos de infraestructura, vivienda y transporte, aunque sus costos, gobernanza e influencia sindical siguen bajo escrutinio.",
        "Política social: respaldó el matrimonio igualitario, los derechos LGBTQ y la expansión de la educación inicial en Victoria.",
        "Energía y clima: apoyó los objetivos de emisiones de Victoria y promovió recuperar la State Electricity Commission."
      ],
      ja: [
        "公共サービス：大型インフラ、住宅更新、交通事業を進めましたが、費用、統治、労組の影響は強い検証対象です。",
        "社会政策：婚姻平等、LGBTQの権利、ビクトリア州の幼児教育拡大を支持しました。",
        "エネルギーと気候：州の排出削減目標を支持し、State Electricity Commission の復活を推進しました。"
      ],
      ko: [
        "공공서비스: 대형 인프라, 주택 재개발, 교통 사업을 추진했지만 비용, 거버넌스, 노조 영향력은 계속 강한 검증 대상입니다.",
        "사회정책: 결혼평등, LGBTQ 권리, 빅토리아 유아교육 확대를 지지했습니다.",
        "에너지와 기후: 빅토리아 배출 감축 목표를 지지하고 State Electricity Commission 부활을 추진했습니다."
      ],
      vi: [
        "Dịch vụ công: thúc đẩy các dự án lớn về hạ tầng, tái thiết nhà ở và giao thông, nhưng chi phí, quản trị và ảnh hưởng công đoàn vẫn bị soi xét.",
        "Chính sách xã hội: ủng hộ hôn nhân bình đẳng, quyền LGBTQ và mở rộng giáo dục mầm non ở Victoria.",
        "Năng lượng và khí hậu: ủng hộ mục tiêu giảm phát thải của Victoria và thúc đẩy khôi phục State Electricity Commission."
      ],
      th: [
        "บริการสาธารณะ: ผลักดันโครงสร้างพื้นฐาน ที่อยู่อาศัย และคมนาคมขนาดใหญ่ แต่ต้นทุน ธรรมาภิบาล และอิทธิพลสหภาพยังถูกตรวจสอบหนัก",
        "นโยบายสังคม: สนับสนุนสมรสเท่าเทียม สิทธิ LGBTQ และการขยายการศึกษาปฐมวัยในวิกตอเรีย",
        "พลังงานและภูมิอากาศ: สนับสนุนเป้าหมายลดการปล่อยของวิกตอเรีย และผลักดันการฟื้น State Electricity Commission"
      ],
      si: [
        "Public services: major infrastructure, housing-renewal සහ transport projects තල්ලු කළ නමුත් cost, governance සහ union influence දැඩි පරීක්ෂාවට ලක්වේ.",
        "Social policy: marriage equality, LGBTQ rights සහ Victoria early-childhood education expansion සඳහා සහාය දුන්නේය.",
        "Energy and climate: Victoria emissions targets සඳහා සහාය දී State Electricity Commission නැවත ශක්තිමත් කිරීම තල්ලු කළේය."
      ]
    }
  },
  {
    name: "Peter Marshall",
    aliases: ["Peter Marshall", "Peter James Marshall", "Peter Marshall UFU", "彼得·马歇尔", "彼得·馬歇爾", "ピーター・マーシャル", "피터 마셜"],
    type: "union leader",
    profile: { label: "UFU Victoria profile", url: "https://ufuvic.asn.au/national-secretary-peter-marshall/" },
    officialProfile: { label: "Victorian Parliament evidence", url: "https://www.parliament.vic.gov.au/contentassets/d7f78e3e642a420d8fba3f6631ca56e4/united_firefighters_union_victorian_branch_transcript.pdf" },
    background: {
      "zh-Hans": "United Firefighters Union of Australia 维州分会和全国秘书，长期代表职业消防员参与工资、工会和消防服务改革争议。",
      "zh-Hant": "United Firefighters Union of Australia 維州分會和全國秘書，長期代表職業消防員參與薪酬、工會和消防服務改革爭議。",
      en: "Victorian branch and national secretary of the United Firefighters Union of Australia, long involved in firefighter pay, union and fire-service reform disputes.",
      es: "Secretario nacional y de la rama victoriana del United Firefighters Union of Australia, vinculado durante años a disputas sobre salarios, sindicatos y reforma de bomberos.",
      ja: "United Firefighters Union of Australia のビクトリア支部・全国書記。消防士の賃金、労組、消防サービス改革をめぐる争点に長く関わっています。",
      ko: "United Firefighters Union of Australia의 빅토리아 지부 및 전국 서기로, 소방관 임금, 노조, 소방 서비스 개혁 논쟁에 오래 관여해 왔습니다.",
      vi: "Thư ký toàn quốc và chi nhánh Victoria của United Firefighters Union of Australia, lâu nay tham gia các tranh chấp về lương, công đoàn và cải cách dịch vụ cứu hỏa.",
      th: "เลขาธิการระดับประเทศและสาขาวิกตอเรียของ United Firefighters Union of Australia มีบทบาทยาวนานในข้อพิพาทเรื่องค่าจ้าง สหภาพ และการปฏิรูประบบดับเพลิง",
      si: "United Firefighters Union of Australia හි Victorian branch සහ national secretary වේ; firefighter pay, union සහ fire-service reform disputes වල දිගුකාලීනව සම්බන්ධ වී ඇත."
    }
  },
  {
    name: "Tom Dearden",
    aliases: ["Tom Dearden", "Thomas Dearden", "Tommy Dearden", "汤姆·迪尔登", "湯姆·迪爾登", "トム・ディアデン", "톰 디어던", "ทอม ดีอาร์เดน"],
    type: "athlete",
    profile: { label: "Cowboys profile", url: "https://www.cowboys.com.au/teams/nrl-premiership/north-queensland-cowboys/tom-dearden/" },
    background: {
      "zh-Hans": "North Queensland Cowboys 的 NRL 半卫和共同队长，也代表 Queensland State of Origin 与澳大利亚队出战。",
      "zh-Hant": "North Queensland Cowboys 的 NRL 半衛和共同隊長，也代表 Queensland State of Origin 與澳洲隊出戰。",
      en: "North Queensland Cowboys NRL half and co-captain who has also represented Queensland in State of Origin and Australia internationally.",
      es: "Medio y cocapitán de North Queensland Cowboys en la NRL; también ha representado a Queensland en State of Origin y a Australia.",
      ja: "North Queensland Cowboys の NRL ハーフで共同主将。Queensland の State of Origin とオーストラリア代表でもプレーしています。",
      ko: "North Queensland Cowboys의 NRL 하프이자 공동 주장으로 Queensland State of Origin과 호주 대표팀에서도 뛰었습니다.",
      vi: "Halfback và đồng đội trưởng NRL của North Queensland Cowboys, từng đại diện Queensland ở State of Origin và đội tuyển Australia.",
      th: "ฮาล์ฟและกัปตันร่วมของ North Queensland Cowboys ใน NRL เคยเล่นให้ Queensland ใน State of Origin และทีมชาติออสเตรเลีย",
      si: "North Queensland Cowboys NRL half සහ co-captain කෙනෙකි; Queensland State of Origin සහ Australia ජාතික කණ්ඩායමද නියෝජනය කර ඇත."
    }
  },
  {
    name: "Todd Payten",
    aliases: ["Todd Payten", "Todd Owen Payten", "托德·佩顿", "トッド・ペイトン", "토드 페이튼"],
    type: "athlete",
    profile: { label: "Cowboys profile", url: "https://www.cowboys.com.au/teams/nrl-premiership/north-queensland-cowboys/todd-payten/" },
    background: {
      "zh-Hans": "North Queensland Cowboys 的 NRL 主教练，曾是职业橄榄球联盟球员，并参与 Cowboys 2015 年首个总冠军赛季的教练团队。",
      "zh-Hant": "North Queensland Cowboys 的 NRL 主教練，曾是職業橄欖球聯盟球員，並參與 Cowboys 2015 年首個總冠軍賽季的教練團隊。",
      en: "Head coach of the North Queensland Cowboys and a former professional rugby league player; he was part of the Cowboys coaching staff for their 2015 premiership.",
      es: "Entrenador principal de North Queensland Cowboys y exjugador profesional de rugby league; integró el cuerpo técnico del club en el título de 2015.",
      ja: "North Queensland Cowboys のヘッドコーチで元プロラグビーリーグ選手。2015年の同クラブ初優勝時にコーチングスタッフを務めました。",
      ko: "North Queensland Cowboys의 감독이자 전 프로 럭비리그 선수입니다. 2015년 Cowboys의 첫 우승 당시 코칭스태프였습니다.",
      vi: "Huấn luyện viên trưởng North Queensland Cowboys và cựu cầu thủ rugby league chuyên nghiệp; ông thuộc ban huấn luyện khi Cowboys vô địch năm 2015.",
      th: "หัวหน้าโค้ช North Queensland Cowboys และอดีตผู้เล่น rugby league อาชีพ เคยอยู่ในสตาฟฟ์โค้ชตอนสโมสรได้แชมป์ปี 2015",
      si: "North Queensland Cowboys head coach සහ හිටපු professional rugby league player කෙනෙකි; 2015 premiership ජයග්‍රහණයේදී Cowboys coaching staff හි සිටියේය."
    }
  },
  {
    name: "Luke Trainor",
    aliases: ["Luke Trainor", "卢克·特雷纳", "路克·特雷納", "ルーク・トレイナー", "루크 트레이너"],
    type: "athlete",
    profile: { label: "Richmond profile", url: "https://www.richmondfc.com.au/players/9376/luke-trainor" },
    background: {
      "zh-Hans": "Richmond Football Club 的 AFL 后卫，2024 年选秀首轮被选中，进入一线队后被视为俱乐部重点培养的新秀。",
      "zh-Hant": "Richmond Football Club 的 AFL 後衛，2024 年選秀首輪被選中，進入一線隊後被視為俱樂部重點培養的新秀。",
      en: "Richmond Football Club AFL defender, selected in the first round of the 2024 draft and regarded by the club as a developing young player.",
      es: "Defensor de Richmond Football Club en la AFL, elegido en la primera ronda del draft de 2024 y visto por el club como un joven en desarrollo.",
      ja: "Richmond Football Club の AFL ディフェンダー。2024年ドラフト1巡目で指名され、クラブの若手有望選手とされています。",
      ko: "Richmond Football Club의 AFL 수비수로 2024년 드래프트 1라운드 지명을 받았고 구단의 유망주로 평가됩니다.",
      vi: "Hậu vệ AFL của Richmond Football Club, được chọn ở vòng một draft 2024 và được CLB xem là cầu thủ trẻ đang phát triển.",
      th: "กองหลัง AFL ของ Richmond Football Club ถูกเลือกในรอบแรกของดราฟต์ปี 2024 และถูกมองว่าเป็นผู้เล่นดาวรุ่งของสโมสร",
      si: "Richmond Football Club AFL defender කෙනෙකි; 2024 draft පළමු වටයේ තෝරාගත් අතර club එක ඔහු young developing player කෙනෙකු ලෙස සලකයි."
    }
  },
  {
    name: "Jack Williams",
    aliases: ["Jack Williams", "杰克·威廉姆斯", "傑克·威廉斯", "ジャック・ウィリアムズ", "잭 윌리엄스"],
    type: "athlete",
    profile: { label: "West Coast Eagles profile", url: "https://www.westcoasteagles.com.au/players/5700/jack-williams" },
    background: {
      "zh-Hans": "West Coast Eagles 的 AFL 前锋和二线 ruck 选择，2021 年选秀加入球队，来自 East Fremantle 青训体系。",
      "zh-Hant": "West Coast Eagles 的 AFL 前鋒和二線 ruck 選擇，2021 年選秀加入球隊，來自 East Fremantle 青訓體系。",
      en: "West Coast Eagles AFL key forward and ruck option, drafted in 2021 after coming through East Fremantle.",
      es: "Delantero alto y opción de ruck de West Coast Eagles en la AFL, drafteado en 2021 tras formarse en East Fremantle.",
      ja: "West Coast Eagles の AFL キーフォワード兼ラック候補。East Fremantle を経て2021年ドラフトで加入しました。",
      ko: "West Coast Eagles의 AFL 키 포워드이자 러크 옵션으로 East Fremantle을 거쳐 2021년 드래프트에서 지명됐습니다.",
      vi: "Key forward và phương án ruck của West Coast Eagles ở AFL, được draft năm 2021 sau khi trưởng thành từ East Fremantle.",
      th: "คีย์ฟอร์เวิร์ดและตัวเลือก ruck ของ West Coast Eagles ใน AFL ถูกดราฟต์ปี 2021 หลังผ่านระบบ East Fremantle",
      si: "West Coast Eagles AFL key forward සහ ruck option කෙනෙකි; East Fremantle හරහා පැමිණ 2021 draft එකෙන් තෝරාගත්තේය."
    }
  },
  {
    name: "Adem Yze",
    aliases: ["Adem Yze", "阿德姆·伊泽", "阿德姆·伊澤", "アデム・イーズ", "아뎀 이즈"],
    type: "athlete",
    profile: { label: "Richmond coach profile", url: "https://www.richmondfc.com.au/football/afl/coaches/ademyze" },
    background: {
      "zh-Hans": "Richmond Football Club 的 AFL 主教练，曾长期效力 Melbourne Football Club，退役后在 Hawthorn、Melbourne 和 Richmond 任教练。",
      "zh-Hant": "Richmond Football Club 的 AFL 主教練，曾長期效力 Melbourne Football Club，退役後在 Hawthorn、Melbourne 和 Richmond 任教練。",
      en: "Richmond Football Club AFL senior coach and former Melbourne player, with coaching roles at Hawthorn, Melbourne and Richmond after his playing career.",
      es: "Entrenador principal de Richmond Football Club en la AFL y exjugador de Melbourne, con etapas técnicas en Hawthorn, Melbourne y Richmond.",
      ja: "Richmond Football Club の AFL シニアコーチで元 Melbourne 選手。引退後は Hawthorn、Melbourne、Richmond でコーチを務めています。",
      ko: "Richmond Football Club의 AFL 감독이자 전 Melbourne 선수로, 선수 은퇴 후 Hawthorn, Melbourne, Richmond에서 코치로 일했습니다.",
      vi: "Huấn luyện viên trưởng AFL của Richmond Football Club và cựu cầu thủ Melbourne, từng làm HLV tại Hawthorn, Melbourne và Richmond.",
      th: "หัวหน้าโค้ช AFL ของ Richmond Football Club และอดีตผู้เล่น Melbourne หลังเลิกเล่นเคยเป็นโค้ชกับ Hawthorn, Melbourne และ Richmond",
      si: "Richmond Football Club AFL senior coach සහ හිටපු Melbourne player කෙනෙකි; playing career එකෙන් පසු Hawthorn, Melbourne සහ Richmond හි coaching roles දැරීය."
    }
  },
  {
    name: "Bakamumu Marika",
    aliases: ["Bakamumu Marika", "Bakamumu Marika AM", "Mr B Yunupingu", "B Yunupingu", "巴卡穆穆·马里卡", "巴卡穆穆·馬里卡", "バカムム・マリカ", "바카무무 마리카"],
    type: "public-figure",
    profile: { label: "Australian of the Year profile", url: "https://australianoftheyear.org.au/recipients/m-marika-memoriam" },
    officialProfile: { label: "Rirratjingu profile", url: "https://rirratjingu.com/about-us/native-title/" },
    background: {
      "zh-Hans": "Rirratjingu 氏族长者和东北 Arnhem Land 社区领袖，曾长期担任 Rirratjingu Aboriginal Corporation 主席和后来的 patron，并因土地权利、社区发展和文化领导获得认可。",
      "zh-Hant": "Rirratjingu 氏族長者和東北 Arnhem Land 社區領袖，曾長期擔任 Rirratjingu Aboriginal Corporation 主席和後來的 patron，並因土地權利、社區發展和文化領導獲得認可。",
      en: "Rirratjingu elder and north-east Arnhem Land community leader. He was a long-serving chair and later patron of Rirratjingu Aboriginal Corporation, recognised for land-rights advocacy, community development and cultural leadership.",
      es: "Anciano Rirratjingu y líder comunitario del noreste de Arnhem Land. Fue durante años presidente y luego patron de Rirratjingu Aboriginal Corporation, reconocido por defensa de derechos sobre la tierra, desarrollo comunitario y liderazgo cultural.",
      ja: "Rirratjingu の長老で、北東 Arnhem Land のコミュニティ指導者。Rirratjingu Aboriginal Corporation の長年の会長、後に patron を務め、土地権利、地域開発、文化的リーダーシップで知られました。",
      ko: "Rirratjingu 원로이자 북동부 Arnhem Land 지역사회 지도자입니다. Rirratjingu Aboriginal Corporation의 장기 의장과 이후 patron을 지냈으며 토지권 옹호, 지역사회 개발, 문화 리더십으로 인정받았습니다.",
      vi: "Trưởng lão Rirratjingu và lãnh đạo cộng đồng vùng đông bắc Arnhem Land. Ông từng nhiều năm là chủ tịch rồi patron của Rirratjingu Aboriginal Corporation, được ghi nhận về vận động quyền đất đai, phát triển cộng đồng và lãnh đạo văn hóa.",
      th: "ผู้อาวุโส Rirratjingu และผู้นำชุมชนใน north-east Arnhem Land เคยเป็นประธานระยะยาวและต่อมาเป็น patron ของ Rirratjingu Aboriginal Corporation ได้รับการยอมรับจากงานสิทธิในที่ดิน การพัฒนาชุมชน และผู้นำทางวัฒนธรรม",
      si: "Rirratjingu elder සහ north-east Arnhem Land community leader කෙනෙකි. Rirratjingu Aboriginal Corporation හි දිගුකාලීන chair සහ පසුව patron වූ ඔහු land-rights advocacy, community development සහ cultural leadership සඳහා පිළිගැනීම ලැබීය."
    }
  },
  {
    name: "Thomas Bradley",
    aliases: ["Thomas Bradley", "Justice Thomas Bradley", "The Honourable Justice Thomas Bradley", "Thomas Bradley JA", "托马斯·布拉德利", "湯瑪斯·布拉德利", "トーマス・ブラッドリー", "토머스 브래들리"],
    type: "public-figure",
    profile: { label: "Supreme Court Library profile", url: "https://www.sclqld.org.au/collections/explore-the-law/judicial-profiles/bradley-196815" },
    officialProfile: { label: "Queensland Courts listing", url: "https://www.courts.qld.gov.au/the-courts/supreme-court/judges-of-the-supreme-court" },
    background: {
      "zh-Hans": "昆士兰州上诉法院法官，2018 年任昆士兰最高法院法官，2025 年升任上诉法院，并获任命为昆士兰第 28 任总督，计划于 2026 年 11 月就职。",
      "zh-Hant": "昆士蘭州上訴法院法官，2018 年任昆士蘭最高法院法官，2025 年升任上訴法院，並獲任命為昆士蘭第 28 任總督，計劃於 2026 年 11 月就職。",
      en: "Queensland Court of Appeal judge, appointed to the Supreme Court of Queensland in 2018 and the Court of Appeal in 2025, named as Queensland's 28th governor from November 2026.",
      es: "Juez del Court of Appeal de Queensland, nombrado al Supreme Court of Queensland en 2018 y al Court of Appeal en 2025; designado 28.º gobernador de Queensland desde noviembre de 2026.",
      ja: "Queensland Court of Appeal の判事。2018年に Supreme Court of Queensland 判事、2025年に控訴院判事となり、2026年11月から第28代 Queensland governor に任命されました。",
      ko: "퀸즐랜드 Court of Appeal 판사입니다. 2018년 Supreme Court of Queensland 판사, 2025년 Court of Appeal 판사로 임명됐고 2026년 11월부터 퀸즐랜드 제28대 주지사로 지명됐습니다.",
      vi: "Thẩm phán Court of Appeal Queensland, được bổ nhiệm vào Supreme Court of Queensland năm 2018 và Court of Appeal năm 2025; được chọn làm thống đốc Queensland thứ 28 từ tháng 11 năm 2026.",
      th: "ผู้พิพากษา Queensland Court of Appeal ได้รับแต่งตั้งเป็นผู้พิพากษา Supreme Court of Queensland ในปี 2018 และ Court of Appeal ในปี 2025 ก่อนถูกเสนอชื่อเป็น Governor of Queensland คนที่ 28 ตั้งแต่พฤศจิกายน 2026",
      si: "Queensland Court of Appeal judge කෙනෙකි; 2018 දී Supreme Court of Queensland වෙතත් 2025 දී Court of Appeal වෙතත් පත් වූ අතර 2026 නොවැම්බර් සිට Queensland හි 28 වැනි governor ලෙස නම් කර ඇත."
    }
  },
  {
    name: "Jeannette Young",
    aliases: ["Jeannette Young", "Dr Jeannette Young", "Dr Jeannette Young AC PSM", "Jeannette Rosita Young", "珍妮特·杨", "珍妮特·楊", "ジャネット・ヤング", "지넷 영"],
    type: "public-figure",
    profile: { label: "Government House biography", url: "https://www.govhouse.qld.gov.au/the-governor-of-queensland/about-the-governor/the-governor-s-biography" },
    officialProfile: { label: "Government House role profile", url: "https://www.govhouse.qld.gov.au/the-governor-of-queensland/about-the-governor/role-of-the-governor" },
    background: {
      "zh-Hans": "澳大利亚医生和公共行政人员，2005 至 2021 年任昆士兰首席卫生官，2021 年起任昆士兰第 27 任总督。",
      "zh-Hant": "澳洲醫生和公共行政人員，2005 至 2021 年任昆士蘭首席衛生官，2021 年起任昆士蘭第 27 任總督。",
      en: "Australian doctor and public administrator, Queensland Chief Health Officer from 2005 to 2021 and Queensland's 27th governor from 2021.",
      es: "Médica y administradora pública australiana, Chief Health Officer de Queensland entre 2005 y 2021 y 27.ª gobernadora de Queensland desde 2021.",
      ja: "オーストラリアの医師・行政官。2005年から2021年まで Queensland Chief Health Officer、2021年から第27代 Queensland governor を務めています。",
      ko: "호주의 의사이자 공공 행정가입니다. 2005년부터 2021년까지 Queensland Chief Health Officer를 지냈고 2021년부터 퀸즐랜드 제27대 주지사를 맡고 있습니다.",
      vi: "Bác sĩ và nhà quản lý công của Australia, Queensland Chief Health Officer từ 2005 đến 2021 và thống đốc Queensland thứ 27 từ năm 2021.",
      th: "แพทย์และผู้บริหารภาครัฐของออสเตรเลีย เป็น Queensland Chief Health Officer ระหว่างปี 2005-2021 และ Governor of Queensland คนที่ 27 ตั้งแต่ปี 2021",
      si: "Australian doctor සහ public administrator කෙනෙකි; 2005 සිට 2021 දක්වා Queensland Chief Health Officer වූ අතර 2021 සිට Queensland හි 27 වැනි governor ලෙස සේවය කරයි."
    }
  },
  {
    name: "Ryan Barrowei",
    aliases: ["Ryan Barrowei", "Mr Ryan Barrowei", "Ryan Barrowei Kakadu", "瑞安·巴罗韦", "瑞安·巴羅韋", "ライアン・バロウェイ", "라이언 배로웨이", "රයන් බැරොවෙයි"],
    type: "public-figure",
    profile: { label: "Australian Government Directory", url: "https://www.directory.gov.au/portfolios/climate-change-energy-environment-and-water/director-national-parks/kakadu-board-management/chair" },
    officialProfile: { label: "Director of National Parks annual report", url: "https://www.dcceew.gov.au/sites/default/files/documents/dnp-annual-report-2024-25.pdf" },
    background: {
      "zh-Hans": "Kakadu National Park Board of Management 主席、Jawoyn 传统所有者提名成员，来自 Kakadu 南部 Wurrkbarbar 氏族，并曾参与 Nitmiluk National Park Board of Management。",
      "zh-Hant": "Kakadu National Park Board of Management 主席、Jawoyn 傳統所有者提名成員，來自 Kakadu 南部 Wurrkbarbar 氏族，並曾參與 Nitmiluk National Park Board of Management。",
      en: "Chair of the Kakadu National Park Board of Management and a Jawoyn traditional-owner nominee from the Wurrkbarbar clan group in southern Kakadu; he has also served on the Nitmiluk National Park Board of Management.",
      es: "Presidente del Kakadu National Park Board of Management y nominado como Traditional Owner Jawoyn del grupo Wurrkbarbar en el sur de Kakadu; también ha integrado el Nitmiluk National Park Board of Management.",
      ja: "Kakadu National Park Board of Management の議長で、Kakadu 南部の Wurrkbarbar クラン出身の Jawoyn traditional-owner nominee。Nitmiluk National Park Board of Management にも関わってきました。",
      ko: "Kakadu National Park Board of Management 의장으로, 남부 Kakadu의 Wurrkbarbar 클랜 출신 Jawoyn 전통 소유자 지명 위원입니다. Nitmiluk National Park Board of Management에서도 활동했습니다.",
      vi: "Chủ tịch Kakadu National Park Board of Management và là đại diện Traditional Owner Jawoyn từ nhóm Wurrkbarbar ở nam Kakadu; ông cũng từng tham gia Nitmiluk National Park Board of Management.",
      th: "ประธาน Kakadu National Park Board of Management และผู้แทน Traditional Owner ของ Jawoyn จากกลุ่ม Wurrkbarbar ทางตอนใต้ของ Kakadu และเคยทำงานกับ Nitmiluk National Park Board of Management",
      si: "Kakadu National Park Board of Management chair සහ southern Kakadu හි Wurrkbarbar clan group එකෙන් Jawoyn traditional-owner nominee කෙනෙකි; Nitmiluk National Park Board of Management හිද සේවය කර ඇත."
    }
  },
  {
    name: "Simon Judkins",
    aliases: ["Simon Judkins", "Dr Simon Judkins", "Dr Simon Judkins MBBS FACEM", "西蒙·贾德金斯", "西蒙·賈德金斯", "サイモン・ジャドキンズ", "사이먼 저드킨스"],
    type: "public-figure",
    profile: { label: "AMA Victoria profile", url: "https://amavic.com.au/about-us/our-people" },
    social: { label: "LinkedIn", url: "https://au.linkedin.com/in/simon-judkins-a8381149" },
    background: {
      "zh-Hans": "AMA Victoria 主席、急诊科医生，曾任 Australasian College for Emergency Medicine 主席，并长期参与维州公立医院医生劳资和医疗系统改革议题。",
      "zh-Hant": "AMA Victoria 主席、急診科醫生，曾任 Australasian College for Emergency Medicine 主席，並長期參與維州公立醫院醫生勞資和醫療系統改革議題。",
      en: "President of AMA Victoria and an emergency physician. He is a former president of the Australasian College for Emergency Medicine and a public advocate on Victorian hospital workforce and health-system reform issues.",
      es: "Presidente de AMA Victoria y médico de urgencias. Fue presidente del Australasian College for Emergency Medicine y es una voz pública sobre la fuerza laboral hospitalaria y la reforma sanitaria en Victoria.",
      ja: "AMA Victoria の会長で救急医。Australasian College for Emergency Medicine の元会長で、Victoria 州の病院人員体制と医療制度改革について発信しています。",
      ko: "AMA Victoria 회장이자 응급의학 전문의입니다. Australasian College for Emergency Medicine 전 회장으로, Victoria 공공병원 인력과 보건의료 제도 개혁 문제를 공개적으로 제기해 왔습니다.",
      vi: "Chủ tịch AMA Victoria và bác sĩ cấp cứu. Ông từng là chủ tịch Australasian College for Emergency Medicine và thường lên tiếng về nhân lực bệnh viện cùng cải cách hệ thống y tế Victoria.",
      th: "ประธาน AMA Victoria และแพทย์ฉุกเฉิน อดีตประธาน Australasian College for Emergency Medicine และเป็นผู้ผลักดันประเด็นบุคลากรโรงพยาบาลกับการปฏิรูประบบสาธารณสุขใน Victoria",
      si: "AMA Victoria president සහ emergency physician කෙනෙකි. Australasian College for Emergency Medicine හි හිටපු president වන ඔහු Victoria රෝහල් workforce සහ health-system reform ගැන public advocate කෙනෙකි."
    }
  },
  {
    name: "Jon Adgemis",
    aliases: ["Jon Adgemis", "John Adgemis", "Jonathon Adgemis", "乔恩·阿杰米斯", "喬恩·阿傑米斯", "ジョン・アジェミス", "존 애드제미스"],
    type: "executive",
    profile: { label: "DevelopmentReady interview", url: "https://www.developmentready.com.au/content-hub/video/jon-adgemis-interview" },
    background: {
      "zh-Hans": "澳大利亚地产和酒店业投资人，曾任 KPMG 高级并购顾问，后来创办 The Jaga Group，并因 Public Hospitality Group 债务崩盘成为私募信贷风险报道中的核心人物。",
      "zh-Hant": "澳洲地產和酒店業投資人，曾任 KPMG 高階併購顧問，後來創辦 The Jaga Group，並因 Public Hospitality Group 債務崩盤成為私募信貸風險報導中的核心人物。",
      en: "Australian property and hospitality investor, former senior KPMG M&A adviser and founder of The Jaga Group, whose Public Hospitality Group debt collapse has become a focal case in private-credit risk reporting.",
      es: "Inversionista australiano en inmobiliario y hotelería, exasesor sénior de fusiones y adquisiciones en KPMG y fundador de The Jaga Group; el colapso de deuda de Public Hospitality Group lo convirtió en caso central sobre riesgos del crédito privado.",
      ja: "オーストラリアの不動産・ホスピタリティ投資家。元 KPMG の上級 M&A アドバイザーで The Jaga Group 創業者。Public Hospitality Group の債務崩壊により、民間信用リスク報道の中心事例となっています。",
      ko: "호주의 부동산 및 호스피탈리티 투자자입니다. 전 KPMG 선임 M&A 자문역이자 The Jaga Group 창업자로, Public Hospitality Group 부채 붕괴가 사모 신용 리스크 보도의 핵심 사례가 됐습니다.",
      vi: "Nhà đầu tư bất động sản và hospitality tại Australia, cựu cố vấn M&A cấp cao của KPMG và nhà sáng lập The Jaga Group; vụ sụp đổ nợ của Public Hospitality Group trở thành trường hợp trung tâm trong các bài viết về rủi ro private credit.",
      th: "นักลงทุนอสังหาริมทรัพย์และ hospitality ของออสเตรเลีย อดีตที่ปรึกษา M&A อาวุโสของ KPMG และผู้ก่อตั้ง The Jaga Group โดยวิกฤตหนี้ของ Public Hospitality Group กลายเป็นกรณีสำคัญในข่าวความเสี่ยง private credit",
      si: "Australian property සහ hospitality investor කෙනෙකි; හිටපු senior KPMG M&A adviser සහ The Jaga Group founder වන අතර Public Hospitality Group ණය කඩා වැටීම private-credit risk reporting හි ප්‍රධාන සිද්ධියක් විය."
    }
  },
  {
    name: "David Crisafulli",
    aliases: ["David Crisafulli", "David Frank Crisafulli", "David Crisafulli MP", "戴维·克里萨富利", "大衛·克里薩富利", "デイビッド・クリサフリ", "데이비드 크리사풀리"],
    type: "politician",
    profile: { label: "Premier biography", url: "https://www.thepremier.qld.gov.au/about.aspx" },
    social: { label: "Facebook", url: "https://www.facebook.com/DavidCrisafulliMP/" },
    background: {
      "zh-Hans": "昆士兰自由国家党政治人物，Broadwater 选区州议员，2024 年起任昆士兰州长，并担任昆士兰 LNP 领袖。",
      "zh-Hant": "昆士蘭自由國家黨政治人物，Broadwater 選區州議員，2024 年起任昆士蘭州長，並擔任昆士蘭 LNP 領袖。",
      en: "Queensland Liberal National Party politician, MP for Broadwater, Premier of Queensland since 2024 and leader of the Queensland LNP.",
      es: "Político del Liberal National Party de Queensland, diputado por Broadwater, premier de Queensland desde 2024 y líder del LNP estatal.",
      ja: "クイーンズランド州 Liberal National Party の政治家で、Broadwater 選出の州議員。2024年から同州首相、Queensland LNP 党首です。",
      ko: "퀸즐랜드 Liberal National Party 정치인으로 Broadwater 지역구 의원이며 2024년부터 퀸즐랜드 주총리와 Queensland LNP 대표를 맡고 있습니다.",
      vi: "Chính trị gia Liberal National Party tại Queensland, nghị sĩ bang khu Broadwater, Premier of Queensland từ năm 2024 và lãnh đạo Queensland LNP.",
      th: "นักการเมือง Liberal National Party ของรัฐควีนส์แลนด์ ส.ส. รัฐเขต Broadwater เป็น Premier of Queensland ตั้งแต่ปี 2024 และผู้นำ Queensland LNP",
      si: "Queensland Liberal National Party දේශපාලනඥයෙකු වන David Crisafulli, Broadwater MP, 2024 සිට Premier of Queensland සහ Queensland LNP නායකයා වේ."
    },
    positions: {
      "zh-Hans": "其州长任期重点包括青年犯罪、州预算、住房、基础设施和 2032 年布里斯班奥运场馆规划；Victoria Park 方案是其政府的核心奥运遗产项目之一。",
      "zh-Hant": "其州長任期重點包括青年犯罪、州預算、住房、基礎設施和 2032 年布里斯本奧運場館規劃；Victoria Park 方案是其政府的核心奧運遺產項目之一。",
      en: "His premiership is tied to youth crime, the state budget, housing, infrastructure and Brisbane 2032 venue planning; the Victoria Park plan is one of his government's central Olympic legacy projects.",
      es: "Su gobierno se vincula con delincuencia juvenil, presupuesto estatal, vivienda, infraestructura y planificación de sedes para Brisbane 2032; Victoria Park es uno de sus proyectos centrales de legado olímpico.",
      ja: "青少年犯罪、州予算、住宅、インフラ、Brisbane 2032 の会場計画が主要課題で、Victoria Park 案は政権の中心的な五輪レガシー事業の一つです。",
      ko: "청소년 범죄, 주 예산, 주택, 인프라, Brisbane 2032 경기장 계획이 핵심 의제이며 Victoria Park 계획은 정부의 주요 올림픽 유산 사업 중 하나입니다.",
      vi: "Trọng tâm nhiệm kỳ gồm tội phạm thanh thiếu niên, ngân sách bang, nhà ở, hạ tầng và quy hoạch địa điểm Brisbane 2032; Victoria Park là một dự án di sản Olympic trung tâm của chính phủ ông.",
      th: "วาระของเขาเน้น youth crime งบประมาณรัฐ ที่อยู่อาศัย โครงสร้างพื้นฐาน และแผนสถานที่ Brisbane 2032 โดย Victoria Park เป็นหนึ่งในโครงการ Olympic legacy หลักของรัฐบาล",
      si: "ඔහුගේ premiership එක youth crime, state budget, housing, infrastructure සහ Brisbane 2032 venue planning සමඟ බැඳී ඇති අතර Victoria Park plan එක ඔහුගේ රජයේ ප්‍රධාන Olympic legacy project එකකි."
    }
  },
  {
    name: "Jarrod Bleijie",
    aliases: ["Jarrod Bleijie", "Jarrod Pieter Bleijie", "Jarrod Bleijie MP", "贾罗德·布莱吉", "賈羅德·布萊吉", "ジャロッド・ブレイジー", "재러드 블레이기"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.qld.gov.au/Members/Current-Members/Member-List/Member-Details?id=555711897" },
    social: { label: "Facebook", url: "https://www.facebook.com/jarrod.bleijie/" },
    background: {
      "zh-Hans": "昆士兰自由国家党政治人物，Kawana 选区州议员，2024 年起任昆士兰副州长，并负责州发展、基础设施、规划和劳资关系。",
      "zh-Hant": "昆士蘭自由國家黨政治人物，Kawana 選區州議員，2024 年起任昆士蘭副州長，並負責州發展、基礎設施、規劃和勞資關係。",
      en: "Queensland Liberal National Party politician, MP for Kawana, Deputy Premier of Queensland since 2024, with state development, infrastructure, planning and industrial relations portfolios.",
      es: "Político del Liberal National Party de Queensland, diputado por Kawana y vicepremier de Queensland desde 2024, con carteras de desarrollo estatal, infraestructura, planificación y relaciones laborales.",
      ja: "クイーンズランド州 Liberal National Party の政治家で、Kawana 選出の州議員。2024年から副州首相を務め、州開発、インフラ、計画、労使関係を担当しています。",
      ko: "퀸즐랜드 Liberal National Party 정치인으로 Kawana 지역구 의원이며 2024년부터 퀸즐랜드 부총리로 주 개발, 인프라, 계획, 노사관계를 담당합니다.",
      vi: "Chính trị gia Liberal National Party tại Queensland, nghị sĩ bang khu Kawana, Deputy Premier of Queensland từ năm 2024, phụ trách phát triển bang, hạ tầng, quy hoạch và quan hệ lao động.",
      th: "นักการเมือง Liberal National Party ของรัฐควีนส์แลนด์ ส.ส. รัฐเขต Kawana เป็น Deputy Premier of Queensland ตั้งแต่ปี 2024 ดูแล state development, infrastructure, planning และ industrial relations",
      si: "Queensland Liberal National Party දේශපාලනඥයෙකු වන Jarrod Bleijie, Kawana MP, 2024 සිට Deputy Premier of Queensland වන අතර state development, infrastructure, planning සහ industrial relations portfolios දරයි."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖大型基础设施、规划审批、产业发展和劳资关系；在 Victoria Park 奥运场馆和公众咨询上代表州政府发布方案。",
      "zh-Hant": "其公共職責覆蓋大型基礎設施、規劃審批、產業發展和勞資關係；在 Victoria Park 奧運場館和公眾諮詢上代表州政府發布方案。",
      en: "His public role covers major infrastructure, planning approvals, industry development and industrial relations; he presents the government's Victoria Park venue plan and consultation process.",
      es: "Su función pública cubre grandes infraestructuras, aprobaciones de planificación, desarrollo industrial y relaciones laborales; presenta el plan y la consulta del gobierno para Victoria Park.",
      ja: "大型インフラ、計画承認、産業開発、労使関係を担当し、Victoria Park 会場計画と住民協議では州政府側の説明役です。",
      ko: "대형 인프라, 계획 승인, 산업 개발, 노사관계를 담당하며 Victoria Park 경기장 계획과 공공 협의 절차를 정부 입장에서 설명합니다.",
      vi: "Vai trò công của ông bao gồm hạ tầng lớn, phê duyệt quy hoạch, phát triển công nghiệp và quan hệ lao động; ông trình bày kế hoạch Victoria Park và quy trình tham vấn của chính phủ.",
      th: "บทบาทสาธารณะครอบคลุมโครงสร้างพื้นฐานขนาดใหญ่ การอนุมัติผังเมือง การพัฒนาอุตสาหกรรม และ industrial relations และเขาเป็นผู้เสนอแผน Victoria Park กับกระบวนการรับฟังความคิดเห็นของรัฐบาล",
      si: "ඔහුගේ public role එක major infrastructure, planning approvals, industry development සහ industrial relations ආවරණය කරයි; Victoria Park venue plan සහ consultation process ගැන රජය වෙනුවෙන් ඉදිරිපත් කරයි."
    }
  },
  {
    name: "Tim Nicholls",
    aliases: ["Tim Nicholls", "Timothy James Nicholls", "Tim Nicholls MP", "蒂姆·尼科尔斯", "蒂姆·尼科爾斯", "ティム・ニコルズ", "팀 니컬스"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.qld.gov.au/Members/Current-Members/Member-List/Member-Details?id=1739578326" },
    officialProfile: { label: "Minister profile", url: "https://cabinet.qld.gov.au/ministers-portfolios/timothy-nicholls.aspx" },
    social: { label: "X", url: "https://x.com/TimNichollsMP" },
    background: {
      "zh-Hans": "昆士兰自由国家党政治人物，Clayfield 选区州议员，曾任昆士兰财长和反对党领袖，2024 年起任昆士兰卫生和救护服务部长。",
      "zh-Hant": "昆士蘭自由國家黨政治人物，Clayfield 選區州議員，曾任昆士蘭財長和反對黨領袖，2024 年起任昆士蘭衛生和救護服務部長。",
      en: "Queensland Liberal National Party politician, MP for Clayfield, former state treasurer and opposition leader, and Minister for Health and Ambulance Services since 2024.",
      es: "Político del Liberal National Party de Queensland, diputado por Clayfield, ex tesorero estatal y exlíder de la oposición; ministro de Salud y Ambulancias desde 2024.",
      ja: "クイーンズランド州 Liberal National Party の政治家で、Clayfield 選出の州議員。元州財務相、元野党党首で、2024年から保健・救急サービス相です。",
      ko: "퀸즐랜드 Liberal National Party 정치인으로 Clayfield 지역구 의원이며 전 주 재무장관과 야당 대표를 지냈고 2024년부터 보건·구급서비스 장관입니다.",
      vi: "Chính trị gia Liberal National Party tại Queensland, nghị sĩ bang khu Clayfield, cựu thủ quỹ bang và lãnh đạo đối lập, Bộ trưởng Health and Ambulance Services từ năm 2024.",
      th: "นักการเมือง Liberal National Party ของรัฐควีนส์แลนด์ ส.ส. รัฐเขต Clayfield อดีตเหรัญญิกรัฐและอดีตผู้นำฝ่ายค้าน เป็น Minister for Health and Ambulance Services ตั้งแต่ปี 2024",
      si: "Queensland Liberal National Party දේශපාලනඥයෙකු වන Tim Nicholls, Clayfield MP, හිටපු state treasurer සහ opposition leader වන අතර 2024 සිට Health and Ambulance Services Minister වේ."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖昆士兰医院、公共卫生、心理健康、救护服务、原住民健康和卫生系统监管；生育护理指引审查属于其卫生组合。",
      "zh-Hant": "其公共職責覆蓋昆士蘭醫院、公共衛生、心理健康、救護服務、原住民健康和衛生系統監管；生育照護指引審查屬於其衛生職權。",
      en: "His public responsibilities cover Queensland hospitals, public health, mental health, ambulance services, First Nations health and health-system regulation; fertility-care guidance sits within his health portfolio.",
      es: "Sus responsabilidades públicas cubren hospitales de Queensland, salud pública, salud mental, ambulancias, salud de First Nations y regulación sanitaria; la guía de fertilidad entra en su cartera.",
      ja: "クイーンズランド州の病院、公衆衛生、メンタルヘルス、救急サービス、First Nations の健康、医療制度規制を所管し、不妊治療指針の見直しも担当分野です。",
      ko: "퀸즐랜드 병원, 공중보건, 정신건강, 구급서비스, First Nations 보건, 보건시스템 규제를 담당하며 난임 치료 지침 검토도 그의 보건 포트폴리오에 속합니다.",
      vi: "Trách nhiệm công của ông bao gồm bệnh viện Queensland, y tế công, sức khỏe tâm thần, xe cứu thương, y tế First Nations và quản lý hệ thống y tế; hướng dẫn chăm sóc sinh sản thuộc danh mục này.",
      th: "หน้าที่สาธารณะครอบคลุมโรงพยาบาลควีนส์แลนด์ สาธารณสุข สุขภาพจิต บริการรถพยาบาล สุขภาพ First Nations และการกำกับระบบสุขภาพ รวมถึงแนวทาง fertility care",
      si: "ඔහුගේ public responsibilities Queensland hospitals, public health, mental health, ambulance services, First Nations health සහ health-system regulation ආවරණය කරයි; fertility-care guidance ඔහුගේ health portfolio එකට අයත් වේ."
    }
  },
  {
    name: "Roger Cook",
    aliases: ["Roger Cook", "Roger Hugh Cook", "Roger Cook MLA", "罗杰·库克", "羅傑·庫克", "ロジャー・クック", "로저 쿡"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.wa.gov.au/Parliament/Memblist.nsf/WAllMembersFlat2/Cook%2C%2BRoger?opendocument=" },
    social: { label: "Facebook", url: "https://www.facebook.com/RogerCookMLA/" },
    background: {
      "zh-Hans": "西澳工党政治人物，Kwinana 选区州议员，2023 年起任西澳州长，并担任西澳工党领袖。",
      "zh-Hant": "西澳工黨政治人物，Kwinana 選區州議員，2023 年起任西澳州長，並擔任西澳工黨領袖。",
      en: "Western Australian Labor politician, MLA for Kwinana, Premier of Western Australia since 2023 and leader of WA Labor.",
      es: "Político laborista de Australia Occidental, diputado estatal por Kwinana, premier de Australia Occidental desde 2023 y líder de WA Labor.",
      ja: "西オーストラリア州労働党の政治家で、Kwinana 選出の州議員。2023年から同州首相、WA Labor 党首です。",
      ko: "서호주 노동당 정치인으로 Kwinana 지역구 주의원이며 2023년부터 서호주 주총리와 WA Labor 대표를 맡고 있습니다.",
      vi: "Chính trị gia Labor tại Tây Australia, nghị sĩ bang khu Kwinana, Premier of Western Australia từ năm 2023 và lãnh đạo WA Labor.",
      th: "นักการเมือง Labor ของรัฐเวสเทิร์นออสเตรเลีย ส.ส. รัฐเขต Kwinana เป็น Premier of Western Australia ตั้งแต่ปี 2023 และผู้นำ WA Labor",
      si: "Western Australian Labor දේශපාලනඥයෙකු වන Roger Cook, Kwinana MLA, 2023 සිට Premier of Western Australia සහ WA Labor නායකයා වේ."
    },
    positions: {
      "zh-Hans": "其州长任期重点包括州经济多元化、就业、贸易投资、公共服务和基础设施；在补选和地方资金宣布上代表工党政府承担政治责任。",
      "zh-Hant": "其州長任期重點包括州經濟多元化、就業、貿易投資、公共服務和基礎設施；在補選和地方資金宣布上代表工黨政府承擔政治責任。",
      en: "His premiership is tied to economic diversification, jobs, trade and investment, public services and infrastructure; he carries government accountability for by-election funding announcements.",
      es: "Su gobierno se centra en diversificación económica, empleo, comercio e inversión, servicios públicos e infraestructura; asume la responsabilidad política por anuncios de fondos en elecciones parciales.",
      ja: "経済多角化、雇用、貿易・投資、公共サービス、インフラを重視し、補選期の資金発表では政府側の説明責任を負います。",
      ko: "경제 다각화, 일자리, 무역과 투자, 공공서비스, 인프라가 핵심이며 보궐선거 자금 발표에 대한 정부 책임을 집니다.",
      vi: "Trọng tâm nhiệm kỳ gồm đa dạng hóa kinh tế, việc làm, thương mại và đầu tư, dịch vụ công và hạ tầng; ông chịu trách nhiệm chính trị về các thông báo ngân sách trong bầu cử bổ sung.",
      th: "วาระของเขาเน้น diversification เศรษฐกิจ งาน การค้าและการลงทุน บริการสาธารณะ และโครงสร้างพื้นฐาน รวมถึงความรับผิดชอบทางการเมืองต่อประกาศงบช่วงเลือกตั้งซ่อม",
      si: "ඔහුගේ premiership එක economic diversification, jobs, trade and investment, public services සහ infrastructure සමඟ බැඳී ඇති අතර by-election funding announcements ගැන රජයේ වගකීම දරයි."
    }
  },
  {
    name: "Georgia Tree",
    aliases: ["Georgia Tree", "Georgia Tree for Secret Harbour", "乔治娅·特里", "喬治婭·特里", "ジョージア・ツリー", "조지아 트리"],
    type: "politician",
    profile: { label: "Campaign profile", url: "https://www.georgiatree.com.au/" },
    social: { label: "Facebook", url: "https://www.facebook.com/georgia4secretharbour/" },
    background: {
      "zh-Hans": "西澳工党 Secret Harbour 补选候选人，公开竞选资料称她来自当地 Warnbro 一带，并代表工党参与该席位补选。",
      "zh-Hant": "西澳工黨 Secret Harbour 補選候選人，公開競選資料稱她來自當地 Warnbro 一帶，並代表工黨參與該席位補選。",
      en: "WA Labor candidate for the Secret Harbour by-election, presented in public campaign material as a local from the Warnbro area.",
      es: "Candidata de WA Labor en la elección parcial de Secret Harbour, presentada en material público de campaña como vecina de la zona de Warnbro.",
      ja: "Secret Harbour 補選の WA Labor 候補。公開された選挙資料では Warnbro 周辺出身の地元候補とされています。",
      ko: "Secret Harbour 보궐선거의 WA Labor 후보로, 공개 선거 자료에서는 Warnbro 지역 출신 현지 후보로 소개됩니다.",
      vi: "Ứng viên WA Labor trong cuộc bầu cử bổ sung Secret Harbour, được giới thiệu trong tài liệu vận động công khai là người địa phương vùng Warnbro.",
      th: "ผู้สมัคร WA Labor ในการเลือกตั้งซ่อม Secret Harbour โดยสื่อหาเสียงสาธารณะระบุว่าเป็นคนท้องถิ่นจากย่าน Warnbro",
      si: "Secret Harbour by-election සඳහා WA Labor candidate කෙනෙකි; public campaign material තුළ Warnbro ප්‍රදේශයේ local candidate ලෙස ඉදිරිපත් කර ඇත."
    },
    positions: {
      "zh-Hans": "补选竞选重点围绕 Secret Harbour 的地方学校、培训设施和社区资金；争议集中在她对政府拨款“争取到”的表述是否越过竞选承诺和公共资金之间的界线。",
      "zh-Hant": "補選競選重點圍繞 Secret Harbour 的地方學校、培訓設施和社區資金；爭議集中在她對政府撥款「爭取到」的表述是否越過競選承諾和公共資金之間的界線。",
      en: "Her campaign is linked to local school, training and community funding promises; scrutiny centres on whether claims of having secured public money blur campaign and government boundaries.",
      es: "Su campaña se vincula con promesas para escuelas, formación y fondos comunitarios locales; el escrutinio se centra en si decir que obtuvo fondos públicos difumina campaña y gobierno.",
      ja: "学校、職業訓練、地域資金の公約と結びつき、公的資金を「確保した」とする表現が選挙運動と政府の境界を曖昧にするかが問われています。",
      ko: "지역 학교, 훈련 시설, 커뮤니티 예산 공약과 연결되며 공공자금을 확보했다는 표현이 선거운동과 정부의 경계를 흐리는지가 쟁점입니다.",
      vi: "Chiến dịch gắn với cam kết ngân sách cho trường học, đào tạo và cộng đồng địa phương; tranh cãi tập trung vào việc tuyên bố đã giành được tiền công có làm mờ ranh giới vận động và chính phủ hay không.",
      th: "แคมเปญเกี่ยวข้องกับคำมั่นเรื่องโรงเรียน การฝึกอบรม และงบชุมชนท้องถิ่น ประเด็นตรวจสอบคือคำกล่าวว่าได้ secured เงินรัฐทำให้เส้นแบ่งหาเสียงกับรัฐบาลพร่าเลือนหรือไม่",
      si: "ඇයගේ campaign එක local schools, training සහ community funding promises සමඟ බැඳී ඇත; public money secured කළා යන claims campaign/government boundaries අස్పෂ්ට කරන්නේද යන්න scrutiny එකයි."
    }
  },
  {
    name: "Paul Papalia",
    aliases: ["Paul Papalia", "Paul Papalia CSC", "Paul Papalia CSC MLA", "保罗·帕帕利亚", "保羅·帕帕利亞", "ポール・パパリア", "폴 파팔리아"],
    type: "politician",
    profile: { label: "Parliament register", url: "https://www.parliament.wa.gov.au/parliament/library/MPHistoricalData.nsf/%28Lookup%29/F4465E49988FDC6B48257C77001E54B7?OpenDocument=" },
    social: { label: "Facebook", url: "https://www.facebook.com/PaulPapaliaCSC.MLA/" },
    background: {
      "zh-Hans": "西澳工党政治人物、前海军人员，2007 年进入西澳议会，曾代表 Warnbro 和 Secret Harbour，并担任多个州部长职位。",
      "zh-Hant": "西澳工黨政治人物、前海軍人員，2007 年進入西澳議會，曾代表 Warnbro 和 Secret Harbour，並擔任多個州部長職位。",
      en: "Western Australian Labor politician and former navy serviceman, elected to WA Parliament in 2007 and later representing Warnbro and Secret Harbour while holding several ministerial portfolios.",
      es: "Político laborista de Australia Occidental y exmilitar naval, elegido al Parlamento estatal en 2007; representó Warnbro y Secret Harbour y ocupó varias carteras ministeriales.",
      ja: "西オーストラリア州労働党の政治家で元海軍関係者。2007年に州議会入りし、Warnbro と Secret Harbour を代表、複数の閣僚職を務めました。",
      ko: "서호주 노동당 정치인이자 전 해군 복무자로 2007년 WA 의회에 입성했고 Warnbro와 Secret Harbour를 대표하며 여러 장관직을 맡았습니다.",
      vi: "Chính trị gia Labor Tây Australia và cựu quân nhân hải quân, vào nghị viện bang năm 2007, từng đại diện Warnbro và Secret Harbour và giữ nhiều chức bộ trưởng.",
      th: "นักการเมือง Labor ของรัฐเวสเทิร์นออสเตรเลียและอดีตทหารเรือ เข้าสภารัฐปี 2007 เคยแทน Warnbro และ Secret Harbour และถือหลายพอร์ตโฟลิโอรัฐมนตรี",
      si: "Western Australian Labor දේශපාලනඥයෙකු සහ හිටපු navy serviceman කෙනෙකි. 2007 දී WA Parliament ට තේරී පත්ව Warnbro සහ Secret Harbour නියෝජනය කර ministerial portfolios කිහිපයක් දරා ඇත."
    },
    positions: {
      "zh-Hans": "其公共角色主要涉及警务、紧急服务、国防工业、退伍军人、矫正和博彩等州事务；Secret Harbour 补选源于其离开议会。",
      "zh-Hant": "其公共角色主要涉及警務、緊急服務、國防工業、退伍軍人、矯正和博彩等州事務；Secret Harbour 補選源於其離開議會。",
      en: "His public roles have covered police, emergency services, defence industries, veterans, corrective services and racing and gaming; the Secret Harbour by-election followed his departure from Parliament.",
      es: "Sus funciones públicas abarcaron policía, emergencias, industrias de defensa, veteranos, prisiones y apuestas; la elección parcial de Secret Harbour siguió a su salida del Parlamento.",
      ja: "警察、緊急サービス、防衛産業、退役軍人、矯正、競馬・賭博などを担当。Secret Harbour 補選は彼の議会離脱を受けたものです。",
      ko: "경찰, 응급서비스, 방위산업, 보훈, 교정, 경마·게임 관련 업무를 맡았으며 Secret Harbour 보궐선거는 그의 의회 퇴임 뒤 치러집니다.",
      vi: "Các vai trò công của ông bao gồm cảnh sát, khẩn cấp, công nghiệp quốc phòng, cựu chiến binh, cải huấn và racing and gaming; bầu cử bổ sung Secret Harbour diễn ra sau khi ông rời nghị viện.",
      th: "บทบาทสาธารณะครอบคลุมตำรวจ บริการฉุกเฉิน อุตสาหกรรมป้องกันประเทศ ทหารผ่านศึก ราชทัณฑ์ และ racing and gaming การเลือกตั้งซ่อม Secret Harbour เกิดหลังเขาออกจากสภา",
      si: "ඔහුගේ public roles police, emergency services, defence industries, veterans, corrective services සහ racing/gaming වටා තිබුණි; Secret Harbour by-election එක ඔහු Parliament හැරීමෙන් පසුව ආවේය."
    }
  },
  {
    name: "Joe Hockey",
    aliases: ["Joe Hockey", "Joseph Benedict Hockey", "The Hon Joe Hockey", "Joe Hockey MP", "乔·霍基", "喬·霍基", "ジョー・ホッキー", "조 호키"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/J_Hockey_MP" },
    social: { label: "X", url: "https://x.com/JoeHockey" },
    background: {
      "zh-Hans": "澳大利亚自由党前联邦政治人物和外交官，1996 至 2015 年任 North Sydney 联邦议员，后任澳大利亚驻美国大使，并创办咨询公司 Bondi Partners。",
      "zh-Hant": "澳洲自由黨前聯邦政治人物和外交官，1996 至 2015 年任 North Sydney 聯邦議員，後任澳洲駐美國大使，並創辦顧問公司 Bondi Partners。",
      en: "Former Australian Liberal federal politician and diplomat, MP for North Sydney from 1996 to 2015, later Australia's ambassador to the United States and founder of advisory firm Bondi Partners.",
      es: "Ex político federal liberal australiano y diplomático, diputado por North Sydney de 1996 a 2015, luego embajador de Australia en Estados Unidos y fundador de la consultora Bondi Partners.",
      ja: "オーストラリア Liberal Party の元連邦政治家、外交官。1996年から2015年まで North Sydney 選出議員を務め、のちに駐米豪州大使、Bondi Partners 創業者となりました。",
      ko: "호주 Liberal Party 출신 전 연방 정치인 겸 외교관으로 1996년부터 2015년까지 North Sydney 의원을 지냈고 이후 주미 호주대사와 Bondi Partners 창업자로 활동했습니다.",
      vi: "Cựu chính trị gia liên bang Liberal và nhà ngoại giao Australia, nghị sĩ North Sydney từ 1996 đến 2015, sau đó là đại sứ Australia tại Hoa Kỳ và nhà sáng lập Bondi Partners.",
      th: "อดีตนักการเมืองรัฐบาลกลาง Liberal และนักการทูตของออสเตรเลีย เป็น ส.ส. North Sydney ปี 1996-2015 ต่อมาเป็นเอกอัครราชทูตออสเตรเลียประจำสหรัฐฯ และผู้ก่อตั้ง Bondi Partners",
      si: "Australian Liberal හි හිටපු federal politician සහ diplomat කෙනෙකු වන Joe Hockey, 1996 සිට 2015 දක්වා North Sydney MP ලෙස සිටි අතර පසුව Australia's ambassador to the United States සහ Bondi Partners founder විය."
    },
    positions: {
      "zh-Hans": "其公共职务包括联邦财长、就业和劳资关系部长、人类服务部长、小企业和旅游部长，以及澳大利亚驻美国大使；在矿业和地缘经济讨论中常以政策和投资视角发言。",
      "zh-Hant": "其公共職務包括聯邦財長、就業和勞資關係部長、人類服務部長、小企業和旅遊部長，以及澳洲駐美國大使；在礦業和地緣經濟討論中常以政策和投資視角發言。",
      en: "His public offices included federal treasurer, employment and workplace relations minister, human services minister, small business and tourism minister, and ambassador to the United States; he often speaks on policy and investment in mining and geoeconomic debates.",
      es: "Sus cargos públicos incluyeron tesorero federal, ministro de Empleo y Relaciones Laborales, Servicios Humanos, Pequeña Empresa y Turismo, y embajador en Estados Unidos; suele intervenir en debates mineros y geoeconómicos desde una óptica de política e inversión.",
      ja: "連邦財務相、雇用・労使関係相、人間サービス相、小企業・観光相、駐米大使を歴任し、鉱業や地経学の議論では政策・投資の観点から発言します。",
      ko: "연방 재무장관, 고용·노사관계 장관, 인적서비스 장관, 중소기업·관광 장관, 주미대사를 지냈으며 광업과 지경학 논의에서 정책과 투자 관점으로 발언합니다.",
      vi: "Các chức vụ công gồm thủ quỹ liên bang, bộ trưởng Employment and Workplace Relations, Human Services, Small Business and Tourism, và đại sứ tại Hoa Kỳ; ông thường phát biểu về chính sách và đầu tư trong các tranh luận khai khoáng và địa kinh tế.",
      th: "ตำแหน่งสาธารณะของเขารวมถึง federal treasurer รัฐมนตรี employment and workplace relations, human services, small business and tourism และเอกอัครราชทูตประจำสหรัฐฯ โดยมักให้มุมมองด้านนโยบายและการลงทุนในประเด็นเหมืองและ geoeconomics",
      si: "ඔහුගේ public offices අතර federal treasurer, employment and workplace relations minister, human services minister, small business and tourism minister, සහ ambassador to the United States ඇතුළත් විය; mining සහ geoeconomic debates වල policy/investment පැත්තෙන් ඔහු සාමාන්‍යයෙන් අදහස් දක්වයි."
    }
  },
  {
    name: "Julie Delvecchio",
    aliases: ["Julie Delvecchio", "朱莉·德尔韦基奥", "朱莉·德爾韋基奧", "ジュリー・デルベッキオ", "줄리 델베키오"],
    type: "public-figure",
    social: { label: "LinkedIn", url: "https://au.linkedin.com/in/juliedelvecchio" },
    background: {
      "zh-Hans": "Electric Vehicle Council 首席执行官，代表澳大利亚电动车行业就市场增长、政策和能源转型发表公开意见。",
      "zh-Hant": "Electric Vehicle Council 行政總裁，代表澳洲電動車產業就市場成長、政策和能源轉型發表公開意見。",
      en: "Chief executive of the Electric Vehicle Council, a public advocate for Australia's EV industry on market growth, policy and the energy transition.",
      es: "Directora ejecutiva del Electric Vehicle Council, voz pública de la industria australiana de vehículos eléctricos en crecimiento del mercado, política y transición energética.",
      ja: "Electric Vehicle Council の最高経営責任者。豪州EV業界の市場成長、政策、エネルギー転換について公に発信しています。",
      ko: "Electric Vehicle Council 최고경영자로, 호주 전기차 산업의 시장 성장, 정책, 에너지 전환에 대해 공개적으로 발언합니다.",
      vi: "Giám đốc điều hành Electric Vehicle Council, tiếng nói công khai của ngành xe điện Australia về tăng trưởng thị trường, chính sách và chuyển đổi năng lượng.",
      th: "ประธานเจ้าหน้าที่บริหารของ Electric Vehicle Council เป็นผู้สนับสนุนสาธารณะของอุตสาหกรรม EV ออสเตรเลียด้านการเติบโตตลาด นโยบาย และ energy transition",
      si: "Electric Vehicle Council chief executive වන Julie Delvecchio, Australia's EV industry වෙනුවෙන් market growth, policy සහ energy transition ගැන public advocate කෙනෙකි."
    }
  },
  {
    name: "Mark Butler",
    aliases: ["Mark Butler", "Mark Christopher Butler", "Mark Butler MP", "马克·巴特勒", "馬克·巴特勒", "マーク・バトラー", "마크 버틀러"],
    type: "politician",
    profile: { label: "Minister biography", url: "https://www.health.gov.au/ministers/the-hon-mark-butler-mp/biography?language=en" },
    social: { label: "X", url: "https://x.com/Mark_Butler_MP" },
    background: {
      "zh-Hans": "澳大利亚工党联邦政治人物，2007 年起任联邦议员，现为 Hindmarsh 选区议员，并担任联邦卫生、老龄、残障和 NDIS 部长。",
      "zh-Hant": "澳洲工黨聯邦政治人物，2007 年起任聯邦議員，現為 Hindmarsh 選區議員，並擔任聯邦衛生、老齡、殘障和 NDIS 部長。",
      en: "Australian Labor federal politician, a federal MP since 2007, Member for Hindmarsh, and Minister for Health and Ageing and for Disability and the NDIS.",
      es: "Político federal laborista australiano, diputado desde 2007, miembro por Hindmarsh y ministro de Salud y Envejecimiento, Discapacidad y NDIS.",
      ja: "オーストラリア労働党の連邦政治家。2007年から連邦議員で、Hindmarsh 選出。保健・高齢化、障害、NDIS を担当する大臣です。",
      ko: "호주 노동당 연방 정치인으로 2007년부터 연방 하원의원이며 Hindmarsh 지역구 의원, 보건·고령화·장애·NDIS 장관입니다.",
      vi: "Chính trị gia liên bang Labor Australia, nghị sĩ liên bang từ năm 2007, dân biểu Hindmarsh, Bộ trưởng Health and Ageing, Disability và NDIS.",
      th: "นักการเมืองรัฐบาลกลาง Australian Labor เป็น ส.ส. ตั้งแต่ปี 2007 เขต Hindmarsh และเป็น Minister for Health and Ageing, Disability และ NDIS",
      si: "Australian Labor federal politician කෙනෙකු වන Mark Butler, 2007 සිට federal MP, Hindmarsh Member, සහ Health and Ageing, Disability සහ NDIS Minister වේ."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖 Medicare、PBS、医院、老龄医疗、残障政策和 NDIS；新药纳入 PBS 时通常由其代表联邦政府说明补贴和患者负担变化。",
      "zh-Hant": "其公共職責覆蓋 Medicare、PBS、醫院、老齡醫療、殘障政策和 NDIS；新藥納入 PBS 時通常由其代表聯邦政府說明補貼和患者負擔變化。",
      en: "His public responsibilities cover Medicare, the PBS, hospitals, aged care, disability policy and the NDIS; PBS medicine listings are part of his federal health portfolio.",
      es: "Sus responsabilidades públicas cubren Medicare, el PBS, hospitales, atención a mayores, política de discapacidad y el NDIS; las inclusiones de medicamentos en el PBS forman parte de su cartera sanitaria.",
      ja: "Medicare、PBS、病院、高齢者ケア、障害政策、NDIS を所管し、PBS への医薬品収載は連邦保健担当大臣としての職務に含まれます。",
      ko: "Medicare, PBS, 병원, 노인 돌봄, 장애 정책, NDIS를 담당하며 PBS 의약품 등재는 그의 연방 보건 포트폴리오에 포함됩니다.",
      vi: "Trách nhiệm công của ông bao gồm Medicare, PBS, bệnh viện, chăm sóc người cao tuổi, chính sách khuyết tật và NDIS; danh mục thuốc PBS thuộc danh mục y tế liên bang của ông.",
      th: "หน้าที่สาธารณะครอบคลุม Medicare, PBS, โรงพยาบาล, aged care, disability policy และ NDIS โดยการขึ้นบัญชียา PBS อยู่ในพอร์ตโฟลิโอสุขภาพของรัฐบาลกลาง",
      si: "ඔහුගේ public responsibilities Medicare, PBS, hospitals, aged care, disability policy සහ NDIS ආවරණය කරයි; PBS medicine listings ඔහුගේ federal health portfolio එකේ කොටසකි."
    }
  },
  {
    name: "Jonathan Greenblatt",
    aliases: ["Jonathan Greenblatt", "Jonathan A. Greenblatt", "JGreenblattADL", "乔纳森·格林布拉特", "喬納森·格林布拉特", "ジョナサン・グリーンブラット", "조너선 그린블랫"],
    type: "public-figure",
    profile: { label: "ADL profile", url: "https://www.adl.org/who-we-are/leadership/staff/jonathan-greenblatt" },
    social: { label: "X", url: "https://x.com/JGreenblattADL" },
    background: {
      "zh-Hans": "Anti-Defamation League 的首席执行官和全国主任，曾任美国白宫社会创新与公民参与办公室主任，经常就反犹主义、网络仇恨和社区安全公开发声。",
      "zh-Hant": "Anti-Defamation League 的行政總裁和全國主任，曾任美國白宮社會創新與公民參與辦公室主任，經常就反猶主義、網路仇恨和社區安全公開發聲。",
      en: "CEO and National Director of the Anti-Defamation League, and a former White House social-innovation official, who speaks publicly on antisemitism, online hate and community safety.",
      es: "Director ejecutivo y director nacional de la Anti-Defamation League, y exfuncionario de innovación social de la Casa Blanca, que interviene públicamente sobre antisemitismo, odio en línea y seguridad comunitaria.",
      ja: "Anti-Defamation League の CEO 兼全国ディレクター。元ホワイトハウス社会イノベーション担当者で、反ユダヤ主義、オンラインヘイト、地域安全について公に発言しています。",
      ko: "Anti-Defamation League의 CEO 겸 전국 디렉터이며 전 백악관 사회혁신 담당자로, 반유대주의, 온라인 혐오, 지역사회 안전에 대해 공개적으로 발언합니다.",
      vi: "CEO kiêm National Director của Anti-Defamation League, từng là quan chức đổi mới xã hội của Nhà Trắng, thường phát biểu công khai về bài Do Thái, thù ghét trực tuyến và an toàn cộng đồng.",
      th: "CEO และ National Director ของ Anti-Defamation League และอดีตเจ้าหน้าที่ด้าน social innovation ของทำเนียบขาว มักพูดต่อสาธารณะเรื่อง antisemitism ความเกลียดชังออนไลน์ และความปลอดภัยชุมชน",
      si: "Anti-Defamation League හි CEO සහ National Director වන අතර හිටපු White House social-innovation official කෙනෙකි; antisemitism, online hate සහ community safety ගැන public ලෙස අදහස් දක්වයි."
    }
  },
  {
    name: "Penny Wong",
    aliases: ["Penny Wong", "Penelope Ying-Yen Wong", "Senator Wong", "Senator Penny Wong", "黄英贤", "黃英賢", "ペニー・ウォン", "페니 웡"],
    type: "politician",
    profile: { label: "Minister biography", url: "https://www.foreignminister.gov.au/minister/penny-wong" },
    social: { label: "X", url: "https://x.com/SenatorWong" },
    background: {
      "zh-Hans": "澳大利亚工党联邦政治人物，2002 年起任南澳参议员，现任外交部长和参议院政府领袖。",
      "zh-Hant": "澳洲工黨聯邦政治人物，2002 年起任南澳參議員，現任外交部長和參議院政府領袖。",
      en: "Australian Labor federal politician, Senator for South Australia since 2002, Minister for Foreign Affairs and Leader of the Government in the Senate.",
      es: "Política federal laborista australiana, senadora por Australia Meridional desde 2002, ministra de Relaciones Exteriores y líder del Gobierno en el Senado.",
      ja: "オーストラリア労働党の連邦政治家。2002年から南オーストラリア州選出の上院議員で、外相と上院政府代表を務めています。",
      ko: "호주 노동당 연방 정치인으로 2002년부터 남호주 상원의원이며 외교장관과 상원 정부 대표를 맡고 있습니다.",
      vi: "Chính trị gia liên bang Labor Australia, thượng nghị sĩ Nam Australia từ năm 2002, Bộ trưởng Ngoại giao và Leader of the Government in the Senate.",
      th: "นักการเมืองรัฐบาลกลาง Australian Labor เป็นวุฒิสมาชิก South Australia ตั้งแต่ปี 2002 รัฐมนตรีต่างประเทศ และ Leader of the Government in the Senate",
      si: "Australian Labor federal politician කෙනෙකු වන Penny Wong, 2002 සිට South Australia Senator, Foreign Affairs Minister සහ Senate හි Leader of the Government වේ."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖澳大利亚外交、区域安全、太平洋关系、发展援助和多边事务；First Nations 外交是其外交政策叙事的一部分。",
      "zh-Hant": "其公共職責覆蓋澳洲外交、區域安全、太平洋關係、發展援助和多邊事務；First Nations 外交是其外交政策敘事的一部分。",
      en: "Her public responsibilities cover foreign policy, regional security, Pacific relations, development assistance and multilateral affairs; First Nations diplomacy is part of her foreign policy agenda.",
      es: "Sus responsabilidades públicas cubren política exterior, seguridad regional, relaciones con el Pacífico, ayuda al desarrollo y asuntos multilaterales; la diplomacia First Nations forma parte de su agenda exterior.",
      ja: "外交政策、地域安全保障、太平洋関係、開発援助、多国間外交を所管し、First Nations 外交は外政策の一部です。",
      ko: "외교정책, 지역 안보, 태평양 관계, 개발 원조, 다자 업무를 담당하며 First Nations 외교는 그의 외교 의제 일부입니다.",
      vi: "Trách nhiệm công của bà bao gồm chính sách đối ngoại, an ninh khu vực, quan hệ Thái Bình Dương, viện trợ phát triển và đa phương; ngoại giao First Nations là một phần trong nghị trình đối ngoại.",
      th: "หน้าที่สาธารณะครอบคลุมนโยบายต่างประเทศ ความมั่นคงภูมิภาค ความสัมพันธ์แปซิฟิก ความช่วยเหลือเพื่อการพัฒนา และงานพหุภาคี โดย First Nations diplomacy เป็นส่วนหนึ่งของวาระต่างประเทศ",
      si: "ඇයගේ public responsibilities foreign policy, regional security, Pacific relations, development assistance සහ multilateral affairs ආවරණය කරයි; First Nations diplomacy ඇයගේ foreign policy agenda එකේ කොටසකි."
    }
  },
  {
    name: "Malarndirri McCarthy",
    aliases: ["Malarndirri McCarthy", "Barbara Anne McCarthy", "Senator Malarndirri McCarthy", "马拉恩迪里·麦卡锡", "馬拉恩迪里·麥卡錫", "マランディリ・マッカーシー", "말라른디리 매카시"],
    type: "politician",
    profile: { label: "Minister profile", url: "https://ministers.pmc.gov.au/mccarthy" },
    social: { label: "Facebook", url: "https://www.facebook.com/Malarndirri/" },
    background: {
      "zh-Hans": "澳大利亚工党联邦政治人物，北领地参议员，Yanyuwa Garrwa 女性，曾任记者，现任澳大利亚原住民事务部长。",
      "zh-Hant": "澳洲工黨聯邦政治人物，北領地參議員，Yanyuwa Garrwa 女性，曾任記者，現任澳洲原住民事務部長。",
      en: "Australian Labor federal politician, Northern Territory senator, Yanyuwa Garrwa woman, former journalist and Minister for Indigenous Australians.",
      es: "Política federal laborista australiana, senadora por el Territorio del Norte, mujer Yanyuwa Garrwa, ex periodista y ministra para los Australianos Indígenas.",
      ja: "オーストラリア労働党の連邦政治家。北部準州選出の上院議員で、Yanyuwa Garrwa の女性、元ジャーナリスト、先住民担当相です。",
      ko: "호주 노동당 연방 정치인으로 노던준주 상원의원, Yanyuwa Garrwa 여성, 전직 기자이며 Indigenous Australians 장관입니다.",
      vi: "Chính trị gia liên bang Labor Australia, thượng nghị sĩ Northern Territory, phụ nữ Yanyuwa Garrwa, cựu nhà báo và Minister for Indigenous Australians.",
      th: "นักการเมืองรัฐบาลกลาง Australian Labor วุฒิสมาชิก Northern Territory หญิง Yanyuwa Garrwa อดีตนักข่าว และ Minister for Indigenous Australians",
      si: "Australian Labor federal politician කෙනෙකු වන Malarndirri McCarthy, Northern Territory Senator, Yanyuwa Garrwa woman, හිටපු journalist සහ Minister for Indigenous Australians වේ."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖原住民事务、Closing the Gap、原住民健康、社区安全和北领地相关政策；Garma 论坛常是其政策发声场合。",
      "zh-Hant": "其公共職責覆蓋原住民事務、Closing the Gap、原住民健康、社區安全和北領地相關政策；Garma 論壇常是其政策發聲場合。",
      en: "Her public responsibilities cover Indigenous affairs, Closing the Gap, Indigenous health, community safety and Northern Territory policy; Garma is a frequent forum for those policy messages.",
      es: "Sus responsabilidades públicas cubren asuntos indígenas, Closing the Gap, salud indígena, seguridad comunitaria y política del Territorio del Norte; Garma suele ser un foro para esos mensajes.",
      ja: "先住民政策、Closing the Gap、先住民保健、地域安全、北部準州関連政策を担当し、Garma はこうした政策発信の場になりやすいです。",
      ko: "원주민 정책, Closing the Gap, 원주민 보건, 지역사회 안전, 노던준주 정책을 담당하며 Garma는 관련 메시지를 내는 주요 장입니다.",
      vi: "Trách nhiệm công của bà bao gồm Indigenous affairs, Closing the Gap, sức khỏe Indigenous, an toàn cộng đồng và chính sách Northern Territory; Garma thường là diễn đàn cho các thông điệp đó.",
      th: "หน้าที่สาธารณะครอบคลุม Indigenous affairs, Closing the Gap, Indigenous health, community safety และนโยบาย Northern Territory โดย Garma มักเป็นเวทีของข้อความนโยบายเหล่านี้",
      si: "ඇයගේ public responsibilities Indigenous affairs, Closing the Gap, Indigenous health, community safety සහ Northern Territory policy ආවරණය කරයි; Garma ඒ policy messages සඳහා නිතර forum එකකි."
    }
  },
  {
    name: "Dan Tehan",
    aliases: ["Dan Tehan", "Daniel Thomas Tehan", "Dan Tehan MP", "丹·蒂汉", "丹·蒂漢", "ダン・ティーハン", "댄 티한"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/d_tehan_mp" },
    social: { label: "Facebook", url: "https://www.facebook.com/DanTehanWannon/" },
    background: {
      "zh-Hans": "澳大利亚自由党联邦政治人物，2010 年起任 Wannon 选区议员，曾任多项联邦部长职务，现为反对党前座议员。",
      "zh-Hant": "澳洲自由黨聯邦政治人物，2010 年起任 Wannon 選區議員，曾任多項聯邦部長職務，現為反對黨前座議員。",
      en: "Australian Liberal federal politician, Member for Wannon since 2010, former federal minister and opposition frontbencher.",
      es: "Político federal liberal australiano, diputado por Wannon desde 2010, ex ministro federal y miembro del frente opositor.",
      ja: "オーストラリア自由党の連邦政治家。2010年から Wannon 選出の下院議員で、元連邦閣僚、野党前線議員です。",
      ko: "호주 자유당 연방 정치인으로 2010년부터 Wannon 하원의원이며 전 연방 장관이자 야당 전면 의원입니다.",
      vi: "Chính trị gia liên bang Liberal Australia, dân biểu Wannon từ năm 2010, cựu bộ trưởng liên bang và thành viên frontbench đối lập.",
      th: "นักการเมืองรัฐบาลกลาง Liberal ของออสเตรเลีย ส.ส. เขต Wannon ตั้งแต่ปี 2010 อดีตรัฐมนตรีรัฐบาลกลางและฝ่ายค้านแถวหน้า",
      si: "Australian Liberal federal politician කෙනෙකු වන Dan Tehan, 2010 සිට Wannon Member, හිටපු federal minister සහ opposition frontbencher කෙනෙකි."
    },
    positions: {
      "zh-Hans": "其公共角色包括代表自由党就卫生、地区选民、预算和政府问责等议题发声；曾负责贸易、教育、社会服务和退伍军人等部长事务。",
      "zh-Hant": "其公共角色包括代表自由黨就衛生、地區選民、預算和政府問責等議題發聲；曾負責貿易、教育、社會服務和退伍軍人等部長事務。",
      en: "His public role includes Liberal Party scrutiny on health, regional electorates, budget choices and government accountability; former portfolios included trade, education, social services and veterans' affairs.",
      es: "Su papel público incluye el escrutinio liberal sobre salud, electorados regionales, presupuesto y rendición de cuentas del gobierno; sus carteras anteriores incluyeron comercio, educación, servicios sociales y veteranos.",
      ja: "医療、地方選挙区、予算判断、政府説明責任について自由党側から追及する役割を担い、過去には貿易、教育、社会サービス、退役軍人を担当しました。",
      ko: "보건, 지역구, 예산 선택, 정부 책임성에 대해 자유당 입장에서 검증하는 역할을 하며 과거 통상, 교육, 사회서비스, 보훈 장관직을 맡았습니다.",
      vi: "Vai trò công của ông gồm giám sát của Liberal Party về y tế, cử tri vùng, lựa chọn ngân sách và trách nhiệm chính phủ; các danh mục trước đây gồm thương mại, giáo dục, dịch vụ xã hội và cựu chiến binh.",
      th: "บทบาทสาธารณะรวมถึงการตรวจสอบของ Liberal Party ด้านสุขภาพ เขตภูมิภาค งบประมาณ และความรับผิดชอบรัฐบาล โดยอดีตพอร์ตโฟลิโอมี trade, education, social services และ veterans' affairs",
      si: "ඔහුගේ public role එක health, regional electorates, budget choices සහ government accountability ගැන Liberal Party scrutiny ඇතුළත් කරයි; හිටපු portfolios trade, education, social services සහ veterans' affairs විය."
    }
  },
  {
    name: "Stephen Duckett",
    aliases: ["Stephen Duckett", "Stephen John Duckett", "Professor Stephen Duckett", "Stephen Duckett AM", "斯蒂芬·达克特", "史蒂芬·達克特", "スティーブン・ダケット", "스티븐 더켓"],
    type: "public-figure",
    profile: { label: "University profile", url: "https://findanexpert.unimelb.edu.au/profile/572560-stephen-duckett" },
    background: {
      "zh-Hans": "澳大利亚卫生经济学家和公共政策专家，墨尔本大学荣誉教授，长期研究医院资金、Medicare 和卫生系统改革。",
      "zh-Hant": "澳洲衛生經濟學家和公共政策專家，墨爾本大學榮譽教授，長期研究醫院資金、Medicare 和衛生系統改革。",
      en: "Australian health economist and public policy expert, honorary professor at the University of Melbourne, known for work on hospital funding, Medicare and health-system reform.",
      es: "Economista sanitario australiano y experto en política pública, profesor honorario en la University of Melbourne, conocido por su trabajo sobre financiación hospitalaria, Medicare y reforma sanitaria.",
      ja: "オーストラリアの医療経済学者・公共政策専門家。メルボルン大学名誉教授で、病院財源、Medicare、医療制度改革の研究で知られます。",
      ko: "호주 보건경제학자이자 공공정책 전문가로 University of Melbourne 명예교수이며 병원 재정, Medicare, 보건제도 개혁 연구로 알려져 있습니다.",
      vi: "Nhà kinh tế y tế và chuyên gia chính sách công Australia, giáo sư danh dự tại University of Melbourne, nổi tiếng về tài trợ bệnh viện, Medicare và cải cách hệ thống y tế.",
      th: "นักเศรษฐศาสตร์สุขภาพและผู้เชี่ยวชาญนโยบายสาธารณะของออสเตรเลีย ศาสตราจารย์กิตติมศักดิ์ที่ University of Melbourne เป็นที่รู้จักด้าน hospital funding, Medicare และ health-system reform",
      si: "Australian health economist සහ public policy expert කෙනෙකු වන Stephen Duckett, University of Melbourne honorary professor වන අතර hospital funding, Medicare සහ health-system reform පිළිබඳ ප්‍රසිද්ධය."
    }
  },
  {
    name: "Kimberley Reid",
    aliases: ["Kimberley Reid", "Kim Reid", "Dr Kimberley Reid", "Dr Kim Reid", "金伯利·里德", "金伯利·里德", "キンバリー・リード", "킴벌리 리드"],
    type: "public-figure",
    profile: { label: "University profile", url: "https://findanexpert.unimelb.edu.au/profile/820621-kimberley-reid" },
    background: {
      "zh-Hans": "墨尔本大学气候和高影响天气研究人员，研究方向包括澳大利亚极端降雨、气候驱动因素和天气风险。",
      "zh-Hant": "墨爾本大學氣候和高影響天氣研究人員，研究方向包括澳洲極端降雨、氣候驅動因素和天氣風險。",
      en: "University of Melbourne climate and high-impact weather researcher whose work covers Australian extreme rainfall, climate drivers and weather risk.",
      es: "Investigadora de clima y tiempo de alto impacto en la University of Melbourne, centrada en lluvias extremas australianas, impulsores climáticos y riesgo meteorológico.",
      ja: "メルボルン大学の気候・高影響気象研究者。豪州の極端降雨、気候要因、気象リスクを研究しています。",
      ko: "University of Melbourne의 기후 및 고영향 날씨 연구자로 호주의 극한 강우, 기후 요인, 날씨 위험을 연구합니다.",
      vi: "Nhà nghiên cứu khí hậu và thời tiết tác động cao tại University of Melbourne, tập trung vào mưa cực đoan ở Australia, tác nhân khí hậu và rủi ro thời tiết.",
      th: "นักวิจัย climate และ high-impact weather ที่ University of Melbourne งานครอบคลุมฝนสุดขั้วของออสเตรเลีย climate drivers และ weather risk",
      si: "University of Melbourne climate සහ high-impact weather researcher කෙනෙකු වන Kimberley Reid, Australian extreme rainfall, climate drivers සහ weather risk ගැන පර්යේෂණ කරයි."
    }
  },
  {
    name: "Matt Webb",
    aliases: ["Matt Webb", "Matthew Webb", "Dr Matt Webb", "马特·韦布", "馬特·韋布", "マット・ウェブ", "맷 웹"],
    type: "public-figure",
    profile: { label: "Enviro-dynamics profile", url: "https://www.enviro-dynamics.com.au/dr-matt-webb" },
    officialProfile: { label: "Threatened Species Recovery Hub profile", url: "https://www.nespthreatenedspecies.edu.au/people/matthew-webb" },
    background: {
      "zh-Hans": "澳大利亚生态学家，长期从事受威胁动植物保护、监测项目和栖息地评估研究，研究对象包括 swift parrot 和 orange-bellied parrot。",
      "zh-Hant": "澳洲生態學家，長期從事受威脅動植物保護、監測項目和棲地評估研究，研究對象包括 swift parrot 和 orange-bellied parrot。",
      en: "Australian ecologist whose work covers threatened flora and fauna conservation, monitoring programs and habitat assessment, including swift parrot and orange-bellied parrot research.",
      es: "Ecólogo australiano especializado en conservación de flora y fauna amenazada, programas de monitoreo y evaluación de hábitats, incluido trabajo sobre swift parrot y orange-bellied parrot.",
      ja: "絶滅危惧の動植物保全、モニタリング、生息地評価に取り組むオーストラリアの生態学者で、swift parrot と orange-bellied parrot の研究にも関わっています。",
      ko: "위협받는 동식물 보전, 모니터링 프로그램, 서식지 평가를 연구하는 호주 생태학자로 swift parrot와 orange-bellied parrot 연구에도 참여했습니다.",
      vi: "Nhà sinh thái học Australia chuyên về bảo tồn hệ động thực vật bị đe dọa, chương trình giám sát và đánh giá sinh cảnh, gồm nghiên cứu về swift parrot và orange-bellied parrot.",
      th: "นักนิเวศวิทยาออสเตรเลียที่ทำงานด้านการอนุรักษ์พืชและสัตว์ใกล้สูญพันธุ์ โครงการติดตาม และการประเมินถิ่นอาศัย รวมถึงงานวิจัย swift parrot และ orange-bellied parrot",
      si: "Threatened flora සහ fauna conservation, monitoring programs සහ habitat assessment පිළිබඳ Australian ecologist කෙනෙකි; swift parrot සහ orange-bellied parrot පර්යේෂණද කරයි."
    }
  },
  {
    name: "Leanne Wicker",
    aliases: ["Leanne Wicker", "Leanne V Wicker", "Dr Leanne Wicker", "利安妮·威克", "利安妮·威克", "リアン・ウィッカー", "리앤 위커"],
    type: "public-figure",
    profile: { label: "Enviro-dynamics profile", url: "https://www.enviro-dynamics.com.au/leanne-wicker" },
    background: {
      "zh-Hans": "澳大利亚野生动物兽医生态学家，研究重点包括自由生活野生动物健康、种群可持续性和保护项目中的兽医生态评估。",
      "zh-Hant": "澳洲野生動物獸醫生態學家，研究重點包括自由生活野生動物健康、族群可持續性和保護項目中的獸醫生態評估。",
      en: "Australian wildlife veterinary ecologist whose work focuses on free-ranging wildlife health, population viability and veterinary ecology in conservation projects.",
      es: "Ecóloga veterinaria de fauna silvestre australiana, centrada en salud de fauna libre, viabilidad poblacional y ecología veterinaria en proyectos de conservación.",
      ja: "野生動物の健康、個体群の存続可能性、保全事業における獣医生態学を専門とするオーストラリアの wildlife veterinary ecologist です。",
      ko: "야생동물 건강, 개체군 존속 가능성, 보전 사업의 수의생태학을 연구하는 호주 wildlife veterinary ecologist입니다.",
      vi: "Nhà sinh thái thú y động vật hoang dã Australia, tập trung vào sức khỏe động vật hoang dã tự do, khả năng duy trì quần thể và sinh thái thú y trong bảo tồn.",
      th: "นักนิเวศวิทยาสัตวแพทย์สัตว์ป่าของออสเตรเลีย ทำงานด้านสุขภาพสัตว์ป่าในธรรมชาติ ความยั่งยืนของประชากร และ veterinary ecology ในโครงการอนุรักษ์",
      si: "Free-ranging wildlife health, population viability සහ conservation projects තුළ veterinary ecology පිළිබඳ Australian wildlife veterinary ecologist කෙනෙකි."
    }
  },
  {
    name: "Mark Holdsworth",
    aliases: ["Mark Holdsworth", "Mark Holdsworth OAM", "马克·霍尔兹沃思", "馬克·霍爾茲沃思", "マーク・ホールズワース", "마크 홀즈워스"],
    type: "public-figure",
    profile: { label: "BirdLife Tasmania profile", url: "https://birdlife.org.au/groups/birdlife-tasmania/" },
    background: {
      "zh-Hans": "澳大利亚鸟类保护专家和 BirdLife Tasmania 公共代表，长期参与 orange-bellied parrot、swift parrot 和塔州鸟类栖息地保护工作。",
      "zh-Hant": "澳洲鳥類保護專家和 BirdLife Tasmania 公共代表，長期參與 orange-bellied parrot、swift parrot 和塔州鳥類棲地保護工作。",
      en: "Australian bird-conservation specialist and public representative of BirdLife Tasmania, long involved in orange-bellied parrot, swift parrot and Tasmanian bird-habitat protection work.",
      es: "Especialista australiano en conservación de aves y representante público de BirdLife Tasmania, con larga trayectoria en orange-bellied parrot, swift parrot y protección de hábitats de aves de Tasmania.",
      ja: "BirdLife Tasmania の公的代表を務めるオーストラリアの鳥類保全専門家で、orange-bellied parrot、swift parrot、タスマニアの鳥類生息地保護に長く関わっています。",
      ko: "BirdLife Tasmania의 공적 대표로 활동하는 호주 조류 보전 전문가이며 orange-bellied parrot, swift parrot와 태즈메이니아 조류 서식지 보호에 오래 참여했습니다.",
      vi: "Chuyên gia bảo tồn chim Australia và đại diện công khai của BirdLife Tasmania, lâu năm trong bảo vệ orange-bellied parrot, swift parrot và sinh cảnh chim Tasmania.",
      th: "ผู้เชี่ยวชาญอนุรักษ์นกของออสเตรเลียและตัวแทนสาธารณะของ BirdLife Tasmania ทำงานยาวนานเกี่ยวกับ orange-bellied parrot, swift parrot และการคุ้มครองถิ่นอาศัยนกในแทสเมเนีย",
      si: "Australian bird-conservation specialist සහ BirdLife Tasmania public representative කෙනෙකි; orange-bellied parrot, swift parrot සහ Tasmanian bird-habitat protection වැඩ වල දිගුකාලීනව නිරත වී ඇත."
    }
  },
  {
    name: "Simon Grove",
    aliases: ["Simon Grove", "Simon James Grove", "Dr Simon Grove", "西蒙·格罗夫", "西蒙·格羅夫", "サイモン・グローブ", "사이먼 그로브"],
    type: "public-figure",
    profile: { label: "University of Tasmania profile", url: "https://discover.utas.edu.au/Simon.Grove/publications" },
    background: {
      "zh-Hans": "澳大利亚昆虫学家和自然史研究者，曾任 Tasmanian Museum and Art Gallery 无脊椎动物学高级策展人，并发表 swift parrot 保护相关研究评论。",
      "zh-Hant": "澳洲昆蟲學家和自然史研究者，曾任 Tasmanian Museum and Art Gallery 無脊椎動物學高級策展人，並發表 swift parrot 保護相關研究評論。",
      en: "Australian entomologist and natural-history researcher, formerly senior curator of invertebrate zoology at the Tasmanian Museum and Art Gallery, with published commentary on swift parrot conservation evidence.",
      es: "Entomólogo australiano e investigador de historia natural, ex curador sénior de zoología de invertebrados en Tasmanian Museum and Art Gallery, con trabajos publicados sobre evidencia de conservación del swift parrot.",
      ja: "オーストラリアの昆虫学者・自然史研究者で、Tasmanian Museum and Art Gallery の無脊椎動物学上級キュレーターを務め、swift parrot 保全の証拠に関する研究レビューも発表しています。",
      ko: "호주 곤충학자이자 자연사 연구자로 Tasmanian Museum and Art Gallery 무척추동물학 선임 큐레이터를 지냈고 swift parrot 보전 근거에 관한 연구 논평을 발표했습니다.",
      vi: "Nhà côn trùng học và nghiên cứu lịch sử tự nhiên Australia, cựu senior curator về động vật không xương sống tại Tasmanian Museum and Art Gallery, có bài bình luận nghiên cứu về bằng chứng bảo tồn swift parrot.",
      th: "นักกีฏวิทยาและนักวิจัยประวัติศาสตร์ธรรมชาติของออสเตรเลีย อดีต senior curator ด้าน invertebrate zoology ที่ Tasmanian Museum and Art Gallery และมีงานทบทวนหลักฐานการอนุรักษ์ swift parrot",
      si: "Australian entomologist සහ natural-history researcher කෙනෙකි; Tasmanian Museum and Art Gallery හි invertebrate zoology senior curator ලෙස කටයුතු කළ අතර swift parrot conservation evidence ගැන published commentary ඇත."
    }
  },
  {
    name: "Richard Scolyer",
    aliases: ["Richard Scolyer", "Richard Anthony Scolyer", "Professor Richard Scolyer", "Richard Scolyer AO", "理查德·斯科利尔", "理查德·斯科利爾", "リチャード・スコリアー", "리처드 스콜리어"],
    type: "public-figure",
    profile: { label: "Melanoma Institute profile", url: "https://melanoma.org.au/news/team/professor-richard-scolyer-ao/" },
    background: {
      "zh-Hans": "澳大利亚病理学家和黑色素瘤研究者，曾任 Melanoma Institute Australia 共同医学主任，并与 Georgina Long 共同获评 2024 年 Australian of the Year。",
      "zh-Hant": "澳洲病理學家和黑色素瘤研究者，曾任 Melanoma Institute Australia 共同醫學主任，並與 Georgina Long 共同獲評 2024 年 Australian of the Year。",
      en: "Australian pathologist and melanoma researcher, formerly co-medical director of Melanoma Institute Australia, and joint 2024 Australian of the Year with Georgina Long.",
      es: "Patólogo australiano e investigador del melanoma, ex codirector médico de Melanoma Institute Australia y Australian of the Year 2024 junto con Georgina Long.",
      ja: "オーストラリアの病理医・メラノーマ研究者。Melanoma Institute Australia の共同医療ディレクターを務め、Georgina Long と共に 2024年 Australian of the Year に選ばれました。",
      ko: "호주 병리학자이자 흑색종 연구자로 Melanoma Institute Australia 공동 의료 책임자를 지냈고 Georgina Long과 함께 2024 Australian of the Year로 선정됐습니다.",
      vi: "Nhà bệnh học và nhà nghiên cứu melanoma của Australia, cựu đồng giám đốc y khoa Melanoma Institute Australia, đồng nhận Australian of the Year 2024 với Georgina Long.",
      th: "นักพยาธิวิทยาและนักวิจัย melanoma ของออสเตรเลีย อดีต co-medical director ของ Melanoma Institute Australia และ Australian of the Year 2024 ร่วมกับ Georgina Long",
      si: "Australian pathologist සහ melanoma researcher කෙනෙකු වූ Richard Scolyer, Melanoma Institute Australia co-medical director ලෙස කටයුතු කළ අතර Georgina Long සමඟ 2024 Australian of the Year විය."
    }
  },
  {
    name: "Djawa Yunupiŋu",
    aliases: ["Djawa Yunupiŋu", "Djawa Yunupingu", "Djawa Yunupi\u014bu", "Djawa Yunupi", "贾瓦·尤努平古", "賈瓦·尤努平古", "ジャワ・ユヌピング", "자와 유누핑구"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://yyf.com.au/about-yyf/our-people/" },
    background: {
      "zh-Hans": "Gumatj 领袖、Yothu Yindi Foundation 主席，也是 Garma Festival 相关公共事务中的重要 Yolŋu 发声者。其工作重点包括 Yolŋu 文化发展、教育、土地治理和 Garma 论坛。",
      "zh-Hant": "Gumatj 領袖、Yothu Yindi Foundation 主席，也是 Garma Festival 相關公共事務中的重要 Yolŋu 發聲者。其工作重點包括 Yolŋu 文化發展、教育、土地治理和 Garma 論壇。",
      en: "Gumatj leader and chair of the Yothu Yindi Foundation, and a prominent Yolŋu voice in public debate around Garma Festival. His work is tied to Yolŋu cultural development, education, land governance and the Garma forum.",
      es: "Líder Gumatj y presidente de la Yothu Yindi Foundation, además de una voz Yolŋu destacada en el debate público en torno al Garma Festival. Su labor se vincula con desarrollo cultural Yolŋu, educación, gobernanza de tierras y el foro Garma.",
      ja: "Gumatj のリーダーで Yothu Yindi Foundation の議長。Garma Festival をめぐる公共議論で重要な Yolŋu の発信者です。活動は Yolŋu の文化発展、教育、土地ガバナンス、Garma フォーラムに関わります。",
      ko: "Gumatj 지도자이자 Yothu Yindi Foundation 의장으로, Garma Festival을 둘러싼 공적 논의에서 중요한 Yolŋu 목소리입니다. 그의 활동은 Yolŋu 문화 발전, 교육, 토지 거버넌스와 Garma 포럼에 연결돼 있습니다.",
      vi: "Lãnh đạo Gumatj và chủ tịch Yothu Yindi Foundation, đồng thời là tiếng nói Yolŋu nổi bật trong tranh luận công chúng quanh Garma Festival. Công việc của ông gắn với phát triển văn hóa Yolŋu, giáo dục, quản trị đất đai và diễn đàn Garma.",
      th: "ผู้นำ Gumatj และประธาน Yothu Yindi Foundation เป็นเสียง Yolŋu สำคัญในการถกเถียงสาธารณะเกี่ยวกับ Garma Festival งานของเขาเกี่ยวข้องกับการพัฒนาวัฒนธรรม Yolŋu การศึกษา การกำกับดูแลที่ดิน และเวที Garma",
      si: "Gumatj leader සහ Yothu Yindi Foundation chair වන Djawa Yunupiŋu, Garma Festival වටා ඇති public debate තුළ වැදගත් Yolŋu හඬකි. ඔහුගේ වැඩ Yolŋu cultural development, education, land governance සහ Garma forum සමඟ බැඳී ඇත."
    }
  },
  {
    name: "Noel Pearson",
    aliases: ["Noel Pearson", "诺埃尔·皮尔森", "諾埃爾·皮爾森", "ノエル・ピアソン", "노엘 피어슨"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://www.fortescue.com/about-fortescue/board-and-leadership-team" },
    background: {
      "zh-Hans": "来自昆士兰 Cape York 的 Guugu Yimithirr 人，律师、作家和 Indigenous policy advocate，曾参与土地权、福利改革、教育和宪法承认辩论，也是 Fortescue 非执行董事。",
      "zh-Hant": "來自昆士蘭 Cape York 的 Guugu Yimithirr 人，律師、作家和 Indigenous policy advocate，曾參與土地權、福利改革、教育和憲法承認辯論，也是 Fortescue 非執行董事。",
      en: "Guugu Yimithirr man from Cape York, lawyer, writer and Indigenous policy advocate whose public work spans land rights, welfare reform, education and constitutional recognition. He is also a Fortescue non-executive director.",
      es: "Hombre Guugu Yimithirr de Cape York, abogado, escritor y defensor de políticas indígenas. Su trabajo público abarca derechos de tierra, reforma del bienestar, educación y reconocimiento constitucional. También es director no ejecutivo de Fortescue.",
      ja: "Cape York 出身の Guugu Yimithirr の人物で、弁護士、作家、Indigenous policy advocate です。土地権、福祉改革、教育、憲法承認をめぐる公共議論で知られ、Fortescue の非常勤取締役でもあります。",
      ko: "Cape York 출신 Guugu Yimithirr 인물로 변호사, 작가, Indigenous policy advocate입니다. 토지권, 복지 개혁, 교육, 헌법상 인정 논의에서 활동해 왔고 Fortescue 비상임 이사이기도 합니다.",
      vi: "Người Guugu Yimithirr từ Cape York, luật sư, tác giả và nhà vận động chính sách Indigenous. Công việc công chúng của ông trải rộng từ quyền đất đai, cải cách phúc lợi, giáo dục đến công nhận hiến pháp. Ông cũng là non-executive director của Fortescue.",
      th: "ชาย Guugu Yimithirr จาก Cape York เป็นทนาย นักเขียน และ Indigenous policy advocate งานสาธารณะของเขาครอบคลุมสิทธิที่ดิน การปฏิรูปสวัสดิการ การศึกษา และ constitutional recognition และเขายังเป็น non-executive director ของ Fortescue",
      si: "Cape York හි Guugu Yimithirr පුද්ගලයෙකු වන Noel Pearson lawyer, writer සහ Indigenous policy advocate කෙනෙකි. Land rights, welfare reform, education සහ constitutional recognition පිළිබඳ public work සඳහා ඔහු ප්‍රසිද්ධ වන අතර Fortescue non-executive director කෙනෙකි."
    }
  },
  {
    name: "Kyam Maher",
    aliases: ["Kyam Maher", "Kyam Joseph Maher", "Kyam Maher MLC", "凯厄姆·马赫", "凱厄姆·馬赫", "カイアム・マー", "카이엄 마허"],
    type: "politician",
    officialProfile: { label: "Minister profile", url: "https://premier.sa.gov.au/the-team/kyam-maher-mlc" },
    profile: { label: "Parliament profile", url: "https://www.parliament.sa.gov.au/en/Legislative-Council/Members" },
    social: { label: "Facebook", url: "https://www.facebook.com/KyamMaherMLC/" },
    background: {
      "zh-Hans": "南澳 Labor 政治人物、Legislative Council 议员，2025 年起任南澳副州长，并长期担任 Attorney-General 和 Aboriginal Affairs Minister。",
      "zh-Hant": "南澳 Labor 政治人物、Legislative Council 議員，2025 年起任南澳副州長，並長期擔任 Attorney-General 和 Aboriginal Affairs Minister。",
      en: "South Australian Labor politician and Legislative Council member, Deputy Premier of South Australia since 2025, and a long-serving Attorney-General and Minister for Aboriginal Affairs.",
      es: "Político laborista de Australia Meridional y miembro del Legislative Council; vicepremier estatal desde 2025, además de fiscal general y ministro de Asuntos Aborígenes.",
      ja: "南オーストラリア州 Labor の政治家で Legislative Council 議員。2025年から同州副首相を務め、Attorney-General と Aboriginal Affairs Minister も長く担っています。",
      ko: "남호주 Labor 정치인이자 Legislative Council 의원으로 2025년부터 남호주 부총리를 맡고 있으며 Attorney-General과 Aboriginal Affairs Minister를 오래 맡아 왔습니다.",
      vi: "Chính trị gia Labor tại Nam Úc và thành viên Legislative Council, Deputy Premier of South Australia từ năm 2025, đồng thời là Attorney-General và Minister for Aboriginal Affairs lâu năm.",
      th: "นักการเมือง Labor ของรัฐเซาท์ออสเตรเลียและสมาชิก Legislative Council เป็น Deputy Premier of South Australia ตั้งแต่ปี 2025 และดำรงตำแหน่ง Attorney-General กับ Minister for Aboriginal Affairs มานาน",
      si: "South Australian Labor දේශපාලනඥයෙකු සහ Legislative Council member කෙනෙකු වන Kyam Maher, 2025 සිට Deputy Premier of South Australia වන අතර Attorney-General සහ Minister for Aboriginal Affairs ලෙස දිගුකාලීනව කටයුතු කරයි."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖南澳司法、原住民事务、劳资关系、艺术和特别国务事务；真相陈述委员会属于其 Aboriginal Affairs 职权范围。",
      "zh-Hant": "其公共職責覆蓋南澳司法、原住民事務、勞資關係、藝術和特別國務事務；真相陳述委員會屬於其 Aboriginal Affairs 職權範圍。",
      en: "His public responsibilities cover South Australian justice, Aboriginal affairs, industrial relations, the arts and special state matters; the truth-telling commission sits within his Aboriginal affairs portfolio.",
      es: "Sus responsabilidades públicas cubren justicia, asuntos aborígenes, relaciones laborales, artes y asuntos especiales del estado; la comisión de verdad forma parte de su cartera de asuntos aborígenes.",
      ja: "州司法、アボリジナル政策、労使関係、芸術、特別州務を担当し、真実伝え委員会は Aboriginal affairs の職責に含まれます。",
      ko: "남호주의 사법, Aboriginal affairs, 노사관계, 예술, 특별 주정부 업무를 담당하며 진실 밝히기 위원회는 그의 Aboriginal affairs 포트폴리오에 속합니다.",
      vi: "Trách nhiệm công của ông bao gồm tư pháp Nam Úc, Aboriginal affairs, quan hệ lao động, nghệ thuật và các vấn đề đặc biệt của bang; ủy ban sự thật thuộc danh mục Aboriginal affairs của ông.",
      th: "บทบาทสาธารณะครอบคลุมงานยุติธรรม Aboriginal affairs แรงงานสัมพันธ์ ศิลปะ และกิจการพิเศษของรัฐ โดยคณะกรรมการบอกความจริงอยู่ในพอร์ต Aboriginal affairs ของเขา",
      si: "ඔහුගේ public responsibilities South Australian justice, Aboriginal affairs, industrial relations, arts සහ special state matters ආවරණය කරයි; truth-telling commission එක ඔහුගේ Aboriginal affairs portfolio එකට අයත් වේ."
    }
  },
  {
    name: "Kellie Sloane",
    aliases: ["Kellie Sloane", "Kellie Anne Sloane", "Kellie Sloane MP", "凯莉·斯隆", "凱莉·斯隆", "ケリー・スローン", "켈리 슬론"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers/members-details?memberId=2288&ref=1845" },
    officialProfile: { label: "Official website", url: "https://kelliesloane.com.au/" },
    social: { label: "Facebook", url: "https://www.facebook.com/KellieSloaneMP/" },
    personalSocial: { label: "X", url: "https://x.com/KellieSloaneMP" },
    background: {
      "zh-Hans": "新南威尔士自由党政治人物，Vaucluse 选区州议员，进入政坛前曾任电视记者和慈善机构负责人，2025 年起任新州反对党领袖和新州自由党领袖。",
      "zh-Hant": "新南威爾士自由黨政治人物，Vaucluse 選區州議員，進入政壇前曾任電視記者和慈善機構負責人，2025 年起任新州反對黨領袖和新州自由黨領袖。",
      en: "New South Wales Liberal politician, MP for Vaucluse, former television journalist and charity executive, and NSW Opposition Leader and NSW Liberal leader since 2025.",
      es: "Política liberal de Nueva Gales del Sur, diputada por Vaucluse, ex periodista televisiva y ejecutiva de organizaciones benéficas; líder de la oposición estatal y del Liberal Party de NSW desde 2025.",
      ja: "ニューサウスウェールズ州 Liberal Party の政治家で、Vaucluse 選出の州議員。元テレビ記者、慈善団体幹部で、2025年から NSW Opposition Leader と NSW Liberal leader を務めています。",
      ko: "뉴사우스웨일스 Liberal Party 정치인으로 Vaucluse 지역구 의원입니다. 전직 TV 기자와 자선단체 임원을 거쳤고 2025년부터 NSW 야당 대표와 NSW Liberal 대표를 맡고 있습니다.",
      vi: "Chính trị gia Liberal tại New South Wales, nghị sĩ bang khu Vaucluse, cựu nhà báo truyền hình và lãnh đạo tổ chức từ thiện; NSW Opposition Leader và lãnh đạo NSW Liberal từ năm 2025.",
      th: "นักการเมือง Liberal ของรัฐนิวเซาท์เวลส์ ส.ส. รัฐเขต Vaucluse อดีตผู้สื่อข่าวโทรทัศน์และผู้บริหารองค์กรการกุศล เป็น NSW Opposition Leader และผู้นำ NSW Liberal ตั้งแต่ปี 2025",
      si: "New South Wales Liberal දේශපාලනඥයෙකු වන Kellie Sloane, Vaucluse MP, හිටපු television journalist සහ charity executive කෙනෙකි. 2025 සිට NSW Opposition Leader සහ NSW Liberal leader වේ."
    },
    positions: {
      "zh-Hans": "其公共职责包括领导新州反对党、代表 Vaucluse，并在州议会监督 Minns 工党政府；ICAC Reformers 调查使其党内治理和候选人管理面临政治压力。",
      "zh-Hant": "其公共職責包括領導新州反對黨、代表 Vaucluse，並在州議會監督 Minns 工黨政府；ICAC Reformers 調查使其黨內治理和候選人管理面臨政治壓力。",
      en: "Her public role is to lead the NSW opposition, represent Vaucluse and scrutinise the Minns Labor government; the ICAC Reformers inquiry puts political pressure on party governance and candidate management under her leadership.",
      es: "Su función pública consiste en liderar la oposición de NSW, representar a Vaucluse y fiscalizar al gobierno laborista de Minns; la investigación ICAC Reformers presiona la gobernanza partidaria y la gestión de candidatos bajo su liderazgo.",
      ja: "NSW 野党を率い、Vaucluse を代表し、Minns Labor 政権を監視する立場です。ICAC Reformers 調査は、党運営と候補者管理をめぐって彼女の指導部に政治的圧力をかけています。",
      ko: "NSW 야당을 이끌고 Vaucluse를 대표하며 Minns Labor 정부를 견제하는 역할입니다. ICAC Reformers 조사는 그의 지도부 아래 당 운영과 후보 관리에 정치적 압박을 줍니다.",
      vi: "Vai trò công của bà là lãnh đạo phe đối lập NSW, đại diện Vaucluse và giám sát chính phủ Minns Labor; cuộc điều tra ICAC Reformers tạo sức ép chính trị về quản trị đảng và quản lý ứng viên dưới thời bà.",
      th: "บทบาทสาธารณะคือผู้นำฝ่ายค้าน NSW ตัวแทนเขต Vaucluse และตรวจสอบรัฐบาล Minns Labor โดยการไต่สวน ICAC Reformers เพิ่มแรงกดดันต่อธรรมาภิบาลพรรคและการจัดการผู้สมัครภายใต้การนำของเธอ",
      si: "ඇයගේ public role එක NSW opposition නායකත්වය, Vaucluse නියෝජනය සහ Minns Labor government scrutiny ය. ICAC Reformers inquiry එක ඇයගේ leadership යටතේ party governance සහ candidate management පිළිබඳ political pressure ගෙන එයි."
    }
  },
  {
    name: "Robert Assaf",
    aliases: ["Robert Assaf", "Rob Assaf", "罗伯特·阿萨夫", "羅伯特·阿薩夫", "ロバート・アサフ", "로버트 아사프"],
    type: "public-figure",
    officialProfile: { label: "ICAC Operation Rosny", url: "https://www.icac.nsw.gov.au/investigations/current-investigations/2026/electoral-funding-act-operation-rosny" },
    background: {
      "zh-Hans": "新州 Liberal Party 内部保守派组织 NSW Reformers 的共同创办人之一。Operation Rosny 中，ICAC 正调查与政治捐款、候选人和党员招募有关的指控，Assaf 是公开听证中的关键证人之一。",
      "zh-Hant": "新州 Liberal Party 內部保守派組織 NSW Reformers 的共同創辦人之一。Operation Rosny 中，ICAC 正調查與政治捐款、候選人和黨員招募有關的指控，Assaf 是公開聽證中的關鍵證人之一。",
      en: "Co-founder of NSW Reformers, a conservative grouping inside the NSW Liberal Party. In Operation Rosny, ICAC is investigating allegations involving political donations, candidates and party-member recruitment, with Assaf appearing as a key public hearing witness.",
      es: "Cofundador de NSW Reformers, un grupo conservador dentro del Liberal Party de NSW. En Operation Rosny, ICAC investiga acusaciones sobre donaciones políticas, candidatos y reclutamiento de afiliados, con Assaf como testigo clave en audiencias públicas.",
      ja: "NSW Liberal Party 内の保守系グループ NSW Reformers の共同創設者。Operation Rosny で ICAC は政治献金、候補者、党員勧誘をめぐる疑惑を調べており、Assaf は公開聴聞の主要証人の一人です。",
      ko: "NSW Liberal Party 내부 보수 성향 조직인 NSW Reformers의 공동 창립자입니다. Operation Rosny에서 ICAC는 정치 기부, 후보자, 당원 모집 관련 의혹을 조사하고 있으며 Assaf는 공개 청문회의 핵심 증인 중 한 명입니다.",
      vi: "Đồng sáng lập NSW Reformers, một nhóm bảo thủ trong NSW Liberal Party. Trong Operation Rosny, ICAC đang điều tra các cáo buộc liên quan đến quyên góp chính trị, ứng viên và tuyển mộ đảng viên, với Assaf là một nhân chứng công khai quan trọng.",
      th: "ผู้ร่วมก่อตั้ง NSW Reformers กลุ่มอนุรักษ์นิยมภายใน NSW Liberal Party ใน Operation Rosny ICAC กำลังสอบสวนข้อกล่าวหาเกี่ยวกับเงินบริจาคทางการเมือง ผู้สมัคร และการรับสมาชิกพรรค โดย Assaf เป็นพยานสำคัญใน hearings สาธารณะ",
      si: "NSW Liberal Party ඇතුළත conservative grouping එකක් වන NSW Reformers හි co-founder කෙනෙකි. Operation Rosny තුළ ICAC political donations, candidates සහ party-member recruitment සම්බන්ධ allegations විමර්ශනය කරන අතර Assaf ප්‍රසිද්ධ hearing witness කෙනෙකි."
    }
  },
  {
    name: "Laurie Daley",
    aliases: ["Laurie Daley", "Laurie William Daley", "Lozza", "劳里·戴利", "勞里·戴利", "ローリー・デイリー", "로리 데일리"],
    type: "athlete",
    profile: { label: "NRL profile", url: "https://www.nrl.com/players/state-of-origin/new-south-wales/laurie-daley/" },
    officialProfile: { label: "NSWRL profile", url: "https://www.nswrl.com.au/players/state-of-origin/new-south-wales/laurie-daley/" },
    social: { label: "Instagram", url: "https://www.instagram.com/laurie_daley6/" },
    background: {
      "zh-Hans": "澳大利亚橄榄球联盟名宿和教练，曾任 New South Wales Blues State of Origin 主教练，球员时代长期效力 Canberra Raiders，并代表新州和澳大利亚出战。",
      "zh-Hant": "澳洲橄欖球聯盟名宿和教練，曾任 New South Wales Blues State of Origin 主教練，球員時代長期效力 Canberra Raiders，並代表新州和澳洲出戰。",
      en: "Australian rugby league great and coach, formerly head coach of the New South Wales Blues in State of Origin. As a player he was a long-serving Canberra Raiders star and represented NSW and Australia.",
      es: "Figura histórica y entrenador de rugby league australiano, exentrenador principal de los New South Wales Blues en State of Origin. Como jugador fue referente de Canberra Raiders y representó a NSW y Australia.",
      ja: "オーストラリアのラグビーリーグ名選手・指導者。State of Origin の New South Wales Blues 監督を務めました。選手時代は Canberra Raiders で長く活躍し、NSW と豪州代表でもプレーしました。",
      ko: "호주 럭비리그 명선수이자 지도자로 State of Origin의 New South Wales Blues 감독을 지냈습니다. 선수 시절 Canberra Raiders에서 오래 활약했고 NSW와 호주 대표로 뛰었습니다.",
      vi: "Danh thủ và HLV rugby league Australia, từng là HLV trưởng New South Wales Blues tại State of Origin. Khi còn thi đấu, ông là ngôi sao lâu năm của Canberra Raiders và đại diện NSW cùng Australia.",
      th: "อดีตผู้เล่นและโค้ช rugby league คนสำคัญของออสเตรเลีย เคยเป็นหัวหน้าโค้ช New South Wales Blues ใน State of Origin สมัยเป็นผู้เล่นอยู่กับ Canberra Raiders ยาวนานและเล่นให้ NSW กับออสเตรเลีย",
      si: "Australian rugby league great සහ coach කෙනෙකු වන Laurie Daley, State of Origin හි New South Wales Blues head coach ලෙස කටයුතු කළේය. Player ලෙස Canberra Raiders සඳහා දිගුකාලීනව ක්‍රීඩා කර NSW සහ Australia නියෝජනය කළේය."
    }
  },
  {
    name: "Matt King",
    aliases: ["Matt King", "Matthew King", "Mat King", "Matthew John King", "马特·金", "馬特·金", "マット・キング", "맷 킹"],
    type: "athlete",
    profile: { label: "Rugby League Project profile", url: "https://www.rugbyleagueproject.org/players/matt-king/summary.html" },
    background: {
      "zh-Hans": "澳大利亚前职业橄榄球联盟球员和教练，曾效力 Melbourne Storm、Warrington Wolves 和 South Sydney Rabbitohs，并代表 New South Wales 与澳大利亚队出战。",
      "zh-Hant": "澳洲前職業橄欖球聯盟球員和教練，曾效力 Melbourne Storm、Warrington Wolves 和 South Sydney Rabbitohs，並代表 New South Wales 與澳洲隊出戰。",
      en: "Australian former professional rugby league player and coach. He played for Melbourne Storm, Warrington Wolves and South Sydney Rabbitohs, and represented New South Wales and Australia.",
      es: "Exjugador profesional y entrenador australiano de rugby league. Jugó para Melbourne Storm, Warrington Wolves y South Sydney Rabbitohs, y representó a New South Wales y Australia.",
      ja: "オーストラリアの元プロ・ラグビーリーグ選手、指導者。Melbourne Storm、Warrington Wolves、South Sydney Rabbitohs でプレーし、New South Wales と豪州代表でも出場しました。",
      ko: "호주 전 프로 럭비리그 선수이자 지도자입니다. Melbourne Storm, Warrington Wolves, South Sydney Rabbitohs에서 뛰었고 New South Wales와 호주 대표로도 출전했습니다.",
      vi: "Cựu cầu thủ chuyên nghiệp và HLV rugby league Australia. Ông từng chơi cho Melbourne Storm, Warrington Wolves và South Sydney Rabbitohs, đồng thời đại diện New South Wales và Australia.",
      th: "อดีตผู้เล่น rugby league อาชีพและโค้ชชาวออสเตรเลีย เคยเล่นให้ Melbourne Storm, Warrington Wolves และ South Sydney Rabbitohs และเป็นตัวแทนของ New South Wales กับทีมชาติออสเตรเลีย",
      si: "Australian former professional rugby league player සහ coach කෙනෙකු වන Matt King, Melbourne Storm, Warrington Wolves සහ South Sydney Rabbitohs සඳහා ක්‍රීඩා කළ අතර New South Wales සහ Australia නියෝජනය කළේය."
    }
  },
  {
    name: "Luke Bateman",
    aliases: ["Luke Bateman", "Luke Anthony Bateman", "卢克·贝特曼", "盧克·貝特曼", "ルーク・ベイトマン", "루크 베이트먼"],
    type: "public-figure",
    profile: { label: "Rugby League Project profile", url: "https://www.rugbyleagueproject.org/players/luke-bateman/summary.html" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/lukebateman_/" },
    background: {
      "zh-Hans": "澳大利亚前职业橄榄球联盟球员和媒体人物，曾效力 Canberra Raiders，退役后因 BookTok、播客、写作和真人秀节目获得更广泛关注。",
      "zh-Hant": "澳洲前職業橄欖球聯盟球員和媒體人物，曾效力 Canberra Raiders，退役後因 BookTok、Podcast、寫作和真人秀節目獲得更廣泛關注。",
      en: "Australian former professional rugby league player and media figure. He played for the Canberra Raiders and later became widely known through BookTok, podcasting, writing and reality television.",
      es: "Exjugador profesional australiano de rugby league y figura mediática. Jugó para Canberra Raiders y luego se hizo conocido por BookTok, podcasts, escritura y televisión de telerrealidad.",
      ja: "オーストラリアの元プロ・ラグビーリーグ選手でメディア人物。Canberra Raiders でプレーし、引退後は BookTok、ポッドキャスト、執筆、リアリティ番組で広く知られました。",
      ko: "호주 전 프로 럭비리그 선수이자 미디어 인물입니다. Canberra Raiders에서 뛰었고 이후 BookTok, 팟캐스트, 글쓰기, 리얼리티 TV를 통해 널리 알려졌습니다.",
      vi: "Cựu cầu thủ rugby league chuyên nghiệp và nhân vật truyền thông Australia. Anh từng chơi cho Canberra Raiders, rồi được biết rộng rãi qua BookTok, podcast, viết sách và truyền hình thực tế.",
      th: "อดีตผู้เล่น rugby league อาชีพและบุคคลสื่อของออสเตรเลีย เคยเล่นให้ Canberra Raiders และต่อมาเป็นที่รู้จักจาก BookTok พอดแคสต์ งานเขียน และรายการเรียลลิตี้",
      si: "Australian former professional rugby league player සහ media figure කෙනෙකි. Canberra Raiders සඳහා ක්‍රීඩා කළ අතර පසුව BookTok, podcasting, writing සහ reality television හරහා ප්‍රසිද්ධ විය."
    }
  },
  {
    name: "Isaac Cooper",
    aliases: ["Isaac Cooper", "Isaac Alan Cooper", "艾萨克·库珀", "艾薩克·庫珀", "アイザック・クーパー", "아이작 쿠퍼", "ไอแซก คูเปอร์"],
    type: "athlete",
    profile: { label: "Swimming Australia profile", url: "https://www.swimming.org.au/performance/dolphins/athletes/isaac-cooper" },
    officialProfile: { label: "Australian Olympic Team profile", url: "https://www.olympics.com.au/olympians/isaac-cooper/" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/mrisaaccooper/" },
    background: {
      "zh-Hans": "澳大利亚仰泳运动员和奥运选手，曾代表澳洲参加 Tokyo 2020 和 Paris 2024，并在世界锦标赛和短池世锦赛接力项目中夺牌。",
      "zh-Hant": "澳洲仰泳運動員和奧運選手，曾代表澳洲參加 Tokyo 2020 和 Paris 2024，並在世界錦標賽和短池世錦賽接力項目中奪牌。",
      en: "Australian backstroke swimmer and Olympian who represented Australia at Tokyo 2020 and Paris 2024, with medals in World Championships and short-course relay events.",
      es: "Nadador australiano de espalda y olímpico que representó a Australia en Tokyo 2020 y Paris 2024, con medallas en campeonatos mundiales y relevos de piscina corta.",
      ja: "オーストラリアの背泳ぎ選手で五輪代表。Tokyo 2020 と Paris 2024 に出場し、世界選手権や短水路リレー種目でメダルを獲得しています。",
      ko: "호주의 배영 선수이자 올림픽 대표입니다. Tokyo 2020과 Paris 2024에서 호주를 대표했고 세계선수권과 쇼트코스 계영 종목에서 메달을 땄습니다.",
      vi: "VĐV bơi ngửa và tuyển thủ Olympic của Australia, từng dự Tokyo 2020 và Paris 2024, có huy chương ở giải vô địch thế giới và các nội dung tiếp sức hồ ngắn.",
      th: "นักว่ายน้ำท่ากรรเชียงและนักกีฬาโอลิมปิกของออสเตรเลีย เคยแข่ง Tokyo 2020 และ Paris 2024 พร้อมเหรียญจากชิงแชมป์โลกและผลัดสระสั้น",
      si: "Australian backstroke swimmer සහ Olympian කෙනෙකි; Tokyo 2020 සහ Paris 2024 හි Australia නියෝජනය කළ අතර World Championships සහ short-course relay events වල medals දිනා ඇත."
    }
  },
  {
    name: "Lucas Herrington",
    aliases: ["Lucas Herrington", "Australian Socceroo Lucas Herrington", "卢卡斯·赫林顿", "盧卡斯·赫林頓", "ルーカス・ヘリントン", "루커스 헤링턴", "ลูคัส เฮอร์ริงตัน"],
    type: "athlete",
    profile: { label: "Socceroos profile", url: "https://socceroos.com.au/player/lucas-herrington" },
    officialProfile: { label: "Colorado Rapids profile", url: "https://www.coloradorapids.com/players/lucas-herrington/" },
    background: {
      "zh-Hans": "澳大利亚足球运动员，出生于布里斯班，司职中后卫，曾出自 Brisbane Roar 青训，后效力 Colorado Rapids，并入选 Socceroos。",
      "zh-Hant": "澳洲足球運動員，出生於布里斯本，司職中後衛，曾出自 Brisbane Roar 青訓，後效力 Colorado Rapids，並入選 Socceroos。",
      en: "Australian footballer from Brisbane who plays as a central defender. He came through the Brisbane Roar academy, joined Colorado Rapids and has been capped by the Socceroos.",
      es: "Futbolista australiano de Brisbane que juega como defensa central. Pasó por la academia de Brisbane Roar, fichó por Colorado Rapids y fue convocado por los Socceroos.",
      ja: "ブリスベン出身のオーストラリアのサッカー選手で、センターバックです。Brisbane Roar のアカデミーを経て Colorado Rapids に加入し、Socceroos に選ばれています。",
      ko: "브리즈번 출신 호주 축구 선수로 중앙 수비수입니다. Brisbane Roar 아카데미를 거쳐 Colorado Rapids에 합류했고 Socceroos 대표로도 뛰었습니다.",
      vi: "Cầu thủ bóng đá Australia từ Brisbane, chơi trung vệ. Anh trưởng thành từ học viện Brisbane Roar, gia nhập Colorado Rapids và đã khoác áo Socceroos.",
      th: "นักฟุตบอลออสเตรเลียจากบริสเบน เล่นตำแหน่งกองหลังตัวกลาง เติบโตจากอะคาเดมี Brisbane Roar ย้ายไป Colorado Rapids และติดทีม Socceroos",
      si: "Brisbane සිට පැමිණි Australian footballer කෙනෙකු වන Lucas Herrington central defender ලෙස ක්‍රීඩා කරයි. Brisbane Roar academy හරහා පැමිණ Colorado Rapids වෙත ගොස් Socceroos සඳහා cap ලබා ඇත."
    }
  },
  {
    name: "Kyle Sandilands",
    aliases: ["Kyle Sandilands", "Kyle Dalton Sandilands", "凯尔·桑迪兰兹", "凱爾·桑迪蘭茲", "カイル・サンダーランズ", "카일 샌딜랜즈"],
    type: "artist",
    profile: { label: "Kyle Sandilands Live", url: "https://kslive.com.au/" },
    background: {
      "zh-Hans": "澳大利亚电台和电视主持人，长期以 Kyle and Jackie O 节目成名，也曾担任 Australian Idol 等电视节目的评委，近年转向自有订阅媒体项目。",
      "zh-Hant": "澳洲電台和電視主持人，長期以 Kyle and Jackie O 節目成名，也曾擔任 Australian Idol 等電視節目的評委，近年轉向自有訂閱媒體項目。",
      en: "Australian radio and television presenter best known for the Kyle and Jackie O program, with television judging roles including Australian Idol and a later move into his own subscription media venture.",
      es: "Presentador australiano de radio y televisión, conocido por el programa Kyle and Jackie O, con trabajos como juez en televisión, incluido Australian Idol, y más tarde por su propio proyecto de medios por suscripción.",
      ja: "オーストラリアのラジオ・テレビ司会者で、Kyle and Jackie O の番組で知られます。Australian Idol などで審査員を務め、近年は自身のサブスクリプション型メディア事業に移っています。",
      ko: "Kyle and Jackie O 프로그램으로 잘 알려진 호주 라디오·TV 진행자입니다. Australian Idol 등 TV 심사위원 경력이 있으며 이후 자체 구독형 미디어 사업으로 옮겼습니다.",
      vi: "Người dẫn chương trình phát thanh và truyền hình Australia, nổi tiếng với Kyle and Jackie O, từng làm giám khảo truyền hình như Australian Idol và sau đó chuyển sang dự án truyền thông thuê bao riêng.",
      th: "ผู้ดำเนินรายการวิทยุและโทรทัศน์ออสเตรเลีย เป็นที่รู้จักจาก Kyle and Jackie O เคยเป็นกรรมการรายการเช่น Australian Idol และภายหลังทำโครงการสื่อแบบสมัครสมาชิกของตนเอง",
      si: "Kyle and Jackie O වැඩසටහනින් ප්‍රසිද්ධ Australian radio සහ television presenter කෙනෙකි. Australian Idol ඇතුළු TV judging roles දරා ඇති අතර පසුව තමන්ගේ subscription media venture එකකට මාරු විය."
    }
  },
  {
    name: "Karl Stefanovic",
    aliases: ["Karl Stefanovic", "卡尔·斯特凡诺维奇", "卡爾·斯特凡諾維奇", "カール・ステファノビック", "칼 스테파노비치"],
    type: "public-figure",
    profile: { label: "Podcast profile", url: "https://podcasts.apple.com/au/podcast/the-karl-stefanovic-show/id1872352760" },
    personalSocial: { label: "X", url: "https://x.com/karlstefanovic" },
    background: {
      "zh-Hans": "澳大利亚电视主持人和记者，长期与 Nine Network 相关，并主持 The Karl Stefanovic Show，采访政界、体育、商业和文化人物。",
      "zh-Hant": "澳洲電視主持人和記者，長期與 Nine Network 相關，並主持 The Karl Stefanovic Show，採訪政界、體育、商業和文化人物。",
      en: "Australian television presenter and journalist long associated with Nine Network, and host of The Karl Stefanovic Show, interviewing figures across politics, sport, business and culture.",
      es: "Presentador y periodista australiano de televisión, vinculado durante años a Nine Network y anfitrión de The Karl Stefanovic Show, con entrevistas sobre política, deporte, negocios y cultura.",
      ja: "Nine Network と長く関わるオーストラリアのテレビ司会者・ジャーナリストで、The Karl Stefanovic Show のホストとして政治、スポーツ、ビジネス、文化の人物にインタビューしています。",
      ko: "Nine Network와 오랫동안 관련된 호주 TV 진행자이자 저널리스트이며 The Karl Stefanovic Show 진행자로 정치, 스포츠, 비즈니스, 문화 인물을 인터뷰합니다.",
      vi: "Người dẫn truyền hình và nhà báo Australia, gắn bó lâu năm với Nine Network và dẫn The Karl Stefanovic Show, phỏng vấn các nhân vật trong chính trị, thể thao, kinh doanh và văn hóa.",
      th: "ผู้ดำเนินรายการโทรทัศน์และนักข่าวออสเตรเลียที่เกี่ยวข้องกับ Nine Network มายาวนาน และเป็นพิธีกร The Karl Stefanovic Show สัมภาษณ์บุคคลด้านการเมือง กีฬา ธุรกิจ และวัฒนธรรม",
      si: "Nine Network සමඟ දිගුකාලීනව බැඳුණු Australian television presenter සහ journalist කෙනෙකි. The Karl Stefanovic Show හි host ලෙස politics, sport, business සහ culture පුරා පුද්ගලයන් සම්මුඛ සාකච්ඡා කරයි."
    }
  },
  {
    name: "Jemima Montag",
    aliases: ["Jemima Montag", "杰迈玛·蒙塔格", "傑邁瑪·蒙塔格", "ジェミマ・モンタグ", "제미마 몬태그"],
    type: "athlete",
    social: { label: "Official profile", url: "https://www.olympics.com.au/olympians/jemima-montag/" },
    background: {
      "zh-Hans": "澳大利亚竞走运动员，两届奥运选手和巴黎奥运会双铜牌得主，也曾获得世界田径锦标赛奖牌和多枚英联邦运动会金牌。",
      "zh-Hant": "澳洲競走運動員，兩屆奧運選手和巴黎奧運會雙銅牌得主，也曾獲得世界田徑錦標賽獎牌和多枚英聯邦運動會金牌。",
      en: "Australian race walker, two-time Olympian and double bronze medallist at the Paris Olympics, with World Athletics Championships and multiple Commonwealth Games medals.",
      es: "Marchadora australiana, dos veces olímpica y doble medallista de bronce en los Juegos Olímpicos de París, con medallas en campeonatos mundiales de atletismo y varios Commonwealth Games.",
      ja: "オーストラリアの競歩選手。五輪に2度出場し、パリ五輪で銅メダルを2個獲得。世界陸上と Commonwealth Games でも複数のメダルがあります。",
      ko: "호주 경보 선수로 올림픽에 두 차례 출전했고 파리 올림픽에서 동메달 2개를 땄습니다. 세계육상선수권과 Commonwealth Games에서도 여러 메달을 보유하고 있습니다.",
      vi: "Vận động viên đi bộ thể thao Australia, hai lần dự Olympic và giành hai huy chương đồng tại Olympic Paris, cùng huy chương World Athletics Championships và nhiều huy chương Commonwealth Games.",
      th: "นักกีฬา race walk ของออสเตรเลีย เป็น Olympian สองสมัยและได้เหรียญทองแดงสองเหรียญที่ Paris Olympics รวมถึงมีเหรียญจาก World Athletics Championships และ Commonwealth Games หลายรายการ",
      si: "Australian race walker වන Jemima Montag Olympian දෙවරක් වන අතර Paris Olympics හි bronze medals දෙකක් දිනා ඇත. World Athletics Championships සහ Commonwealth Games medals කිහිපයක්ද ඇයට ඇත."
    }
  },
  {
    name: "Elizabeth McMillen",
    aliases: ["Elizabeth McMillen", "Lizzy McMillen", "伊丽莎白·麦克米伦", "伊麗莎白·麥克米倫", "エリザベス・マクミレン", "엘리자베스 맥밀런"],
    type: "athlete",
    social: { label: "Official profile", url: "https://worldathletics.org/athletes/australia/elizabeth-mcmillen-14771862" },
    background: {
      "zh-Hans": "澳大利亚竞走运动员，参加 10 公里、20 公里和 35 公里竞走项目，曾代表澳大利亚参加国际赛事并在 2025 年世界大学生运动会夺金。",
      "zh-Hant": "澳洲競走運動員，參加 10 公里、20 公里和 35 公里競走項目，曾代表澳洲參加國際賽事並在 2025 年世界大學生運動會奪金。",
      en: "Australian race walker competing across 10km, 20km and 35km events. She has represented Australia internationally and won gold at the 2025 World University Games.",
      es: "Marchadora australiana en pruebas de 10 km, 20 km y 35 km. Ha representado a Australia internacionalmente y ganó oro en los World University Games de 2025.",
      ja: "10km、20km、35kmの競歩に出場するオーストラリア選手。国際大会で同国を代表し、2025年 World University Games で金メダルを獲得しました。",
      ko: "10km, 20km, 35km 경보에 출전하는 호주 선수입니다. 국제대회에서 호주를 대표했고 2025 World University Games에서 금메달을 획득했습니다.",
      vi: "Vận động viên đi bộ thể thao Australia ở các nội dung 10 km, 20 km và 35 km. Cô đã đại diện Australia quốc tế và giành vàng tại World University Games 2025.",
      th: "นักกีฬา race walk ของออสเตรเลียในระยะ 10 กม., 20 กม. และ 35 กม. เคยแทนออสเตรเลียในระดับนานาชาติและได้เหรียญทอง World University Games ปี 2025",
      si: "10km, 20km සහ 35km race walk events වල තරඟ කරන Australian athlete කෙනෙකි. ඇය Australia ජාත්‍යන්තරව නියෝජනය කර 2025 World University Games හි gold medal දිනා ඇත."
    }
  },
  {
    name: "Keli Lane",
    aliases: ["Keli Lane", "Kelli Lane", "Keli Megan Lane", "凯莉·莱恩", "凱莉·萊恩", "ケリ・レーン", "켈리 레인"],
    type: "public-figure",
    profile: { label: "Rule of Law case note", url: "https://www.ruleoflaw.org.au/case-note-keli-lane" },
    background: {
      "zh-Hans": "澳大利亚前精英水球运动员和教师，2010 年因 1996 年其新生女儿死亡案被定罪。她的定罪、上诉和“无尸体不假释”法律适用长期受到媒体和法律界关注。",
      "zh-Hant": "澳洲前菁英水球運動員和教師，2010 年因 1996 年其新生女兒死亡案被定罪。她的定罪、上訴和「無屍體不假釋」法律適用長期受到媒體和法律界關注。",
      en: "Former Australian elite water polo player and teacher, convicted in 2010 over the 1996 death of her newborn daughter. Her conviction, appeals and treatment under no-body-no-parole laws remain recurring legal and media issues.",
      es: "Exjugadora australiana de waterpolo de elite y docente, condenada en 2010 por la muerte de su hija recién nacida en 1996. Su condena, apelaciones y el uso de leyes de no body no parole siguen siendo asuntos legales y mediáticos recurrentes.",
      ja: "オーストラリアの元エリート水球選手、教師。1996年の新生児の娘の死亡をめぐり2010年に有罪判決を受けました。判決、控訴、no-body-no-parole 法の適用が継続的に報道されています。",
      ko: "호주의 전 엘리트 수구 선수이자 교사입니다. 1996년 신생아 딸 사망 사건으로 2010년 유죄 판결을 받았고, 판결과 항소, no-body-no-parole 법 적용이 계속 법적·언론 이슈가 되고 있습니다.",
      vi: "Cựu vận động viên water polo cấp cao và giáo viên tại Australia, bị kết án năm 2010 liên quan cái chết năm 1996 của con gái mới sinh. Bản án, các kháng cáo và việc áp dụng luật no-body-no-parole vẫn là vấn đề pháp lý và truyền thông lặp lại.",
      th: "อดีตนักกีฬา water polo ระดับสูงและครูของออสเตรเลีย ถูกตัดสินผิดในปี 2010 จากคดีการเสียชีวิตของลูกสาวแรกเกิดในปี 1996 โดยคำพิพากษา การอุทธรณ์ และกฎหมาย no-body-no-parole ยังเป็นประเด็นข่าวและกฎหมายต่อเนื่อง",
      si: "හිටපු Australian elite water polo player සහ teacher කෙනෙකි; 1996 දී තම newborn daughter මරණය සම්බන්ධයෙන් 2010 දී දෝෂී තීරණය විය. ඇයගේ conviction, appeals සහ no-body-no-parole නීති යටතේ සැලකීම නැවත නැවත නීති හා මාධ්‍ය ප්‍රශ්නයක් වේ."
    }
  },
  {
    name: "Rebecca Henderson",
    aliases: ["Rebecca Henderson", "Bec Henderson", "丽贝卡·亨德森", "麗貝卡·亨德森", "レベッカ・ヘンダーソン", "리베카 헨더슨"],
    type: "athlete",
    social: { label: "Official profile", url: "https://www.athletics.com.au/athlete/rebecca-henderson/" },
    background: {
      "zh-Hans": "澳大利亚竞走运动员，两届奥运选手，主攻 20 公里和 35 公里竞走，并曾在世界锦标赛和其他国际赛事中代表澳大利亚参赛。",
      "zh-Hant": "澳洲競走運動員，兩屆奧運選手，主攻 20 公里和 35 公里競走，並曾在世界錦標賽和其他國際賽事中代表澳洲參賽。",
      en: "Australian race walker and two-time Olympian specialising in the 20km and 35km walks, with Australian representation at world championships and other international meets.",
      es: "Marchadora australiana y dos veces olímpica, especializada en 20 km y 35 km marcha, con representación de Australia en mundiales y otras competiciones internacionales.",
      ja: "20kmと35km競歩を専門とするオーストラリア選手で、五輪に2度出場。世界選手権など国際大会で同国を代表しています。",
      ko: "20km와 35km 경보를 주 종목으로 하는 호주 선수이자 두 차례 올림픽에 출전한 선수입니다. 세계선수권 등 국제대회에서 호주를 대표했습니다.",
      vi: "Vận động viên đi bộ thể thao Australia, hai lần dự Olympic, chuyên 20 km và 35 km, từng đại diện Australia tại world championships và các giải quốc tế khác.",
      th: "นักกีฬา race walk ของออสเตรเลียและ Olympian สองสมัย เชี่ยวชาญระยะ 20 กม. และ 35 กม. เคยแทนออสเตรเลียใน world championships และรายการนานาชาติอื่น",
      si: "20km සහ 35km walks වල විශේෂත්වයක් ඇති Australian race walker සහ Olympian දෙවරකි. World championships ඇතුළු international meets වල Australia නියෝජනය කර ඇත."
    }
  },
  {
    name: "Mackenzie Little",
    aliases: ["Mackenzie Little", "Mackenzie Patricia Little", "麦肯齐·利特", "麥肯齊·利特", "マッケンジー・リトル", "매켄지 리틀", "แม็คเคนซี ลิตเติล"],
    type: "athlete",
    profile: { label: "Australian Athletics profile", url: "https://www.athletics.com.au/athlete/mackenzie-little/" },
    officialProfile: { label: "World Athletics profile", url: "https://worldathletics.org/athletes/australia/mackenzie-little-14464527" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/kenzielittle22/" },
    background: {
      "zh-Hans": "澳大利亚标枪运动员和医生，两届奥运选手，曾获世界田径锦标赛奖牌、英联邦运动会奖牌，并长期在医学工作与精英训练之间兼顾。",
      "zh-Hant": "澳洲標槍運動員和醫生，兩屆奧運選手，曾獲世界田徑錦標賽獎牌、英聯邦運動會獎牌，並長期在醫學工作與精英訓練之間兼顧。",
      en: "Australian javelin thrower and doctor, a two-time Olympian with World Athletics Championships and Commonwealth Games medals, known for balancing elite competition with medical work.",
      es: "Lanzadora de jabalina australiana y médica, dos veces olímpica, con medallas en World Athletics Championships y Commonwealth Games, conocida por compaginar deporte de élite y medicina.",
      ja: "オーストラリアのやり投げ選手で医師。五輪に2度出場し、World Athletics Championships と Commonwealth Games でメダルを獲得、医療の仕事と競技を両立しています。",
      ko: "호주 창던지기 선수이자 의사로, 올림픽에 두 차례 출전했고 World Athletics Championships와 Commonwealth Games에서 메달을 딴 엘리트 선수입니다.",
      vi: "Vận động viên ném lao Australia và bác sĩ, hai lần dự Olympic, có huy chương World Athletics Championships và Commonwealth Games, nổi bật vì vừa thi đấu đỉnh cao vừa làm y khoa.",
      th: "นักพุ่งแหลนออสเตรเลียและแพทย์ เป็น Olympian สองสมัย มีเหรียญจาก World Athletics Championships และ Commonwealth Games และเป็นที่รู้จักจากการทำงานแพทย์ควบคู่กีฬาอาชีพ",
      si: "Australian javelin thrower සහ doctor කෙනෙකු වන Mackenzie Little Olympian දෙවරකි. World Athletics Championships සහ Commonwealth Games medals දිනා ඇති අතර medical work සහ elite competition සමබර කරගෙන යාමට ප්‍රසිද්ධය."
    }
  },
  {
    name: "Rhiannan Iffland",
    aliases: ["Rhiannan Iffland", "Rhiannan IFFLAND", "里安南·伊夫兰德", "里安南·伊夫蘭德", "リアナン・イフランド", "리안난 이플랜드", "ริอันแนน อิฟแลนด์"],
    type: "athlete",
    profile: { label: "Red Bull athlete profile", url: "https://www.redbull.com/int-en/athlete/rhiannan-iffland" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/rhiannan_iffland/" },
    background: {
      "zh-Hans": "澳大利亚高台跳水和悬崖跳水运动员，来自新南威尔士 Newcastle，是 Red Bull Cliff Diving World Series 的长期统治者，并多次获得 World Aquatics 高台跳水金牌。",
      "zh-Hant": "澳洲高台跳水和懸崖跳水運動員，來自新南威爾士 Newcastle，是 Red Bull Cliff Diving World Series 的長期統治者，並多次獲得 World Aquatics 高台跳水金牌。",
      en: "Australian high diver and cliff diver from Newcastle, New South Wales, a long-running Red Bull Cliff Diving World Series champion and multiple World Aquatics high-diving gold medallist.",
      es: "Clavadista de altura y cliff diver australiana de Newcastle, Nueva Gales del Sur; campeona dominante del Red Bull Cliff Diving World Series y múltiple medallista de oro de World Aquatics.",
      ja: "ニューサウスウェールズ州 Newcastle 出身のオーストラリアのハイダイビング、クリフダイビング選手。Red Bull Cliff Diving World Series を長く支配し、World Aquatics の高飛込でも複数の金メダルを獲得しています。",
      ko: "뉴사우스웨일스 Newcastle 출신 호주 하이다이빙·클리프다이빙 선수입니다. Red Bull Cliff Diving World Series를 장기간 지배했고 World Aquatics 하이다이빙 금메달도 여러 차례 획득했습니다.",
      vi: "Vận động viên high diving và cliff diving người Australia từ Newcastle, New South Wales; nhà vô địch lâu năm của Red Bull Cliff Diving World Series và nhiều lần giành vàng high diving tại World Aquatics.",
      th: "นักกีฬา high diving และ cliff diving ชาวออสเตรเลียจาก Newcastle รัฐนิวเซาท์เวลส์ เป็นแชมป์ Red Bull Cliff Diving World Series ที่ครองความสำเร็จยาวนาน และได้เหรียญทอง high diving ของ World Aquatics หลายครั้ง",
      si: "New South Wales හි Newcastle සිට පැමිණි Australian high diver සහ cliff diver කෙනෙකි. Red Bull Cliff Diving World Series හි දිගුකාලීන champion කෙනෙකු වන අතර World Aquatics high-diving gold medals කිහිපයක් දිනා ඇත."
    }
  },
  {
    name: "Abbey Caldwell",
    aliases: ["Abbey Caldwell", "阿比·考德威尔", "阿比·考德威爾", "アビー・コールドウェル", "애비 콜드웰"],
    type: "athlete",
    profile: { label: "Official profile", url: "https://www.athletics.com.au/athlete/abbey-caldwell/" },
    social: { label: "Instagram", url: "https://www.instagram.com/abbeycaldwelll/" },
    background: {
      "zh-Hans": "澳大利亚中距离跑运动员，主攻 800 米、1500 米和一英里，曾获英联邦运动会奖牌，并保持大洋洲 1000 米纪录。",
      "zh-Hant": "澳洲中距離跑運動員，主攻 800 米、1500 米和一英里，曾獲英聯邦運動會獎牌，並保持大洋洲 1000 米紀錄。",
      en: "Australian middle-distance runner across 800m, 1500m and the mile. She is a Commonwealth Games medallist and Oceania 1000m record holder.",
      es: "Mediofondista australiana en 800 m, 1500 m y milla. Es medallista de Commonwealth Games y plusmarquista de Oceanía en 1000 m.",
      ja: "800m、1500m、1マイルを走るオーストラリアの中距離選手。Commonwealth Games のメダリストで、1000mのオセアニア記録保持者です。",
      ko: "800m, 1500m, 마일에 출전하는 호주 중거리 육상 선수입니다. Commonwealth Games 메달리스트이자 오세아니아 1000m 기록 보유자입니다.",
      vi: "Vận động viên chạy cự ly trung bình Australia ở 800 m, 1500 m và mile. Cô từng giành huy chương Commonwealth Games và giữ kỷ lục châu Đại Dương 1000 m.",
      th: "นักวิ่งระยะกลางของออสเตรเลียใน 800 ม., 1500 ม. และ mile เป็นผู้ได้เหรียญ Commonwealth Games และเจ้าของสถิติโอเชียเนีย 1000 ม.",
      si: "800m, 1500m සහ mile events වල තරඟ කරන Australian middle-distance runner කෙනෙකි. ඇය Commonwealth Games medallist කෙනෙකු සහ Oceania 1000m record holder කෙනෙකි."
    }
  },
  {
    name: "Kurtis Marschall",
    aliases: ["Kurtis Marschall", "科蒂斯·马歇尔", "科蒂斯·馬歇爾", "カーティス・マーシャル", "커티스 마셜"],
    type: "athlete",
    profile: { label: "Official profile", url: "https://www.athletics.com.au/athlete/kurtis-marschall/" },
    social: { label: "Instagram", url: "https://www.instagram.com/kurtismarschall/" },
    background: {
      "zh-Hans": "澳大利亚撑竿跳高运动员、奥运选手和世界锦标赛奖牌得主，曾多次获得英联邦运动会金牌。",
      "zh-Hant": "澳洲撐竿跳高運動員、奧運選手和世界錦標賽獎牌得主，曾多次獲得英聯邦運動會金牌。",
      en: "Australian pole vaulter, Olympian and World Championships medallist, with multiple Commonwealth Games gold medals.",
      es: "Pertiguista australiano, olímpico y medallista en campeonatos mundiales, con varios oros en Commonwealth Games.",
      ja: "オーストラリアの棒高跳び選手。五輪代表で世界選手権メダリスト、Commonwealth Games で複数の金メダルを獲得しています。",
      ko: "호주 장대높이뛰기 선수로 올림픽에 출전했고 세계선수권 메달을 보유했습니다. Commonwealth Games 금메달도 여러 차례 획득했습니다.",
      vi: "Vận động viên nhảy sào Australia, Olympian và từng giành huy chương World Championships, với nhiều huy chương vàng Commonwealth Games.",
      th: "นักกระโดดค้ำถ่อออสเตรเลีย เป็น Olympian และผู้ได้เหรียญ World Championships พร้อมเหรียญทอง Commonwealth Games หลายรายการ",
      si: "Australian pole vaulter, Olympian සහ World Championships medallist කෙනෙකි. Commonwealth Games gold medals කිහිපයක්ද ඔහු දිනා ඇත."
    }
  },
  {
    name: "Matt Denny",
    aliases: ["Matt Denny", "Matthew Denny", "马特·丹尼", "馬特·丹尼", "マット・デニー", "매트 데니"],
    type: "athlete",
    profile: { label: "Official profile", url: "https://worldathletics.org/athletes/australia/matthew-denny-14436890" },
    social: { label: "Instagram", url: "https://www.instagram.com/mattydenny/" },
    background: {
      "zh-Hans": "澳大利亚铁饼运动员、奥运选手、钻石联赛总决赛冠军和英联邦运动会冠军，也曾参加链球项目。",
      "zh-Hant": "澳洲鐵餅運動員、奧運選手、鑽石聯賽總決賽冠軍和英聯邦運動會冠軍，也曾參加鏈球項目。",
      en: "Australian discus thrower, Olympian, Diamond League Final winner and Commonwealth Games champion, who has also competed in hammer throw.",
      es: "Lanzador de disco australiano, olímpico, ganador de la final de la Diamond League y campeón de Commonwealth Games, que también ha competido en martillo.",
      ja: "オーストラリアの円盤投げ選手。五輪代表、Diamond League Final 優勝者、Commonwealth Games 王者で、ハンマー投げにも出場してきました。",
      ko: "호주 원반던지기 선수로 올림픽에 출전했고 Diamond League Final 우승자이자 Commonwealth Games 챔피언입니다. 해머던지기에도 출전했습니다.",
      vi: "Vận động viên ném đĩa Australia, Olympian, vô địch Diamond League Final và Commonwealth Games, từng thi đấu cả ném búa.",
      th: "นักขว้างจักรออสเตรเลีย เป็น Olympian ผู้ชนะ Diamond League Final และแชมป์ Commonwealth Games และเคยแข่งขว้างค้อนด้วย",
      si: "Australian discus thrower, Olympian, Diamond League Final winner සහ Commonwealth Games champion කෙනෙකි. Hammer throw වලද ඔහු තරඟ කර ඇත."
    }
  },
  {
    name: "Lachlan Kennedy",
    aliases: ["Lachlan Kennedy", "Lachie Kennedy", "拉克兰·肯尼迪", "拉克蘭·肯尼迪", "ラクラン・ケネディ", "라클런 케네디"],
    type: "athlete",
    profile: { label: "Official profile", url: "https://www.athletics.com.au/athlete/lachlan-kennedy/" },
    social: { label: "Instagram", url: "https://www.instagram.com/_lachiekennedy_/" },
    background: {
      "zh-Hans": "澳大利亚短跑运动员，参加 60 米、100 米、200 米和 4x100 米接力，曾代表澳大利亚参加奥运会并获得世界室内锦标赛奖牌。",
      "zh-Hant": "澳洲短跑運動員，參加 60 米、100 米、200 米和 4x100 米接力，曾代表澳洲參加奧運會並獲得世界室內錦標賽獎牌。",
      en: "Australian sprinter across 60m, 100m, 200m and the 4x100m relay. He has represented Australia at the Olympics and won a World Indoor Championships medal.",
      es: "Velocista australiano en 60 m, 100 m, 200 m y relevo 4x100 m. Ha representado a Australia en los Juegos Olímpicos y ganó una medalla en World Indoor Championships.",
      ja: "60m、100m、200m、4x100mリレーに出場するオーストラリアの短距離選手。五輪で同国を代表し、World Indoor Championships でメダルを獲得しています。",
      ko: "60m, 100m, 200m, 4x100m 계주에 출전하는 호주 단거리 선수입니다. 올림픽에서 호주를 대표했고 World Indoor Championships 메달을 획득했습니다.",
      vi: "Vận động viên chạy nước rút Australia ở 60 m, 100 m, 200 m và tiếp sức 4x100 m. Anh từng đại diện Australia tại Olympic và giành huy chương World Indoor Championships.",
      th: "นักวิ่งสปรินต์ออสเตรเลียใน 60 ม., 100 ม., 200 ม. และผลัด 4x100 ม. เคยแทนออสเตรเลียใน Olympic และได้เหรียญ World Indoor Championships",
      si: "60m, 100m, 200m සහ 4x100m relay වල තරඟ කරන Australian sprinter කෙනෙකි. Olympics හි Australia නියෝජනය කර World Indoor Championships medal එකක් දිනා ඇත."
    }
  },
  {
    name: "Sophie Dwyer",
    aliases: ["Sophie Dwyer", "Soph Dwyer", "索菲·德怀尔", "索菲·德懷爾", "ソフィー・ドワイヤー", "소피 드와이어"],
    type: "athlete",
    social: { label: "Official profile", url: "https://netball.com.au/player/sophie-dwyer" },
    background: {
      "zh-Hans": "澳大利亚无挡板篮球运动员，司职 GS/GA，效力 GIANTS Netball，并代表 Australian Diamonds。她 2022 年完成国家队首秀，是 Diamonds 第 187 号球员。",
      "zh-Hant": "澳洲無擋板籃球運動員，司職 GS/GA，效力 GIANTS Netball，並代表 Australian Diamonds。她 2022 年完成國家隊首秀，是 Diamonds 第 187 號球員。",
      en: "Australian netballer who plays GS/GA for GIANTS Netball and the Australian Diamonds. She made her national debut in 2022 and is Diamond number 187.",
      es: "Jugadora australiana de netball, GS/GA de GIANTS Netball y de las Australian Diamonds. Debutó con la selección en 2022 y es la Diamond número 187.",
      ja: "GIANTS Netball と Australian Diamonds で GS/GA を務めるオーストラリアのネットボール選手。2022年に代表デビューし、Diamond number 187 です。",
      ko: "GIANTS Netball과 Australian Diamonds에서 GS/GA로 뛰는 호주 네트볼 선수입니다. 2022년 국가대표로 데뷔했고 Diamond number 187입니다.",
      vi: "Vận động viên netball Australia chơi GS/GA cho GIANTS Netball và Australian Diamonds. Cô ra mắt đội tuyển quốc gia năm 2022 và là Diamond số 187.",
      th: "นัก netball ออสเตรเลีย ตำแหน่ง GS/GA ให้ GIANTS Netball และ Australian Diamonds เปิดตัวทีมชาติในปี 2022 และเป็น Diamond หมายเลข 187",
      si: "GIANTS Netball සහ Australian Diamonds සඳහා GS/GA ලෙස ක්‍රීඩා කරන Australian netballer කෙනෙකි. 2022 දී national debut කළ ඇය Diamond number 187 වේ."
    }
  },
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
    profile: { label: "Victorian Parliament profile", url: "https://www.parliament.vic.gov.au/members/ben-carroll/" },
    officialProfile: { label: "Personal website", url: "https://bencarroll.com.au/" },
    social: { label: "Facebook", url: "https://www.facebook.com/bencarrollmp/" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/bencarrollmp/" },
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
    name: "Anthony Carbines",
    aliases: ["Anthony Carbines", "Anthony Richard Carbines", "Anthony Carbines MP", "安东尼·卡宾斯", "安東尼·卡賓斯", "アンソニー・カービンズ", "앤서니 카바인스"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.vic.gov.au/members/anthony-carbines/" },
    officialProfile: { label: "Premier profile", url: "https://www.premier.vic.gov.au/anthony-carbines" },
    social: { label: "X", url: "https://x.com/ACarbinesMP" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/anthonycarbinesmp/" },
    background: {
      "zh-Hans": "维州工党政治人物，Ivanhoe 选区州议员，2010 年进入维州议会，曾任警务、社区安全、受害者事务和赛马部长，并在 2026 年 Carroll 政府中接手人工智能和数字经济职责。",
      "zh-Hant": "維州工黨政治人物，Ivanhoe 選區州議員，2010 年進入維州議會，曾任警務、社區安全、受害者事務和賽馬部長，並在 2026 年 Carroll 政府中接手人工智能和數字經濟職責。",
      en: "Victorian Labor politician, MP for Ivanhoe since 2010, former police, community safety, victims and racing minister, and the minister given artificial intelligence and digital economy responsibilities in Ben Carroll's 2026 government.",
      es: "Político laborista de Victoria, diputado por Ivanhoe desde 2010; fue ministro de Policía, seguridad comunitaria, víctimas y carreras, y recibió inteligencia artificial y economía digital en el gobierno de Ben Carroll de 2026.",
      ja: "ビクトリア州労働党の政治家で、2010年から Ivanhoe 選出州議員。警察、地域安全、被害者、競馬担当相を務め、2026年の Ben Carroll 政権で人工知能とデジタル経済を担当しました。",
      ko: "빅토리아 노동당 정치인으로 2010년부터 Ivanhoe 지역구 의원입니다. 경찰, 지역사회 안전, 피해자, 경마 장관을 지냈고 2026년 Ben Carroll 정부에서 인공지능과 디지털 경제를 맡았습니다.",
      vi: "Chính trị gia Labor tại Victoria, nghị sĩ Ivanhoe từ năm 2010; từng giữ các bộ cảnh sát, an toàn cộng đồng, nạn nhân và đua ngựa, rồi nhận trách nhiệm trí tuệ nhân tạo và kinh tế số trong chính phủ Ben Carroll năm 2026.",
      th: "นักการเมือง Labor ของรัฐวิกตอเรีย ส.ส. เขต Ivanhoe ตั้งแต่ปี 2010 เคยดูแลตำรวจ ความปลอดภัยชุมชน เหยื่อ และ racing ก่อนรับหน้าที่ artificial intelligence และ digital economy ในรัฐบาล Ben Carroll ปี 2026",
      si: "Victorian Labor දේශපාලනඥයෙකු වන Anthony Carbines 2010 සිට Ivanhoe MP වේ. Police, community safety, victims සහ racing minister ලෙස කටයුතු කර ඇති අතර 2026 Ben Carroll රජයේ artificial intelligence සහ digital economy වගකීම් ලැබීය."
    },
    positions: {
      "zh-Hans": "其 AI 职责围绕负责任和伦理化 AI、数字投资、监管护栏以及数据中心等基础设施对就业、环境和社区的影响。",
      "zh-Hant": "其 AI 職責圍繞負責任和倫理化 AI、數字投資、監管護欄以及數據中心等基礎設施對就業、環境和社區的影響。",
      en: "His AI role is framed around responsible and ethical AI, digital investment, regulatory guardrails and the worker, environmental and community impacts of infrastructure such as data centres.",
      es: "Su cartera de IA se presenta en torno a IA responsable y ética, inversión digital, límites regulatorios y los efectos laborales, ambientales y comunitarios de infraestructuras como centros de datos.",
      ja: "AI 担当として、責任ある倫理的 AI、デジタル投資、規制上のガードレール、データセンターなどのインフラが労働者・環境・地域に与える影響を扱います。",
      ko: "AI 역할은 책임 있고 윤리적인 AI, 디지털 투자, 규제 가드레일, 데이터센터 같은 인프라가 노동자·환경·지역사회에 미치는 영향을 중심으로 합니다.",
      vi: "Vai trò AI của ông xoay quanh AI có trách nhiệm và đạo đức, đầu tư số, hàng rào pháp lý và tác động của hạ tầng như trung tâm dữ liệu đến người lao động, môi trường và cộng đồng.",
      th: "บทบาทด้าน AI ของเขาเน้น AI ที่รับผิดชอบและมีจริยธรรม การลงทุนดิจิทัล guardrails ด้านกฎระเบียบ และผลกระทบต่อแรงงาน สิ่งแวดล้อม และชุมชนจากโครงสร้างพื้นฐาน เช่น data centres",
      si: "ඔහුගේ AI role එක responsible/ethical AI, digital investment, regulatory guardrails සහ data centres වැනි infrastructure වල worker, environmental, community impacts වටා ගොඩනැගී ඇත."
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
    name: "Jaclyn Symes",
    aliases: ["Jaclyn Symes", "Jaclyn Louise Symes", "杰奎琳·赛姆斯", "傑奎琳·賽姆斯", "ジャクリン・サイムズ", "재클린 사임스"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.parliament.vic.gov.au/members/jaclyn-symes/" },
    background: {
      "zh-Hans": "维州工党政治人物，代表 Northern Victoria 的上议院议员，2024 年起任维州财长和工业关系部长，2026 年起兼任 Development Victoria and Precincts 部长。",
      "zh-Hant": "維州工黨政治人物，代表 Northern Victoria 的上議院議員，2024 年起任維州財長和工業關係部長，2026 年起兼任 Development Victoria and Precincts 部長。",
      en: "Victorian Labor politician and Legislative Council member for Northern Victoria. She has served as Victorian Treasurer and Minister for Industrial Relations since 2024, and as Minister for Development Victoria and Precincts since 2026.",
      es: "Política laborista de Victoria y miembro del Legislative Council por Northern Victoria. Es tesorera de Victoria y ministra de Relaciones Industriales desde 2024, y ministra de Development Victoria and Precincts desde 2026.",
      ja: "ビクトリア州労働党の政治家で、Northern Victoria 選出の上院議員です。2024年から州財務相・労使関係相、2026年から Development Victoria and Precincts 相も務めています。",
      ko: "빅토리아주 노동당 정치인이며 Northern Victoria를 대표하는 Legislative Council 의원입니다. 2024년부터 빅토리아 재무장관과 산업관계 장관, 2026년부터 Development Victoria and Precincts 장관을 맡고 있습니다.",
      vi: "Chính trị gia Labor tại Victoria và thành viên Legislative Council đại diện Northern Victoria. Bà là Treasurer của Victoria và Minister for Industrial Relations từ năm 2024, đồng thời là Minister for Development Victoria and Precincts từ năm 2026.",
      th: "นักการเมือง Labor ของรัฐวิกตอเรีย และสมาชิก Legislative Council เขต Northern Victoria ดำรงตำแหน่ง Treasurer และ Minister for Industrial Relations ของรัฐตั้งแต่ปี 2024 และ Minister for Development Victoria and Precincts ตั้งแต่ปี 2026",
      si: "Victorian Labor දේශපාලනඥයෙකු සහ Northern Victoria නියෝජනය කරන Legislative Council member. 2024 සිට Victorian Treasurer සහ Minister for Industrial Relations ලෙසත්, 2026 සිට Minister for Development Victoria and Precincts ලෙසත් කටයුතු කරයි."
    },
    positions: {
      "zh-Hans": "主要负责州预算、工业关系和重大开发机构议题；在灵活工作上支持把可远程岗位每周两天在家工作的权利写入维州法律。",
      "zh-Hant": "主要負責州預算、工業關係和重大開發機構議題；在彈性工作上支持把可遠端職位每週兩天在家工作的權利寫入維州法律。",
      en: "Her portfolio focus is state finances, industrial relations and major development bodies. On flexible work she backs putting a two-day work-from-home right for eligible roles into Victorian law.",
      es: "Sus áreas son las finanzas estatales, relaciones industriales y grandes organismos de desarrollo. En trabajo flexible respalda convertir en ley victoriana el derecho a trabajar desde casa dos días para puestos elegibles.",
      ja: "州財政、労使関係、大型開発機関を所管します。柔軟な働き方では、対象職種に週2日の在宅勤務権を州法に盛り込む立場です。",
      ko: "주 재정, 산업관계, 주요 개발 기관을 담당합니다. 유연근무에서는 해당 직무의 주 2일 재택근무 권리를 빅토리아 법에 담는 것을 지지합니다.",
      vi: "Trọng tâm của bà là tài chính bang, industrial relations và các cơ quan phát triển lớn. Về làm việc linh hoạt, bà ủng hộ đưa quyền làm việc tại nhà hai ngày mỗi tuần cho vị trí phù hợp vào luật Victoria.",
      th: "งานหลักคือการคลังรัฐ industrial relations และหน่วยงานพัฒนาขนาดใหญ่ ด้านการทำงานยืดหยุ่น เธอสนับสนุนการใส่สิทธิทำงานจากบ้านสองวันต่อสัปดาห์สำหรับงานที่เข้าเกณฑ์ไว้ในกฎหมายรัฐวิกตอเรีย",
      si: "ඇයගේ portfolio focus එක state finances, industrial relations සහ major development bodies වේ. Flexible work සම්බන්ධයෙන් eligible roles සඳහා සතියකට දින දෙකක් work-from-home right එක Victorian law තුළට ගෙන ඒමට සහාය දක්වයි."
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
    name: "Tanya Plibersek",
    aliases: ["Tanya Plibersek", "Tanya Joan Plibersek", "Hon Tanya Plibersek MP", "The Hon Tanya Plibersek MP", "坦娅·普利伯塞克", "坦雅·普利伯塞克", "タニア・プリバーセック", "타냐 플리버섹"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/t_plibersek_mp" },
    officialProfile: { label: "Official website", url: "https://www.tanyaplibersek.com/" },
    social: { label: "X", url: "https://x.com/tanya_plibersek" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/tanya.plibersek/" },
    background: {
      "zh-Hans": "澳大利亚工党政治人物，1998 年起代表悉尼选区进入联邦众议院，2025 年起任社会服务部长；此前曾任副反对党领袖、环境与水资源部长、卫生部长和住房部长。",
      "zh-Hant": "澳洲工黨政治人物，1998 年起代表雪梨選區進入聯邦眾議院，2025 年起任社會服務部長；此前曾任副反對黨領袖、環境與水資源部長、衛生部長和住房部長。",
      en: "Australian Labor politician and federal MP for Sydney since 1998, serving as Minister for Social Services since 2025 after earlier roles as deputy opposition leader, environment and water minister, health minister and housing minister.",
      es: "Política laborista australiana y diputada federal por Sydney desde 1998; es ministra de Servicios Sociales desde 2025, tras cargos como vice-líder de la oposición, ministra de Medio Ambiente y Agua, Salud y Vivienda.",
      ja: "1998年から Sydney 選出の連邦下院議員を務める豪州労働党の政治家。2025年から社会サービス相で、以前は野党副党首、環境・水資源相、保健相、住宅相を歴任しました。",
      ko: "1998년부터 Sydney를 대표한 호주 노동당 연방 하원의원입니다. 2025년부터 사회서비스 장관이며, 앞서 야당 부대표, 환경·수자원 장관, 보건 장관, 주택 장관을 지냈습니다.",
      vi: "Chính trị gia Labor Úc và nghị sĩ liên bang khu Sydney từ năm 1998, giữ chức Minister for Social Services từ năm 2025 sau các vai trò deputy opposition leader, bộ trưởng môi trường và nước, y tế và nhà ở.",
      th: "นักการเมือง Labor ของออสเตรเลียและ ส.ส. รัฐบาลกลางเขต Sydney ตั้งแต่ปี 1998 ดำรงตำแหน่ง Minister for Social Services ตั้งแต่ปี 2025 หลังเคยเป็น deputy opposition leader รัฐมนตรีสิ่งแวดล้อมและน้ำ สาธารณสุข และที่อยู่อาศัย",
      si: "1998 සිට Sydney federal MP ලෙස කටයුතු කරන Australian Labor දේශපාලනඥයෙකි; 2025 සිට Minister for Social Services වන අතර පෙර deputy opposition leader, environment and water minister, health minister සහ housing minister ලෙස කටයුතු කළාය."
    },
    positions: {
      "zh-Hans": "主要关注社会服务、家庭和性别暴力应对、住房、环境保护、医疗和女性事务；在社会服务部长任内负责福利体系、家庭与儿童安全以及国家反家暴政策中的联邦协调。",
      "zh-Hant": "主要關注社會服務、家庭和性別暴力應對、住房、環境保護、醫療和女性事務；在社會服務部長任內負責福利體系、家庭與兒童安全以及國家反家暴政策中的聯邦協調。",
      en: "Her policy profile spans social services, family and gendered-violence responses, housing, environment protection, health and women's affairs. As social services minister she is tied to welfare settings, family and child safety, and federal coordination on national domestic-violence policy.",
      es: "Su agenda abarca servicios sociales, respuestas a violencia familiar y de género, vivienda, protección ambiental, salud y asuntos de mujeres. Como ministra de Servicios Sociales está vinculada a bienestar, seguridad familiar e infantil y coordinación federal contra la violencia doméstica.",
      ja: "社会サービス、家庭・ジェンダー暴力対応、住宅、環境保護、医療、女性政策を扱ってきました。社会サービス相としては福祉制度、家族と子どもの安全、家庭内暴力対策の連邦調整に関わります。",
      ko: "사회서비스, 가족·젠더 폭력 대응, 주거, 환경보호, 보건, 여성 정책을 다뤄 왔습니다. 사회서비스 장관으로서는 복지 제도, 가족·아동 안전, 전국 가정폭력 정책의 연방 조정과 관련됩니다.",
      vi: "Hồ sơ chính sách của bà bao gồm dịch vụ xã hội, ứng phó bạo lực gia đình và giới, nhà ở, bảo vệ môi trường, y tế và vấn đề phụ nữ. Với vai trò Minister for Social Services, bà gắn với phúc lợi, an toàn gia đình và trẻ em, cùng điều phối liên bang về chính sách chống bạo lực gia đình.",
      th: "ประเด็นของเธอครอบคลุม social services การรับมือความรุนแรงในครอบครัวและ gendered violence ที่อยู่อาศัย สิ่งแวดล้อม สาธารณสุข และกิจการสตรี ในฐานะ Minister for Social Services เธอเกี่ยวข้องกับระบบสวัสดิการ ความปลอดภัยของครอบครัวและเด็ก และการประสานนโยบาย domestic violence ระดับรัฐบาลกลาง",
      si: "ඇයගේ policy profile එක social services, family/gendered-violence responses, housing, environment protection, health සහ women's affairs ආවරණය කරයි. Social services minister ලෙස welfare settings, family/child safety සහ national domestic-violence policy සඳහා federal coordination සමඟ සම්බන්ධය."
    }
  },
  {
    name: "Anika Wells",
    aliases: ["Anika Wells", "Anika Shay Wells", "安妮卡·韦尔斯", "安妮卡·韋爾斯", "アニカ・ウェルズ", "아니카 웰스"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID=264121" },
    officialProfile: { label: "Official website", url: "https://www.anikawells.com.au/" },
    social: { label: "X", url: "https://x.com/AnikaWells" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/AnikaWellsMP/" },
    background: {
      "zh-Hans": "澳大利亚工党政治人物，2019 年起代表昆州 Lilley 选区进入联邦众议院，2025 年起任通信部长和体育部长。进入议会前曾从事法律和政策顾问工作。",
      "zh-Hant": "澳洲工黨政治人物，2019 年起代表昆州 Lilley 選區進入聯邦眾議院，2025 年起任通訊部長和體育部長。進入議會前曾從事法律和政策顧問工作。",
      en: "Australian Labor politician, federal MP for Lilley in Queensland since 2019, and Minister for Communications and Minister for Sport since 2025. Before parliament she worked in law and policy advice.",
      es: "Política laborista australiana, diputada federal por Lilley en Queensland desde 2019 y ministra de Comunicaciones y Deporte desde 2025. Antes del parlamento trabajó en derecho y asesoría política.",
      ja: "オーストラリア労働党の政治家。2019年からクイーンズランド州 Lilley 選出の連邦下院議員で、2025年から通信相・スポーツ相です。議会入り前は法律と政策助言の仕事をしていました。",
      ko: "호주 노동당 정치인으로 2019년부터 퀸즐랜드 Lilley 연방 하원의원이며 2025년부터 통신부 장관과 스포츠 장관을 맡고 있습니다. 의회 입성 전에는 법률과 정책 자문 업무를 했습니다.",
      vi: "Chính trị gia Labor Úc, nghị sĩ liên bang khu Lilley ở Queensland từ năm 2019, và là Minister for Communications cùng Minister for Sport từ năm 2025. Trước quốc hội, bà làm trong lĩnh vực luật và cố vấn chính sách.",
      th: "นักการเมือง Labor ของออสเตรเลีย เป็น ส.ส. รัฐบาลกลางเขต Lilley ในควีนส์แลนด์ตั้งแต่ปี 2019 และเป็น Minister for Communications กับ Minister for Sport ตั้งแต่ปี 2025 ก่อนเข้าสภาทำงานด้านกฎหมายและคำปรึกษานโยบาย",
      si: "Australian Labor දේශපාලනඥයෙකු වන Anika Wells 2019 සිට Queensland හි Lilley federal MP වන අතර 2025 සිට Minister for Communications සහ Minister for Sport වේ. Parliament ට පෙර law සහ policy advice ක්ෂේත්‍රවල කටයුතු කළාය."
    },
    positions: {
      "zh-Hans": "在通信政策上负责落实未成年人社交媒体年龄限制和平台年龄验证规则；同时在体育事务上负责联邦体育投资和重大赛事政策。",
      "zh-Hant": "在通訊政策上負責落實未成年人社群媒體年齡限制和平台年齡驗證規則；同時在體育事務上負責聯邦體育投資和重大賽事政策。",
      en: "In communications she is responsible for implementing under-16 social-media age restrictions and platform age-assurance rules; in sport she oversees federal sport investment and major-event policy.",
      es: "En comunicaciones es responsable de aplicar las restricciones de edad para redes sociales de menores de 16 años y reglas de verificación de edad; en deporte supervisa inversión federal y política de grandes eventos.",
      ja: "通信分野では16歳未満のソーシャルメディア年齢制限とプラットフォームの年齢確認ルールの実施を担当します。スポーツでは連邦のスポーツ投資と大型大会政策を所管します。",
      ko: "통신 분야에서는 16세 미만 소셜미디어 연령 제한과 플랫폼 연령 확인 규칙 이행을 담당합니다. 스포츠 분야에서는 연방 스포츠 투자와 주요 행사 정책을 관장합니다.",
      vi: "Trong truyền thông, bà phụ trách triển khai giới hạn tuổi mạng xã hội dưới 16 và quy định age assurance của nền tảng; trong thể thao, bà giám sát đầu tư thể thao liên bang và chính sách sự kiện lớn.",
      th: "ด้าน communications เธอรับผิดชอบการบังคับใช้ข้อจำกัดอายุ social media สำหรับผู้ต่ำกว่า 16 ปีและกฎ age assurance ของแพลตฟอร์ม ส่วนด้าน sport ดูแลการลงทุนกีฬาระดับรัฐบาลกลางและนโยบายอีเวนต์ใหญ่",
      si: "Communications ක්ෂේත්‍රයේ ඇය under-16 social-media age restrictions සහ platform age-assurance rules ක්‍රියාත්මක කිරීම භාරව සිටී; sport ක්ෂේත්‍රයේ federal sport investment සහ major-event policy අධීක්ෂණය කරයි."
    }
  },
  {
    name: "Sarah Henderson",
    aliases: ["Sarah Henderson", "Sarah Moya Henderson", "Senator Sarah Henderson", "Senator the Hon Sarah Henderson", "莎拉·亨德森", "莎拉·韓德森", "サラ・ヘンダーソン", "새라 헨더슨"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/s_henderson_mp" },
    officialProfile: { label: "Official website", url: "https://sarahhenderson.com.au/" },
    social: { label: "X", url: "https://x.com/SenSHenderson" },
    background: {
      "zh-Hans": "维州自由党联邦参议员，曾任 Corangamite 众议员；进入政坛前是记者、电视主持人和律师。",
      "zh-Hant": "維州自由黨聯邦參議員，曾任 Corangamite 眾議員；進入政壇前是記者、電視主持人和律師。",
      en: "Liberal senator for Victoria and former federal member for Corangamite. Before politics she worked as a journalist, television presenter and lawyer.",
      es: "Senadora liberal por Victoria y exdiputada federal por Corangamite. Antes de la política trabajó como periodista, presentadora de televisión y abogada.",
      ja: "ビクトリア州選出の自由党上院議員で、元 Corangamite 選出連邦下院議員です。政界入り前は記者、テレビ司会者、弁護士として働きました。",
      ko: "빅토리아를 대표하는 자유당 상원의원이자 전 Corangamite 연방 하원의원입니다. 정계 입문 전에는 기자, TV 진행자, 변호사로 일했습니다.",
      vi: "Thượng nghị sĩ Liberal đại diện Victoria và cựu dân biểu liên bang khu Corangamite. Trước chính trị bà làm nhà báo, người dẫn truyền hình và luật sư.",
      th: "วุฒิสมาชิก Liberal จากรัฐวิกตอเรีย และอดีต ส.ส. รัฐบาลกลางเขต Corangamite ก่อนเข้าสู่การเมืองทำงานเป็นผู้สื่อข่าว พิธีกรโทรทัศน์ และทนายความ",
      si: "Victoria නියෝජනය කරන Liberal senator සහ හිටපු Corangamite federal member. Politics ට පෙර journalist, television presenter සහ lawyer ලෙස කටයුතු කළාය."
    },
    positions: {
      "zh-Hans": "作为影子通信和数字安全部长，常就 ABC、网络安全、平台监管、未成年人网络保护和赌博广告限制发声。",
      "zh-Hant": "作為影子通訊和數位安全部長，常就 ABC、網路安全、平台監管、未成年人網路保護和賭博廣告限制發聲。",
      en: "As shadow minister for communications and digital safety, she often focuses on the ABC, online safety, platform regulation, child protection online and gambling-ad restrictions.",
      es: "Como shadow minister de comunicaciones y seguridad digital, suele centrarse en la ABC, seguridad en línea, regulación de plataformas, protección infantil online y límites a anuncios de apuestas.",
      ja: "影の通信・デジタル安全相として、ABC、オンライン安全、平台規制、子どものオンライン保護、賭博広告規制を主に扱います。",
      ko: "예비 통신·디지털안전 장관으로서 ABC, 온라인 안전, 플랫폼 규제, 아동 온라인 보호, 도박 광고 제한에 자주 초점을 맞춥니다.",
      vi: "Là shadow minister về communications và digital safety, bà thường tập trung vào ABC, an toàn trực tuyến, quản lý nền tảng, bảo vệ trẻ em online và hạn chế quảng cáo cá cược.",
      th: "ในฐานะ shadow minister ด้าน communications และ digital safety เธอมักเน้น ABC ความปลอดภัยออนไลน์ การกำกับแพลตฟอร์ม การคุ้มครองเด็กออนไลน์ และข้อจำกัดโฆษณาพนัน",
      si: "Shadow minister for communications and digital safety ලෙස ඇය ABC, online safety, platform regulation, child protection online සහ gambling-ad restrictions පිළිබඳ වැඩි අවධානය යොමු කරයි."
    }
  },
  {
    name: "Sarah Hanson-Young",
    aliases: ["Sarah Hanson-Young", "Sarah Coral Hanson-Young", "Senator Sarah Hanson-Young", "Sarah Hanson Young", "莎拉·汉森-杨", "莎拉·漢森-楊", "サラ・ハンソン＝ヤング", "새라 핸슨영"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/senator_hanson-young" },
    officialProfile: { label: "Greens profile", url: "https://greens.org.au/mps/sarah-hanson-young" },
    social: { label: "Facebook", url: "https://www.facebook.com/Senator.Sarah.Hanson.Young/" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/sarah_hansonyoung/" },
    background: {
      "zh-Hans": "南澳绿党联邦参议员，2007 年首次当选；长期参与环境、水资源、艺术、媒体和难民议题。",
      "zh-Hant": "南澳綠黨聯邦參議員，2007 年首次當選；長期參與環境、水資源、藝術、媒體和難民議題。",
      en: "Australian Greens senator for South Australia, first elected in 2007. She has long worked on environment, water, arts, media and refugee issues.",
      es: "Senadora de los Greens por Australia Meridional, elegida por primera vez en 2007. Ha trabajado durante años en ambiente, agua, artes, medios y refugiados.",
      ja: "南オーストラリア州選出の Greens 上院議員で、2007年に初当選しました。環境、水、芸術、メディア、難民問題に長く取り組んでいます。",
      ko: "남호주를 대표하는 Greens 상원의원으로 2007년 처음 당선됐습니다. 환경, 물, 예술, 미디어, 난민 문제를 오래 다뤄 왔습니다.",
      vi: "Thượng nghị sĩ Greens đại diện Nam Australia, lần đầu đắc cử năm 2007. Bà hoạt động lâu năm về môi trường, nước, nghệ thuật, truyền thông và người tị nạn.",
      th: "วุฒิสมาชิก Greens จากรัฐเซาท์ออสเตรเลีย ได้รับเลือกครั้งแรกในปี 2007 ทำงานมายาวนานด้านสิ่งแวดล้อม น้ำ ศิลปะ สื่อ และผู้ลี้ภัย",
      si: "South Australia නියෝජනය කරන Australian Greens senator; 2007 දී පළමුව තේරී පත්විය. Environment, water, arts, media සහ refugee issues පිළිබඳ දිගු කාලයක් කටයුතු කර ඇත."
    },
    positions: {
      "zh-Hans": "主要推动更强的环境和水资源保护、公共广播和艺术投入、媒体多样性、难民保护，以及更严格的赌博广告限制。",
      "zh-Hant": "主要推動更強的環境和水資源保護、公共廣播和藝術投入、媒體多樣性、難民保護，以及更嚴格的賭博廣告限制。",
      en: "Her main themes include stronger environment and water protection, public broadcasting and arts funding, media diversity, refugee protection and tighter gambling-ad restrictions.",
      es: "Sus temas centrales incluyen mayor protección ambiental y del agua, financiación de radiodifusión pública y artes, diversidad mediática, protección de refugiados y límites más estrictos a anuncios de apuestas.",
      ja: "環境・水資源保護、公共放送と芸術支援、メディア多様性、難民保護、賭博広告のより厳しい規制を重視します。",
      ko: "환경과 물 보호 강화, 공영방송과 예술 지원, 미디어 다양성, 난민 보호, 더 엄격한 도박 광고 제한을 주요 의제로 삼습니다.",
      vi: "Các chủ đề chính của bà gồm bảo vệ môi trường và nước mạnh hơn, tài trợ phát thanh công cộng và nghệ thuật, đa dạng truyền thông, bảo vệ người tị nạn và siết quảng cáo cá cược.",
      th: "ประเด็นหลักคือการคุ้มครองสิ่งแวดล้อมและน้ำที่เข้มแข็งขึ้น เงินสนับสนุนสื่อสาธารณะและศิลปะ ความหลากหลายสื่อ การคุ้มครองผู้ลี้ภัย และข้อจำกัดโฆษณาพนันที่เข้มขึ้น",
      si: "ඇයගේ main themes stronger environment/water protection, public broadcasting and arts funding, media diversity, refugee protection සහ tighter gambling-ad restrictions වේ."
    }
  },
  {
    name: "Daniel Mulino",
    aliases: ["Daniel Mulino", "Dr Daniel Mulino", "Daniel Mulino MP", "Dan Mulino", "丹尼尔·穆利诺", "丹尼爾·穆利諾", "ダニエル・ムリーノ", "대니얼 물리노"],
    type: "politician",
    profile: { label: "Minister biography", url: "https://ministers.treasury.gov.au/ministers/daniel-mulino-2025/biography" },
    social: { label: "LinkedIn", url: "https://www.linkedin.com/in/danielmulinomp/" },
    background: {
      "zh-Hans": "澳大利亚工党联邦政治人物，2019 年起任 Fraser 选区议员，2025 年起任助理财长和金融服务部长；从政前是经济学者和政策从业者。",
      "zh-Hant": "澳洲工黨聯邦政治人物，2019 年起任 Fraser 選區議員，2025 年起任助理財長和金融服務部長；從政前是經濟學者和政策從業者。",
      en: "Australian Labor federal politician, Member for Fraser since 2019, and Assistant Treasurer and Minister for Financial Services since 2025; before politics he worked as an economist and policy practitioner.",
      es: "Político federal laborista australiano, diputado por Fraser desde 2019 y Assistant Treasurer y Minister for Financial Services desde 2025; antes de la política trabajó como economista y en política pública.",
      ja: "オーストラリア労働党の連邦政治家。2019年から Fraser 選出の下院議員で、2025年から財務次官補兼金融サービス相です。政界入り前は経済学と政策分野で働きました。",
      ko: "호주 노동당 연방 정치인으로 2019년부터 Fraser 하원의원이며 2025년부터 Assistant Treasurer와 Minister for Financial Services를 맡고 있습니다. 정계 입문 전에는 경제학자와 정책 실무자로 일했습니다.",
      vi: "Chính trị gia liên bang Labor Úc, dân biểu Fraser từ năm 2019, và là Assistant Treasurer cùng Minister for Financial Services từ năm 2025; trước chính trị ông làm kinh tế và chính sách.",
      th: "นักการเมืองรัฐบาลกลาง Labor ของออสเตรเลีย เป็น ส.ส. เขต Fraser ตั้งแต่ปี 2019 และเป็น Assistant Treasurer กับ Minister for Financial Services ตั้งแต่ปี 2025 ก่อนเข้าสู่การเมืองทำงานด้านเศรษฐศาสตร์และนโยบาย",
      si: "Australian Labor federal politician කෙනෙකු වන Daniel Mulino 2019 සිට Fraser Member වන අතර 2025 සිට Assistant Treasurer සහ Minister for Financial Services වේ; politics ට පෙර economist සහ policy practitioner ලෙස කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "其职责覆盖金融服务、税务和经济政策执行；News Bargaining Incentive 中，他代表财金口径说明对大型数字平台的收费和抵扣设计。",
      "zh-Hant": "其職責覆蓋金融服務、稅務和經濟政策執行；News Bargaining Incentive 中，他代表財金口徑說明對大型數位平台的收費和抵扣設計。",
      en: "His responsibilities cover financial services, tax and economic-policy implementation; on the News Bargaining Incentive he explains the charge and offset design for large digital platforms.",
      es: "Sus responsabilidades cubren servicios financieros, impuestos e implementación de política económica; en el News Bargaining Incentive explica el diseño de cargos y compensaciones para grandes plataformas digitales.",
      ja: "金融サービス、税、経済政策の実施を担当します。News Bargaining Incentive では、大型デジタル平台への課金と控除設計を説明する立場です。",
      ko: "금융서비스, 세제, 경제정책 집행을 담당합니다. News Bargaining Incentive에서는 대형 디지털 플랫폼에 대한 부과금과 상계 설계를 설명합니다.",
      vi: "Trách nhiệm của ông gồm dịch vụ tài chính, thuế và triển khai chính sách kinh tế; với News Bargaining Incentive, ông giải thích thiết kế phí và khấu trừ cho các nền tảng số lớn.",
      th: "หน้าที่ครอบคลุม financial services ภาษี และการดำเนินนโยบายเศรษฐกิจ ใน News Bargaining Incentive เขาอธิบายการออกแบบ charge และ offset สำหรับแพลตฟอร์มดิจิทัลขนาดใหญ่",
      si: "ඔහුගේ responsibilities financial services, tax සහ economic-policy implementation ආවරණය කරයි; News Bargaining Incentive සම්බන්ධයෙන් large digital platforms සඳහා charge සහ offset design පැහැදිලි කරයි."
    }
  },
  {
    name: "Sam Rae",
    aliases: ["Sam Rae", "Samuel Rae", "Sam Rae MP", "萨姆·雷", "薩姆·雷", "サム・レイ", "샘 레이"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.health.gov.au/ministers/the-hon-sam-rae-mp" },
    background: {
      "zh-Hans": "澳大利亚工党政治人物，2022 年起代表维州 Hawke 选区进入联邦众议院，2025 年起任老年护理和老年人事务部长。进入联邦议会前曾任维州工党州秘书。",
      "zh-Hant": "澳洲工黨政治人物，2022 年起代表維州 Hawke 選區進入聯邦眾議院，2025 年起任老年護理和老年人事務部長。進入聯邦議會前曾任維州工黨州秘書。",
      en: "Australian Labor politician, federal MP for Hawke in Victoria since 2022 and Minister for Aged Care and Seniors since 2025. Before federal parliament he served as Victorian Labor state secretary.",
      es: "Político laborista australiano, diputado federal por Hawke en Victoria desde 2022 y ministro de Aged Care and Seniors desde 2025. Antes del parlamento federal fue secretario estatal de Labor en Victoria.",
      ja: "オーストラリア労働党の政治家。2022年からビクトリア州 Hawke 選出の連邦下院議員で、2025年から高齢者ケア・高齢者担当相です。連邦議会入り前はビクトリア州労働党の州書記を務めました。",
      ko: "호주 노동당 정치인으로 2022년부터 빅토리아 Hawke 지역구 연방 하원의원이며 2025년부터 노인돌봄·노인 담당 장관입니다. 연방 의회 입성 전에는 빅토리아 노동당 주 서기를 지냈습니다.",
      vi: "Chính trị gia Labor Úc, nghị sĩ liên bang khu Hawke ở Victoria từ năm 2022 và là Minister for Aged Care and Seniors từ năm 2025. Trước quốc hội liên bang, ông là secretary của Labor bang Victoria.",
      th: "นักการเมือง Labor ของออสเตรเลีย เป็น ส.ส. รัฐบาลกลางเขต Hawke ในรัฐวิกตอเรียตั้งแต่ปี 2022 และเป็น Minister for Aged Care and Seniors ตั้งแต่ปี 2025 ก่อนเข้าสภากลางเคยเป็นเลขาธิการ Labor รัฐวิกตอเรีย",
      si: "Australian Labor දේශපාලනඥයෙකු වන Sam Rae 2022 සිට Victoria හි Hawke federal MP වන අතර 2025 සිට Minister for Aged Care and Seniors වේ. Federal parliament ට පෙර Victorian Labor state secretary ලෙස කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "主要负责老年护理工资、服务质量和老年人支持政策；支持通过联邦资金落实 Fair Work Commission 的老年护理工资决定，以改善招聘、留任和照护质量。",
      "zh-Hant": "主要負責老年護理工資、服務品質和老年人支持政策；支持透過聯邦資金落實 Fair Work Commission 的老年護理工資決定，以改善招聘、留任和照護品質。",
      en: "His portfolio focus is aged-care wages, service quality and support for older Australians. He backs federal funding for Fair Work Commission aged-care wage decisions to improve recruitment, retention and care quality.",
      es: "Su área se centra en salarios de aged care, calidad del servicio y apoyo a personas mayores. Respalda financiación federal para aplicar decisiones salariales de la Fair Work Commission en aged care y mejorar contratación, retención y calidad.",
      ja: "所管は高齢者ケアの賃金、サービス品質、高齢者支援です。採用、定着、ケア品質を改善するため、Fair Work Commission の高齢者ケア賃金決定への連邦資金投入を支持しています。",
      ko: "주요 담당 분야는 노인돌봄 임금, 서비스 품질, 노인 지원입니다. 채용, 인력 유지, 돌봄 품질 개선을 위해 Fair Work Commission의 노인돌봄 임금 결정에 연방 재정을 투입하는 것을 지지합니다.",
      vi: "Trọng tâm của ông là lương aged care, chất lượng dịch vụ và hỗ trợ người cao tuổi. Ông ủng hộ tài trợ liên bang cho các quyết định lương aged care của Fair Work Commission để cải thiện tuyển dụng, giữ chân nhân viên và chất lượng chăm sóc.",
      th: "งานหลักคือค่าจ้าง aged care คุณภาพบริการ และการสนับสนุนผู้สูงอายุ เขาสนับสนุนเงินรัฐบาลกลางสำหรับคำตัดสินค่าจ้าง aged care ของ Fair Work Commission เพื่อช่วยการจ้างงาน การรักษาบุคลากร และคุณภาพการดูแล",
      si: "ඔහුගේ portfolio focus එක aged-care wages, service quality සහ older Australians සඳහා support වේ. Recruitment, retention සහ care quality වැඩිදියුණු කිරීමට Fair Work Commission aged-care wage decisions සඳහා federal funding ලබාදීමට ඔහු සහාය දක්වයි."
    }
  },
  {
    name: "Jennifer Howard",
    aliases: ["Jennifer Howard", "Jennifer Ruth Howard", "Jennifer Howard MP", "詹妮弗·霍华德", "詹妮弗·霍華德", "ジェニファー・ハワード", "제니퍼 하워드"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.parliament.qld.gov.au/Members/Current-Members/Member-List/Member-Details?id=1748033050" },
    background: {
      "zh-Hans": "昆州工党政治人物，2015 年起任 Ipswich 选区州议员。进入议会前曾经营本地小生意，并长期参与 Ipswich 社区组织。",
      "zh-Hant": "昆州工黨政治人物，2015 年起任 Ipswich 選區州議員。進入議會前曾經營本地小生意，並長期參與 Ipswich 社區組織。",
      en: "Queensland Labor politician and state MP for Ipswich since 2015. Before parliament she ran a local small business and was active in Ipswich community organisations.",
      es: "Política laborista de Queensland y diputada estatal por Ipswich desde 2015. Antes del parlamento gestionó un pequeño negocio local y participó en organizaciones comunitarias de Ipswich.",
      ja: "クイーンズランド州労働党の政治家で、2015年から Ipswich 選出州議員です。議会入り前は地元の小規模事業を営み、Ipswich の地域団体で活動していました。",
      ko: "퀸즐랜드 노동당 정치인으로 2015년부터 Ipswich 주의원입니다. 의회 입성 전에는 지역 소규모 사업을 운영했고 Ipswich 지역사회 단체에서 활동했습니다.",
      vi: "Chính trị gia Labor tại Queensland và nghị sĩ bang khu Ipswich từ năm 2015. Trước quốc hội, bà điều hành một doanh nghiệp nhỏ địa phương và hoạt động trong các tổ chức cộng đồng Ipswich.",
      th: "นักการเมือง Labor ของ Queensland และ ส.ส. รัฐเขต Ipswich ตั้งแต่ปี 2015 ก่อนเข้าสภาเคยทำธุรกิจขนาดเล็กในพื้นที่และทำงานกับองค์กรชุมชนใน Ipswich",
      si: "2015 සිට Ipswich සඳහා Queensland Labor state MP වන Jennifer Howard, parliament ට පෙර දේශීය small business එකක් පවත්වා Ipswich community organisations වල ක්‍රියාකාරීව සිටියාය."
    },
    positions: {
      "zh-Hans": "她代表 Ipswich 地区议题，并在社区、心理健康和动物福利上较活跃；近期推动昆州逐步结束灰狗赛，并主张把 The Q 场地转作 2032 奥运相关体育用途。",
      "zh-Hant": "她代表 Ipswich 地區議題，並在社區、心理健康和動物福利上較活躍；近期推動昆州逐步結束灰狗賽，並主張把 The Q 場地轉作 2032 奧運相關體育用途。",
      en: "She focuses on Ipswich local issues, communities, mental health and animal welfare. Recently she has pushed Queensland to phase out greyhound racing and convert The Q site toward 2032 Olympics-related athletics use.",
      es: "Se centra en asuntos locales de Ipswich, comunidades, salud mental y bienestar animal. Recientemente ha impulsado que Queensland elimine gradualmente las carreras de galgos y convierta The Q para usos atléticos ligados a los Juegos de 2032.",
      ja: "Ipswich の地域課題、コミュニティ、メンタルヘルス、動物福祉に重点を置きます。最近はクイーンズランド州でグレイハウンド競走を段階的に廃止し、The Q を2032年五輪関連の陸上施設へ転用するよう求めています。",
      ko: "Ipswich 지역 현안, 지역사회, 정신건강, 동물복지에 중점을 둡니다. 최근에는 퀸즐랜드가 그레이하운드 경주를 단계적으로 폐지하고 The Q 부지를 2032 올림픽 관련 육상 용도로 전환해야 한다고 주장했습니다.",
      vi: "Bà tập trung vào vấn đề địa phương Ipswich, cộng đồng, sức khỏe tâm thần và phúc lợi động vật. Gần đây bà thúc đẩy Queensland loại bỏ dần đua greyhound và chuyển The Q sang mục đích điền kinh liên quan Olympic 2032.",
      th: "เธอเน้นประเด็นท้องถิ่น Ipswich ชุมชน สุขภาพจิต และสวัสดิภาพสัตว์ ช่วงหลังผลักดันให้ Queensland ค่อย ๆ ยุติ greyhound racing และเปลี่ยนพื้นที่ The Q ไปใช้ด้านกรีฑาที่เกี่ยวข้องกับโอลิมปิก 2032",
      si: "ඇය Ipswich local issues, communities, mental health සහ animal welfare මත අවධානය යොමු කරයි. මෑතකදී Queensland greyhound racing phase out කිරීම සහ The Q site එක 2032 Olympics සම්බන්ධ athletics භාවිතයට හැරවීම ඇය තල්ලු කරයි."
    }
  },
  {
    name: "Julian Leeser",
    aliases: ["Julian Leeser", "Julian Martin Leeser", "Julian Leeser MP", "朱利安·利瑟", "朱利安·利瑟", "ジュリアン・リーザー", "줄리언 리서"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.aph.gov.au/J_Leeser_MP" },
    background: {
      "zh-Hans": "澳大利亚自由党联邦议员，2016 年起代表 NSW 的 Berowra 选区。2026 年任反对党教育和原住民事务影子部长。",
      "zh-Hant": "澳洲自由黨聯邦議員，2016 年起代表 NSW 的 Berowra 選區。2026 年任反對黨教育和原住民事務影子部長。",
      en: "Federal Liberal MP for Berowra in NSW since 2016. In 2026 he serves as Shadow Minister for Education and Shadow Minister for Indigenous Australians.",
      es: "Diputado federal liberal por Berowra, NSW, desde 2016. En 2026 es ministro en la sombra de Educación y de Asuntos Indígenas.",
      ja: "NSW 州 Berowra 選出の連邦自由党議員で、2016年から下院議員です。2026年時点で教育担当および先住民担当の影の大臣です。",
      ko: "2016년부터 NSW Berowra를 대표하는 연방 자유당 하원의원입니다. 2026년에는 예비 교육장관과 예비 원주민호주인 장관을 맡고 있습니다.",
      vi: "Nghị sĩ Liberal liên bang khu Berowra ở NSW từ năm 2016. Năm 2026, ông là Shadow Minister for Education và Shadow Minister for Indigenous Australians.",
      th: "ส.ส. Liberal รัฐบาลกลางเขต Berowra ใน NSW ตั้งแต่ปี 2016 ในปี 2026 เป็น Shadow Minister for Education และ Shadow Minister for Indigenous Australians",
      si: "2016 සිට NSW හි Berowra නියෝජනය කරන Federal Liberal MP. 2026 දී ඔහු Shadow Minister for Education සහ Shadow Minister for Indigenous Australians වේ."
    },
    positions: {
      "zh-Hans": "他主张自由党温和保守路线，关注教育、宪政和原住民事务；曾因支持原住民 Voice 公投从影子内阁辞职，之后继续推动后公投阶段的原住民政策重设。",
      "zh-Hant": "他主張自由黨溫和保守路線，關注教育、憲政和原住民事務；曾因支持原住民 Voice 公投從影子內閣辭職，之後繼續推動後公投階段的原住民政策重設。",
      en: "He is a moderate conservative Liberal focused on education, constitutional issues and Indigenous affairs. He resigned from shadow cabinet over support for the Voice referendum, then continued pressing for a post-referendum Indigenous policy reset.",
      es: "Es un liberal conservador moderado centrado en educación, asuntos constitucionales y asuntos indígenas. Renunció al gabinete en la sombra por apoyar el referéndum de la Voice y luego siguió impulsando un reinicio de política indígena tras el referéndum.",
      ja: "教育、憲法問題、先住民政策を重視する穏健保守系の自由党議員です。Voice 国民投票支持を理由に影の内閣を辞任し、その後も国民投票後の先住民政策の立て直しを訴えています。",
      ko: "교육, 헌정 문제, 원주민 정책에 초점을 둔 온건 보수 성향의 자유당 의원입니다. Voice 국민투표 지지를 이유로 예비내각에서 사임했고, 이후 국민투표 이후 원주민 정책 재정비를 계속 주장했습니다.",
      vi: "Ông là nghị sĩ Liberal bảo thủ ôn hòa, tập trung vào giáo dục, vấn đề hiến pháp và Indigenous affairs. Ông rời shadow cabinet vì ủng hộ trưng cầu Voice, rồi tiếp tục thúc đẩy tái định hình chính sách Indigenous sau trưng cầu.",
      th: "เขาเป็น Liberal สายอนุรักษนิยมปานกลางที่เน้นการศึกษา ประเด็นรัฐธรรมนูญ และ Indigenous affairs เขาลาออกจาก shadow cabinet เพราะสนับสนุนประชามติ Voice และต่อมายังผลักดันการรีเซ็ตนโยบาย Indigenous หลังประชามติ",
      si: "ඔහු education, constitutional issues සහ Indigenous affairs මත අවධානය යොමු කරන moderate conservative Liberal MP. Voice referendum සහාය දීම නිසා shadow cabinet එකෙන් ඉල්ලා අස්වූ අතර පසුව post-referendum Indigenous policy reset එකක් තල්ලු කළේය."
    }
  },
  {
    name: "Yung Filly",
    aliases: ["Yung Filly", "Andres Felipe Valencia Barrientos", "Andrés Felipe Valencia Barrientos", "扬·菲利", "ヤング・フィリー", "영 필리"],
    type: "artist",
    social: { label: "YouTube", url: "https://www.youtube.com/channel/UCq3xWfTdDRjgyd7_WOK94Fg" },
    background: {
      "zh-Hans": "本名 Andres Felipe Valencia Barrientos，英国 YouTuber、主持人和说唱歌手，出生于哥伦比亚，在英国长大。曾与 Beta Squad、BBC 和多档网络节目合作，2024 年澳洲巡演后卷入西澳刑事案件。",
      "zh-Hant": "本名 Andres Felipe Valencia Barrientos，英國 YouTuber、主持人和饒舌歌手，出生於哥倫比亞，在英國長大。曾與 Beta Squad、BBC 和多檔網路節目合作，2024 年澳洲巡演後捲入西澳刑事案件。",
      en: "Real name Andres Felipe Valencia Barrientos, a British YouTuber, presenter and rapper who was born in Colombia and grew up in the UK. He has worked with Beta Squad, the BBC and online entertainment shows, and became involved in a WA criminal case after a 2024 Australian tour.",
      es: "Nombre real Andres Felipe Valencia Barrientos, YouTuber, presentador y rapero británico nacido en Colombia y criado en Reino Unido. Ha trabajado con Beta Squad, la BBC y programas de entretenimiento online, y quedó involucrado en un caso penal de WA tras una gira australiana en 2024.",
      ja: "本名 Andres Felipe Valencia Barrientos。コロンビア生まれで英国育ちの英国 YouTuber、司会者、ラッパーです。Beta Squad、BBC、オンライン番組で活動し、2024年の豪州ツアー後に西オーストラリア州の刑事事件に関与しました。",
      ko: "본명은 Andres Felipe Valencia Barrientos이며 콜롬비아에서 태어나 영국에서 성장한 영국 유튜버, 진행자, 래퍼입니다. Beta Squad, BBC, 온라인 엔터테인먼트 프로그램과 작업했고 2024년 호주 투어 뒤 WA 형사 사건에 연루됐습니다.",
      vi: "Tên thật Andres Felipe Valencia Barrientos, YouTuber, người dẫn chương trình và rapper người Anh, sinh tại Colombia và lớn lên ở Anh. Anh từng làm với Beta Squad, BBC và các chương trình giải trí online, và vướng một vụ án hình sự tại WA sau tour Úc năm 2024.",
      th: "ชื่อจริง Andres Felipe Valencia Barrientos เป็น YouTuber พิธีกร และแรปเปอร์ชาวอังกฤษ เกิดในโคลอมเบียและเติบโตในสหราชอาณาจักร เคยทำงานกับ Beta Squad, BBC และรายการบันเทิงออนไลน์ และเกี่ยวข้องกับคดีอาญาใน WA หลังทัวร์ออสเตรเลียปี 2024",
      si: "සැබෑ නම Andres Felipe Valencia Barrientos. Colombia හි උපත ලබා UK හි වැඩුණු British YouTuber, presenter සහ rapper. Beta Squad, BBC සහ online entertainment shows සමඟ කටයුතු කර ඇති අතර 2024 Australian tour එකෙන් පසු WA criminal case එකකට සම්බන්ධ විය."
    }
  },
  {
    name: "Chris Bowen",
    aliases: ["Chris Bowen", "Christopher Bowen", "克里斯·鲍恩", "克里斯·鮑恩", "クリス・ボーエン", "크리스 보언"],
    type: "politician",
    profile: { label: "Minister biography", url: "https://minister.dcceew.gov.au/bowen" },
    officialProfile: { label: "Parliament profile", url: "https://www.aph.gov.au/C_Bowen_MP" },
    social: { label: "Facebook", url: "https://www.facebook.com/chrisbowenmp/" },
    background: {
      "zh-Hans": "澳洲工党联邦议员，代表 NSW 的 McMahon 选区，2022 年起任联邦气候变化和能源部长。此前曾任影子财长、移民部长和多项经济相关职务。",
      "zh-Hant": "澳洲工黨聯邦議員，代表 NSW 的 McMahon 選區，2022 年起任聯邦氣候變化和能源部長。此前曾任影子財長、移民部長和多項經濟相關職務。",
      en: "Federal Labor MP for McMahon in NSW and Minister for Climate Change and Energy since 2022. He previously served as shadow treasurer, immigration minister and in several economic portfolios.",
      es: "Diputado federal laborista por McMahon, NSW, y ministro de Cambio Climático y Energía desde 2022. Antes fue tesorero en la sombra, ministro de Inmigración y ocupó varias carteras económicas.",
      ja: "NSW 州 McMahon 選出の連邦労働党議員で、2022年から気候変動・エネルギー相です。以前は影の財務相、移民相、複数の経済関連職を務めました。",
      ko: "NSW McMahon 지역구의 연방 노동당 하원의원이며 2022년부터 기후변화·에너지 장관입니다. 이전에는 예비 재무장관, 이민장관, 여러 경제 관련 직책을 맡았습니다.",
      vi: "Nghị sĩ Labor liên bang khu McMahon ở NSW và là Bộ trưởng Biến đổi khí hậu và Năng lượng từ năm 2022. Trước đó ông từng là shadow treasurer, bộ trưởng di trú và giữ nhiều vị trí kinh tế.",
      th: "ส.ส. Labor รัฐบาลกลางเขต McMahon ใน NSW และเป็นรัฐมนตรี Climate Change and Energy ตั้งแต่ปี 2022 ก่อนหน้านี้เคยเป็น shadow treasurer รัฐมนตรีตรวจคนเข้าเมือง และดำรงตำแหน่งด้านเศรษฐกิจหลายบทบาท",
      si: "NSW හි McMahon නියෝජනය කරන Federal Labor MP වන අතර 2022 සිට Minister for Climate Change and Energy වේ. මීට පෙර shadow treasurer, immigration minister සහ economic portfolios කිහිපයක සේවය කළේය."
    },
    positions: {
      "zh-Hans": "主要推动减排、电网和可再生能源扩张、家庭电池补贴、燃料安全和能源价格政策；批评者常把电价、煤气可靠性和气候目标执行压力归到其职责范围。",
      "zh-Hant": "主要推動減排、電網和可再生能源擴張、家庭電池補貼、燃料安全和能源價格政策；批評者常把電價、煤氣可靠性和氣候目標執行壓力歸到其職責範圍。",
      en: "His portfolio focuses on emissions reduction, grid and renewable expansion, household battery support, fuel security and energy prices. Critics often tie power bills, gas reliability and delivery of climate targets to his role.",
      es: "Su cartera se centra en reducción de emisiones, red eléctrica y renovables, apoyo a baterías domésticas, seguridad de combustibles y precios energéticos. Sus críticos suelen vincular su cargo con facturas eléctricas, fiabilidad del gas y cumplimiento de metas climáticas.",
      ja: "排出削減、送電網と再エネ拡大、家庭用蓄電池支援、燃料安全保障、エネルギー価格を所管します。電気料金、ガス供給信頼性、気候目標の実行が批判の焦点になりがちです。",
      ko: "배출 감축, 전력망과 재생에너지 확대, 가정용 배터리 지원, 연료 안보와 에너지 가격을 담당합니다. 전기요금, 가스 신뢰성, 기후 목표 이행이 그의 책임과 연결돼 비판받곤 합니다.",
      vi: "Danh mục của ông tập trung vào giảm phát thải, mở rộng lưới điện và năng lượng tái tạo, hỗ trợ pin gia đình, an ninh nhiên liệu và giá năng lượng. Các chỉ trích thường gắn hóa đơn điện, độ tin cậy khí đốt và việc đạt mục tiêu khí hậu với vai trò của ông.",
      th: "งานหลักคือการลดการปล่อยก๊าซ การขยายกริดและพลังงานหมุนเวียน การสนับสนุนแบตเตอรี่บ้าน ความมั่นคงเชื้อเพลิง และราคาไฟฟ้า นักวิจารณ์มักโยงค่าไฟ ความน่าเชื่อถือของก๊าซ และการทำตามเป้าหมายภูมิอากาศกับบทบาทของเขา",
      si: "ඔහුගේ portfolio එක emissions reduction, grid/renewable expansion, household battery support, fuel security සහ energy prices වටා වේ. Power bills, gas reliability සහ climate targets delivery ඔහුගේ role එකට සම්බන්ධ කරමින් විවේචන එල්ල වේ."
    }
  },
  {
    name: "Jordon Steele-John",
    aliases: ["Jordon Steele-John", "Jordon Alexander Steele-John", "Senator Jordon", "乔登·斯蒂尔-约翰", "喬登·斯蒂爾-約翰", "ジョードン・スティール＝ジョン", "조던 스틸-존"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID=250156" },
    officialProfile: { label: "Greens profile", url: "https://greens.org.au/wa/person/jordon-steele-john" },
    social: { label: "X", url: "https://x.com/SenatorJordon" },
    background: {
      "zh-Hans": "西澳 Australian Greens 联邦参议员，2017 年进入参议院，也是残障权利倡议者。其公开工作长期围绕 NDIS、残障包容、青年、健康和心理健康。",
      "zh-Hant": "西澳 Australian Greens 聯邦參議員，2017 年進入參議院，也是殘障權利倡議者。其公開工作長期圍繞 NDIS、殘障包容、青年、健康和心理健康。",
      en: "Australian Greens senator for Western Australia since 2017 and a disability-rights advocate. His public work has focused on the NDIS, disability inclusion, youth, health and mental health.",
      es: "Senador de Australian Greens por Australia Occidental desde 2017 y defensor de los derechos de las personas con discapacidad. Su trabajo público se centra en NDIS, inclusión, juventud, salud y salud mental.",
      ja: "2017年から西オーストラリア州選出の Australian Greens 上院議員で、障害者権利の提唱者です。NDIS、障害包摂、若者、健康、メンタルヘルスを主に扱っています。",
      ko: "2017년부터 서호주를 대표하는 Australian Greens 상원의원이자 장애 권리 옹호자입니다. NDIS, 장애 포용, 청년, 보건과 정신건강에 초점을 맞춰 활동합니다.",
      vi: "Thượng nghị sĩ Australian Greens của Tây Úc từ năm 2017 và là nhà vận động quyền người khuyết tật. Công việc công của ông tập trung vào NDIS, hòa nhập khuyết tật, thanh niên, y tế và sức khỏe tâm thần.",
      th: "วุฒิสมาชิก Australian Greens จากเวสเทิร์นออสเตรเลียตั้งแต่ปี 2017 และนักรณรงค์สิทธิคนพิการ งานสาธารณะเน้น NDIS การมีส่วนร่วมของคนพิการ เยาวชน สุขภาพ และสุขภาพจิต",
      si: "2017 සිට Western Australia සඳහා Australian Greens senator කෙනෙකු වන අතර disability-rights advocate කෙනෙකි. ඔහුගේ public work එක NDIS, disability inclusion, youth, health සහ mental health මත යොමු වේ."
    },
    positions: {
      "zh-Hans": "他主张加强而非削弱 NDIS、提高残障人士自主权和共同设计权，并把残障服务、心理健康、青年权益和反战议题作为 Greens 议程的一部分。",
      "zh-Hant": "他主張加強而非削弱 NDIS、提高殘障人士自主權和共同設計權，並把殘障服務、心理健康、青年權益和反戰議題作為 Greens 議程的一部分。",
      en: "He argues for strengthening rather than weakening the NDIS, greater autonomy and co-design for disabled people, and links disability services, mental health, youth rights and anti-war policy within the Greens agenda.",
      es: "Defiende reforzar, no debilitar, el NDIS; más autonomía y codiseño para personas con discapacidad; y conecta servicios de discapacidad, salud mental, derechos juveniles y política antibélica en la agenda Greens.",
      ja: "NDIS を弱めるのではなく強化し、障害者の自律と共同設計を広げる立場です。障害サービス、メンタルヘルス、若者の権利、反戦政策を Greens の政策軸に結びつけています。",
      ko: "NDIS를 약화하기보다 강화하고, 장애인의 자율성과 공동 설계를 확대해야 한다고 주장합니다. 장애 서비스, 정신건강, 청년 권리, 반전 정책을 Greens 의제로 연결합니다.",
      vi: "Ông ủng hộ củng cố thay vì làm suy yếu NDIS, tăng quyền tự chủ và đồng thiết kế cho người khuyết tật, đồng thời gắn dịch vụ khuyết tật, sức khỏe tâm thần, quyền thanh niên và chính sách phản chiến trong nghị trình Greens.",
      th: "เขาสนับสนุนการทำให้ NDIS แข็งแรงขึ้น ไม่ใช่อ่อนลง เพิ่มอำนาจตัดสินใจและ co-design ให้คนพิการ และเชื่อมบริการคนพิการ สุขภาพจิต สิทธิคนรุ่นใหม่ และนโยบายต่อต้านสงครามในวาระ Greens",
      si: "ඔහු NDIS දුර්වල කිරීම නොව ශක්තිමත් කිරීම, disabled people සඳහා autonomy සහ co-design වැඩි කිරීම වෙනුවෙන් පෙනී සිටී; disability services, mental health, youth rights සහ anti-war policy Greens agenda එකට සම්බන්ධ කරයි."
    }
  },
  {
    name: "Kristy McBain",
    aliases: ["Kristy McBain", "Kristy McBain MP", "Kristy Lorraine McBain", "克里斯蒂·麦克贝恩", "克里斯蒂·麥克貝恩", "クリスティ・マクベイン", "크리스티 맥베인"],
    type: "politician",
    profile: { label: "Minister profile", url: "https://minister.infrastructure.gov.au/mcbain" },
    officialProfile: { label: "Parliament profile", url: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID=282928" },
    social: { label: "X", url: "https://x.com/KristyMcBain" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/kristymcbainMP/" },
    background: {
      "zh-Hans": "澳洲工党联邦议员，代表 NSW 的 Eden-Monaro，曾任 Bega Valley 市长。2025 年起任紧急管理部长、区域发展、地方政府和领地部长。",
      "zh-Hant": "澳洲工黨聯邦議員，代表 NSW 的 Eden-Monaro，曾任 Bega Valley 市長。2025 年起任緊急管理部長、區域發展、地方政府和領地部長。",
      en: "Federal Labor MP for Eden-Monaro in NSW and former Bega Valley mayor. Since 2025 she has served as Minister for Emergency Management and Minister for Regional Development, Local Government and Territories.",
      es: "Diputada federal laborista por Eden-Monaro, NSW, y exalcaldesa de Bega Valley. Desde 2025 es ministra de Gestión de Emergencias y de Desarrollo Regional, Gobierno Local y Territorios.",
      ja: "NSW 州 Eden-Monaro 選出の連邦 Labor 議員で、元 Bega Valley 市長です。2025年から緊急管理相、地域開発・地方自治・準州相を務めています。",
      ko: "NSW Eden-Monaro 지역구의 연방 Labor 하원의원이자 전 Bega Valley 시장입니다. 2025년부터 비상관리 장관과 지역개발·지방정부·준주 장관을 맡고 있습니다.",
      vi: "Nghị sĩ Labor liên bang khu Eden-Monaro ở NSW và cựu thị trưởng Bega Valley. Từ năm 2025, bà là Bộ trưởng Emergency Management và Bộ trưởng Regional Development, Local Government and Territories.",
      th: "ส.ส. Labor รัฐบาลกลางเขต Eden-Monaro ใน NSW และอดีตนายกเทศมนตรี Bega Valley ตั้งแต่ปี 2025 เป็นรัฐมนตรี Emergency Management และ Regional Development, Local Government and Territories",
      si: "NSW හි Eden-Monaro නියෝජනය කරන Federal Labor MP සහ හිටපු Bega Valley mayor. 2025 සිට Minister for Emergency Management සහ Minister for Regional Development, Local Government and Territories වේ."
    },
    positions: {
      "zh-Hans": "其职责覆盖自然灾害应对和恢复、区域发展、地方政府、领地事务以及 National Capital Authority 相关决策；Hume Circle 规划审批属于其领地职责范围。",
      "zh-Hant": "其職責覆蓋自然災害應對和恢復、區域發展、地方政府、領地事務以及 National Capital Authority 相關決策；Hume Circle 規劃審批屬於其領地職責範圍。",
      en: "Her portfolio covers disaster response and recovery, regional development, local government, territories and decisions linked to the National Capital Authority; Hume Circle planning approval sits within that territories remit.",
      es: "Su cartera cubre respuesta y recuperación ante desastres, desarrollo regional, gobierno local, territorios y decisiones vinculadas a la National Capital Authority; la aprobación de Hume Circle cae en ese ámbito territorial.",
      ja: "災害対応・復旧、地域開発、地方自治、準州、National Capital Authority 関連の判断を所管します。Hume Circle の計画承認はその準州担当に含まれます。",
      ko: "재난 대응과 복구, 지역개발, 지방정부, 준주, National Capital Authority 관련 결정을 담당합니다. Hume Circle 계획 승인은 이 준주 소관에 포함됩니다.",
      vi: "Danh mục của bà gồm ứng phó và phục hồi thiên tai, phát triển vùng, chính quyền địa phương, lãnh thổ và các quyết định liên quan National Capital Authority; phê duyệt quy hoạch Hume Circle thuộc phần lãnh thổ này.",
      th: "งานของเธอครอบคลุมการรับมือและฟื้นฟูภัยพิบัติ การพัฒนาภูมิภาค รัฐบาลท้องถิ่น territories และการตัดสินใจที่เกี่ยวกับ National Capital Authority โดยการอนุมัติแผน Hume Circle อยู่ในขอบเขต territories นี้",
      si: "ඇයගේ portfolio එක disaster response/recovery, regional development, local government, territories සහ National Capital Authority decisions ආවරණය කරයි; Hume Circle planning approval එම territories remit එකට අයත් වේ."
    }
  },
  {
    name: "Karen Doran",
    aliases: ["Karen Doran", "Karen Doran PSM", "Ms Karen Doran", "凯伦·多兰", "凱倫·多蘭", "カレン・ドーラン", "캐런 도런"],
    type: "public-figure",
    profile: { label: "NCA board profile", url: "https://www.nca.gov.au/about-us/who-we-are/our-board" },
    officialProfile: { label: "Government directory", url: "https://www.directory.gov.au/portfolios/infrastructure-transport-regional-development-communications-and-arts/national-capital-authority/chief-executive" },
    personalSocial: { label: "LinkedIn", url: "https://au.linkedin.com/in/karen-doran-5ba902284" },
    background: {
      "zh-Hans": "National Capital Authority 首席执行官，2024 年 4 月起任五年期。此前在 ACT 公共部门担任高级领导职务，包括 Transport Canberra and City Services 代理总干事和 Major Projects Canberra 代理首席项目官。",
      "zh-Hant": "National Capital Authority 行政總裁，2024 年 4 月起任五年期。此前在 ACT 公共部門擔任高級領導職務，包括 Transport Canberra and City Services 代理總幹事和 Major Projects Canberra 代理首席項目官。",
      en: "Chief executive of the National Capital Authority, appointed for a five-year term from April 2024. She previously held senior ACT public-sector roles, including acting director-general of Transport Canberra and City Services and acting chief project officer at Major Projects Canberra.",
      es: "Directora ejecutiva de la National Capital Authority, nombrada por cinco años desde abril de 2024. Antes ocupó altos cargos públicos en ACT, incluidos directora general interina de Transport Canberra and City Services y chief project officer interina en Major Projects Canberra.",
      ja: "National Capital Authority の最高責任者で、2024年4月から5年任期です。以前は ACT 公共部門で Transport Canberra and City Services の暫定局長、Major Projects Canberra の暫定 chief project officer などを務めました。",
      ko: "2024년 4월부터 5년 임기로 임명된 National Capital Authority 최고경영자입니다. 이전에는 Transport Canberra and City Services 직무대행 국장, Major Projects Canberra 직무대행 chief project officer 등 ACT 공공부문 고위직을 맡았습니다.",
      vi: "Giám đốc điều hành National Capital Authority, được bổ nhiệm nhiệm kỳ 5 năm từ tháng 4 năm 2024. Trước đó bà giữ các vai trò cấp cao trong khu vực công ACT, gồm acting director-general của Transport Canberra and City Services và acting chief project officer tại Major Projects Canberra.",
      th: "Chief executive ของ National Capital Authority ได้รับแต่งตั้งวาระห้าปีตั้งแต่เมษายน 2024 ก่อนหน้านี้ดำรงตำแหน่งอาวุโสในภาครัฐ ACT รวมถึง acting director-general ของ Transport Canberra and City Services และ acting chief project officer ที่ Major Projects Canberra",
      si: "2024 අප්‍රේල් සිට වසර පහක term එකකට පත් වූ National Capital Authority chief executive. මීට පෙර ACT public-sector senior roles, Transport Canberra and City Services acting director-general සහ Major Projects Canberra acting chief project officer ලෙස කටයුතු කළාය."
    }
  },
  {
    name: "Peter Malinauskas",
    aliases: ["Peter Malinauskas", "Peter Bryden Malinauskas", "彼得·马利瑙斯卡斯", "彼得·馬利瑙斯卡斯", "ピーター・マリナウスカス", "피터 말리나우스카스"],
    type: "politician",
    social: { label: "Official profile", url: "https://premier.sa.gov.au/the-team/peter-malinauskas-mp" },
    background: {
      "zh-Hans": "南澳工党政治人物，Croydon 州议员，2018 年起任南澳工党领袖，2022 年起任南澳州长。进入议会前曾在工会运动中任职。",
      "zh-Hant": "南澳工黨政治人物，Croydon 州議員，2018 年起任南澳工黨領袖，2022 年起任南澳州長。進入議會前曾在工會運動中任職。",
      en: "South Australian Labor politician, MP for Croydon, state Labor leader since 2018 and Premier of South Australia since 2022. Before parliament he worked in the union movement.",
      es: "Político laborista de Australia Meridional, diputado por Croydon, líder laborista estatal desde 2018 y premier de Australia Meridional desde 2022. Antes del parlamento trabajó en el movimiento sindical.",
      ja: "南オーストラリア州労働党の政治家。Croydon 選出州議員で、2018年から州労働党党首、2022年から州首相です。議会入り前は労組運動で活動しました。",
      ko: "남호주 노동당 정치인으로 Croydon 주의원이며 2018년부터 주 노동당 대표, 2022년부터 남호주 주총리입니다. 의회 입성 전에는 노조 운동에서 일했습니다.",
      vi: "Chính trị gia Labor tại Nam Úc, nghị sĩ bang khu Croydon, lãnh đạo Labor bang từ năm 2018 và Premier of South Australia từ năm 2022. Trước quốc hội, ông làm trong phong trào công đoàn.",
      th: "นักการเมือง Labor ของรัฐเซาท์ออสเตรเลีย ส.ส. เขต Croydon เป็นผู้นำ Labor ของรัฐตั้งแต่ปี 2018 และ Premier of South Australia ตั้งแต่ปี 2022 ก่อนเข้าสภาทำงานในขบวนการสหภาพ",
      si: "South Australian Labor දේශපාලනඥයෙකු වන ඔහු Croydon MP, 2018 සිට state Labor leader සහ 2022 සිට Premier of South Australia වේ. Parliament ට පෙර union movement එකේ කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "主要强调医疗能力、AUKUS 和国防产业、能源转型、制造业和州经济增长；在青少年社交媒体限制和公共安全议题上也采取积极干预路线。",
      "zh-Hant": "主要強調醫療能力、AUKUS 和國防產業、能源轉型、製造業和州經濟增長；在青少年社交媒體限制和公共安全議題上也採取積極干預路線。",
      en: "His agenda emphasises health capacity, AUKUS and defence industry, energy transition, manufacturing and state growth. He has also taken an interventionist line on youth social-media restrictions and public safety.",
      es: "Su agenda enfatiza capacidad sanitaria, AUKUS e industria de defensa, transición energética, manufactura y crecimiento estatal. También ha adoptado una línea intervencionista sobre restricciones de redes sociales para menores y seguridad pública.",
      ja: "医療体制、AUKUS と防衛産業、エネルギー転換、製造業、州経済成長を重視します。未成年のSNS制限や公共安全でも積極介入型の姿勢を取っています。",
      ko: "보건 역량, AUKUS와 방위산업, 에너지 전환, 제조업, 주 경제 성장을 강조합니다. 청소년 소셜미디어 제한과 공공안전에도 적극 개입 노선을 보입니다.",
      vi: "Chương trình của ông nhấn mạnh năng lực y tế, AUKUS và công nghiệp quốc phòng, chuyển đổi năng lượng, sản xuất và tăng trưởng bang. Ông cũng can thiệp mạnh về hạn chế mạng xã hội cho trẻ em và an toàn công cộng.",
      th: "วาระหลักคือศักยภาพระบบสุขภาพ AUKUS และอุตสาหกรรมกลาโหม การเปลี่ยนผ่านพลังงาน การผลิต และการเติบโตของรัฐ เขายังใช้แนวทางแทรกแซงมากขึ้นเรื่องข้อจำกัดโซเชียลมีเดียของเยาวชนและความปลอดภัยสาธารณะ",
      si: "ඔහුගේ agenda එක health capacity, AUKUS/defence industry, energy transition, manufacturing සහ state growth අවධාරණය කරයි. Youth social-media restrictions සහ public safety සම්බන්ධයෙන්ද interventionist line එකක් ගනී."
    }
  },
  {
    name: "Grant Stevens",
    aliases: ["Grant Stevens", "Grantley Stevens", "Grantley John Stevens", "格兰特·史蒂文斯", "グラント・スティーブンス", "그랜트 스티븐스"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://www.police.sa.gov.au/about-us/annual-reporting/annual-report-preparation-2019/overview-about-the-agency" },
    background: {
      "zh-Hans": "南澳警察总监，2015 年起领导 South Australia Police。其职责包括全州警务、重大公共安全事件协调和警队治理；新冠期间曾担任南澳州紧急协调员。",
      "zh-Hant": "南澳警察總監，2015 年起領導 South Australia Police。其職責包括全州警務、重大公共安全事件協調和警隊治理；新冠期間曾擔任南澳州緊急協調員。",
      en: "Commissioner of South Australia Police since 2015. His role covers statewide policing, major public-safety coordination and police governance; during COVID he served as South Australia's state emergency coordinator.",
      es: "Comisionado de South Australia Police desde 2015. Su cargo abarca policía estatal, coordinación de grandes incidentes de seguridad pública y gobernanza policial; durante la COVID fue coordinador estatal de emergencias de Australia Meridional.",
      ja: "2015年から South Australia Police の警察長官です。州全体の警務、重大な公共安全事案の調整、警察組織の統治を担い、COVID 期には南オーストラリア州の緊急調整官も務めました。",
      ko: "2015년부터 South Australia Police 청장입니다. 주 전역 치안, 주요 공공안전 조정, 경찰 거버넌스를 담당하며 코로나19 기간에는 남호주 주 비상조정관을 맡았습니다.",
      vi: "Ủy viên South Australia Police từ năm 2015. Vai trò bao gồm cảnh sát toàn bang, điều phối các sự kiện an toàn công cộng lớn và quản trị lực lượng; trong COVID, ông là state emergency coordinator của Nam Úc.",
      th: "Commissioner ของ South Australia Police ตั้งแต่ปี 2015 รับผิดชอบงานตำรวจทั้งรัฐ การประสานเหตุความปลอดภัยสาธารณะขนาดใหญ่ และ governance ของตำรวจ ช่วง COVID เคยเป็น state emergency coordinator ของ South Australia",
      si: "2015 සිට South Australia Police Commissioner. Statewide policing, major public-safety coordination සහ police governance ඔහුගේ role එකට අයත් අතර COVID කාලයේ South Australia state emergency coordinator ලෙසද කටයුතු කළේය."
    }
  },
  {
    name: "Winston Peters",
    aliases: ["Winston Peters", "Winston Raymond Peters", "温斯顿·彼得斯", "溫斯頓·彼得斯", "ウィンストン・ピーターズ", "윈스턴 피터스"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.beehive.govt.nz/minister/biography/winston-peters-0" },
    background: {
      "zh-Hans": "新西兰 First 党创始人和长期国会议员，现任新西兰外交部长、赛马部长和铁路部长，曾三度担任副总理。",
      "zh-Hant": "紐西蘭 First 黨創辦人和長期國會議員，現任紐西蘭外交部長、賽馬部長和鐵路部長，曾三度擔任副總理。",
      en: "Founder of New Zealand First and long-serving New Zealand MP. He is Minister of Foreign Affairs, Minister for Racing and Minister for Rail, and has served three periods as deputy prime minister.",
      es: "Fundador de New Zealand First y diputado neozelandés de larga trayectoria. Es ministro de Exteriores, ministro de Racing y ministro de Rail, y ha sido viceprimer ministro en tres periodos.",
      ja: "New Zealand First の創設者で、長年のニュージーランド国会議員です。外相、競馬相、鉄道相を務め、副首相も3期務めました。",
      ko: "New Zealand First 창립자이자 뉴질랜드의 장기 국회의원입니다. 외교장관, 경마장관, 철도장관이며 세 차례 부총리를 지냈습니다.",
      vi: "Nhà sáng lập New Zealand First và nghị sĩ New Zealand lâu năm. Ông là Bộ trưởng Ngoại giao, Bộ trưởng Racing và Bộ trưởng Rail, từng ba giai đoạn làm phó thủ tướng.",
      th: "ผู้ก่อตั้ง New Zealand First และ ส.ส. นิวซีแลนด์มายาวนาน ปัจจุบันเป็นรัฐมนตรีต่างประเทศ รัฐมนตรี Racing และรัฐมนตรี Rail และเคยเป็นรองนายกรัฐมนตรีสามช่วง",
      si: "New Zealand First founder සහ දිගුකාලීන New Zealand MP. ඔහු Minister of Foreign Affairs, Minister for Racing සහ Minister for Rail වන අතර deputy prime minister ලෙස කාල තුනක සේවය කළේය."
    },
    positions: {
      "zh-Hans": "其政治路线强调民族主义、移民控制、地区和老年选民利益、赛马业改革以及对外资和大型企业权力的怀疑；在灰狗赛关闭中负责赛马部长职责。",
      "zh-Hant": "其政治路線強調民族主義、移民控制、地區和老年選民利益、賽馬業改革以及對外資和大型企業權力的懷疑；在灰狗賽關閉中負責賽馬部長職責。",
      en: "His politics stress nationalism, tighter immigration, regional and older-voter interests, racing-industry reform and scepticism toward foreign ownership and large corporate power; he holds the racing portfolio during the greyhound-racing shutdown.",
      es: "Su política enfatiza nacionalismo, inmigración más estricta, intereses regionales y de votantes mayores, reforma de la industria de carreras y escepticismo ante propiedad extranjera y grandes empresas; lleva la cartera de racing durante el cierre de las carreras de galgos.",
      ja: "ナショナリズム、移民規制、地方・高齢有権者の利益、競馬産業改革、外国資本や大企業権力への懐疑を重視します。グレイハウンド競走廃止期には競馬相を務めています。",
      ko: "민족주의, 엄격한 이민, 지역과 고령 유권자 이익, 경마 산업 개혁, 외국인 소유와 대기업 권력에 대한 회의론을 강조합니다. 그레이하운드 경주 폐쇄 기간 경마 포트폴리오를 맡고 있습니다.",
      vi: "Chính trị của ông nhấn mạnh chủ nghĩa dân tộc, siết nhập cư, lợi ích vùng và cử tri lớn tuổi, cải cách ngành racing và hoài nghi sở hữu nước ngoài cùng quyền lực doanh nghiệp lớn; ông giữ danh mục racing trong quá trình đóng cửa đua greyhound.",
      th: "แนวทางการเมืองเน้นชาตินิยม การคุมคนเข้าเมือง ผลประโยชน์ภูมิภาคและผู้สูงวัย การปฏิรูปอุตสาหกรรม racing และความระแวงต่อทุนต่างชาติและอำนาจบริษัทใหญ่ เขาถือ portfolio racing ระหว่างการปิด greyhound racing",
      si: "ඔහුගේ politics nationalism, tighter immigration, regional/older-voter interests, racing-industry reform සහ foreign ownership/large corporate power පිළිබඳ scepticism අවධාරණය කරයි; greyhound-racing shutdown කාලයේ racing portfolio ඔහුට අයත් වේ."
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
    aliases: ["David Connolly", "Administrator David Connolly", "NT Administrator David Connolly", "大卫·康诺利", "大衛·康諾利", "デービッド・コノリー", "데이비드 코널리"],
    type: "public-figure",
    profile: { label: "Government House profile", url: "https://govhouse.nt.gov.au/the-administrator/about-the-administrator" },
    officialProfile: { label: "Official biography", url: "https://govhouse.nt.gov.au/the-administrator/about-the-administrator" },
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
    name: "David Gibson",
    aliases: ["David Gibson", "David Francis Gibson", "大卫·吉布森", "大衛·吉布森", "デービッド・ギブソン", "데이비드 깁슨"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.parliament.qld.gov.au/Members/Former-Members/Former-Members-Register/Former-Member-Details?id=56257014" },
    background: {
      "zh-Hans": "澳大利亚前陆军军官和前昆州 LNP 政治人物，2006 年至 2015 年任 Gympie 州议员，曾短暂担任昆州警察和社区安全部长。离开政界后从事聋人服务、照护和 LGBTI 长者权益倡导，现任 GRAI 主席。",
      "zh-Hant": "澳洲前陸軍軍官和前昆州 LNP 政治人物，2006 年至 2015 年任 Gympie 州議員，曾短暫擔任昆州警察和社區安全部長。離開政界後從事聾人服務、照護和 LGBTI 長者權益倡議，現任 GRAI 主席。",
      en: "Former Australian Army officer and Queensland LNP politician, MP for Gympie from 2006 to 2015 and briefly Queensland minister for police and community safety. Since leaving parliament he has worked in deaf services, care and LGBTI ageing advocacy, and chairs GRAI.",
      es: "Exoficial del ejército australiano y ex político LNP de Queensland, diputado por Gympie entre 2006 y 2015 y brevemente ministro estatal de Policía y Seguridad Comunitaria. Tras dejar el parlamento ha trabajado en servicios para personas sordas, cuidados y defensa de mayores LGBTI, y preside GRAI.",
      ja: "元豪陸軍将校で、クイーンズランド州 LNP の元政治家。2006年から2015年まで Gympie 選出州議員で、一時は州警察・地域安全相も務めました。政界引退後はろう者サービス、介護、LGBTI 高齢者支援に携わり、GRAI の議長です。",
      ko: "전 호주 육군 장교이자 퀸즐랜드 LNP 정치인으로 2006년부터 2015년까지 Gympie 주의원이었고 한때 퀸즐랜드 경찰·지역사회안전 장관을 지냈습니다. 의회 퇴임 후 청각장애인 서비스, 돌봄, LGBTI 노년층 권익 활동을 해 왔으며 GRAI 의장입니다.",
      vi: "Cựu sĩ quan Australian Army và cựu chính trị gia LNP tại Queensland, nghị sĩ bang khu Gympie từ 2006 đến 2015 và từng ngắn hạn làm bộ trưởng cảnh sát và an toàn cộng đồng Queensland. Sau quốc hội, ông làm trong dịch vụ người điếc, chăm sóc và vận động quyền lợi người cao tuổi LGBTI, hiện là chủ tịch GRAI.",
      th: "อดีตนายทหาร Australian Army และอดีตนักการเมือง LNP ของ Queensland เป็น ส.ส. รัฐเขต Gympie ระหว่างปี 2006-2015 และเคยเป็นรัฐมนตรีตำรวจและความปลอดภัยชุมชนช่วงสั้น ๆ หลังออกจากสภาทำงานด้านบริการคนหูหนวก การดูแล และการรณรงค์เพื่อผู้สูงอายุ LGBTI ปัจจุบันเป็นประธาน GRAI",
      si: "හිටපු Australian Army officer සහ Queensland LNP දේශපාලනඥයෙකු වූ ඔහු 2006-2015 අතර Gympie MP වූ අතර කෙටි කලක් Queensland minister for police and community safety විය. Parliament හැර ගිය පසු deaf services, care සහ LGBTI ageing advocacy වල කටයුතු කරමින් GRAI chair ලෙස සිටී."
    },
    positions: {
      "zh-Hans": "在政界时属于昆州 LNP 的温和派声音，曾公开支持 LGBTIQ 权利和残障包容；近年主要倡导历史性国防歧视补救、LGBTI 长者服务和照护政策。",
      "zh-Hant": "在政界時屬於昆州 LNP 的溫和派聲音，曾公開支持 LGBTIQ 權利和身心障礙包容；近年主要倡議歷史性國防歧視補救、LGBTI 長者服務和照護政策。",
      en: "In politics he was a moderate Queensland LNP voice who publicly backed LGBTIQ rights and disability inclusion; his recent advocacy focuses on redress for historic defence discrimination, LGBTI ageing services and care policy.",
      es: "En política fue una voz moderada del LNP de Queensland que apoyó públicamente derechos LGBTIQ e inclusión de la discapacidad; su activismo reciente se centra en reparación por discriminación histórica en Defensa, servicios para mayores LGBTI y política de cuidados.",
      ja: "政界ではクイーンズランド LNP の穏健派として、LGBTIQ の権利や障害者包摂を支持しました。近年は国防分野の過去の差別への補償、LGBTI 高齢者サービス、介護政策を訴えています。",
      ko: "정치권에서는 퀸즐랜드 LNP 내 온건파로 LGBTIQ 권리와 장애 포용을 공개 지지했습니다. 최근에는 과거 국방 차별 구제, LGBTI 노년층 서비스, 돌봄 정책을 중심으로 활동합니다.",
      vi: "Trong chính trị, ông là tiếng nói ôn hòa trong LNP Queensland, công khai ủng hộ quyền LGBTIQ và disability inclusion; vận động gần đây tập trung vào bồi hoàn cho phân biệt đối xử lịch sử trong quốc phòng, dịch vụ người cao tuổi LGBTI và chính sách chăm sóc.",
      th: "ในทางการเมืองเขาเป็นเสียงสายกลางใน LNP Queensland ที่สนับสนุนสิทธิ LGBTIQ และ disability inclusion อย่างเปิดเผย งานรณรงค์ช่วงหลังเน้นการเยียวยาการเลือกปฏิบัติในกลาโหมในอดีต บริการผู้สูงอายุ LGBTI และนโยบาย care",
      si: "දේශපාලනයේදී ඔහු Queensland LNP moderate voice එකක් ලෙස LGBTIQ rights සහ disability inclusion මහජනව සහාය දුන්නේය; මෑත advocacy එක historic defence discrimination redress, LGBTI ageing services සහ care policy වටා ය."
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
    name: "Jeanne Day",
    aliases: ["Jeanne Day", "Jane Day", "珍妮·戴", "珍妮·戴伊", "ジャンヌ・デイ", "잔 데이"],
    type: "public-figure",
    social: { label: "ABC feature", url: "https://www.abc.net.au/news/2026-08-01/stowaway-school-teacher-jeanne-day-disguised-as-boy-tall-ship-sa/106707878" },
    background: {
      "zh-Hans": "南澳 Balaklava 音乐教师。1928 年，她在 Port Lincoln 剪短头发、女扮男装，偷渡登上 Herzogin Cecilie 帆船前往英国；她的故事后来成为女性进入航海行业限制的历史案例。",
      "zh-Hant": "南澳 Balaklava 音樂教師。1928 年，她在 Port Lincoln 剪短頭髮、女扮男裝，偷渡登上 Herzogin Cecilie 帆船前往英國；她的故事後來成為女性進入航海行業限制的歷史案例。",
      en: "South Australian music teacher from Balaklava who disguised herself as a boy and stowed away on the Herzogin Cecilie at Port Lincoln in 1928. Her story became a historical example of the barriers women faced in seafaring work.",
      es: "Profesora de música de Balaklava, Australia Meridional, que en 1928 se disfrazó de chico y se coló como polizona en el Herzogin Cecilie en Port Lincoln. Su historia se recuerda como ejemplo histórico de las barreras para las mujeres en la navegación.",
      ja: "南オーストラリア州 Balaklava 出身の音楽教師。1928年、Port Lincoln で少年に変装して Herzogin Cecilie に密航し、女性が船員になることを阻まれていた時代を示す歴史的事例となりました。",
      ko: "남호주 Balaklava 출신 음악 교사입니다. 1928년 Port Lincoln에서 남성으로 변장해 Herzogin Cecilie호에 밀항했으며, 여성의 해상 노동 진입 장벽을 보여주는 역사적 사례로 남았습니다.",
      vi: "Giáo viên âm nhạc từ Balaklava, Nam Úc. Năm 1928, bà cải trang thành nam giới và trốn lên tàu Herzogin Cecilie ở Port Lincoln, trở thành một ví dụ lịch sử về rào cản phụ nữ gặp phải trong nghề đi biển.",
      th: "ครูดนตรีจาก Balaklava ในรัฐเซาท์ออสเตรเลีย ปี 1928 เธอปลอมตัวเป็นเด็กผู้ชายและแอบขึ้นเรือ Herzogin Cecilie ที่ Port Lincoln เรื่องของเธอกลายเป็นตัวอย่างทางประวัติศาสตร์ของข้อจำกัดที่ผู้หญิงเผชิญในงานเดินเรือ",
      si: "South Australia හි Balaklava සිටි music teacher කෙනෙකි. 1928 දී Port Lincoln හිදී ඇය පිරිමි ළමයෙකු ලෙස වේශභූෂා කර Herzogin Cecilie නෞකාවට stow away විය. ඇගේ කතාව කාන්තාවන්ට seafaring work වෙත යාමේ බාධා පෙන්වන historical example එකක් විය."
    }
  },
  {
    name: "Barnaby Joyce",
    aliases: ["Barnaby Joyce", "Barnaby Thomas Gerard Joyce", "Barnaby Joyce MP", "巴纳比·乔伊斯", "巴納比·喬伊斯", "バーナビー・ジョイス", "바너비 조이스"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/b_joyce_mp" },
    background: {
      "zh-Hans": "新南威尔士 New England 选区联邦众议员，曾任澳大利亚副总理和国家党领袖，2025 年离开国家党并加入 One Nation。",
      "zh-Hant": "新南威爾斯 New England 選區聯邦眾議員，曾任澳洲副總理和國家黨領袖，2025 年離開國家黨並加入 One Nation。",
      en: "Federal MP for New England in New South Wales, former deputy prime minister and former Nationals leader who left the Nationals and joined One Nation in 2025.",
      es: "Diputado federal por New England, Nueva Gales del Sur; ex vice primer ministro y exlíder de los Nationals que dejó el partido y se unió a One Nation en 2025.",
      ja: "ニューサウスウェールズ州 New England 選出の連邦下院議員。元副首相、元 Nationals 党首で、2025年に Nationals を離れ One Nation に加わりました。",
      ko: "뉴사우스웨일스 New England 지역구 연방 하원의원입니다. 전 부총리이자 전 Nationals 대표로, 2025년 Nationals를 떠나 One Nation에 합류했습니다.",
      vi: "Nghị sĩ liên bang khu New England ở New South Wales, cựu phó thủ tướng và cựu lãnh đạo Nationals; rời Nationals và gia nhập One Nation năm 2025.",
      th: "ส.ส. รัฐบาลกลางเขต New England ในนิวเซาท์เวลส์ อดีตรองนายกรัฐมนตรีและอดีตผู้นำ Nationals ที่ออกจาก Nationals และเข้าร่วม One Nation ในปี 2025",
      si: "New South Wales හි New England Federal MP කෙනෙකි. හිටපු deputy prime minister සහ හිටපු Nationals leader වූ ඔහු 2025 දී Nationals අතහැර One Nation වෙත එක් විය."
    },
    positions: {
      "zh-Hans": "主要围绕地区产业、农业、能源、净零目标、移民和保守社会议题发声；加入 One Nation 后，其难民和移民立场与该党的单一文化主张之间的张力受到关注。",
      "zh-Hant": "主要圍繞地區產業、農業、能源、淨零目標、移民和保守社會議題發聲；加入 One Nation 後，其難民和移民立場與該黨的單一文化主張之間的張力受到關注。",
      en: "His politics centre on regional industries, agriculture, energy, net zero, migration and conservative social issues; since joining One Nation, tension between his refugee comments and the party's monocultural pitch has drawn attention.",
      es: "Su política se centra en industrias regionales, agricultura, energía, cero neto, migración y temas sociales conservadores; desde que se sumó a One Nation, se observa la tensión entre sus comentarios sobre refugiados y el discurso monocultural del partido.",
      ja: "地方産業、農業、エネルギー、ネットゼロ、移民、保守的な社会問題を主な論点とします。One Nation 参加後は、難民に関する発言と同党の単一文化的主張との緊張が注目されています。",
      ko: "지역 산업, 농업, 에너지, 넷제로, 이민, 보수적 사회 이슈를 중심으로 발언합니다. One Nation 합류 이후 난민 관련 발언과 당의 단일문화 메시지 사이의 긴장이 주목받고 있습니다.",
      vi: "Chính trị của ông tập trung vào ngành vùng, nông nghiệp, năng lượng, net zero, di trú và các vấn đề xã hội bảo thủ; sau khi gia nhập One Nation, căng thẳng giữa phát biểu về người tị nạn và thông điệp monocultural của đảng được chú ý.",
      th: "แนวการเมืองของเขาเน้นอุตสาหกรรมภูมิภาค เกษตร พลังงาน net zero การย้ายถิ่น และประเด็นสังคมอนุรักษนิยม หลังเข้าร่วม One Nation ความตึงเครียดระหว่างคำพูดเรื่องผู้ลี้ภัยกับแนวคิด monocultural ของพรรคถูกจับตา",
      si: "ඔහුගේ politics regional industries, agriculture, energy, net zero, migration සහ conservative social issues වටා ය. One Nation වෙත එක් වූ පසු refugee comments සහ party එකේ monocultural pitch අතර tension අවධානයට ලක්විය."
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
    name: "Warren Pickering",
    aliases: ["Warren Pickering", "Warren Pickering One Nation", "Warren Pickering Pakenham", "沃伦·皮克林", "沃倫·皮克林", "ウォーレン・ピカリング", "워런 피커링"],
    type: "politician",
    profile: { label: "One Nation candidate profile", url: "https://vic.onenation.org.au/warren-pickering" },
    social: { label: "Facebook", url: "https://www.facebook.com/warren4onenation/" },
    background: {
      "zh-Hans": "One Nation 维州政治人物和 Pakenham 候选人，公开竞选资料称他有农场、建筑、军队和矿业背景，并在 2026 年维州选举发布中被介绍为该党维州负责人之一。",
      "zh-Hant": "One Nation 維州政治人物和 Pakenham 候選人，公開競選資料稱他有農場、建築、軍隊和礦業背景，並在 2026 年維州選舉發布中被介紹為該黨維州負責人之一。",
      en: "Victorian One Nation politician and Pakenham candidate. Public campaign material presents him as having farming, construction, military and mining experience, and he was introduced as a state figure in the party's 2026 Victorian election launch.",
      es: "Político de One Nation en Victoria y candidato por Pakenham. Su material público de campaña lo presenta con experiencia en agricultura, construcción, fuerzas armadas y minería, y fue presentado como figura estatal en el lanzamiento electoral victoriano de 2026.",
      ja: "ビクトリア州 One Nation の政治家で、Pakenham 候補。公開された選挙資料では農業、建設、軍務、鉱業の経験があるとされ、2026年州選挙の発表で同党の州レベルの人物として紹介されました。",
      ko: "빅토리아주 One Nation 정치인이자 Pakenham 후보입니다. 공개 선거 자료는 농업, 건설, 군 복무, 광업 경험을 소개하며 2026년 빅토리아 선거 출범 행사에서 당의 주 단위 인물로 소개됐습니다.",
      vi: "Chính trị gia One Nation tại Victoria và ứng viên Pakenham. Tài liệu vận động công khai giới thiệu ông có kinh nghiệm nông nghiệp, xây dựng, quân đội và khai khoáng, và ông được nêu như một nhân vật cấp bang trong buổi ra mắt bầu cử Victoria 2026 của đảng.",
      th: "นักการเมือง One Nation ในรัฐวิกตอเรียและผู้สมัครเขต Pakenham ข้อมูลหาเสียงสาธารณะระบุว่าเขามีประสบการณ์ด้านฟาร์ม ก่อสร้าง ทหาร และเหมือง และถูกเปิดตัวเป็นบุคคลระดับรัฐในการเลือกตั้งวิกตอเรียปี 2026 ของพรรค",
      si: "Victoria හි One Nation දේශපාලනඥයෙකු සහ Pakenham candidate කෙනෙකි. Public campaign material ඔහුට farming, construction, military සහ mining experience ඇති බව පෙන්වයි; 2026 Victorian election launch එකේදී party state figure කෙනෙකු ලෙස ඉදිරිපත් විය."
    },
    positions: {
      "zh-Hans": "其竞选信息强调执法、公共诚信、地区和农场社区、生活成本以及对工党政府的不信任；这些主题与 One Nation 在维州选举中的反建制定位一致。",
      "zh-Hant": "其競選資訊強調執法、公共誠信、地區和農場社區、生活成本以及對工黨政府的不信任；這些主題與 One Nation 在維州選舉中的反建制定位一致。",
      en: "His campaign messaging stresses law enforcement, public integrity, regional and farming communities, cost-of-living pressure and distrust of the Labor government, aligning with One Nation's anti-establishment Victorian pitch.",
      es: "Su campaña subraya cumplimiento de la ley, integridad pública, comunidades regionales y agrícolas, coste de vida y desconfianza hacia el gobierno laborista, en línea con el tono antiestablishment de One Nation en Victoria.",
      ja: "法執行、公的廉潔性、地方・農業コミュニティ、生活費、労働党政権への不信を訴え、One Nation のビクトリア州での反既成政治的な訴えと重なります。",
      ko: "법 집행, 공공 청렴, 지역과 농업 공동체, 생활비 부담, 노동당 정부 불신을 강조하며 One Nation의 빅토리아 반기성 정치 메시지와 맞닿아 있습니다.",
      vi: "Thông điệp tranh cử nhấn mạnh thực thi pháp luật, liêm chính công, cộng đồng vùng và nông nghiệp, áp lực chi phí sinh hoạt và nghi ngờ chính phủ Labor, phù hợp với lập trường chống chính trị chính thống của One Nation tại Victoria.",
      th: "สารหาเสียงเน้น law enforcement, public integrity, ชุมชนภูมิภาคและเกษตร, ค่าครองชีพ และความไม่ไว้วางใจรัฐบาล Labor สอดคล้องกับภาพต่อต้าน establishment ของ One Nation ในรัฐวิกตอเรีย",
      si: "ඔහුගේ campaign messaging law enforcement, public integrity, regional/farming communities, cost-of-living pressure සහ Labor government ගැන අවිශ්වාසය අවධාරණය කරයි; මෙය Victoria හි One Nation anti-establishment pitch එකට ගැළපේ."
    }
  },
  {
    name: "Elizabeth Dabars",
    aliases: ["Elizabeth Dabars", "Elizabeth Dabars AM", "Liz Dabars", "伊丽莎白·达巴斯", "伊麗莎白·達巴斯", "エリザベス・ダバーズ", "엘리자베스 다바스"],
    type: "public-figure",
    profile: { label: "ANMF SA leadership profile", url: "https://www.anmfsa.org.au/about/leadership/" },
    social: { label: "LinkedIn", url: "https://www.linkedin.com/in/elizabeth-dabars-am-47962452/" },
    background: {
      "zh-Hans": "Australian Nursing and Midwifery Federation SA Branch 首席执行官兼秘书，注册护士和助产士，长期代表南澳护理和助产行业就医院压力、员工安全和患者护理发声。",
      "zh-Hant": "Australian Nursing and Midwifery Federation SA Branch 行政總裁兼秘書，註冊護士和助產士，長期代表南澳護理和助產行業就醫院壓力、員工安全和病患照護發聲。",
      en: "Chief executive officer and secretary of the Australian Nursing and Midwifery Federation SA Branch, and a registered nurse and midwife who regularly speaks publicly on hospital pressure, staff safety and patient care in South Australia.",
      es: "Directora ejecutiva y secretaria de la Australian Nursing and Midwifery Federation SA Branch, enfermera y matrona registrada que suele intervenir públicamente sobre presión hospitalaria, seguridad del personal y atención al paciente en Australia Meridional.",
      ja: "Australian Nursing and Midwifery Federation SA Branch の CEO 兼 secretary。登録看護師・助産師で、南オーストラリア州の病院逼迫、職員安全、患者ケアについて公に発言しています。",
      ko: "Australian Nursing and Midwifery Federation SA Branch의 최고경영자 겸 사무총장입니다. 등록 간호사이자 조산사로 남호주의 병원 압박, 직원 안전, 환자 돌봄 문제에 대해 공개적으로 발언합니다.",
      vi: "Tổng giám đốc kiêm secretary của Australian Nursing and Midwifery Federation SA Branch, là y tá và nữ hộ sinh đã đăng ký, thường lên tiếng công khai về áp lực bệnh viện, an toàn nhân viên và chăm sóc bệnh nhân ở Nam Úc.",
      th: "Chief executive officer และ secretary ของ Australian Nursing and Midwifery Federation SA Branch เป็นพยาบาลและผดุงครรภ์ขึ้นทะเบียนที่มักออกมาพูดเรื่องแรงกดดันโรงพยาบาล ความปลอดภัยของบุคลากร และการดูแลผู้ป่วยในเซาท์ออสเตรเลีย",
      si: "Australian Nursing and Midwifery Federation SA Branch හි chief executive officer සහ secretary වේ. Registered nurse සහ midwife කෙනෙකු වන ඇය South Australia හි hospital pressure, staff safety සහ patient care ගැන ප්‍රසිද්ධියේ කථා කරයි."
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
    personalSocial: { label: "X", url: "https://x.com/AngusTaylorMP" },
    profile: { label: "Personal website", url: "https://www.angustaylor.com.au/" },
    officialProfile: { label: "Parliament profile", url: "https://www.aph.gov.au/a_taylor_mp" },
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
    name: "Jim Chalmers",
    aliases: ["Jim Chalmers", "James Chalmers", "James Edward Chalmers", "吉姆·查尔默斯", "吉姆·查默斯", "ジム・チャーマーズ", "짐 차머스"],
    type: "politician",
    social: { label: "Official profile", url: "https://www.aph.gov.au/j_chalmers_mp" },
    background: {
      "zh-Hans": "澳大利亚工党政治人物，Rankin 选区联邦议员，2022 年起任澳大利亚财政部长。进入财政部前曾任影子财长、影子财政部长和工党前排议员。",
      "zh-Hant": "澳洲工黨政治人物，Rankin 選區聯邦議員，2022 年起任澳洲財政部長。進入財政部前曾任影子財長、影子財政部長和工黨前排議員。",
      en: "Australian Labor politician, federal MP for Rankin and Treasurer of Australia since 2022. Before becoming treasurer he served as shadow treasurer, shadow finance minister and a Labor frontbencher.",
      es: "Político laborista australiano, diputado federal por Rankin y tesorero de Australia desde 2022. Antes fue shadow treasurer, shadow finance minister y frontbencher laborista.",
      ja: "オーストラリア労働党の政治家。Rankin 選出連邦議員で、2022年から財務相です。以前は影の財務相、影の財政相、労働党の前列議員を務めました。",
      ko: "호주 노동당 정치인으로 Rankin 연방 하원의원이며 2022년부터 호주 재무장관입니다. 이전에는 예비 재무장관, 예비 재정장관, 노동당 전면 의원을 지냈습니다.",
      vi: "Chính trị gia Labor, nghị sĩ liên bang khu Rankin và là Treasurer of Australia từ năm 2022. Trước đó ông là shadow treasurer, shadow finance minister và frontbencher của Labor.",
      th: "นักการเมือง Labor ของออสเตรเลีย ส.ส. รัฐบาลกลางเขต Rankin และเป็น Treasurer of Australia ตั้งแต่ปี 2022 ก่อนหน้านั้นเป็น shadow treasurer, shadow finance minister และ frontbencher ของ Labor",
      si: "Australian Labor දේශපාලනඥයෙකු වන Jim Chalmers Rankin federal MP සහ 2022 සිට Treasurer of Australia වේ. Treasurer වීමට පෙර shadow treasurer, shadow finance minister සහ Labor frontbencher ලෙස කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "主要围绕通胀、预算修复、生产率、税制和生活成本政策发声；通常把财政纪律与定向生活成本补助、住房和清洁能源投资相结合。",
      "zh-Hant": "主要圍繞通膨、預算修復、生產率、稅制和生活成本政策發聲；通常把財政紀律與定向生活成本補助、住房和清潔能源投資相結合。",
      en: "His main themes are inflation, budget repair, productivity, tax and cost-of-living policy; he usually pairs fiscal restraint with targeted cost-of-living relief, housing and clean-energy investment.",
      es: "Sus temas centrales son inflación, reparación presupuestaria, productividad, impuestos y coste de vida; suele combinar disciplina fiscal con ayudas focalizadas, vivienda e inversión en energía limpia.",
      ja: "インフレ、財政修復、生産性、税制、生活費政策を主な課題とし、財政規律と対象を絞った生活費支援、住宅、クリーンエネルギー投資を組み合わせます。",
      ko: "주요 의제는 인플레이션, 예산 복원, 생산성, 세제, 생활비 정책입니다. 재정 절제와 선별적 생활비 지원, 주택, 청정에너지 투자를 함께 내세웁니다.",
      vi: "Các chủ đề chính của ông là lạm phát, sửa chữa ngân sách, năng suất, thuế và chi phí sinh hoạt; ông thường kết hợp kỷ luật tài khóa với hỗ trợ chi phí sinh hoạt có mục tiêu, nhà ở và đầu tư năng lượng sạch.",
      th: "ประเด็นหลักคือเงินเฟ้อ การซ่อมงบประมาณ productivity ภาษี และนโยบายค่าครองชีพ โดยมักจับคู่ fiscal restraint กับความช่วยเหลือค่าครองชีพแบบเจาะจง ที่อยู่อาศัย และการลงทุนพลังงานสะอาด",
      si: "ඔහුගේ main themes inflation, budget repair, productivity, tax සහ cost-of-living policy වේ; fiscal restraint සමඟ targeted cost-of-living relief, housing සහ clean-energy investment එකට සම්බන්ධ කරයි."
    }
  },
  {
    name: "David Pocock",
    aliases: ["David Pocock", "David Willmer Pocock", "Senator David Pocock", "大卫·波科克", "大衛·波科克", "デービッド・ポーコック", "데이비드 포콕"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID=256136" },
    social: { label: "X", url: "https://x.com/DavidPocock" },
    background: {
      "zh-Hans": "澳大利亚首都领地独立参议员，2022 年首次当选、2025 年连任；从政前是 Wallabies 橄榄球国脚，并长期参与环保和社会公义倡议。",
      "zh-Hant": "澳洲首都領地獨立參議員，2022 年首次當選、2025 年連任；從政前是 Wallabies 橄欖球國腳，並長期參與環保和社會公義倡議。",
      en: "Independent senator for the Australian Capital Territory, first elected in 2022 and re-elected in 2025; before politics he was a Wallabies rugby union player and an environmental and social-justice advocate.",
      es: "Senador independiente por el Australian Capital Territory, elegido por primera vez en 2022 y reelegido en 2025; antes fue jugador de rugby de los Wallabies y activista ambiental y social.",
      ja: "Australian Capital Territory 選出の無所属上院議員。2022年に初当選し、2025年に再選。政界入り前は Wallabies のラグビー選手で、環境・社会正義の活動にも関わりました。",
      ko: "Australian Capital Territory를 대표하는 무소속 상원의원으로 2022년 처음 당선되고 2025년 재선됐습니다. 정계 입문 전에는 Wallabies 럭비 유니언 선수이자 환경·사회정의 활동가였습니다.",
      vi: "Thượng nghị sĩ độc lập đại diện Australian Capital Territory, lần đầu đắc cử năm 2022 và tái đắc cử năm 2025; trước chính trị ông là cầu thủ rugby Wallabies và nhà vận động môi trường, công bằng xã hội.",
      th: "วุฒิสมาชิกอิสระของ Australian Capital Territory ได้รับเลือกครั้งแรกในปี 2022 และอีกครั้งในปี 2025 ก่อนเข้าสู่การเมืองเป็นนักรักบี้ Wallabies และนักรณรงค์สิ่งแวดล้อมกับความเป็นธรรมทางสังคม",
      si: "Australian Capital Territory නියෝජනය කරන independent senator; 2022 දී පළමුව තේරී 2025 දී නැවත තේරී පත්විය. Politics ට පෙර Wallabies rugby union player සහ environmental/social-justice advocate කෙනෙකි."
    },
    positions: {
      "zh-Hans": "重点推动气候行动、廉政与政治广告改革、领地权利、住房可负担性和社会保障充足性；在悬峙议会或参议院谈判中常要求政府补强法案细节。",
      "zh-Hant": "重點推動氣候行動、廉政與政治廣告改革、領地權利、住房可負擔性和社會保障充足性；在懸峙議會或參議院談判中常要求政府補強法案細節。",
      en: "His main themes are climate action, integrity and political-advertising reform, territory rights, housing affordability and adequate social security; in Senate negotiations he often pushes governments to tighten bill details.",
      es: "Sus temas centrales son acción climática, integridad y reforma de publicidad política, derechos territoriales, vivienda asequible y seguridad social adecuada; en negociaciones del Senado suele exigir más precisión legislativa.",
      ja: "気候対策、政治倫理と政治広告改革、準州の権利、住宅 affordability、社会保障の十分性を重視します。上院交渉では法案の細部修正を政府に求めることが多いです。",
      ko: "기후 행동, 청렴성과 정치광고 개혁, 준주 권리, 주거 부담 완화, 적정한 사회보장을 중시합니다. 상원 협상에서는 법안 세부 보완을 정부에 요구하는 경우가 많습니다.",
      vi: "Ông tập trung vào khí hậu, liêm chính và cải cách quảng cáo chính trị, quyền của territory, khả năng mua nhà và mức an sinh xã hội đủ sống; trong đàm phán Thượng viện ông thường yêu cầu siết chi tiết dự luật.",
      th: "ประเด็นหลักคือ climate action ความโปร่งใสและการปฏิรูปโฆษณาการเมือง สิทธิของ territory ที่อยู่อาศัยที่จ่ายไหว และ social security ที่เพียงพอ ในการเจรจา Senate เขามักผลักดันให้รัฐบาลปรับรายละเอียดกฎหมาย",
      si: "ඔහුගේ main themes climate action, integrity/political-advertising reform, territory rights, housing affordability සහ adequate social security වේ; Senate negotiations වලදී bill details tighten කිරීමට governments වෙත බලපෑම් කරයි."
    }
  },
  {
    name: "Jacqui Lambie",
    aliases: ["Jacqui Lambie", "Jacquiline Louise Lambie", "Senator Jacqui Lambie", "杰基·兰比", "傑基·蘭比", "ジャッキー・ランビー", "재키 램비"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/senator_lambie" },
    social: { label: "Facebook", url: "https://www.facebook.com/SenatorLambie/" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/senatorjacquilambie/" },
    background: {
      "zh-Hans": "塔州联邦参议员、Jacqui Lambie Network 创始人和领袖；从政前曾在澳大利亚陆军服役，后以退伍军人事务、福利和参议院制衡议题闻名。",
      "zh-Hant": "塔州聯邦參議員、Jacqui Lambie Network 創辦人和領袖；從政前曾在澳洲陸軍服役，後以退伍軍人事務、福利和參議院制衡議題聞名。",
      en: "Tasmanian senator and founder-leader of the Jacqui Lambie Network. Before politics she served in the Australian Army and later became known for veterans' affairs, welfare and Senate crossbench bargaining.",
      es: "Senadora por Tasmania y fundadora-líder de Jacqui Lambie Network. Antes de la política sirvió en el ejército australiano y después se destacó en asuntos de veteranos, bienestar social y negociación en el Senado.",
      ja: "タスマニア州選出の上院議員で、Jacqui Lambie Network の創設者・党首です。政界入り前は豪陸軍に勤務し、退役軍人政策、福祉、上院クロスベンチ交渉で知られます。",
      ko: "태즈메이니아 상원의원이자 Jacqui Lambie Network 창립자 겸 대표입니다. 정계 입문 전 호주 육군에서 복무했고 이후 보훈, 복지, 상원 크로스벤치 협상으로 알려졌습니다.",
      vi: "Thượng nghị sĩ Tasmania, người sáng lập kiêm lãnh đạo Jacqui Lambie Network. Trước chính trị, bà phục vụ trong quân đội Australia và sau đó được biết đến với vấn đề cựu chiến binh, phúc lợi và đàm phán crossbench ở Thượng viện.",
      th: "วุฒิสมาชิกรัฐแทสเมเนียและผู้ก่อตั้ง-ผู้นำ Jacqui Lambie Network ก่อนเข้าสู่การเมืองเคยรับราชการในกองทัพออสเตรเลีย และต่อมาเป็นที่รู้จักเรื่องทหารผ่านศึก สวัสดิการ และการต่อรองใน Senate crossbench",
      si: "Tasmania senator සහ Jacqui Lambie Network founder-leader කෙනෙකි. Politics ට පෙර Australian Army හි සේවය කළ අතර පසුව veterans' affairs, welfare සහ Senate crossbench bargaining ගැන ප්‍රසිද්ධියට පත්විය."
    },
    positions: {
      "zh-Hans": "重点关注退伍军人支持、社会保障、塔州地区利益、廉政和大型政党权力制衡；在博彩改革等议题上常要求更强的消费者保护。",
      "zh-Hant": "重點關注退伍軍人支持、社會保障、塔州地區利益、廉政和大型政黨權力制衡；在博彩改革等議題上常要求更強的消費者保護。",
      en: "Her main themes include veterans' support, social security, Tasmanian regional interests, integrity and checking major-party power. On gambling reform she often presses for stronger consumer protection.",
      es: "Sus temas centrales incluyen apoyo a veteranos, seguridad social, intereses regionales de Tasmania, integridad y control del poder de los grandes partidos. En reforma del juego suele pedir mayor protección al consumidor.",
      ja: "退役軍人支援、社会保障、タスマニアの地域利益、政治倫理、大政党への抑制を重視します。ギャンブル改革では消費者保護の強化を求めることが多いです。",
      ko: "보훈 지원, 사회보장, 태즈메이니아 지역 이익, 청렴성, 거대 양당 견제를 중시합니다. 도박 개혁에서는 더 강한 소비자 보호를 요구하는 경우가 많습니다.",
      vi: "Các trọng tâm của bà gồm hỗ trợ cựu chiến binh, an sinh xã hội, lợi ích vùng Tasmania, liêm chính và kiểm soát quyền lực các đảng lớn. Về cải cách cờ bạc, bà thường thúc đẩy bảo vệ người tiêu dùng mạnh hơn.",
      th: "ประเด็นหลักคือการสนับสนุนทหารผ่านศึก social security ผลประโยชน์ภูมิภาคแทสเมเนีย ความโปร่งใส และการถ่วงดุลพรรคใหญ่ ด้านปฏิรูปการพนัน เธอมักเรียกร้องการคุ้มครองผู้บริโภคที่เข้มขึ้น",
      si: "ඇයගේ main themes veterans' support, social security, Tasmanian regional interests, integrity සහ major-party power check කිරීම වේ. Gambling reform සම්බන්ධයෙන් වඩා ශක්තිමත් consumer protection ඉල්ලා සිටීමට ඇය නැඹුරුය."
    }
  },
  {
    name: "Tim Costello",
    aliases: ["Tim Costello", "Timothy Ewen Costello", "Rev Tim Costello", "Reverend Tim Costello", "蒂姆·科斯特洛", "ティム・コステロ", "팀 코스텔로"],
    type: "advocate",
    profile: { label: "Micah Australia profile", url: "https://www.micahaustralia.org/news/author/tim-costello/" },
    officialProfile: { label: "Alliance for Gambling Reform profile", url: "https://www.agr.org.au/team/rev-tim-costello" },
    social: { label: "X", url: "https://x.com/TimCostello" },
    background: {
      "zh-Hans": "澳大利亚牧师、社会公义倡议者和前 World Vision Australia 首席执行官；长期参与贫困、援助、伦理和博彩伤害改革公共讨论。",
      "zh-Hant": "澳洲牧師、社會公義倡議者和前 World Vision Australia 行政總裁；長期參與貧困、援助、倫理和博彩傷害改革公共討論。",
      en: "Australian minister, social-justice advocate and former World Vision Australia chief executive. He is a long-running public voice on poverty, aid, ethics and gambling-harm reform.",
      es: "Ministro religioso australiano, defensor de justicia social y ex director ejecutivo de World Vision Australia. Es una voz pública de larga trayectoria sobre pobreza, ayuda, ética y reforma del daño por juego.",
      ja: "豪州の牧師、社会正義の提唱者で、World Vision Australia の元最高経営責任者です。貧困、援助、倫理、ギャンブル被害改革について長く発言しています。",
      ko: "호주의 목회자이자 사회정의 활동가, 전 World Vision Australia 최고경영자입니다. 빈곤, 원조, 윤리, 도박 피해 개혁에 대해 오랫동안 공개적으로 발언해 왔습니다.",
      vi: "Mục sư Australia, nhà vận động công bằng xã hội và cựu CEO World Vision Australia. Ông là tiếng nói công khai lâu năm về nghèo đói, viện trợ, đạo đức và cải cách tác hại cờ bạc.",
      th: "บาทหลวงออสเตรเลีย นักรณรงค์ความเป็นธรรมทางสังคม และอดีต chief executive ของ World Vision Australia เป็นเสียงสาธารณะมายาวนานเรื่องความยากจน ความช่วยเหลือ จริยธรรม และการปฏิรูปอันตรายจากการพนัน",
      si: "Australian minister, social-justice advocate සහ හිටපු World Vision Australia chief executive කෙනෙකි. Poverty, aid, ethics සහ gambling-harm reform පිළිබඳ දිගුකාලීන public voice කෙනෙකි."
    }
  },
  {
    name: "Katy Gallagher",
    aliases: ["Katy Gallagher", "Katherine Ruth Gallagher", "Senator Katy Gallagher", "凯蒂·加拉格尔", "凱蒂·加拉格爾", "ケイティ・ギャラガー", "케이티 갤러거"],
    type: "politician",
    profile: { label: "Minister biography", url: "https://ministers.pmc.gov.au/gallagher" },
    social: { label: "X", url: "https://x.com/SenKatyG" },
    background: {
      "zh-Hans": "澳大利亚工党参议员，代表首都领地；曾任 ACT 首席部长，现任财政部长、女性部长、公共服务部长和政府服务部长。",
      "zh-Hant": "澳洲工黨參議員，代表首都領地；曾任 ACT 首席部長，現任財政部長、女性部長、公共服務部長和政府服務部長。",
      en: "Australian Labor senator for the ACT, former ACT chief minister, and federal Minister for Finance, Minister for Women, Minister for the Public Service and Minister for Government Services.",
      es: "Senadora laborista australiana por el ACT, ex jefa de gobierno del ACT y ministra federal de Finanzas, Mujeres, Servicio Público y Servicios Gubernamentales.",
      ja: "ACT 選出のオーストラリア労働党上院議員。元 ACT 首席大臣で、連邦の財政相、女性相、公共サービス相、政府サービス相を務めています。",
      ko: "ACT를 대표하는 호주 노동당 상원의원이며 전 ACT 수석장관입니다. 연방 재정장관, 여성장관, 공공서비스장관, 정부서비스장관을 맡고 있습니다.",
      vi: "Thượng nghị sĩ Labor đại diện ACT, cựu Chief Minister của ACT, hiện là Minister for Finance, Minister for Women, Minister for the Public Service và Minister for Government Services.",
      th: "วุฒิสมาชิก Labor จาก ACT อดีต Chief Minister ของ ACT และรัฐมนตรีรัฐบาลกลางด้าน Finance, Women, Public Service และ Government Services",
      si: "ACT නියෝජනය කරන Australian Labor senator; හිටපු ACT chief minister සහ federal Minister for Finance, Women, Public Service සහ Government Services වේ."
    },
    positions: {
      "zh-Hans": "主要负责联邦预算支出控制、公共服务改革、妇女政策和 Services Australia 等政府服务；在税改和预算谈判中代表政府处理参议院协商。",
      "zh-Hant": "主要負責聯邦預算支出控制、公共服務改革、婦女政策和 Services Australia 等政府服務；在稅改和預算談判中代表政府處理參議院協商。",
      en: "Her portfolio focus is federal expenditure control, public-service reform, women's policy and government services including Services Australia; she often handles Senate negotiations on budget and tax legislation.",
      es: "Sus áreas son control del gasto federal, reforma del servicio público, políticas de mujeres y servicios gubernamentales como Services Australia; suele gestionar negociaciones del Senado sobre presupuesto e impuestos.",
      ja: "連邦支出管理、公共サービス改革、女性政策、Services Australia などの政府サービスを担当します。予算・税制法案では上院交渉を担うことが多いです。",
      ko: "연방 지출 관리, 공공서비스 개혁, 여성 정책, Services Australia를 포함한 정부 서비스를 담당합니다. 예산·세제 법안의 상원 협상을 자주 맡습니다.",
      vi: "Trọng tâm của bà là kiểm soát chi tiêu liên bang, cải cách công vụ, chính sách phụ nữ và dịch vụ chính phủ gồm Services Australia; bà thường xử lý đàm phán Thượng viện về ngân sách và thuế.",
      th: "งานหลักคือควบคุมรายจ่ายรัฐบาลกลาง ปฏิรูป public service นโยบายผู้หญิง และบริการรัฐรวมถึง Services Australia โดยมักรับหน้าที่เจรจา Senate เรื่องงบประมาณและภาษี",
      si: "ඇයගේ portfolio focus එක federal expenditure control, public-service reform, women's policy සහ Services Australia ඇතුළු government services වේ; budget/tax legislation පිළිබඳ Senate negotiations නිතර හැසිරවයි."
    }
  },
  {
    name: "Sonya Kilkenny",
    aliases: ["Sonya Kilkenny", "Sonya Kilkenny MP", "The Hon. Sonya Kilkenny", "The Hon. Sonya Kilkenny MP", "索尼娅·基尔肯尼", "索尼婭·基爾肯尼", "ソニア・キルケニー", "소냐 킬케니"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.vic.gov.au/members/sonya-kilkenny/" },
    officialProfile: { label: "Premier of Victoria profile", url: "https://www.premier.vic.gov.au/sonya-kilkenny" },
    social: { label: "X", url: "https://x.com/SonyaKilkenny" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/sonyakilkennymp/" },
    background: {
      "zh-Hans": "维州工党政治人物，2014 年起任 Carrum 选区州议员；进入议会前曾从事商业诉讼、银行金融法律工作，并在社区和文化机构任职。",
      "zh-Hant": "維州工黨政治人物，2014 年起任 Carrum 選區州議員；進入議會前曾從事商業訴訟、銀行金融法律工作，並在社區和文化機構任職。",
      en: "Victorian Labor politician and MP for Carrum since 2014. Before parliament she worked in commercial litigation and banking and finance law, with community and arts-sector board experience.",
      es: "Política laborista de Victoria y diputada por Carrum desde 2014. Antes del parlamento trabajó en litigios comerciales y derecho bancario y financiero, con experiencia en organizaciones comunitarias y culturales.",
      ja: "ビクトリア州労働党の政治家で、2014年から Carrum 選出州議員です。議会入り前は商事訴訟、銀行・金融法務に携わり、地域・文化団体の理事経験もあります。",
      ko: "2014년부터 Carrum 지역구를 대표하는 빅토리아주 노동당 의원입니다. 의회 전에는 상업 소송과 은행·금융 법률 분야에서 일했고 지역사회·예술 분야 이사회 경험도 있습니다.",
      vi: "Chính trị gia Labor của Victoria, nghị sĩ bang khu Carrum từ năm 2014. Trước khi vào quốc hội, bà làm về tranh tụng thương mại, luật ngân hàng và tài chính, đồng thời tham gia các hội đồng cộng đồng và nghệ thuật.",
      th: "นักการเมือง Labor ของ Victoria และ ส.ส. รัฐเขต Carrum ตั้งแต่ปี 2014 ก่อนเข้าสภาเคยทำงานด้าน commercial litigation กฎหมาย banking and finance และมีประสบการณ์บอร์ดภาคชุมชนกับศิลปะ",
      si: "2014 සිට Carrum සඳහා Victorian Labor MP කෙනෙකි. Parliament ට පෙර commercial litigation සහ banking/finance law ක්ෂේත්‍රවල කටයුතු කළ අතර community සහ arts-sector board experience ඇත."
    },
    positions: {
      "zh-Hans": "其公共职责集中在维州规划审批、司法与总检察长事务、暴力预防和州财政；住房供应和开发审批是其规划部长职责的一部分。",
      "zh-Hant": "其公共職責集中在維州規劃審批、司法與總檢察長事務、暴力預防和州財政；住房供應和開發審批是其規劃部長職責的一部分。",
      en: "Her public brief covers Victorian planning approvals, attorney-general and justice matters, violence prevention and state finance; housing supply and development approvals sit inside her planning portfolio.",
      es: "Su cartera pública cubre aprobaciones de planificación en Victoria, funciones de fiscal general y justicia, prevención de la violencia y finanzas estatales; vivienda y aprobaciones urbanísticas forman parte de planificación.",
      ja: "ビクトリア州の計画承認、法務長官・司法、暴力予防、州財政を担当します。住宅供給と開発承認は計画相としての職務に含まれます。",
      ko: "빅토리아주 계획 승인, 법무장관·사법 업무, 폭력 예방, 주 재정을 담당합니다. 주택 공급과 개발 승인은 계획 장관 포트폴리오에 포함됩니다.",
      vi: "Bà phụ trách approvals quy hoạch tại Victoria, các vấn đề attorney-general và tư pháp, phòng chống bạo lực và tài chính bang; nguồn cung nhà ở và phê duyệt phát triển thuộc portfolio quy hoạch.",
      th: "ภารกิจครอบคลุม planning approvals ของ Victoria งาน attorney-general และ justice การป้องกันความรุนแรง และการเงินรัฐ โดย housing supply กับ development approvals อยู่ใน portfolio planning",
      si: "ඇගේ public brief එක Victorian planning approvals, attorney-general/justice matters, violence prevention සහ state finance ආවරණය කරයි; housing supply සහ development approvals ඇගේ planning portfolio එකේ කොටසකි."
    }
  },
  {
    name: "Michele Bullock",
    aliases: ["Michele Bullock", "Michelle Bullock", "米歇尔·布洛克", "米歇爾·布洛克", "ミシェル・ブロック", "미셸 불록"],
    type: "public-figure",
    social: { label: "Official profile", url: "https://www.rba.gov.au/about-rba/people/gov.html" },
    background: {
      "zh-Hans": "澳大利亚储备银行行长，2023 年 9 月上任，也是澳储行治理、货币政策和支付系统董事会主席，并参与金融监管委员会。",
      "zh-Hant": "澳洲儲備銀行總裁，2023 年 9 月上任，也是澳儲行治理、貨幣政策和支付系統董事會主席，並參與金融監管委員會。",
      en: "Governor of the Reserve Bank of Australia since September 2023, chairing the RBA's governance, monetary policy and payments system boards and participating in the Council of Financial Regulators.",
      es: "Gobernadora del Reserve Bank of Australia desde septiembre de 2023, presidenta de sus juntas de gobernanza, política monetaria y pagos, y participante en el Council of Financial Regulators.",
      ja: "2023年9月からオーストラリア準備銀行総裁。RBA のガバナンス、金融政策、決済システム各委員会の議長で、Council of Financial Regulators にも参加しています。",
      ko: "2023년 9월부터 호주준비은행 총재입니다. RBA 거버넌스, 통화정책, 지급결제 시스템 이사회를 이끌고 Council of Financial Regulators에도 참여합니다.",
      vi: "Thống đốc Reserve Bank of Australia từ tháng 9 năm 2023, chủ trì các hội đồng governance, monetary policy và payments system của RBA, đồng thời tham gia Council of Financial Regulators.",
      th: "ผู้ว่าการ Reserve Bank of Australia ตั้งแต่กันยายน 2023 เป็นประธานบอร์ด governance, monetary policy และ payments system ของ RBA และร่วม Council of Financial Regulators",
      si: "2023 සැප්තැම්බර් සිට Reserve Bank of Australia Governor වේ. RBA governance, monetary policy සහ payments system boards වල chair වන අතර Council of Financial Regulators හිද කටයුතු කරයි."
    }
  },
  {
    name: "Stephen Rue",
    aliases: ["Stephen Rue", "史蒂芬·鲁", "史蒂芬·魯", "スティーブン・ルー", "스티븐 루"],
    type: "executive",
    social: { label: "Official profile", url: "https://www.optus.com.au/about/corporate/executive-profiles" },
    background: {
      "zh-Hans": "Optus 首席执行官，2024 年 11 月加入公司。此前他曾任 NBN Co 首席执行官，长期参与澳大利亚电信基础设施和网络服务管理。",
      "zh-Hant": "Optus 執行長，2024 年 11 月加入公司。此前他曾任 NBN Co 執行長，長期參與澳洲電信基礎設施和網路服務管理。",
      en: "Chief executive of Optus, joining the company in November 2024. He previously led NBN Co and has long worked in Australian telecommunications infrastructure and network services.",
      es: "Director ejecutivo de Optus desde noviembre de 2024. Antes dirigió NBN Co y ha trabajado durante años en infraestructura de telecomunicaciones y servicios de red en Australia.",
      ja: "Optus の最高経営責任者で、2024年11月に就任。以前は NBN Co を率い、豪州の通信インフラとネットワークサービスに長く携わってきました。",
      ko: "2024년 11월 Optus에 합류한 최고경영자입니다. 이전에는 NBN Co를 이끌었으며 호주 통신 인프라와 네트워크 서비스 분야에서 오래 일했습니다.",
      vi: "Tổng giám đốc Optus, gia nhập công ty vào tháng 11 năm 2024. Trước đó ông lãnh đạo NBN Co và có nhiều năm làm việc trong hạ tầng viễn thông và dịch vụ mạng tại Australia.",
      th: "ประธานเจ้าหน้าที่บริหารของ Optus เข้าบริษัทในเดือนพฤศจิกายน 2024 ก่อนหน้านี้นำ NBN Co และทำงานมายาวนานในโครงสร้างพื้นฐานโทรคมนาคมกับบริการเครือข่ายของออสเตรเลีย",
      si: "2024 නොවැම්බර් Optus වෙත එක් වූ chief executive වේ. ඔහු පෙර NBN Co නායකත්වය දැරූ අතර Australian telecommunications infrastructure සහ network services ක්ෂේත්‍රවල දිගු කලක් කටයුතු කර ඇත."
    }
  },
  {
    name: "Justin Untersteiner",
    aliases: ["Justin Untersteiner", "Justin Untersteiner CEO", "Ahpra CEO Justin Untersteiner", "贾斯廷·翁特施泰纳", "賈斯廷·翁特施泰納", "ジャスティン・ウンターシュタイナー", "저스틴 운터슈타이너"],
    type: "public-figure",
    profile: { label: "Ahpra executive team", url: "https://www.ahpra.gov.au/About-Ahpra/Who-We-Are/AHPRA-Senior-Managers" },
    officialProfile: { label: "Ahpra appointment", url: "https://www.ahpra.gov.au/News/2025-01-29-Ahpra-CEO" },
    social: { label: "LinkedIn", url: "https://au.linkedin.com/in/justinuntersteiner" },
    background: {
      "zh-Hans": "澳大利亚监管机构高管，2025 年 4 月起任 Ahpra 首席执行官；此前曾在 Australian Financial Complaints Authority 和 Australian Taxation Office 担任高级合规与转型职务。",
      "zh-Hant": "澳洲監管機構高管，2025 年 4 月起任 Ahpra 行政總裁；此前曾在 Australian Financial Complaints Authority 和 Australian Taxation Office 擔任高階合規與轉型職務。",
      en: "Australian regulatory executive who became Ahpra chief executive in April 2025, after senior compliance and transformation roles at the Australian Financial Complaints Authority and Australian Taxation Office.",
      es: "Ejecutivo regulador australiano, director ejecutivo de Ahpra desde abril de 2025, tras cargos sénior de cumplimiento y transformación en Australian Financial Complaints Authority y Australian Taxation Office.",
      ja: "豪州の規制機関幹部で、2025年4月に Ahpra の最高経営責任者に就任しました。以前は Australian Financial Complaints Authority と Australian Taxation Office でコンプライアンスや組織改革の上級職を務めました。",
      ko: "호주 규제기관 경영자로 2025년 4월 Ahpra 최고경영자가 됐습니다. 이전에는 Australian Financial Complaints Authority와 Australian Taxation Office에서 준법·전환 관련 고위직을 맡았습니다.",
      vi: "Nhà điều hành cơ quan quản lý tại Australia, trở thành chief executive của Ahpra vào tháng 4 năm 2025 sau các vai trò cấp cao về compliance và transformation tại Australian Financial Complaints Authority và Australian Taxation Office.",
      th: "ผู้บริหารด้านกำกับดูแลของออสเตรเลีย เป็น chief executive ของ Ahpra ตั้งแต่เมษายน 2025 หลังทำบทบาทอาวุโสด้าน compliance และ transformation ที่ Australian Financial Complaints Authority และ Australian Taxation Office",
      si: "2025 අප්‍රේල් සිට Ahpra chief executive වූ Australian regulatory executive කෙනෙකි; පෙර Australian Financial Complaints Authority සහ Australian Taxation Office හි senior compliance සහ transformation roles දැරීය."
    }
  },
  {
    name: "Andrew Dillon",
    aliases: ["Andrew Dillon", "安德鲁·迪伦", "安德魯·狄龍", "アンドリュー・ディロン", "앤드루 딜런"],
    type: "executive",
    social: { label: "Official profile", url: "https://www.afl.com.au/about-afl/afl-administration" },
    background: {
      "zh-Hans": "澳大利亚足球联盟 AFL 首席执行官，2023 年 10 月正式上任。此前他在 AFL 担任法律、诚信、足球运营和赛事发展等高级职务。",
      "zh-Hant": "澳洲足球聯盟 AFL 執行長，2023 年 10 月正式上任。此前他在 AFL 擔任法律、誠信、足球營運和賽事發展等高階職務。",
      en: "Chief executive of the Australian Football League, formally starting in October 2023. He previously held senior AFL roles across legal, integrity, football operations and game development.",
      es: "Director ejecutivo de la Australian Football League desde octubre de 2023. Antes ocupó cargos sénior en la AFL en áreas legales, integridad, operaciones futbolísticas y desarrollo del juego.",
      ja: "Australian Football League の最高経営責任者で、2023年10月に正式就任。以前は AFL で法務、インテグリティ、フットボール運営、競技普及の上級職を務めました。",
      ko: "2023년 10월 공식 취임한 Australian Football League 최고경영자입니다. 이전에는 AFL에서 법무, 청렴, 경기 운영, 종목 개발 분야 고위직을 맡았습니다.",
      vi: "Tổng giám đốc Australian Football League, chính thức bắt đầu từ tháng 10 năm 2023. Trước đó ông giữ các vai trò cấp cao tại AFL về pháp lý, liêm chính, football operations và game development.",
      th: "ประธานเจ้าหน้าที่บริหารของ Australian Football League เริ่มอย่างเป็นทางการในตุลาคม 2023 ก่อนหน้านี้ทำบทบาทอาวุโสของ AFL ด้านกฎหมาย integrity football operations และ game development",
      si: "2023 ඔක්තෝබර් සිට Australian Football League chief executive වේ. ඔහු පෙර AFL හි legal, integrity, football operations සහ game development යන senior roles දැරීය."
    }
  },
  {
    name: "Rose Jackson",
    aliases: ["Rose Jackson", "Rose Butler Jackson", "Rose Jackson MLC", "The Hon Rose Jackson MLC", "罗斯·杰克逊", "羅斯·傑克遜", "ローズ・ジャクソン", "로즈 잭슨"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members/Pages/Member-details.aspx?pk=2258" },
    officialProfile: { label: "NSW Labor profile", url: "https://www.nswlabor.org.au/rose_jackson" },
    social: { label: "X", url: "https://x.com/RoseBJackson" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/RoseJacksonMLC/" },
    background: {
      "zh-Hans": "新州工党政治人物，2019 年起任新南威尔士州上议院议员，现任水务、住房、无家可归、心理健康、青年和 North Coast 相关部长。",
      "zh-Hant": "新州工黨政治人物，2019 年起任新南威爾士州上議院議員，現任水務、住房、無家可歸、心理健康、青年和 North Coast 相關部長。",
      en: "NSW Labor politician, member of the Legislative Council since 2019, serving as minister for water, housing, homelessness, mental health, youth and the North Coast.",
      es: "Política laborista de NSW, miembro del Legislative Council desde 2019 y ministra de agua, vivienda, sinhogarismo, salud mental, juventud y North Coast.",
      ja: "NSW 労働党の政治家で、2019年から Legislative Council 議員。水、住宅、ホームレス対策、メンタルヘルス、若者、North Coast 担当相です。",
      ko: "NSW 노동당 정치인으로 2019년부터 Legislative Council 의원이며 물, 주택, 노숙, 정신건강, 청년, North Coast 담당 장관입니다.",
      vi: "Chính trị gia Labor tại NSW, thành viên Legislative Council từ năm 2019, hiện phụ trách water, housing, homelessness, mental health, youth và North Coast.",
      th: "นักการเมือง Labor ของ NSW สมาชิก Legislative Council ตั้งแต่ปี 2019 และเป็นรัฐมนตรีด้าน water, housing, homelessness, mental health, youth และ North Coast",
      si: "2019 සිට NSW Legislative Council සාමාජිකාවක් වන NSW Labor දේශපාලනඥයෙකි; water, housing, homelessness, mental health, youth සහ North Coast අමාත්‍ය ධුර දරයි."
    },
    positions: {
      "zh-Hans": "公共职责集中在住房与无家可归、心理健康危机响应、水资源管理、青年政策和新州北海岸事务。",
      "zh-Hant": "公共職責集中在住房與無家可歸、心理健康危機回應、水資源管理、青年政策和新州北海岸事務。",
      en: "Her public brief centres on housing and homelessness, mental-health crisis response, water management, youth policy and NSW North Coast issues.",
      es: "Su cartera pública se centra en vivienda y sinhogarismo, respuesta a crisis de salud mental, gestión del agua, política juvenil y asuntos de la North Coast de NSW.",
      ja: "住宅とホームレス対策、メンタルヘルス危機対応、水管理、若者政策、NSW North Coast の課題を担当しています。",
      ko: "주택과 노숙, 정신건강 위기 대응, 물 관리, 청년 정책, NSW North Coast 현안을 주로 맡고 있습니다.",
      vi: "Bà phụ trách chính các vấn đề housing và homelessness, ứng phó khủng hoảng mental health, quản lý nước, chính sách youth và NSW North Coast.",
      th: "ภารกิจหลักครอบคลุม housing และ homelessness การรับมือวิกฤต mental health การจัดการน้ำ นโยบาย youth และประเด็น NSW North Coast",
      si: "ඇගේ public brief එක housing සහ homelessness, mental-health crisis response, water management, youth policy සහ NSW North Coast issues වටා කේන්ද්‍රගත වේ."
    }
  },
  {
    name: "Yasmin Catley",
    aliases: ["Yasmin Catley", "Yasmin Maree Catley", "Yasmin Catley MP", "The Hon Yasmin Catley MP", "亚斯敏·卡特利", "亞斯敏·卡特利", "ヤスミン・キャトリー", "야스민 캐틀리"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members/Pages/Member-details.aspx?pk=128" },
    officialProfile: { label: "Personal website", url: "https://www.yasmincatley.com/about-yasmin/" },
    social: { label: "Facebook", url: "https://www.facebook.com/YasminCatleyforSwansea/" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/yasmincatleymp/" },
    background: {
      "zh-Hans": "新州工党政治人物，2015 年起任 Swansea 选区州议员，现任新南威尔士州警务与反恐部长、Hunter 地区部长。",
      "zh-Hant": "新州工黨政治人物，2015 年起任 Swansea 選區州議員，現任新南威爾士州警務與反恐部長、Hunter 地區部長。",
      en: "NSW Labor politician, MP for Swansea since 2015, serving as New South Wales Minister for Police and Counter-terrorism and Minister for the Hunter.",
      es: "Política laborista de NSW, diputada por Swansea desde 2015 y ministra de Policía y Contraterrorismo y del Hunter en Nueva Gales del Sur.",
      ja: "NSW 労働党の政治家で、2015年から Swansea 選出州議員。New South Wales の警察・テロ対策相、Hunter 担当相です。",
      ko: "NSW 노동당 정치인으로 2015년부터 Swansea 지역구 의원이며 New South Wales 경찰·대테러 장관과 Hunter 장관을 맡고 있습니다.",
      vi: "Chính trị gia Labor tại NSW, nghị sĩ bang khu Swansea từ năm 2015, hiện là Bộ trưởng Police and Counter-terrorism và Minister for the Hunter của New South Wales.",
      th: "นักการเมือง Labor ของ NSW ส.ส. รัฐเขต Swansea ตั้งแต่ปี 2015 เป็น Minister for Police and Counter-terrorism และ Minister for the Hunter ของ New South Wales",
      si: "2015 සිට Swansea සඳහා NSW Labor MP වන අතර New South Wales Minister for Police and Counter-terrorism සහ Minister for the Hunter ලෙස සේවය කරයි."
    },
    positions: {
      "zh-Hans": "公共职责覆盖新州警务、反恐、社区安全、紧急响应中的警务协调，以及 Hunter 地区事务。",
      "zh-Hant": "公共職責覆蓋新州警務、反恐、社區安全、緊急回應中的警務協調，以及 Hunter 地區事務。",
      en: "Her public brief covers NSW policing, counter-terrorism, community safety, police coordination in emergency response and Hunter regional issues.",
      es: "Su cartera cubre policía de NSW, contraterrorismo, seguridad comunitaria, coordinación policial en emergencias y asuntos regionales del Hunter.",
      ja: "NSW の警察、テロ対策、地域安全、緊急対応での警察調整、Hunter 地域の課題を担当しています。",
      ko: "NSW 치안, 대테러, 지역사회 안전, 긴급 대응에서의 경찰 조정, Hunter 지역 현안을 담당합니다.",
      vi: "Bà phụ trách policing tại NSW, counter-terrorism, an toàn cộng đồng, phối hợp cảnh sát trong emergency response và các vấn đề vùng Hunter.",
      th: "ภารกิจครอบคลุม policing ของ NSW counter-terrorism ความปลอดภัยชุมชน การประสานตำรวจใน emergency response และประเด็นภูมิภาค Hunter",
      si: "ඇගේ public brief එක NSW policing, counter-terrorism, community safety, emergency response හි police coordination සහ Hunter regional issues ආවරණය කරයි."
    }
  },
  {
    name: "Chris Minns",
    aliases: ["Chris Minns", "Christopher John Minns", "Chris Minns MP", "克里斯·明斯", "克里斯·明斯", "クリス・ミンズ", "크리스 민스"],
    type: "politician",
    profile: { label: "Premier biography", url: "https://www.nsw.gov.au/nsw-government/premier-of-nsw" },
    officialProfile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members/Pages/Member-details.aspx?pk=108" },
    social: { label: "X", url: "https://x.com/ChrisMinnsMP" },
    background: {
      "zh-Hans": "新州工党政治人物，Kogarah 选区州议员，2023 年起任新南威尔士州州长和新州工党领袖。进入州议会前曾任地方议员和政务顾问。",
      "zh-Hant": "新州工黨政治人物，Kogarah 選區州議員，2023 年起任新南威爾士州州長和新州工黨領袖。進入州議會前曾任地方議員和政務顧問。",
      en: "NSW Labor politician, MP for Kogarah, Premier of New South Wales since 2023 and leader of NSW Labor. Before state parliament he served as a local councillor and political adviser.",
      es: "Político laborista de NSW, diputado por Kogarah, premier de Nueva Gales del Sur desde 2023 y líder de NSW Labor. Antes del parlamento estatal fue concejal local y asesor político.",
      ja: "NSW 労働党の政治家で、Kogarah 選出州議員。2023年から New South Wales 州首相、NSW Labor 党首です。州議会入り前は地方議員と政治顧問を務めました。",
      ko: "NSW 노동당 정치인으로 Kogarah 지역구 의원이며 2023년부터 New South Wales 주총리와 NSW Labor 대표입니다. 주의회 전에는 지방의원과 정치 보좌관을 지냈습니다.",
      vi: "Chính trị gia Labor tại NSW, nghị sĩ bang khu Kogarah, Premier of New South Wales từ năm 2023 và lãnh đạo NSW Labor. Trước quốc hội bang, ông là councillor địa phương và cố vấn chính trị.",
      th: "นักการเมือง Labor ของ NSW ส.ส. รัฐเขต Kogarah เป็น Premier of New South Wales ตั้งแต่ปี 2023 และผู้นำ NSW Labor ก่อนเข้าสภารัฐเคยเป็น councillor ท้องถิ่นและที่ปรึกษาการเมือง",
      si: "NSW Labor දේශපාලනඥයෙකු වන Chris Minns, Kogarah MP, 2023 සිට Premier of New South Wales සහ NSW Labor නායකයා වේ. State parliament ට පෙර local councillor සහ political adviser ලෙස කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "其州长任期重点包括住房、生活成本、医院、学校、交通、道路收费改革和能源转型；悉尼过路费调整是其政府交通改革的一部分。",
      "zh-Hant": "其州長任期重點包括住房、生活成本、醫院、學校、交通、道路收費改革和能源轉型；悉尼過路費調整是其政府交通改革的一部分。",
      en: "His premiership centres on housing, cost of living, hospitals, schools, transport, toll-road reform and energy transition; Sydney toll changes sit inside his government's transport agenda.",
      es: "Su gobierno se centra en vivienda, coste de vida, hospitales, escuelas, transporte, reforma de peajes y transición energética; los cambios de peajes de Sídney forman parte de su agenda de transporte.",
      ja: "住宅、生活費、病院、学校、交通、有料道路改革、エネルギー転換が主要課題で、Sydney の通行料金見直しは政権の交通政策の一部です。",
      ko: "주택, 생활비, 병원, 학교, 교통, 유료도로 개혁, 에너지 전환이 핵심 의제이며 Sydney 통행료 변경은 정부 교통 의제의 일부입니다.",
      vi: "Trọng tâm nhiệm kỳ gồm nhà ở, chi phí sinh hoạt, bệnh viện, trường học, giao thông, cải cách phí đường bộ và chuyển đổi năng lượng; thay đổi toll ở Sydney nằm trong agenda giao thông của chính phủ ông.",
      th: "วาระของเขาเน้นที่อยู่อาศัย ค่าครองชีพ โรงพยาบาล โรงเรียน การขนส่ง การปฏิรูป toll roads และพลังงาน โดยการเปลี่ยน toll ใน Sydney เป็นส่วนหนึ่งของ agenda ด้านคมนาคม",
      si: "ඔහුගේ premiership එක housing, cost of living, hospitals, schools, transport, toll-road reform සහ energy transition වටා යයි; Sydney toll changes ඔහුගේ රජයේ transport agenda එකේ කොටසකි."
    }
  },
  {
    name: "Ryan Park",
    aliases: ["Ryan Park", "Ryan John Park", "Ryan Park MP", "The Hon Ryan Park MP", "瑞安·帕克", "萊恩·帕克", "ライアン・パーク", "라이언 파크"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers/members-details?memberId=58&ref=1845" },
    officialProfile: { label: "NSW Health minister profile", url: "https://www.health.nsw.gov.au/ministers/Pages/health.aspx" },
    social: { label: "Facebook", url: "https://www.facebook.com/RyanParkMPMemberforKeira/" },
    background: {
      "zh-Hans": "新州工党政治人物，Keira 选区州议员，现任新南威尔士州卫生部长、区域卫生部长以及 Illawarra 和 South Coast 部长。",
      "zh-Hant": "新州工黨政治人物，Keira 選區州議員，現任新南威爾士州衛生部長、區域衛生部長以及 Illawarra 和 South Coast 部長。",
      en: "NSW Labor politician, MP for Keira, serving as New South Wales Minister for Health, Minister for Regional Health, and Minister for the Illawarra and the South Coast.",
      es: "Político laborista de NSW, diputado por Keira y ministro de Salud, Salud Regional, Illawarra y South Coast de Nueva Gales del Sur.",
      ja: "NSW 労働党の政治家で、Keira 選出州議員。New South Wales の保健相、地域保健相、Illawarra and South Coast 担当相を務めています。",
      ko: "NSW 노동당 정치인으로 Keira 지역구 의원이며 New South Wales 보건장관, 지역보건장관, Illawarra and South Coast 장관을 맡고 있습니다.",
      vi: "Chính trị gia Labor tại NSW, nghị sĩ bang khu Keira, hiện là Bộ trưởng Health, Regional Health, Illawarra and South Coast của New South Wales.",
      th: "นักการเมือง Labor ของ NSW ส.ส. รัฐเขต Keira เป็น Minister for Health, Minister for Regional Health และ Minister for the Illawarra and the South Coast ของ New South Wales",
      si: "NSW Labor දේශපාලනඥයෙකු වන Ryan Park, Keira MP, New South Wales Minister for Health, Minister for Regional Health සහ Minister for the Illawarra and the South Coast ලෙස සේවය කරයි."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖新州医院、急诊压力、区域医疗服务、卫生 workforce 和 Illawarra/South Coast 地区事务。",
      "zh-Hant": "其公共職責覆蓋新州醫院、急診壓力、區域醫療服務、衛生 workforce 和 Illawarra/South Coast 地區事務。",
      en: "His public role covers NSW hospitals, emergency-department pressure, regional health services, the health workforce and Illawarra/South Coast regional issues.",
      es: "Su función pública cubre hospitales de NSW, presión en urgencias, servicios regionales de salud, fuerza laboral sanitaria y asuntos de Illawarra/South Coast.",
      ja: "NSW の病院、救急部門の逼迫、地域医療、医療人材、Illawarra/South Coast の地域課題を担当しています。",
      ko: "NSW 병원, 응급실 압박, 지역 보건 서비스, 보건 인력, Illawarra/South Coast 지역 현안을 담당합니다.",
      vi: "Vai trò công của ông bao gồm bệnh viện NSW, áp lực emergency departments, dịch vụ y tế vùng, workforce y tế và các vấn đề Illawarra/South Coast.",
      th: "บทบาทสาธารณะครอบคลุมโรงพยาบาล NSW แรงกดดัน emergency departments บริการสุขภาพภูมิภาค workforce สุขภาพ และประเด็น Illawarra/South Coast",
      si: "ඔහුගේ public role එක NSW hospitals, emergency-department pressure, regional health services, health workforce සහ Illawarra/South Coast regional issues ආවරණය කරයි."
    }
  },
  {
    name: "John Graham",
    aliases: ["John Graham", "John Graham MLC", "The Hon John Graham MLC", "约翰·格雷厄姆", "約翰·格雷厄姆", "ジョン・グラハム", "존 그레이엄"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members/Pages/Member-details.aspx?pk=2224" },
    social: { label: "Facebook", url: "https://www.facebook.com/johngrahamalp/" },
    background: {
      "zh-Hans": "新州工党上议院议员，2016 年进入议会，现任交通部长、艺术部长、音乐和夜间经济部长、特别国务部长，并任上议院政府副领袖。",
      "zh-Hant": "新州工黨上議院議員，2016 年進入議會，現任交通部長、藝術部長、音樂和夜間經濟部長、特別國務部長，並任上議院政府副領袖。",
      en: "NSW Labor member of the Legislative Council, elected in 2016. He is Minister for Transport, Minister for the Arts, Minister for Music and the Night-time Economy, Special Minister of State and Deputy Leader of the Government in the Legislative Council.",
      es: "Miembro laborista del Consejo Legislativo de NSW, elegido en 2016. Es ministro de Transporte, Artes, Música y Economía Nocturna, Special Minister of State y vice líder del gobierno en el Consejo Legislativo.",
      ja: "NSW 労働党の上院議員で、2016年に選出。交通相、芸術相、音楽・夜間経済相、Special Minister of State、上院政府副代表を務めています。",
      ko: "2016년 선출된 NSW 노동당 상원의원입니다. 교통장관, 예술장관, 음악·야간경제 장관, 특별국무장관, 상원 정부 부대표를 맡고 있습니다.",
      vi: "Thành viên Labor của Hội đồng Lập pháp NSW, được bầu năm 2016. Ông là Bộ trưởng Transport, Arts, Music and the Night-time Economy, Special Minister of State và Deputy Leader of the Government trong Hội đồng Lập pháp.",
      th: "สมาชิก Labor ใน Legislative Council ของ NSW ได้รับเลือกปี 2016 เป็น Minister for Transport, Minister for the Arts, Minister for Music and the Night-time Economy, Special Minister of State และ Deputy Leader of the Government ในสภาสูง",
      si: "2016 දී තේරී පත් වූ NSW Labor Legislative Council member කෙනෙකි. ඔහු Minister for Transport, Minister for the Arts, Minister for Music and the Night-time Economy, Special Minister of State සහ Legislative Council හි Deputy Leader of the Government වේ."
    },
    positions: {
      "zh-Hans": "其公共职责覆盖悉尼和新州交通、道路收费改革、文化政策、音乐产业和夜间经济；近期过路费方案由其交通组合负责说明。",
      "zh-Hant": "其公共職責覆蓋悉尼和新州交通、道路收費改革、文化政策、音樂產業和夜間經濟；近期過路費方案由其交通職權負責說明。",
      en: "His public role covers Sydney and NSW transport, toll-road reform, cultural policy, the music sector and the night-time economy; recent toll changes are handled through his transport portfolio.",
      es: "Su función pública cubre transporte de Sídney y NSW, reforma de peajes, política cultural, música y economía nocturna; los cambios recientes de peajes corresponden a su cartera de transporte.",
      ja: "Sydney と NSW の交通、有料道路改革、文化政策、音楽産業、夜間経済を担当し、最近の通行料金変更は交通相として説明しています。",
      ko: "Sydney와 NSW 교통, 유료도로 개혁, 문화정책, 음악 부문, 야간경제를 담당하며 최근 통행료 변경은 그의 교통 포트폴리오에서 다룹니다.",
      vi: "Vai trò công của ông bao gồm giao thông Sydney và NSW, cải cách toll roads, chính sách văn hóa, lĩnh vực âm nhạc và night-time economy; các thay đổi toll gần đây thuộc portfolio giao thông của ông.",
      th: "บทบาทสาธารณะครอบคลุมการขนส่ง Sydney และ NSW การปฏิรูป toll roads นโยบายวัฒนธรรม ภาคดนตรี และ night-time economy โดย toll changes ล่าสุดอยู่ใน portfolio ด้าน transport ของเขา",
      si: "ඔහුගේ public role එක Sydney සහ NSW transport, toll-road reform, cultural policy, music sector සහ night-time economy ආවරණය කරයි; recent toll changes ඔහුගේ transport portfolio හරහා හසුරුවයි."
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
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/gianni_infantino/" },
    profile: { label: "FIFA profile", url: "https://inside.fifa.com/organisation/president" },
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
    aliases: ["Ed Husic", "埃德·胡西克", "埃德·休西克", "エド・ヒュージック", "에드 휴식"],
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
    name: "Michael Lee",
    aliases: ["Michael Lee", "Justice Michael Lee", "Michael Bryan Joshua Lee", "The Hon Justice Michael Lee", "迈克尔·李", "麥可·李", "マイケル・リー", "마이클 리"],
    type: "judge",
    officialProfile: { label: "Federal Court biography", url: "https://www.fedcourt.gov.au/about/judges/current-judges-appointment/current-judges/lee-j" },
    background: {
      "zh-Hans": "澳大利亚联邦法院法官，2017 年获任命；此前为资深诉讼律师和御用大律师，曾审理 Qantas 外包、诽谤和公司法等高关注案件。",
      "zh-Hant": "澳洲聯邦法院法官，2017 年獲任命；此前為資深訴訟律師和資深大律師，曾審理 Qantas 外判、誹謗和公司法等高關注案件。",
      en: "Federal Court of Australia judge appointed in 2017, after a career as a senior litigation lawyer and silk; he has handled high-profile Qantas outsourcing, defamation and corporations matters.",
      es: "Juez del Federal Court of Australia desde 2017, tras una carrera como abogado litigante sénior y silk; ha llevado asuntos destacados sobre outsourcing de Qantas, difamación y derecho corporativo.",
      ja: "2017年に任命された豪州連邦裁判所判事。上級訴訟弁護士、シルクを経て、Qantas 外部委託、名誉毀損、会社法など注目度の高い事件を扱ってきました。",
      ko: "2017년 임명된 호주 연방법원 판사입니다. 선임 소송 변호사와 선임 법정변호사를 거쳤으며 Qantas 아웃소싱, 명예훼손, 기업법 관련 주요 사건을 맡았습니다.",
      vi: "Thẩm phán Federal Court of Australia được bổ nhiệm năm 2017, sau sự nghiệp luật sư tranh tụng cấp cao và silk; ông xử lý các vụ lớn về outsourcing của Qantas, phỉ báng và luật công ty.",
      th: "ผู้พิพากษา Federal Court of Australia ได้รับแต่งตั้งในปี 2017 หลังทำงานเป็นทนายความคดีความอาวุโสและ silk; เคยดูแลคดีสำคัญเกี่ยวกับ Qantas outsourcing หมิ่นประมาท และกฎหมายบริษัท",
      si: "2017 දී පත් කළ Federal Court of Australia judge කෙනෙකි; senior litigation lawyer සහ silk ලෙස කටයුතු කළ පසු Qantas outsourcing, defamation සහ corporations matters වැනි high-profile cases බලයි."
    }
  },
  {
    name: "Jo Puccini",
    aliases: ["Jo Puccini"],
    type: "media executive",
    social: { label: "LinkedIn", url: "https://au.linkedin.com/in/jo-puccini-0b9a0767" },
    background: {
      "zh-Hans": "澳洲公共广播资深编辑和节目负责人，曾在 ABC 任调查与时事主管，并长期参与 Four Corners、7.30、Lateline 和 Media Watch 等节目。",
      "zh-Hant": "澳洲公共廣播資深編輯和節目負責人，曾在 ABC 任調查與時事主管，並長期參與 Four Corners、7.30、Lateline 和 Media Watch 等節目。",
      en: "Australian public-broadcasting editor and program leader who served as ABC head of investigations and current affairs after senior work across Four Corners, 7.30, Lateline and Media Watch.",
      es: "Editora y directiva de programación de la radiodifusión pública australiana; fue jefa de investigaciones y actualidad de ABC tras cargos sénior en Four Corners, 7.30, Lateline y Media Watch.",
      ja: "豪州公共放送の編集者、番組幹部。Four Corners、7.30、Lateline、Media Watch での上級職を経て、ABC の調査報道・時事部門責任者を務めました。",
      ko: "호주 공영방송 편집자이자 프로그램 책임자로, Four Corners, 7.30, Lateline, Media Watch의 고위 역할을 거쳐 ABC 조사보도·시사 부문 책임자를 지냈습니다.",
      vi: "Biên tập viên và lãnh đạo chương trình trong truyền thông công Australia, từng là trưởng bộ phận điều tra và thời sự của ABC sau các vai trò cấp cao ở Four Corners, 7.30, Lateline và Media Watch.",
      th: "บรรณาธิการและผู้บริหารรายการในสื่อสาธารณะออสเตรเลีย เคยเป็นหัวหน้าฝ่ายสืบสวนและเหตุการณ์ปัจจุบันของ ABC หลังทำงานระดับอาวุโสกับ Four Corners, 7.30, Lateline และ Media Watch",
      si: "Australian public-broadcasting editor සහ program leader කෙනෙකි; Four Corners, 7.30, Lateline සහ Media Watch හි senior work පසු ABC head of investigations and current affairs ලෙස කටයුතු කළාය."
    }
  },
  {
    name: "Ralph Carr",
    aliases: ["Ralph Carr", "Ralph D. Carr", "Ralph Carnovale-Carr", "拉尔夫·卡尔", "拉爾夫·卡爾", "ラルフ・カー", "랠프 카"],
    type: "public-figure",
    profile: { label: "Ralph Carr Management profile", url: "https://www.ralphcarr.com/about" },
    background: {
      "zh-Hans": "澳洲娱乐和体育经纪人，Ralph Carr Management 负责人，曾代理音乐人、电视人物和 AFL 运动员。2026 年，他在维州一宗强奸和性侵定罪后被法院解除姓名禁令而公开身份。",
      "zh-Hant": "澳洲娛樂和體育經紀人，Ralph Carr Management 負責人，曾代理音樂人、電視人物和 AFL 運動員。2026 年，他在維州一宗強姦和性侵定罪後被法院解除姓名禁令而公開身份。",
      en: "Australian entertainment and sports manager who led Ralph Carr Management and represented musicians, television personalities and AFL athletes. In 2026, he was publicly identified after a Victorian court lifted suppression following rape and sexual-assault convictions.",
      es: "Representante australiano de entretenimiento y deporte, responsable de Ralph Carr Management, que trabajó con músicos, figuras de televisión y atletas de la AFL. En 2026 fue identificado públicamente después de que un tribunal de Victoria levantara la supresión tras condenas por violación y agresión sexual.",
      ja: "Ralph Carr Management を率いた豪州のエンターテインメント・スポーツマネージャーで、音楽家、テレビ関係者、AFL 選手を代理しました。2026年、ビクトリア州での強姦・性的暴行の有罪評決後に秘匿命令が解除され、氏名が公表されました。",
      ko: "Ralph Carr Management를 이끈 호주의 엔터테인먼트·스포츠 매니저로 음악인, 방송 인물, AFL 선수들을 대리했습니다. 2026년 빅토리아주 법원이 강간 및 성폭력 유죄 평결 뒤 보도금지를 해제하면서 신원이 공개됐습니다.",
      vi: "Nhà quản lý giải trí và thể thao Úc, người đứng đầu Ralph Carr Management và từng đại diện cho nhạc sĩ, nhân vật truyền hình và vận động viên AFL. Năm 2026, ông được công khai danh tính sau khi tòa Victoria dỡ lệnh cấm nêu tên sau các kết án hiếp dâm và tấn công tình dục.",
      th: "ผู้จัดการด้านบันเทิงและกีฬาชาวออสเตรเลีย หัวหน้า Ralph Carr Management ซึ่งเคยดูแลนักดนตรี บุคคลโทรทัศน์ และนักกีฬา AFL ในปี 2026 ศาลวิกตอเรียยกเลิกคำสั่งปิดชื่อหลังคำตัดสินผิดคดี rape และ sexual assault ทำให้เขาถูกเปิดเผยชื่อ",
      si: "Ralph Carr Management නායකත්වය දුන් Australian entertainment සහ sports manager කෙනෙකි; musicians, television personalities සහ AFL athletes නියෝජනය කළේය. 2026 දී Victoria court එක rape සහ sexual-assault convictions පසු suppression ඉවත් කිරීමෙන් ඔහුගේ නම ප්‍රසිද්ධ විය."
    }
  },
  {
    name: "John Gibbs",
    aliases: ["John Gibbs", "Johnny Gibbs", "John Vincent Gibbs", "Gibbsy", "约翰·吉布斯", "約翰·吉布斯", "ジョン・ギブス", "존 깁스"],
    type: "public-figure",
    profile: { label: "Rugby League Project profile", url: "https://www.rugbyleagueproject.org/players/john-gibbs/positions.html" },
    background: {
      "zh-Hans": "澳洲前橄榄球联盟球员和体育广播人，曾效力 Manly-Warringah Sea Eagles，并长期从事 NRL 广播解说。ABC Sport 报道称，2026 年他确诊霍奇金淋巴瘤后暂时离开解说工作接受治疗。",
      "zh-Hant": "澳洲前橄欖球聯盟球員和體育廣播人，曾效力 Manly-Warringah Sea Eagles，並長期從事 NRL 廣播解說。ABC Sport 報道稱，2026 年他確診霍奇金淋巴瘤後暫時離開解說工作接受治療。",
      en: "Australian former rugby league player and sports broadcaster who played for the Manly-Warringah Sea Eagles and later became a long-running NRL radio commentator. ABC Sport reported in 2026 that he was stepping back from commentary after a Hodgkin lymphoma diagnosis.",
      es: "Exjugador australiano de rugby league y comentarista deportivo que jugó para Manly-Warringah Sea Eagles y luego trabajó durante años como comentarista radial de NRL. ABC Sport informó en 2026 que se apartaba temporalmente de la narración tras un diagnóstico de linfoma de Hodgkin.",
      ja: "Manly-Warringah Sea Eagles でプレーした豪州の元ラグビーリーグ選手で、長く NRL のラジオ解説を務めたスポーツ放送人。ABC Sport は2026年、ホジキンリンパ腫の診断を受けて解説業を一時離れると報じました。",
      ko: "Manly-Warringah Sea Eagles에서 뛴 호주의 전 럭비리그 선수이자 스포츠 방송인으로, 이후 오랫동안 NRL 라디오 해설을 맡았습니다. ABC Sport는 2026년 그가 호지킨 림프종 진단 뒤 해설 활동을 잠시 중단한다고 보도했습니다.",
      vi: "Cựu cầu thủ rugby league và phát thanh viên thể thao Úc, từng chơi cho Manly-Warringah Sea Eagles và sau đó bình luận NRL trên radio trong nhiều năm. ABC Sport đưa tin năm 2026 rằng ông tạm rời công việc bình luận sau khi được chẩn đoán Hodgkin lymphoma.",
      th: "อดีตผู้เล่นรักบี้ลีกและผู้บรรยายกีฬาชาวออสเตรเลีย เคยเล่นให้ Manly-Warringah Sea Eagles และต่อมาเป็นผู้บรรยาย NRL ทางวิทยุมาเป็นเวลานาน ABC Sport รายงานในปี 2026 ว่าเขาพักงานบรรยายหลังได้รับการวินิจฉัยว่าเป็น Hodgkin lymphoma",
      si: "Manly-Warringah Sea Eagles වෙනුවෙන් ක්‍රීඩා කළ Australian former rugby league player සහ sports broadcaster කෙනෙකි; පසුව දිගු කලක් NRL radio commentator ලෙස වැඩ කළේය. ABC Sport 2026 දී වාර්තා කළේ Hodgkin lymphoma diagnosis එකක් පසු ඔහු commentary වලින් තාවකාලිකව ඉවත්වන බවයි."
    }
  },
  {
    name: "Tim Nielsen",
    aliases: ["Tim Nielsen", "Timothy John Nielsen", "蒂姆·尼尔森", "蒂姆·尼爾森", "ティム・ニールセン", "팀 닐슨"],
    type: "athlete",
    profile: { label: "ESPNcricinfo profile", url: "https://www.espncricinfo.com/cricketers/tim-nielsen-6928" },
    background: {
      "zh-Hans": "澳洲前一流板球运动员和教练，曾在 2007 至 2011 年担任澳大利亚男子国家队主教练，后来继续参与 Cricket Australia 青训和 U19 项目。",
      "zh-Hant": "澳洲前一流板球運動員和教練，曾在 2007 至 2011 年擔任澳洲男子國家隊主教練，後來繼續參與 Cricket Australia 青訓和 U19 項目。",
      en: "Australian former first-class cricketer and coach. He coached the Australian men's national team from 2007 to 2011 and later worked in Cricket Australia development and under-19 programs.",
      es: "Exjugador australiano de cricket de primera clase y entrenador. Dirigió a la selección masculina de Australia entre 2007 y 2011 y luego trabajó en desarrollo y programas sub-19 de Cricket Australia.",
      ja: "豪州の元ファーストクラス・クリケット選手でコーチ。2007年から2011年まで男子豪州代表を率い、その後 Cricket Australia の育成・U19 プログラムに関わっています。",
      ko: "호주의 전 1급 크리켓 선수이자 코치입니다. 2007년부터 2011년까지 호주 남자 대표팀을 이끌었고 이후 Cricket Australia의 육성 및 U19 프로그램에서 일했습니다.",
      vi: "Cựu VĐV cricket first-class và HLV người Úc. Ông dẫn dắt đội tuyển nam Australia từ 2007 đến 2011 và sau đó làm việc trong các chương trình phát triển, U19 của Cricket Australia.",
      th: "อดีตผู้เล่นคริกเก็ต first-class และโค้ชชาวออสเตรเลีย เคยคุมทีมชายทีมชาติออสเตรเลียระหว่างปี 2007 ถึง 2011 และต่อมาทำงานในโครงการพัฒนาและ U19 ของ Cricket Australia",
      si: "Australian former first-class cricketer සහ coach කෙනෙකි. 2007 සිට 2011 දක්වා Australian men's national team coach වූ අතර පසුව Cricket Australia development සහ under-19 programs තුළ වැඩ කළේය."
    }
  },
  {
    name: "Alan Jones",
    aliases: ["Alan Jones", "Alan Belford Jones", "艾伦·琼斯", "艾倫·瓊斯", "アラン・ジョーンズ", "앨런 존스"],
    type: "public-figure",
    profile: { label: "Wikipedia profile", url: "https://en.wikipedia.org/wiki/Alan_Jones_(talkback_host)" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/alanjonesaustralia/" },
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
    name: "David Ossip",
    aliases: ["David Ossip", "David Ossip AM", "大卫·奥西普", "大衛·奧西普", "デイビッド・オシップ", "데이비드 오십"],
    type: "public-figure",
    officialProfile: { label: "NSW Jewish Board profile", url: "https://nswjbd.org.au/2022/08/16/changing-of-the-guard-at-the-nsw-jewish-board-of-deputies/" },
    background: {
      "zh-Hans": "新州 Jewish Board of Deputies 前主席和澳洲犹太社区公共代表，在反犹主义、社区安全和社会凝聚相关公共讨论中经常代表该机构发声。",
      "zh-Hant": "新州 Jewish Board of Deputies 前主席和澳洲猶太社區公共代表，在反猶主義、社區安全和社會凝聚相關公共討論中經常代表該機構發聲。",
      en: "Former president of the NSW Jewish Board of Deputies and a public representative of the Australian Jewish community, often speaking for the organisation on antisemitism, community safety and social cohesion.",
      es: "Expresidente del NSW Jewish Board of Deputies y representante público de la comunidad judía australiana, con intervenciones frecuentes sobre antisemitismo, seguridad comunitaria y cohesión social.",
      ja: "NSW Jewish Board of Deputies の元会長で、豪州ユダヤ人コミュニティの公的代表者。反ユダヤ主義、地域安全、社会的結束について同団体を代表して発言してきました。",
      ko: "NSW Jewish Board of Deputies 전 회장이자 호주 유대인 공동체의 공적 대표입니다. 반유대주의, 공동체 안전, 사회 통합 문제에서 해당 단체를 대표해 발언해 왔습니다.",
      vi: "Cựu chủ tịch NSW Jewish Board of Deputies và đại diện công khai của cộng đồng Do Thái Australia, thường lên tiếng về chủ nghĩa bài Do Thái, an toàn cộng đồng và gắn kết xã hội.",
      th: "อดีตประธาน NSW Jewish Board of Deputies และตัวแทนสาธารณะของชุมชนยิวออสเตรเลีย มักพูดในนามองค์กรเรื่อง antisemitism ความปลอดภัยชุมชน และ social cohesion",
      si: "NSW Jewish Board of Deputies හි හිටපු president සහ Australian Jewish community හි public representative කෙනෙකි; antisemitism, community safety සහ social cohesion පිළිබඳ සංවිධානය වෙනුවෙන් නිතර අදහස් දක්වයි."
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
    name: "Leanne Liddle",
    aliases: ["Leanne Liddle", "莉安·利德尔", "莉安·利德爾", "リアン・リドル", "리앤 리들"],
    type: "public-figure",
    officialProfile: { label: "Executive leadership profile", url: "https://pfes.nt.gov.au/corporate/executive-leadership" },
    background: {
      "zh-Hans": "Northern Territory Police Force 文化改革执行主任，Arrernte 女性，曾参与北领地 Aboriginal Justice Agreement，并因司法和警务文化改革工作获公共表彰。",
      "zh-Hant": "Northern Territory Police Force 文化改革執行主任，Arrernte 女性，曾參與北領地 Aboriginal Justice Agreement，並因司法和警務文化改革工作獲公共表彰。",
      en: "Executive Director of Cultural Reform for the Northern Territory Police Force, an Arrernte woman involved in the Northern Territory Aboriginal Justice Agreement and publicly recognised for justice and policing reform work.",
      es: "Directora ejecutiva de reforma cultural en la Northern Territory Police Force, mujer Arrernte vinculada al Northern Territory Aboriginal Justice Agreement y reconocida públicamente por su trabajo en reforma de justicia y policía.",
      ja: "Northern Territory Police Force の文化改革担当 Executive Director。Arrernte の女性で、Northern Territory Aboriginal Justice Agreement に関わり、司法と警察文化改革の仕事で公的に評価されています。",
      ko: "Northern Territory Police Force의 문화 개혁 담당 Executive Director입니다. Arrernte 여성으로 Northern Territory Aboriginal Justice Agreement에 관여했고 사법 및 경찰 문화 개혁 활동으로 공개적으로 인정받았습니다.",
      vi: "Executive Director of Cultural Reform của Northern Territory Police Force, phụ nữ Arrernte, từng tham gia Northern Territory Aboriginal Justice Agreement và được công nhận công khai nhờ công việc cải cách tư pháp và văn hóa cảnh sát.",
      th: "Executive Director of Cultural Reform ของ Northern Territory Police Force เป็นหญิง Arrernte มีส่วนร่วมกับ Northern Territory Aboriginal Justice Agreement และได้รับการยอมรับต่อสาธารณะจากงานปฏิรูปความยุติธรรมและวัฒนธรรมตำรวจ",
      si: "Northern Territory Police Force හි Executive Director of Cultural Reform වන Leanne Liddle, Arrernte කාන්තාවකි; Northern Territory Aboriginal Justice Agreement සමඟ සම්බන්ධ වී justice සහ policing reform වැඩ සඳහා public recognition ලබා ඇත."
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
    officialProfile: { label: "Official biography", url: "https://www.gg.gov.au/about-governor-general/governor-generals-biography" },
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
    name: "Nick Watson",
    aliases: ["Nick Watson", "Nicholas Watson", "The Wizard", "Watto", "Wiz", "尼克·沃森", "尼克·華森", "ニック・ワトソン", "닉 왓슨"],
    type: "athlete",
    social: { label: "Official profile", url: "https://www.hawthornfc.com.au/players/5592/nick-watson" },
    background: {
      "zh-Hans": "澳大利亚规则足球运动员，效力 AFL 的 Hawthorn，司职中小型前锋。2023 年以第 5 顺位被选中，因速度、进球能力和“The Wizard”外号受到 Hawthorn 球迷关注。",
      "zh-Hant": "澳洲規則足球運動員，效力 AFL 的 Hawthorn，司職中小型前鋒。2023 年以第 5 順位被選中，因速度、進球能力和「The Wizard」外號受到 Hawthorn 球迷關注。",
      en: "Australian rules footballer for Hawthorn in the AFL, playing as a medium forward. Drafted at pick 5 in 2023, he is known to Hawks supporters for speed, goal sense and the nickname The Wizard.",
      es: "Jugador de fútbol australiano de Hawthorn en la AFL, como medium forward. Elegido con el pick 5 en 2023, es conocido entre la afición de los Hawks por su velocidad, olfato goleador y el apodo The Wizard.",
      ja: "AFL の Hawthorn に所属するオーストラリアンルールズ選手で、medium forward としてプレーします。2023年ドラフト5位指名で、スピード、得点感覚、The Wizard の愛称で Hawks ファンに知られています。",
      ko: "AFL Hawthorn에서 미디엄 포워드로 뛰는 호주식 풋볼 선수입니다. 2023년 드래프트 5순위로 지명됐고 속도, 득점 감각, The Wizard라는 별명으로 Hawks 팬들에게 알려져 있습니다.",
      vi: "Cầu thủ Australian rules football của Hawthorn tại AFL, chơi medium forward. Được chọn pick 5 năm 2023, anh được cổ động viên Hawks biết đến nhờ tốc độ, cảm giác ghi bàn và biệt danh The Wizard.",
      th: "นัก Australian rules football ของ Hawthorn ใน AFL เล่นตำแหน่ง medium forward ถูกดราฟต์ pick 5 ในปี 2023 และเป็นที่รู้จักในหมู่แฟน Hawks จากความเร็ว เซนส์การทำประตู และฉายา The Wizard",
      si: "AFL හි Hawthorn වෙනුවෙන් medium forward ලෙස ක්‍රීඩා කරන Australian rules footballer කෙනෙකි. 2023 දී pick 5 ලෙස තෝරා ගත් අතර speed, goal sense සහ The Wizard nickname නිසා Hawks supporters අතර ප්‍රසිද්ධය."
    }
  },
  {
    name: "Mabior Chol",
    aliases: ["Mabior Chol", "Mabior", "马比奥尔·乔尔", "馬比奧爾·喬爾", "マビア・チョル", "마비오르 촐"],
    type: "athlete",
    social: { label: "Official profile", url: "https://www.hawthornfc.com.au/players/1125/mabior-chol" },
    background: {
      "zh-Hans": "AFL 职业澳式足球运动员，现效力 Hawthorn，司职高大前锋和替补 ruck。此前效力 Richmond 和 Gold Coast，并曾获得 Gold Coast 与 Hawthorn 队内赛季进球王。",
      "zh-Hant": "AFL 職業澳式足球運動員，現效力 Hawthorn，司職高大前鋒和替補 ruck。此前效力 Richmond 和 Gold Coast，並曾獲得 Gold Coast 與 Hawthorn 隊內賽季進球王。",
      en: "Professional AFL footballer now with Hawthorn, playing as a tall forward and relief ruck. He previously played for Richmond and Gold Coast and has been a season leading goalkicker at both Gold Coast and Hawthorn.",
      es: "Futbolista profesional de AFL, ahora en Hawthorn, como tall forward y relief ruck. Antes jugó para Richmond y Gold Coast, y fue máximo goleador de temporada tanto en Gold Coast como en Hawthorn.",
      ja: "Hawthorn に所属するプロ AFL 選手で、tall forward と relief ruck を務めます。以前は Richmond と Gold Coast でプレーし、Gold Coast と Hawthorn の双方でシーズン最多得点者になりました。",
      ko: "현재 Hawthorn 소속의 프로 AFL 선수로 tall forward와 relief ruck 역할을 합니다. Richmond와 Gold Coast에서 뛰었고 Gold Coast와 Hawthorn 모두에서 시즌 팀 내 최다 골을 기록했습니다.",
      vi: "Cầu thủ AFL chuyên nghiệp hiện chơi cho Hawthorn, ở vai trò tall forward và relief ruck. Anh từng chơi cho Richmond và Gold Coast, và từng là cây ghi bàn nhiều nhất mùa của cả Gold Coast lẫn Hawthorn.",
      th: "นัก AFL อาชีพของ Hawthorn เล่นเป็น tall forward และ relief ruck ก่อนหน้านี้เล่นให้ Richmond และ Gold Coast และเคยเป็นผู้ทำประตูสูงสุดประจำฤดูกาลของทั้ง Gold Coast และ Hawthorn",
      si: "දැනට Hawthorn වෙනුවෙන් tall forward සහ relief ruck ලෙස ක්‍රීඩා කරන professional AFL footballer කෙනෙකි. ඔහු Richmond සහ Gold Coast සඳහාද ක්‍රීඩා කර ඇති අතර Gold Coast සහ Hawthorn දෙකෙහිම season leading goalkicker වී ඇත."
    }
  },
  {
    name: "Matt Payne",
    aliases: ["Matt Payne", "Matthew Payne", "Matthew Allen Payne", "马特·佩恩", "馬特·佩恩", "マット・ペイン", "맷 페인"],
    type: "athlete",
    social: { label: "Supercars profile", url: "https://www.supercars.com/drivers/matthew-payne" },
    background: {
      "zh-Hans": "新西兰赛车手，效力 Supercars 的 Penrite Racing/Grove Racing，驾驶 19 号 Ford Mustang，并在 2025 年赢得 Bathurst 1000。",
      "zh-Hant": "紐西蘭賽車手，效力 Supercars 的 Penrite Racing/Grove Racing，駕駛 19 號 Ford Mustang，並在 2025 年贏得 Bathurst 1000。",
      en: "New Zealand racing driver in Supercars with Penrite Racing/Grove Racing, driving the No. 19 Ford Mustang and winner of the 2025 Bathurst 1000.",
      es: "Piloto neozelandés de Supercars con Penrite Racing/Grove Racing, al volante del Ford Mustang número 19 y ganador del Bathurst 1000 de 2025.",
      ja: "Supercars の Penrite Racing/Grove Racing に所属するニュージーランド人レーシングドライバー。19号車 Ford Mustang を走らせ、2025年 Bathurst 1000 を制しました。",
      ko: "Supercars Penrite Racing/Grove Racing 소속 뉴질랜드 레이싱 드라이버로 19번 Ford Mustang을 몰며 2025 Bathurst 1000 우승자입니다.",
      vi: "Tay đua New Zealand ở Supercars cho Penrite Racing/Grove Racing, lái Ford Mustang số 19 và vô địch Bathurst 1000 năm 2025.",
      th: "นักแข่งรถชาวนิวซีแลนด์ใน Supercars สังกัด Penrite Racing/Grove Racing ขับ Ford Mustang หมายเลข 19 และเป็นผู้ชนะ Bathurst 1000 ปี 2025",
      si: "Supercars හි Penrite Racing/Grove Racing වෙනුවෙන් No. 19 Ford Mustang ධාවනය කරන New Zealand racing driver; 2025 Bathurst 1000 ජයග්‍රාහකයෙකි."
    }
  },
  {
    name: "Brodie Kostecki",
    aliases: ["Brodie Kostecki", "Brodie Paul Kostecki", "布罗迪·科斯特基", "布羅迪·科斯特基", "ブロディ・コステッキ", "브로디 코스테키"],
    type: "athlete",
    social: { label: "Supercars profile", url: "https://www.supercars.com/drivers/brodie-kostecki" },
    background: {
      "zh-Hans": "西澳出身的职业赛车手，Supercars 2023 年总冠军和 2024 年 Bathurst 1000 冠军，现与 Shell V-Power Racing Team/Dick Johnson Racing 相关。",
      "zh-Hant": "西澳出身的職業賽車手，Supercars 2023 年總冠軍和 2024 年 Bathurst 1000 冠軍，現與 Shell V-Power Racing Team/Dick Johnson Racing 相關。",
      en: "Western Australian professional racing driver, 2023 Supercars champion and 2024 Bathurst 1000 winner, now associated with Shell V-Power Racing Team/Dick Johnson Racing.",
      es: "Piloto profesional de Australia Occidental, campeón de Supercars 2023 y ganador del Bathurst 1000 de 2024, vinculado a Shell V-Power Racing Team/Dick Johnson Racing.",
      ja: "西オーストラリア出身のプロレーシングドライバー。2023年 Supercars 王者、2024年 Bathurst 1000 優勝者で、Shell V-Power Racing Team/Dick Johnson Racing と関係します。",
      ko: "서호주 출신 프로 레이싱 드라이버로 2023 Supercars 챔피언이자 2024 Bathurst 1000 우승자이며 Shell V-Power Racing Team/Dick Johnson Racing과 관련돼 있습니다.",
      vi: "Tay đua chuyên nghiệp người Tây Úc, vô địch Supercars 2023 và thắng Bathurst 1000 năm 2024, hiện gắn với Shell V-Power Racing Team/Dick Johnson Racing.",
      th: "นักแข่งรถอาชีพจาก Western Australia แชมป์ Supercars ปี 2023 และผู้ชนะ Bathurst 1000 ปี 2024 ปัจจุบันเกี่ยวข้องกับ Shell V-Power Racing Team/Dick Johnson Racing",
      si: "Western Australian professional racing driver; 2023 Supercars champion සහ 2024 Bathurst 1000 winner, Shell V-Power Racing Team/Dick Johnson Racing සමඟ සම්බන්ධය ඇත."
    }
  },
  {
    name: "Kai Allen",
    aliases: ["Kai Allen", "凯·艾伦", "凱·艾倫", "カイ・アレン", "카이 앨런"],
    type: "athlete",
    social: { label: "Supercars profile", url: "https://www.supercars.com/drivers/kai-allen" },
    background: {
      "zh-Hans": "南澳 Mount Gambier 出身的赛车手，Supercars 车手，曾获 Super2 冠军，效力 Penrite Racing/Grove Racing。",
      "zh-Hant": "南澳 Mount Gambier 出身的賽車手，Supercars 車手，曾獲 Super2 冠軍，效力 Penrite Racing/Grove Racing。",
      en: "Racing driver from Mount Gambier, South Australia, a Supercars driver and former Super2 champion with Penrite Racing/Grove Racing.",
      es: "Piloto de Mount Gambier, Australia Meridional, piloto de Supercars y ex campeón de Super2 con Penrite Racing/Grove Racing.",
      ja: "南オーストラリア州 Mount Gambier 出身のレーシングドライバー。Supercars 参戦中で、Super2 元王者、Penrite Racing/Grove Racing 所属です。",
      ko: "남호주 Mount Gambier 출신 레이싱 드라이버로 Supercars 선수이며 Penrite Racing/Grove Racing 소속 전 Super2 챔피언입니다.",
      vi: "Tay đua từ Mount Gambier, Nam Úc, đang đua Supercars và từng vô địch Super2 với Penrite Racing/Grove Racing.",
      th: "นักแข่งรถจาก Mount Gambier รัฐเซาท์ออสเตรเลีย เป็นนักแข่ง Supercars และอดีตแชมป์ Super2 ของ Penrite Racing/Grove Racing",
      si: "South Australia Mount Gambier හි racing driver; Supercars driver සහ Penrite Racing/Grove Racing හි former Super2 champion."
    }
  },
  {
    name: "Ryan Wood",
    aliases: ["Ryan Wood", "瑞安·伍德", "萊恩·伍德", "ライアン・ウッド", "라이언 우드"],
    type: "athlete",
    social: { label: "Supercars profile", url: "https://www.supercars.com/drivers/ryan-wood" },
    background: {
      "zh-Hans": "新西兰赛车手，效力 Supercars 的 Walkinshaw TWG Racing，曾在澳洲保时捷和 Super2 阶梯赛事中表现突出。",
      "zh-Hant": "紐西蘭賽車手，效力 Supercars 的 Walkinshaw TWG Racing，曾在澳洲保時捷和 Super2 階梯賽事中表現突出。",
      en: "New Zealand racing driver in Supercars with Walkinshaw TWG Racing, after standout Porsche and Super2 ladder results in Australia.",
      es: "Piloto neozelandés de Supercars con Walkinshaw TWG Racing, tras destacar en Porsche y Super2 en Australia.",
      ja: "Supercars の Walkinshaw TWG Racing に所属するニュージーランド人レーシングドライバー。豪州の Porsche と Super2 系列で実績を上げました。",
      ko: "Walkinshaw TWG Racing 소속 Supercars 뉴질랜드 레이싱 드라이버로 호주 Porsche 및 Super2 단계에서 두각을 보였습니다.",
      vi: "Tay đua New Zealand ở Supercars cho Walkinshaw TWG Racing, sau các kết quả nổi bật ở Porsche và Super2 tại Úc.",
      th: "นักแข่งรถชาวนิวซีแลนด์ใน Supercars สังกัด Walkinshaw TWG Racing หลังทำผลงานเด่นในสาย Porsche และ Super2 ที่ออสเตรเลีย",
      si: "Supercars හි Walkinshaw TWG Racing සමඟ New Zealand racing driver; Australia හි Porsche සහ Super2 ladder results වලින් ඉදිරියට ආවෙකි."
    }
  },
  {
    name: "Anton De Pasquale",
    aliases: ["Anton De Pasquale", "Anton de Pasquale", "安东·德帕斯夸莱", "安東·德帕斯夸萊", "アントン・デ・パスクアーレ", "안톤 데 파스콸레"],
    type: "athlete",
    social: { label: "Supercars profile", url: "https://www.supercars.com/drivers/anton-de-pasquale" },
    background: {
      "zh-Hans": "墨尔本出身的 Supercars 赛车手，效力 Team 18，早年赢得 Australian Formula Ford Championship，之后转入 Super2 和 Supercars。",
      "zh-Hant": "墨爾本出身的 Supercars 賽車手，效力 Team 18，早年贏得 Australian Formula Ford Championship，之後轉入 Super2 和 Supercars。",
      en: "Melbourne-born Supercars driver for Team 18, a former Australian Formula Ford champion who moved through Super2 into the main Supercars field.",
      es: "Piloto de Supercars nacido en Melbourne para Team 18, ex campeón australiano de Formula Ford que pasó por Super2 antes de llegar a Supercars.",
      ja: "メルボルン出身の Team 18 所属 Supercars ドライバー。Australian Formula Ford 元王者で、Super2 を経てメインカテゴリーに進みました。",
      ko: "멜버른 출신 Team 18 Supercars 드라이버로 Australian Formula Ford 챔피언을 지낸 뒤 Super2를 거쳐 메인 Supercars 무대로 올라왔습니다.",
      vi: "Tay đua Supercars sinh ở Melbourne của Team 18, cựu vô địch Australian Formula Ford, đi qua Super2 trước khi lên hạng chính Supercars.",
      th: "นักแข่ง Supercars จากเมลเบิร์นของ Team 18 อดีตแชมป์ Australian Formula Ford ที่ไต่จาก Super2 เข้าสู่สนามหลักของ Supercars",
      si: "Melbourne-born Team 18 Supercars driver; former Australian Formula Ford champion, Super2 හරහා main Supercars field වෙත පැමිණියේය."
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
    name: "Lidia Thorpe",
    aliases: ["Lidia Thorpe", "Senator Lidia Thorpe", "Lidia Alma Thorpe", "莉迪亚·索普", "莉迪亞·索普", "リディア・ソープ", "리디아 소프"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/Senator_Thorpe" },
    officialProfile: { label: "Personal website", url: "https://www.lidiathorpe.com/" },
    social: { label: "X", url: "https://x.com/SenatorThorpe" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/senatorthorpe/" },
    background: {
      "zh-Hans": "Gunnai、Gunditjmara 和 Djab Wurrung 女性，维州联邦参议员，曾代表 Greens，后来以独立参议员身份倡导 Blak Sovereign Movement。",
      "zh-Hant": "Gunnai、Gunditjmara 和 Djab Wurrung 女性，維州聯邦參議員，曾代表 Greens，後來以獨立參議員身份倡導 Blak Sovereign Movement。",
      en: "Gunnai, Gunditjmara and Djab Wurrung woman and Victorian senator who entered federal parliament with the Greens and later sat as an independent for the Blak Sovereign Movement.",
      es: "Mujer Gunnai, Gunditjmara y Djab Wurrung y senadora federal por Victoria; llegó al Parlamento con los Greens y luego actuó como independiente por el Blak Sovereign Movement.",
      ja: "Gunnai、Gunditjmara、Djab Wurrung の女性で、ビクトリア州選出の連邦上院議員。Greens 所属で連邦議会入りし、その後 Blak Sovereign Movement の独立議員として活動しています。",
      ko: "Gunnai, Gunditjmara, Djab Wurrung 여성으로 빅토리아주 연방 상원의원입니다. Greens 소속으로 의회에 들어간 뒤 Blak Sovereign Movement를 대표하는 무소속으로 활동했습니다.",
      vi: "Phụ nữ Gunnai, Gunditjmara và Djab Wurrung, thượng nghị sĩ liên bang của Victoria; vào Quốc hội cùng Greens rồi sau đó ngồi độc lập cho Blak Sovereign Movement.",
      th: "สตรีชาว Gunnai, Gunditjmara และ Djab Wurrung และวุฒิสมาชิกจากรัฐ Victoria เข้าสู่รัฐสภากับ Greens ก่อนเป็นอิสระในนาม Blak Sovereign Movement",
      si: "Gunnai, Gunditjmara සහ Djab Wurrung woman කෙනෙකු වන Victorian senator; Greens සමඟ federal parliament වෙත පැමිණ පසුව Blak Sovereign Movement වෙනුවෙන් independent ලෙස කටයුතු කළාය."
    },
    positions: {
      "zh-Hans": [
        "原住民主权：主张 Treaty、Truth-telling、First Nations 自决和对殖民伤害的制度性回应。",
        "反种族主义：要求更强的国家级反种族主义调查和对政治、媒体、执法机构中种族主义的问责。",
        "气候与土地权利：把气候行动、土地保护和原住民对 Country 的管理权联系在一起。"
      ],
      "zh-Hant": [
        "原住民主權：主張 Treaty、Truth-telling、First Nations 自決和對殖民傷害的制度性回應。",
        "反種族主義：要求更強的國家級反種族主義調查和對政治、媒體、執法機構中種族主義的問責。",
        "氣候與土地權利：把氣候行動、土地保護和原住民對 Country 的管理權連在一起。"
      ],
      en: [
        "First Nations sovereignty: advocates treaty, truth-telling, self-determination and institutional responses to colonial harm.",
        "Anti-racism: calls for stronger national scrutiny of racism in politics, media, policing and public life.",
        "Climate and land rights: links climate action with land protection and First Nations authority over Country."
      ],
      es: [
        "Soberanía First Nations: defiende treaty, truth-telling, autodeterminación y respuestas institucionales al daño colonial.",
        "Antirracismo: pide mayor escrutinio nacional del racismo en política, medios, policía y vida pública.",
        "Clima y tierra: vincula acción climática, protección territorial y autoridad First Nations sobre Country."
      ],
      ja: [
        "First Nations 主権：Treaty、Truth-telling、自己決定、植民地支配の被害への制度的対応を求めています。",
        "反人種差別：政治、メディア、警察、公的生活における人種差別への全国的な検証強化を求めています。",
        "気候と土地権：気候対策、土地保護、First Nations による Country への権限を結び付けています。"
      ],
      ko: [
        "First Nations 주권: treaty, truth-telling, 자기결정, 식민 피해에 대한 제도적 대응을 주장합니다.",
        "반인종주의: 정치, 미디어, 경찰, 공적 영역의 인종주의에 대한 더 강한 전국적 검증을 요구합니다.",
        "기후와 토지권: 기후 행동, 토지 보호, Country에 대한 First Nations 권한을 연결합니다."
      ],
      vi: [
        "Chủ quyền First Nations: ủng hộ treaty, truth-telling, tự quyết và phản ứng thể chế với tổn hại thuộc địa.",
        "Chống phân biệt chủng tộc: kêu gọi giám sát quốc gia mạnh hơn với phân biệt chủng tộc trong chính trị, truyền thông, cảnh sát và đời sống công.",
        "Khí hậu và đất đai: nối hành động khí hậu với bảo vệ đất và quyền First Nations đối với Country."
      ],
      th: [
        "อธิปไตย First Nations: สนับสนุน treaty, truth-telling, self-determination และการตอบสนองเชิงสถาบันต่อความเสียหายจากอาณานิคม",
        "ต้าน racism: เรียกร้องการตรวจสอบระดับชาติที่เข้มขึ้นต่อ racism ในการเมือง สื่อ ตำรวจ และชีวิตสาธารณะ",
        "ภูมิอากาศและสิทธิที่ดิน: เชื่อม climate action กับการปกป้องที่ดินและอำนาจ First Nations เหนือ Country"
      ],
      si: [
        "First Nations sovereignty: treaty, truth-telling, self-determination සහ colonial harm සඳහා institutional responses ඉල්ලා සිටී.",
        "Anti-racism: politics, media, policing සහ public life තුළ racism ගැන ශක්තිමත් national scrutiny ඉල්ලා සිටී.",
        "Climate and land rights: climate action, land protection සහ Country පිළිබඳ First Nations authority එකට සම්බන්ධ කරයි."
      ]
    }
  },
  {
    name: "Mike Cannon-Brookes",
    aliases: ["Mike Cannon-Brookes", "Michael Cannon-Brookes", "Michael Cannon Brookes", "迈克·坎农-布鲁克斯", "麥克·坎農-布魯克斯", "マイク・キャノンブルックス", "마이크 캐넌브룩스"],
    type: "executive",
    profile: { label: "Atlassian leadership", url: "https://www.atlassian.com/company/people" },
    officialProfile: { label: "LinkedIn", url: "https://au.linkedin.com/in/mcannonbrookes" },
    social: { label: "X", url: "https://x.com/mcannonbrookes" },
    personalSocial: { label: "LinkedIn", url: "https://au.linkedin.com/in/mcannonbrookes" },
    background: {
      "zh-Hans": "澳大利亚科技企业家，Atlassian 联合创始人兼首席执行官，也是气候投资和能源转型项目的重要投资者。",
      "zh-Hant": "澳洲科技企業家，Atlassian 共同創辦人兼行政總裁，也是氣候投資和能源轉型項目的重要投資者。",
      en: "Australian technology entrepreneur, co-founder and chief executive of Atlassian, and a major investor in climate and energy-transition projects.",
      es: "Emprendedor tecnológico australiano, cofundador y director ejecutivo de Atlassian, e importante inversor en proyectos climáticos y de transición energética.",
      ja: "豪州のテクノロジー起業家。Atlassian の共同創業者兼最高経営責任者で、気候・エネルギー転換分野の主要投資家でもあります。",
      ko: "호주 기술 기업가로 Atlassian 공동창업자 겸 최고경영자이며, 기후 및 에너지 전환 프로젝트의 주요 투자자입니다.",
      vi: "Doanh nhân công nghệ Australia, đồng sáng lập kiêm CEO Atlassian, đồng thời là nhà đầu tư lớn vào các dự án khí hậu và chuyển đổi năng lượng.",
      th: "ผู้ประกอบการเทคโนโลยีชาวออสเตรเลีย ผู้ร่วมก่อตั้งและซีอีโอของ Atlassian และนักลงทุนรายใหญ่ในโครงการ climate กับ energy transition",
      si: "Australian technology entrepreneur කෙනෙකි; Atlassian co-founder සහ chief executive වන අතර climate සහ energy-transition projects වල ප්‍රධාන investor කෙනෙකි."
    }
  },
  {
    name: "Tony Burke",
    aliases: ["Tony Burke", "The Hon Tony Burke", "托尼·伯克", "トニー・バーク", "토니 버크"],
    type: "politician",
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/T_Burke_MP" },
    officialProfile: { label: "Minister biography", url: "https://minister.homeaffairs.gov.au/TonyBurke/Pages/Welcome.aspx" },
    social: { label: "X", url: "https://x.com/Tony_Burke" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/burke.tony.mp/" },
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
      "zh-Hans": [
        "移民：主张维护移民体系完整性，收紧学生签证和复审滥用，同时保留对技能、战略伙伴和真实教育需求的通道。",
        "网络安全：强调政府、企业和关键平台共同承担防护责任，目标是把澳洲网络韧性提高到世界前列。",
        "文化：支持国家文化政策和澳洲内容投入，认为艺术与文化应覆盖全国，而不只集中在悉尼和墨尔本。"
      ],
      "zh-Hant": [
        "移民：主張維護移民體系完整性，收緊學生簽證和覆審濫用，同時保留對技能、戰略夥伴和真實教育需求的通道。",
        "網絡安全：強調政府、企業和關鍵平台共同承擔防護責任，目標是把澳洲網絡韌性提高到世界前列。",
        "文化：支持國家文化政策和澳洲內容投入，認為藝術與文化應覆蓋全國，而不只集中在悉尼和墨爾本。"
      ],
      en: [
        "Migration: argues for protecting migration-system integrity, tightening student-visa and review abuse while keeping pathways for skills, strategic partners and genuine education.",
        "Cyber security: frames cyber resilience as a shared responsibility between government, business and major technology partners, with Australia aiming for world-leading capability.",
        "Culture: backs national cultural policy and Australian content funding, arguing arts and culture should reach beyond Sydney and Melbourne."
      ],
      es: [
        "Migración: defiende la integridad del sistema migratorio, endureciendo abusos en visas estudiantiles y revisiones, sin cerrar vías para habilidades, socios estratégicos y educación genuina.",
        "Ciberseguridad: plantea la resiliencia digital como responsabilidad compartida entre gobierno, empresas y grandes socios tecnológicos.",
        "Cultura: apoya una política cultural nacional y financiación para contenido australiano, con alcance más allá de Sydney y Melbourne."
      ],
      ja: [
        "移民：制度の信頼性を重視し、学生ビザや審査制度の乱用を抑えつつ、技能・戦略的パートナー・本来の教育目的のルートは残す立場です。",
        "サイバー安全保障：政府、企業、大手テック企業が共同で責任を負い、豪州のサイバー耐性を世界上位に引き上げるべきだとしています。",
        "文化：国家文化政策と豪州コンテンツ支援を重視し、芸術文化は Sydney と Melbourne だけでなく全国に届くべきだと主張しています。"
      ],
      ko: [
        "이민: 이민 제도의 신뢰성을 지키기 위해 학생비자와 심사 남용은 조이되, 기술 인력, 전략적 파트너, 진정한 교육 목적의 경로는 유지해야 한다는 입장입니다.",
        "사이버 보안: 정부, 기업, 주요 기술 파트너가 함께 책임지는 국가적 회복력 문제로 보고, 호주의 역량을 세계 상위 수준으로 끌어올리려 합니다.",
        "문화: 국가 문화정책과 호주 콘텐츠 투자를 지지하며, 예술과 문화가 Sydney와 Melbourne에만 집중돼서는 안 된다고 봅니다."
      ],
      vi: [
        "Di trú: nhấn mạnh tính liêm chính của hệ thống, siết lạm dụng visa sinh viên và kháng nghị, nhưng vẫn giữ lối đi cho kỹ năng, đối tác chiến lược và giáo dục thực chất.",
        "An ninh mạng: coi năng lực chống chịu mạng là trách nhiệm chung của chính phủ, doanh nghiệp và các đối tác công nghệ lớn.",
        "Văn hóa: ủng hộ chính sách văn hóa quốc gia và đầu tư cho nội dung Australia, với quan điểm nghệ thuật không nên chỉ tập trung ở Sydney và Melbourne."
      ],
      th: [
        "การย้ายถิ่น: เน้นความน่าเชื่อถือของระบบ migration โดยเข้มงวดกับ student visa และการอุทธรณ์ที่ถูกใช้ผิดทาง แต่ยังคงทางสำหรับทักษะ พันธมิตรยุทธศาสตร์ และการศึกษาจริง",
        "ไซเบอร์: มอง cyber resilience เป็นความรับผิดชอบร่วมของรัฐบาล ธุรกิจ และพันธมิตรเทคโนโลยีหลัก",
        "วัฒนธรรม: สนับสนุนนโยบายวัฒนธรรมระดับชาติและเงินทุนสำหรับ Australian content โดยไม่ให้ศิลปะกระจุกเฉพาะ Sydney และ Melbourne"
      ],
      si: [
        "Migration: student visa සහ review abuse තද කරන අතර skills, strategic partners සහ genuine education pathways තබා migration-system integrity ආරක්ෂා කළ යුතුය.",
        "Cyber security: government, business සහ major technology partners එකට වගකියන national resilience issue එකක් ලෙස දකී.",
        "Culture: national cultural policy සහ Australian content funding වලට සහය දක්වමින් arts/culture Sydney සහ Melbourne වලට පමණක් සීමා නොවිය යුතු බව කියයි."
      ]
    }
  },
  {
    name: "Kevin Rudd",
    aliases: ["Kevin Rudd", "Kevin Michael Rudd", "The Hon Dr Kevin Rudd", "陆克文", "陸克文", "ケビン・ラッド", "케빈 러드"],
    type: "politician",
    profile: { label: "Asia Society profile", url: "https://asiasociety.org/policy-institute/honorable-dr-kevin-rudd-ac" },
    officialProfile: { label: "Personal website", url: "https://kevinrudd.com/about" },
    social: { label: "X", url: "https://x.com/MrKRudd" },
    personalSocial: { label: "Facebook", url: "https://www.facebook.com/MrKRudd/" },
    background: {
      "zh-Hans": "澳大利亚前总理、前外交部长和前驻美大使，长期研究中国、美国和印太战略，现任 Asia Society 全球总裁兼 CEO。",
      "zh-Hant": "澳洲前總理、前外交部長和前駐美大使，長期研究中國、美國和印太戰略，現任 Asia Society 全球總裁兼 CEO。",
      en: "Former Australian prime minister, foreign minister and ambassador to the United States, now Global President and CEO of Asia Society, with a long focus on China, the United States and Indo-Pacific strategy.",
      es: "Ex primer ministro, exministro de Exteriores y exembajador australiano en Estados Unidos; hoy es presidente global y CEO de Asia Society, con largo trabajo sobre China, EE.UU. y el Indo-Pacífico.",
      ja: "オーストラリアの元首相、元外相、元駐米大使。現在は Asia Society の Global President and CEO で、中国、米国、インド太平洋戦略を長く扱ってきました。",
      ko: "호주 전 총리, 전 외교장관, 전 주미대사이며 현재 Asia Society의 Global President and CEO입니다. 중국, 미국, 인도태평양 전략을 오래 다뤄 왔습니다.",
      vi: "Cựu thủ tướng, cựu ngoại trưởng và cựu đại sứ Australia tại Hoa Kỳ; hiện là Global President and CEO của Asia Society, với trọng tâm lâu dài về Trung Quốc, Mỹ và chiến lược Indo-Pacific.",
      th: "อดีตนายกรัฐมนตรี อดีตรัฐมนตรีต่างประเทศ และอดีตเอกอัครราชทูตออสเตรเลียประจำสหรัฐฯ ปัจจุบันเป็น Global President and CEO ของ Asia Society และทำงานด้านจีน สหรัฐฯ และยุทธศาสตร์ Indo-Pacific มายาวนาน",
      si: "හිටපු Australian prime minister, foreign minister සහ United States ambassador කෙනෙකි; දැන් Asia Society Global President and CEO වන අතර China, United States සහ Indo-Pacific strategy පිළිබඳ දිගුකාලීන අවධානයක් ඇත."
    },
    positions: {
      "zh-Hans": "其公开观点多围绕中美竞争、台湾风险、AUKUS、威慑、外交接触和澳洲在印太地区的战略选择。",
      "zh-Hant": "其公開觀點多圍繞中美競爭、台灣風險、AUKUS、威懾、外交接觸和澳洲在印太地區的戰略選擇。",
      en: "His public positions centre on US-China competition, Taiwan risk, AUKUS, deterrence, diplomatic engagement and Australia's strategic choices in the Indo-Pacific.",
      es: "Sus posiciones públicas se centran en la competencia EE.UU.-China, el riesgo en Taiwán, AUKUS, disuasión, diplomacia y las opciones estratégicas de Australia en el Indo-Pacífico.",
      ja: "米中競争、台湾リスク、AUKUS、抑止、外交的関与、インド太平洋におけるオーストラリアの戦略選択を主に論じています。",
      ko: "공개 입장은 미중 경쟁, 대만 리스크, AUKUS, 억지, 외교적 관여, 인도태평양에서 호주의 전략 선택에 초점을 둡니다.",
      vi: "Các lập trường công khai tập trung vào cạnh tranh Mỹ-Trung, rủi ro Đài Loan, AUKUS, răn đe, ngoại giao và lựa chọn chiến lược của Australia ở Indo-Pacific.",
      th: "จุดยืนสาธารณะของเขาเน้นการแข่งขันสหรัฐฯ-จีน ความเสี่ยงไต้หวัน AUKUS การป้องปราม การทูต และทางเลือกเชิงยุทธศาสตร์ของออสเตรเลียใน Indo-Pacific",
      si: "ඔහුගේ public positions US-China competition, Taiwan risk, AUKUS, deterrence, diplomatic engagement සහ Indo-Pacific හි Australia strategic choices වටා කේන්ද්‍රගත වේ."
    }
  },
  {
    name: "Ali Brigginshaw",
    aliases: ["Ali Brigginshaw", "Ali Brigginshaw OAM", "Briggo", "阿莉·布里金肖", "アリ・ブリギンショー", "알리 브리긴쇼"],
    type: "athlete",
    profile: { label: "Broncos profile", url: "https://www.broncos.com.au/teams/womens-premiership/brisbane-broncos-women/ali-brigginshaw/" },
    social: { label: "Instagram", url: "https://www.instagram.com/ali_brigg/" },
    background: {
      "zh-Hans": "Brisbane Broncos NRLW 半卫和队长，也是 Queensland Maroons 与 Australian Jillaroos 代表队核心球员，曾获 Dally M 女子最佳球员。",
      "zh-Hant": "Brisbane Broncos NRLW 半衛和隊長，也是 Queensland Maroons 與 Australian Jillaroos 代表隊核心球員，曾獲 Dally M 女子最佳球員。",
      en: "Brisbane Broncos NRLW halfback and captain, Queensland Maroons and Australian Jillaroos representative, and a former Dally M women's player of the year.",
      es: "Halfback y capitana de Brisbane Broncos en la NRLW, representante de Queensland Maroons y Australian Jillaroos, y exjugadora femenina del año Dally M.",
      ja: "Brisbane Broncos NRLW のハーフバック兼主将。Queensland Maroons と Australian Jillaroos の代表選手で、Dally M 女子年間最優秀選手の受賞歴があります。",
      ko: "Brisbane Broncos NRLW 하프백이자 주장으로 Queensland Maroons와 Australian Jillaroos 대표이며 Dally M 여자 올해의 선수 수상자입니다.",
      vi: "Halfback kiêm đội trưởng Brisbane Broncos ở NRLW, tuyển thủ Queensland Maroons và Australian Jillaroos, từng là cầu thủ nữ Dally M của năm.",
      th: "ฮาล์ฟแบ็กและกัปตัน Brisbane Broncos ใน NRLW เป็นตัวแทน Queensland Maroons และ Australian Jillaroos และเคยได้รางวัล Dally M women's player of the year",
      si: "Brisbane Broncos NRLW halfback සහ captain කෙනෙකි; Queensland Maroons සහ Australian Jillaroos නියෝජිතයෙකු වන අතර හිටපු Dally M women's player of the year සම්මානලාභිනියකි."
    }
  },
  {
    name: "Tayla Preston",
    aliases: ["Tayla Preston", "Tay", "泰拉·普雷斯顿", "泰拉·普雷斯頓", "テイラ・プレストン", "테일라 프레스턴"],
    type: "athlete",
    profile: { label: "Bulldogs profile", url: "https://www.bulldogs.com.au/teams/womens-premiership/canterbury-bankstown-bulldogs-women/tayla-preston/" },
    social: { label: "Instagram", url: "https://www.instagram.com/taylaapreston/" },
    background: {
      "zh-Hans": "Canterbury-Bankstown Bulldogs NRLW 半卫和共同队长，曾效力 Parramatta Eels Women 与 Cronulla-Sutherland Sharks Women。",
      "zh-Hant": "Canterbury-Bankstown Bulldogs NRLW 半衛和共同隊長，曾效力 Parramatta Eels Women 與 Cronulla-Sutherland Sharks Women。",
      en: "Canterbury-Bankstown Bulldogs NRLW halfback and co-captain, after earlier NRLW stints with Parramatta Eels Women and Cronulla-Sutherland Sharks Women.",
      es: "Halfback y cocapitana de Canterbury-Bankstown Bulldogs en la NRLW, tras etapas previas con Parramatta Eels Women y Cronulla-Sutherland Sharks Women.",
      ja: "Canterbury-Bankstown Bulldogs NRLW のハーフバック兼共同主将。以前は Parramatta Eels Women と Cronulla-Sutherland Sharks Women でプレーしました。",
      ko: "Canterbury-Bankstown Bulldogs NRLW 하프백이자 공동 주장으로, 이전에는 Parramatta Eels Women과 Cronulla-Sutherland Sharks Women에서 뛰었습니다.",
      vi: "Halfback và đồng đội trưởng Canterbury-Bankstown Bulldogs ở NRLW, sau các giai đoạn tại Parramatta Eels Women và Cronulla-Sutherland Sharks Women.",
      th: "ฮาล์ฟแบ็กและกัปตันร่วมของ Canterbury-Bankstown Bulldogs ใน NRLW หลังเคยเล่นกับ Parramatta Eels Women และ Cronulla-Sutherland Sharks Women",
      si: "Canterbury-Bankstown Bulldogs NRLW halfback සහ co-captain කෙනෙකි; පෙර Parramatta Eels Women සහ Cronulla-Sutherland Sharks Women සමඟ ක්‍රීඩා කර ඇත."
    }
  },
  {
    name: "Kath Pettingill",
    aliases: ["Kath Pettingill", "Kathleen Pettingill", "Kathy Pettingill", "Granny Evil", "凯思·佩廷吉尔", "キャス・ペティンギル", "캐스 페팅길"],
    type: "public-figure",
    profile: { label: "Wikipedia profile", url: "https://en.wikipedia.org/wiki/Kath_Pettingill" },
    background: {
      "zh-Hans": "墨尔本 Pettingill 犯罪家族的知名女族长，长期与维州上世纪七八十年代的毒品、暴力犯罪和 Walsh Street 警察枪杀案公共记忆相连。",
      "zh-Hant": "墨爾本 Pettingill 犯罪家族的知名女族長，長期與維州上世紀七八十年代的毒品、暴力犯罪和 Walsh Street 警察槍殺案公共記憶相連。",
      en: "Publicly known matriarch of Melbourne's Pettingill crime family, long associated with Victoria's public memory of 1970s-80s drug crime, violence and the Walsh Street police shootings.",
      es: "Conocida matriarca pública de la familia criminal Pettingill de Melbourne, asociada durante décadas con la memoria pública victoriana sobre drogas, violencia y los asesinatos policiales de Walsh Street.",
      ja: "メルボルンの Pettingill 犯罪一家の著名な家長。1970-80年代のビクトリア州の薬物犯罪、暴力、Walsh Street 警官殺害事件の記憶と結び付けられてきました。",
      ko: "멜버른 Pettingill 범죄 가족의 공개적으로 알려진 가장으로, 1970-80년대 빅토리아의 마약 범죄, 폭력, Walsh Street 경찰 총격 사건의 공적 기억과 오래 연결돼 있습니다.",
      vi: "Nhân vật được biết đến công khai như matriarch của gia đình tội phạm Pettingill ở Melbourne, gắn với ký ức công chúng Victoria về tội phạm ma túy, bạo lực và vụ bắn cảnh sát Walsh Street thập niên 1970-80.",
      th: "บุคคลสาธารณะที่เป็น matriarch ของตระกูลอาชญากรรม Pettingill ในเมลเบิร์น ซึ่งเกี่ยวโยงกับความทรงจำสาธารณะของ Victoria เรื่องอาชญากรรมยาเสพติด ความรุนแรง และคดียิงตำรวจ Walsh Street ในทศวรรษ 1970-80",
      si: "Melbourne හි Pettingill crime family හි ප්‍රසිද්ධ matriarch කෙනෙකි; 1970-80 දශකයේ Victoria drug crime, violence සහ Walsh Street police shootings පිළිබඳ public memory සමඟ දිගුකාලීනව සම්බන්ධ වී ඇත."
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
    name: "Bob Montgomery",
    aliases: ["Bob Montgomery", "Robert Montgomery", "鲍勃·蒙哥马利", "鮑勃·蒙哥馬利", "ボブ・モンゴメリー", "밥 몽고메리"],
    type: "public-figure",
    personalSocial: { label: "Campaign site", url: "https://bobmontgomery.com.au/" },
    profile: { label: "MND Blue fundraiser", url: "https://www.mndblue.org.au/fundraisers/robertmontgomery/miles-for-mnd--one-last-ride" },
    background: {
      "zh-Hans": "澳大利亚公益骑行者和 MND 倡议者，82 岁时与孙子 Tom Malcolm 完成 Broome 到 Bowral 的跨澳骑行，为运动神经元病筹款和提高关注。",
      "zh-Hant": "澳洲公益騎行者和 MND 倡議者，82 歲時與孫子 Tom Malcolm 完成 Broome 到 Bowral 的跨澳騎行，為運動神經元病籌款並提高關注。",
      en: "Australian charity cyclist and MND advocate who, aged 82, completed a Broome-to-Bowral cross-country ride with his grandson Tom Malcolm to raise funds and awareness for motor neurone disease.",
      es: "Ciclista benéfico australiano y defensor de la causa MND que, a los 82 años, completó una travesía de Broome a Bowral con su nieto Tom Malcolm para recaudar fondos y conciencia sobre la enfermedad de neurona motora.",
      ja: "82歳で孫の Tom Malcolm とともに Broome から Bowral まで豪州横断のチャリティーライドを完走し、MND の支援と啓発に取り組んだ豪州のチャリティーサイクリスト。",
      ko: "82세에 손자 Tom Malcolm과 Broome에서 Bowral까지 호주 횡단 자선 라이드를 완주하며 MND 기금과 인식 제고에 나선 호주의 자선 사이클리스트입니다.",
      vi: "Người đạp xe gây quỹ và vận động cho MND tại Australia; ở tuổi 82, ông cùng cháu Tom Malcolm hoàn thành hành trình xuyên Australia từ Broome đến Bowral để gây quỹ và nâng cao nhận thức về bệnh motor neurone disease.",
      th: "นักปั่นจักรยานการกุศลและผู้รณรงค์เรื่อง MND ของออสเตรเลีย ซึ่งในวัย 82 ปีได้ปั่นข้ามประเทศจาก Broome ถึง Bowral กับหลาน Tom Malcolm เพื่อระดมทุนและสร้างความตระหนักเรื่อง motor neurone disease",
      si: "Australian charity cyclist සහ MND advocate කෙනෙකි; වයස 82 දී ඔහුගේ මුණුපුරා Tom Malcolm සමඟ Broome සිට Bowral දක්වා cross-country ride එකක් සම්පූර්ණ කර motor neurone disease සඳහා මුදල් සහ අවධානය එකතු කළේය."
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
    name: "Jonathan Greenblatt",
    aliases: ["Jonathan Greenblatt", "Jonathan A. Greenblatt", "JGreenblattADL", "乔纳森·格林布拉特", "喬納森·格林布拉特", "ジョナサン・グリーンブラット", "조너선 그린블랫"],
    type: "executive",
    social: { label: "X", url: "https://x.com/JGreenblattADL" },
    officialProfile: { label: "ADL biography", url: "https://www.adl.org/who-we-are/leadership/staff/jonathan-greenblatt" },
    background: {
      "zh-Hans": "Anti-Defamation League 的首席执行官兼全国主任，曾在 Obama 政府任 White House Office of Social Innovation and Civic Participation 主任，也曾参与社会企业和媒体项目。",
      "zh-Hant": "Anti-Defamation League 的行政總裁兼全國主任，曾在 Obama 政府任 White House Office of Social Innovation and Civic Participation 主任，也曾參與社會企業和媒體項目。",
      en: "CEO and national director of the Anti-Defamation League, previously director of the White House Office of Social Innovation and Civic Participation in the Obama administration and involved in social-enterprise and media ventures.",
      es: "CEO y director nacional de la Anti-Defamation League; antes dirigió la White House Office of Social Innovation and Civic Participation en la administración Obama y participó en proyectos de empresa social y medios.",
      ja: "Anti-Defamation League の CEO 兼 national director。Obama 政権で White House Office of Social Innovation and Civic Participation の director を務め、社会的企業やメディア事業にも関わりました。",
      ko: "Anti-Defamation League의 CEO 겸 national director입니다. Obama 행정부에서 White House Office of Social Innovation and Civic Participation 국장을 지냈고 사회적 기업과 미디어 사업에도 관여했습니다.",
      vi: "CEO và national director của Anti-Defamation League; trước đó là giám đốc White House Office of Social Innovation and Civic Participation trong chính quyền Obama và tham gia các dự án doanh nghiệp xã hội, truyền thông.",
      th: "CEO และ national director ของ Anti-Defamation League ก่อนหน้านี้เป็นผู้อำนวยการ White House Office of Social Innovation and Civic Participation ในรัฐบาล Obama และเคยทำงานด้าน social enterprise และสื่อ",
      si: "Anti-Defamation League හි CEO සහ national director වේ. Obama administration සමයේ White House Office of Social Innovation and Civic Participation director ලෙස කටයුතු කළ අතර social-enterprise සහ media ventures වලද නිරත විය."
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
  },
  {
    name: "Michael Daley",
    aliases: ["Michael Daley", "Michael John Daley", "Michael Daley MP", "迈克尔·戴利", "麥可·戴利", "マイケル・デイリー", "마이클 데일리"],
    type: "politician",
    social: { label: "X", url: "https://x.com/michaeldaleyMP" },
    profile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers/members-details?memberId=27" },
    background: {
      "zh-Hans": "新南威尔士州 Labor 政治人物，Maroubra 州议员，2023 年起任 NSW Attorney General，曾短暂担任 NSW Labor 领袖和反对党领袖。",
      "zh-Hant": "新南威爾士州 Labor 政治人物，Maroubra 州議員，2023 年起任 NSW Attorney General，曾短暫擔任 NSW Labor 領袖和反對黨領袖。",
      en: "NSW Labor politician, Member for Maroubra and NSW Attorney General since 2023; he previously served briefly as NSW Labor leader and opposition leader.",
      es: "Político laborista de NSW, diputado por Maroubra y fiscal general estatal desde 2023; antes fue brevemente líder de NSW Labor y de la oposición.",
      ja: "NSW Labor の政治家。Maroubra 選出州議員で、2023年から NSW Attorney General。以前は NSW Labor 党首・野党党首を短期間務めました。",
      ko: "NSW Labor 정치인으로 Maroubra 지역구 의원이며 2023년부터 NSW Attorney General입니다. 과거 NSW Labor 대표와 야당 대표를 잠시 지냈습니다.",
      vi: "Chính trị gia NSW Labor, nghị sĩ Maroubra và NSW Attorney General từ năm 2023; từng có thời gian ngắn lãnh đạo NSW Labor và phe đối lập.",
      th: "นักการเมือง NSW Labor สมาชิกเขต Maroubra และ NSW Attorney General ตั้งแต่ปี 2023 เคยเป็นผู้นำ NSW Labor และฝ่ายค้านช่วงสั้น ๆ",
      si: "NSW Labor politician කෙනෙකි; Maroubra MP සහ 2023 සිට NSW Attorney General වේ. පෙර NSW Labor leader සහ opposition leader ලෙස කෙටි කාලයක් කටයුතු කළේය."
    },
    positions: {
      "zh-Hans": "公开职务重点包括司法、反歧视法律、公共安全、博彩与 Racing 政策，以及 Maroubra 地区代表工作。",
      "zh-Hant": "公開職務重點包括司法、反歧視法律、公共安全、博彩與 Racing 政策，以及 Maroubra 地區代表工作。",
      en: "His public roles focus on justice, anti-discrimination law, public safety, gaming and racing policy, and representation of Maroubra.",
      es: "Sus funciones públicas se centran en justicia, ley antidiscriminación, seguridad pública, juego y carreras, y representación de Maroubra.",
      ja: "司法、反差別法、公共安全、賭博・競馬政策、Maroubra の地域代表を主な公的職務としています。",
      ko: "사법, 차별금지법, 공공안전, 게임 및 경마 정책, Maroubra 지역 대표 활동이 주요 공적 역할입니다.",
      vi: "Các vai trò công tập trung vào tư pháp, luật chống phân biệt đối xử, an toàn công cộng, chính sách gaming và racing, cùng đại diện Maroubra.",
      th: "บทบาทสาธารณะเน้นกระบวนการยุติธรรม กฎหมายต่อต้านการเลือกปฏิบัติ ความปลอดภัยสาธารณะ นโยบาย gaming/racing และการแทนเขต Maroubra",
      si: "Justice, anti-discrimination law, public safety, gaming/racing policy සහ Maroubra representation ඔහුගේ public roles වේ."
    }
  },
  {
    name: "John Sackar",
    aliases: ["John Sackar", "John Robertson Sackar", "John Sackar AM KC", "Justice John Sackar", "约翰·萨卡", "約翰·薩卡", "ジョン・サッカー", "존 사카"],
    type: "public-figure",
    profile: { label: "NSW Government review profile", url: "https://dcj.nsw.gov.au/legal-and-justice/laws-and-legislation/review-of-criminal-law-protections-against-incitement-of-hate.html" },
    officialProfile: { label: "Middle Temple profile", url: "https://www.middletemple.org.uk/bencher-persons-view/40144" },
    background: {
      "zh-Hans": "澳洲退休法官和高级律师，2011 至 2024 年任 NSW Supreme Court 法官，曾主持 NSW LGBTIQ 仇恨犯罪特别调查，并审查 NSW 仇恨煽动刑法保护。",
      "zh-Hant": "澳洲退休法官和資深大律師，2011 至 2024 年任 NSW Supreme Court 法官，曾主持 NSW LGBTIQ 仇恨犯罪特別調查，並審查 NSW 仇恨煽動刑法保護。",
      en: "Australian retired judge and senior counsel who served on the NSW Supreme Court from 2011 to 2024, led the NSW LGBTIQ hate-crimes inquiry and reviewed criminal-law protections against hate incitement.",
      es: "Juez retirado y abogado senior australiano; integró la Supreme Court de NSW entre 2011 y 2024, dirigió la investigación sobre crímenes de odio LGBTIQ y revisó las protecciones penales contra la incitación al odio.",
      ja: "豪州の退官判事・上級弁護士。2011年から2024年まで NSW Supreme Court 判事を務め、NSW の LGBTIQ ヘイト犯罪調査とヘイト扇動刑法保護の見直しを率いました。",
      ko: "호주 은퇴 판사이자 선임 변호사로 2011년부터 2024년까지 NSW Supreme Court 판사를 지냈고 NSW LGBTIQ 혐오범죄 조사와 혐오 선동 형사법 보호 검토를 이끌었습니다.",
      vi: "Cựu thẩm phán và luật sư cấp cao Úc, làm việc tại NSW Supreme Court từ 2011 đến 2024, dẫn dắt điều tra tội ác thù ghét LGBTIQ và rà soát bảo vệ hình sự chống kích động thù ghét.",
      th: "อดีตผู้พิพากษาและ senior counsel ของออสเตรเลีย ดำรงตำแหน่งใน NSW Supreme Court ปี 2011-2024 เคยนำการไต่สวน LGBTIQ hate crimes และทบทวนกฎหมายอาญาเรื่องการยุยงความเกลียดชัง",
      si: "Australian retired judge සහ senior counsel කෙනෙකි; 2011-2024 NSW Supreme Court හි සේවය කර NSW LGBTIQ hate-crimes inquiry සහ hate incitement criminal-law protections review නායකත්වය දුන්නේය."
    }
  },
  {
    name: "Damien Tudehope",
    aliases: ["Damien Tudehope", "Damien Francis Tudehope", "Damien Tudehope MLC", "达米恩·图德霍普", "達米恩·圖德霍普", "ダミアン・チュードホープ", "데이미언 튜드호프"],
    type: "politician",
    social: { label: "X", url: "https://x.com/DamienTudehope" },
    profile: { label: "Parliament profile", url: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers/members-details?memberId=115" },
    background: {
      "zh-Hans": "新南威尔士州 Liberal 政治人物，NSW Legislative Council 议员，曾任财政和雇员关系部长，并担任过上议院政府领袖和反对党上议院领袖。",
      "zh-Hant": "新南威爾士州 Liberal 政治人物，NSW Legislative Council 議員，曾任財政和僱員關係部長，並擔任過上議院政府領袖和反對黨上議院領袖。",
      en: "NSW Liberal politician and Legislative Council member, former finance and employee relations minister, and former government and opposition leader in the upper house.",
      es: "Político liberal de NSW y miembro del Legislative Council, exministro de finanzas y relaciones laborales, y exlíder de gobierno y oposición en la cámara alta.",
      ja: "NSW Liberal の政治家で Legislative Council 議員。財務・雇用関係相を務め、上院の政府側・野党側リーダーも経験しました。",
      ko: "NSW Liberal 정치인이자 Legislative Council 의원으로, 재무 및 고용관계 장관과 상원 정부·야당 대표를 지냈습니다.",
      vi: "Chính trị gia NSW Liberal và nghị sĩ Legislative Council, cựu bộ trưởng tài chính và quan hệ lao động, từng lãnh đạo chính phủ và phe đối lập ở thượng viện bang.",
      th: "นักการเมือง NSW Liberal และสมาชิก Legislative Council อดีตรัฐมนตรี finance และ employee relations และอดีตผู้นำฝ่ายรัฐบาลและฝ่ายค้านในสภาสูง",
      si: "NSW Liberal politician සහ Legislative Council member කෙනෙකි; former finance/employee relations minister සහ upper house government/opposition leader ලෙස කටයුතු කර ඇත."
    },
    positions: {
      "zh-Hans": "公开工作重点包括财政、产业关系、议会监督、反腐制度和 NSW Liberal 议会战略。",
      "zh-Hant": "公開工作重點包括財政、產業關係、議會監督、反腐制度和 NSW Liberal 議會戰略。",
      en: "His public work has centred on finance, industrial relations, parliamentary scrutiny, integrity systems and NSW Liberal parliamentary strategy.",
      es: "Su trabajo público se ha centrado en finanzas, relaciones industriales, control parlamentario, sistemas de integridad y estrategia parlamentaria liberal en NSW.",
      ja: "財政、労使関係、議会監視、政治倫理制度、NSW Liberal の議会戦略を重視してきました。",
      ko: "재정, 노사관계, 의회 감시, 청렴 제도, NSW Liberal 의회 전략이 주요 공적 활동입니다.",
      vi: "Công việc công tập trung vào tài chính, quan hệ công nghiệp, giám sát nghị viện, hệ thống liêm chính và chiến lược nghị viện NSW Liberal.",
      th: "งานสาธารณะเน้นการคลัง ความสัมพันธ์อุตสาหกรรม การตรวจสอบรัฐสภา ระบบความซื่อสัตย์ และยุทธศาสตร์รัฐสภาของ NSW Liberal",
      si: "Finance, industrial relations, parliamentary scrutiny, integrity systems සහ NSW Liberal parliamentary strategy ඔහුගේ public work වේ."
    }
  },
  {
    name: "Tony Abbott",
    aliases: ["Tony Abbott", "Anthony John Abbott", "Tony Abbott AC", "托尼·阿博特", "東尼·艾伯特", "トニー・アボット", "토니 애벗"],
    type: "politician",
    social: { label: "X", url: "https://x.com/HonTonyAbbott" },
    profile: { label: "Official website", url: "https://tonyabbott.com.au/" },
    background: {
      "zh-Hans": "澳大利亚 Liberal 政治人物，第 28 任澳大利亚总理，曾任 Warringah 联邦议员、反对党领袖和多项联邦部长职务。",
      "zh-Hant": "澳洲 Liberal 政治人物，第 28 任澳洲總理，曾任 Warringah 聯邦議員、反對黨領袖和多項聯邦部長職務。",
      en: "Australian Liberal politician, 28th prime minister of Australia, former federal member for Warringah, opposition leader and federal minister.",
      es: "Político liberal australiano, 28.º primer ministro de Australia, exdiputado federal por Warringah, líder de la oposición y ministro federal.",
      ja: "豪州 Liberal の政治家。第28代豪州首相で、Warringah 選出連邦議員、野党党首、連邦閣僚を歴任しました。",
      ko: "호주 Liberal 정치인으로 제28대 호주 총리, 전 Warringah 연방 의원, 야당 대표 및 연방 장관을 지냈습니다.",
      vi: "Chính trị gia Liberal Úc, thủ tướng thứ 28 của Australia, cựu nghị sĩ liên bang Warringah, lãnh đạo đối lập và bộ trưởng liên bang.",
      th: "นักการเมือง Liberal ของออสเตรเลีย นายกรัฐมนตรีคนที่ 28 อดีต ส.ส. รัฐบาลกลางเขต Warringah ผู้นำฝ่ายค้าน และรัฐมนตรีรัฐบาลกลาง",
      si: "Australian Liberal politician කෙනෙකි; Australia හි 28 වැනි prime minister, former federal member for Warringah, opposition leader සහ federal minister විය."
    },
    positions: {
      "zh-Hans": "公开立场长期集中在保守派经济和社会政策、边境控制、国防、君主立宪和 Liberal-National Coalition 方向。",
      "zh-Hant": "公開立場長期集中在保守派經濟和社會政策、邊境控制、國防、君主立憲和 Liberal-National Coalition 方向。",
      en: "His public positions have centred on conservative economic and social policy, border control, defence, constitutional monarchy and Liberal-National Coalition politics.",
      es: "Sus posiciones públicas se centran en política económica y social conservadora, control fronterizo, defensa, monarquía constitucional y la Coalición Liberal-Nacional.",
      ja: "保守的な経済・社会政策、国境管理、防衛、立憲君主制、Liberal-National Coalition 政治を重視してきました。",
      ko: "보수적 경제·사회 정책, 국경 통제, 국방, 입헌군주제, Liberal-National Coalition 정치가 주요 입장입니다.",
      vi: "Lập trường công khai tập trung vào chính sách kinh tế-xã hội bảo thủ, kiểm soát biên giới, quốc phòng, quân chủ lập hiến và chính trị Liberal-National Coalition.",
      th: "จุดยืนสาธารณะเน้นนโยบายเศรษฐกิจและสังคมอนุรักษนิยม การควบคุมพรมแดน กลาโหม ราชาธิปไตยภายใต้รัฐธรรมนูญ และการเมือง Liberal-National Coalition",
      si: "Conservative economic/social policy, border control, defence, constitutional monarchy සහ Liberal-National Coalition politics ඔහුගේ public positions වේ."
    }
  },
  {
    name: "Barnaby Joyce",
    aliases: ["Barnaby Joyce", "Barnaby Thomas Gerard Joyce", "Barnaby Joyce MP", "巴纳比·乔伊斯", "巴納比·喬伊斯", "バーナビー・ジョイス", "바너비 조이스"],
    type: "politician",
    social: { label: "Facebook", url: "https://www.facebook.com/BarnabyJoyceMP/" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/barnaby.joyce/" },
    profile: { label: "Parliament profile", url: "https://www.aph.gov.au/b_joyce_mp" },
    officialProfile: { label: "Official website", url: "https://barnabyjoyce.com.au/about-barnaby" },
    background: {
      "zh-Hans": "澳大利亚保守派政治人物，New England 联邦议员，曾三度任 Deputy Prime Minister，并曾任 National Party 领袖；后来转向 One Nation。",
      "zh-Hant": "澳洲保守派政治人物，New England 聯邦議員，曾三度任 Deputy Prime Minister，並曾任 National Party 領袖；後來轉向 One Nation。",
      en: "Australian conservative politician, federal member for New England, three-time deputy prime minister and former National Party leader who later moved to One Nation.",
      es: "Político conservador australiano, diputado federal por New England, tres veces vice primer ministro y exlíder del National Party que después pasó a One Nation.",
      ja: "豪州の保守政治家。New England 選出連邦議員で、Deputy Prime Minister を3度務め、National Party 党首を経て One Nation に移りました。",
      ko: "호주 보수 정치인으로 New England 연방 의원이며 세 차례 Deputy Prime Minister와 National Party 대표를 지낸 뒤 One Nation으로 옮겼습니다.",
      vi: "Chính trị gia bảo thủ Úc, nghị sĩ liên bang New England, ba lần làm deputy prime minister và cựu lãnh đạo National Party, sau đó chuyển sang One Nation.",
      th: "นักการเมืองอนุรักษนิยมของออสเตรเลีย ส.ส. รัฐบาลกลางเขต New England เคยเป็น deputy prime minister สามครั้งและอดีตผู้นำ National Party ก่อนย้ายไป One Nation",
      si: "Australian conservative politician කෙනෙකි; New England federal member, තුන් වරක් deputy prime minister සහ හිටපු National Party leader වූ ඔහු පසුව One Nation වෙත ගියේය."
    },
    positions: {
      "zh-Hans": "公开立场集中在区域农业、资源开发、移民限制、社会保守主义、经济民族主义和新英格兰地方利益。",
      "zh-Hant": "公開立場集中在區域農業、資源開發、移民限制、社會保守主義、經濟民族主義和新英格蘭地方利益。",
      en: "His public positions centre on regional agriculture, resources development, migration restrictions, social conservatism, economic nationalism and New England local interests.",
      es: "Sus posiciones públicas se centran en agricultura regional, recursos, restricciones migratorias, conservadurismo social, nacionalismo económico e intereses locales de New England.",
      ja: "地方農業、資源開発、移民制限、社会保守主義、経済ナショナリズム、New England の地域利益を重視しています。",
      ko: "지역 농업, 자원 개발, 이민 제한, 사회 보수주의, 경제 민족주의, New England 지역 이익이 주요 입장입니다.",
      vi: "Lập trường công khai tập trung vào nông nghiệp vùng, phát triển tài nguyên, hạn chế di cư, bảo thủ xã hội, chủ nghĩa dân tộc kinh tế và lợi ích địa phương New England.",
      th: "จุดยืนสาธารณะเน้นเกษตรภูมิภาค การพัฒนาทรัพยากร ข้อจำกัดการย้ายถิ่น อนุรักษนิยมทางสังคม ชาตินิยมเศรษฐกิจ และผลประโยชน์ท้องถิ่น New England",
      si: "Regional agriculture, resources development, migration restrictions, social conservatism, economic nationalism සහ New England local interests ඔහුගේ public positions වේ."
    }
  },
  {
    name: "Jacinta Allan",
    aliases: ["Jacinta Allan", "Jacinta Marie Allan", "Jacinta Allan MP", "杰辛塔·艾伦", "傑辛塔·艾倫", "ジャシンタ・アラン", "재신타 앨런"],
    type: "politician",
    social: { label: "X", url: "https://x.com/JacintaAllanMP" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/jacintaallanmp/" },
    profile: { label: "Official website", url: "https://www.jacintaallan.com/" },
    background: {
      "zh-Hans": "维州 Labor 政治人物，Bendigo East 州议员，2023 至 2026 年任 Victoria Premier，之前长期负责交通基础设施和州重大项目。",
      "zh-Hant": "維州 Labor 政治人物，Bendigo East 州議員，2023 至 2026 年任 Victoria Premier，之前長期負責交通基礎設施和州重大項目。",
      en: "Victorian Labor politician, Member for Bendigo East and premier of Victoria from 2023 to 2026, after long-running transport infrastructure and major-projects roles.",
      es: "Política laborista de Victoria, diputada por Bendigo East y premier de Victoria de 2023 a 2026, tras años en infraestructura de transporte y grandes proyectos.",
      ja: "Victoria Labor の政治家。Bendigo East 選出州議員で、2023年から2026年まで Victoria Premier。長く交通インフラと大型事業を担当しました。",
      ko: "Victoria Labor 정치인으로 Bendigo East 지역구 의원이며 2023년부터 2026년까지 Victoria Premier였습니다. 장기간 교통 인프라와 대형 프로젝트를 맡았습니다.",
      vi: "Chính trị gia Victoria Labor, nghị sĩ Bendigo East và premier Victoria từ 2023 đến 2026, sau thời gian dài phụ trách hạ tầng giao thông và dự án lớn.",
      th: "นักการเมือง Victoria Labor สมาชิกเขต Bendigo East และ Premier of Victoria ปี 2023-2026 หลังทำงานด้าน transport infrastructure และ major projects มายาวนาน",
      si: "Victorian Labor politician කෙනෙකි; Bendigo East MP සහ 2023-2026 Victoria Premier විය. දිගු කාලයක් transport infrastructure/major projects roles දැරීය."
    },
    positions: {
      "zh-Hans": "公开工作重点包括交通基础设施、郊区铁路、区域维州、家庭暴力改革、条约进程和工党州政府延续性。",
      "zh-Hant": "公開工作重點包括交通基礎設施、郊區鐵路、區域維州、家庭暴力改革、條約進程和工黨州政府延續性。",
      en: "Her public priorities have included transport infrastructure, the Suburban Rail Loop, regional Victoria, family-violence reform, treaty processes and Labor government continuity.",
      es: "Sus prioridades públicas incluyen infraestructura de transporte, Suburban Rail Loop, Victoria regional, reforma contra violencia familiar, tratado y continuidad laborista.",
      ja: "交通インフラ、Suburban Rail Loop、地方 Victoria、家庭内暴力改革、条約プロセス、労働党政権の継続を重視してきました。",
      ko: "교통 인프라, Suburban Rail Loop, 지역 Victoria, 가정폭력 개혁, 조약 절차, Labor 정부 연속성이 주요 우선순위였습니다.",
      vi: "Các ưu tiên gồm hạ tầng giao thông, Suburban Rail Loop, vùng Victoria, cải cách bạo lực gia đình, tiến trình treaty và tính liên tục của chính phủ Labor.",
      th: "ประเด็นสำคัญคือโครงสร้างพื้นฐานคมนาคม Suburban Rail Loop ภูมิภาค Victoria การปฏิรูป family violence กระบวนการ treaty และความต่อเนื่องของรัฐบาล Labor",
      si: "Transport infrastructure, Suburban Rail Loop, regional Victoria, family-violence reform, treaty processes සහ Labor government continuity ඇයගේ priorities වේ."
    }
  },
  {
    name: "Gabrielle Williams",
    aliases: ["Gabrielle Williams", "Gabrielle Leigh Williams", "Gabrielle Williams MP", "Gabby Williams", "加布里埃尔·威廉姆斯", "加布里埃爾·威廉斯", "ガブリエル・ウィリアムズ", "개브리엘 윌리엄스"],
    type: "politician",
    social: { label: "X", url: "https://x.com/gabwilliamsmp" },
    personalSocial: { label: "Instagram", url: "https://www.instagram.com/gabbywilliamsmp/" },
    profile: { label: "Parliament profile", url: "https://www.parliament.vic.gov.au/members/gabrielle-williams/" },
    officialProfile: { label: "Ministerial profile", url: "https://www.premier.vic.gov.au/gabrielle-williams" },
    background: {
      "zh-Hans": "维州 Labor 政治人物，Dandenong 州议员，曾任交通、公共交通、妇女、心理健康和第一民族等部长，并在 2026 年领导层更替中出任副州长。",
      "zh-Hant": "維州 Labor 政治人物，Dandenong 州議員，曾任交通、公共交通、婦女、心理健康和第一民族等部長，並在 2026 年領導層更替中出任副州長。",
      en: "Victorian Labor politician and Member for Dandenong, with portfolios across transport, public transport, women, mental health and First Peoples, and deputy premier in the 2026 leadership transition.",
      es: "Política laborista de Victoria y diputada por Dandenong, con carteras de transporte, transporte público, mujeres, salud mental y First Peoples; vicepremier en la transición de liderazgo de 2026.",
      ja: "Victoria Labor の政治家で Dandenong 選出州議員。交通、公共交通、女性、メンタルヘルス、First Peoples などを担当し、2026年の指導部交代で副州首相となりました。",
      ko: "Victoria Labor 정치인이자 Dandenong 지역구 의원으로 교통, 대중교통, 여성, 정신건강, First Peoples 포트폴리오를 맡았고 2026년 지도부 전환에서 부총리가 됐습니다.",
      vi: "Chính trị gia Victoria Labor và nghị sĩ Dandenong, từng phụ trách giao thông, vận tải công cộng, phụ nữ, sức khỏe tâm thần và First Peoples; làm phó premier trong chuyển giao lãnh đạo năm 2026.",
      th: "นักการเมือง Victoria Labor สมาชิกเขต Dandenong เคยดูแล transport, public transport, women, mental health และ First Peoples และเป็น deputy premier ในการเปลี่ยนผู้นำปี 2026",
      si: "Victorian Labor politician සහ Dandenong MP; transport, public transport, women, mental health සහ First Peoples portfolios දරා ඇති අතර 2026 leadership transition එකේ deputy premier විය."
    },
    positions: {
      "zh-Hans": "公开工作重点包括交通交付、公共交通、妇女和性别平等、心理健康、第一民族政策和东南墨尔本社区代表。",
      "zh-Hant": "公開工作重點包括交通交付、公共交通、婦女和性別平等、心理健康、第一民族政策和東南墨爾本社區代表。",
      en: "Her public priorities include transport delivery, public transport, women and gender equality, mental health, First Peoples policy and south-east Melbourne representation.",
      es: "Sus prioridades incluyen ejecución de transporte, transporte público, mujeres e igualdad de género, salud mental, política de First Peoples y representación del sureste de Melbourne.",
      ja: "交通事業の実施、公共交通、女性とジェンダー平等、メンタルヘルス、First Peoples 政策、メルボルン南東部の地域代表を重視しています。",
      ko: "교통 사업 집행, 대중교통, 여성 및 성평등, 정신건강, First Peoples 정책, 멜버른 남동부 대표 활동이 주요 우선순위입니다.",
      vi: "Các ưu tiên gồm triển khai giao thông, vận tải công cộng, phụ nữ và bình đẳng giới, sức khỏe tâm thần, chính sách First Peoples và đại diện đông nam Melbourne.",
      th: "ประเด็นสำคัญคือการส่งมอบโครงการคมนาคม ขนส่งสาธารณะ ผู้หญิงและความเท่าเทียมทางเพศ สุขภาพจิต นโยบาย First Peoples และการแทนชุมชน southeast Melbourne",
      si: "Transport delivery, public transport, women/gender equality, mental health, First Peoples policy සහ south-east Melbourne representation ඇයගේ priorities වේ."
    }
  },
  {
    name: "Misha Schubert",
    aliases: ["Misha Schubert", "Misha Schubert AM", "米莎·舒伯特", "米莎·舒伯特", "ミーシャ・シューベルト", "미샤 슈버트"],
    type: "executive",
    profile: { label: "Super Members Council profile", url: "https://supermemberscouncil.com.au/about-us/our-people/" },
    social: { label: "LinkedIn", url: "https://www.linkedin.com/in/mishaschubert/" },
    personalSocial: { label: "X", url: "https://x.com/mishaschubert" },
    background: {
      "zh-Hans": "Super Members Council 首席执行官，曾领导 Science & Technology Australia，并长期从事公共政策、倡议和成员组织代表工作。",
      "zh-Hant": "Super Members Council 行政總裁，曾領導 Science & Technology Australia，並長期從事公共政策、倡議和會員組織代表工作。",
      en: "Chief executive officer of Super Members Council, former head of Science & Technology Australia, with a long background in public policy, advocacy and member-based representation.",
      es: "Directora ejecutiva de Super Members Council y exdirectora de Science & Technology Australia, con trayectoria en política pública, incidencia y representación de organizaciones miembro.",
      ja: "Super Members Council の最高経営責任者。Science & Technology Australia の元代表で、公共政策、提言、会員組織の代表活動に長く携わっています。",
      ko: "Super Members Council 최고경영자이며 Science & Technology Australia 전 대표로, 공공정책, advocacy, 회원 기반 대표 활동 경력이 깁니다.",
      vi: "Tổng giám đốc Super Members Council, cựu lãnh đạo Science & Technology Australia, có nền tảng lâu năm về chính sách công, vận động và đại diện tổ chức thành viên.",
      th: "ประธานเจ้าหน้าที่บริหารของ Super Members Council อดีตหัวหน้า Science & Technology Australia มีประสบการณ์ยาวนานด้านนโยบายสาธารณะ advocacy และการเป็นตัวแทนองค์กรสมาชิก",
      si: "Super Members Council chief executive officer වේ; Science & Technology Australia හි හිටපු head කෙනෙකු වන අතර public policy, advocacy සහ member-based representation පිළිබඳ දිගු පසුබිමක් ඇත."
    }
  },
  {
    name: "Julie Inman Grant",
    aliases: ["Julie Inman Grant", "Julie Inman-Grant", "Julie Inman Grant eSafety", "朱莉·因曼·格兰特", "朱莉·因曼·格蘭特", "ジュリー・インマン・グラント", "줄리 인먼 그랜트"],
    type: "public-office-holder",
    profile: { label: "eSafety Commissioner profile", url: "https://www.esafety.gov.au/about-us/who-we-are/esafety-commissioner" },
    officialProfile: { label: "eSafety biography", url: "https://www.esafety.gov.au/about-us/who-we-are/esafety-commissioner" },
    background: {
      "zh-Hans": "澳大利亚 eSafety Commissioner，负责网络安全监管、平台责任和在线伤害应对；此前曾在 Microsoft、Twitter 和 Adobe 担任公共政策与安全相关职务。",
      "zh-Hant": "澳洲 eSafety Commissioner，負責網絡安全監管、平台責任和網上傷害應對；此前曾在 Microsoft、Twitter 和 Adobe 擔任公共政策與安全相關職務。",
      en: "Australia's eSafety Commissioner, responsible for online-safety regulation, platform accountability and responses to online harms, after public-policy and safety roles at Microsoft, Twitter and Adobe.",
      es: "Comisionada de eSafety de Australia, responsable de regulación de seguridad online, responsabilidad de plataformas y respuesta a daños digitales, tras cargos de política pública y seguridad en Microsoft, Twitter y Adobe.",
      ja: "豪州の eSafety Commissioner。オンライン安全規制、プラットフォーム責任、オンライン被害対応を担当し、以前は Microsoft、Twitter、Adobe で公共政策・安全関連職を務めました。",
      ko: "호주의 eSafety Commissioner로 온라인 안전 규제, 플랫폼 책임, 온라인 피해 대응을 담당하며, 이전에는 Microsoft, Twitter, Adobe에서 공공정책 및 안전 관련 업무를 맡았습니다.",
      vi: "Ủy viên eSafety của Australia, phụ trách quản lý an toàn trực tuyến, trách nhiệm nền tảng và ứng phó tác hại online, sau các vai trò chính sách công và an toàn tại Microsoft, Twitter và Adobe.",
      th: "eSafety Commissioner ของออสเตรเลีย รับผิดชอบการกำกับความปลอดภัยออนไลน์ ความรับผิดชอบของแพลตฟอร์ม และการรับมืออันตรายออนไลน์ หลังเคยทำงานด้านนโยบายสาธารณะและความปลอดภัยที่ Microsoft, Twitter และ Adobe",
      si: "Australia's eSafety Commissioner වේ; online-safety regulation, platform accountability සහ online harms responses භාරව සිටින අතර Microsoft, Twitter සහ Adobe හි public-policy/safety roles දැරීය."
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

function isPersonalSocialLink(link) {
  if (!link?.url) return false;
  const label = String(link.label || "").toLowerCase();
  const url = String(link.url || "").toLowerCase();
  const socialLabel = /\b(x|twitter|facebook|instagram|youtube|tiktok|threads|linkedin|bluesky|bsky)\b/.test(label);
  const socialDomain =
    /(^|\/\/)(www\.)?(x\.com|twitter\.com|facebook\.com|instagram\.com|youtube\.com|youtu\.be|tiktok\.com|threads\.net|linkedin\.com|bsky\.app)\b/.test(
      url
    );
  const profileOnlyLabel = /\b(official profile|profile|biography|bio|wikipedia|forbes|parliament|publisher|feature)\b/.test(label);

  return (socialLabel || socialDomain) && !profileOnlyLabel;
}

function isPublicPersonalPresenceLink(link) {
  if (!link?.url) return false;
  const label = String(link.label || "").toLowerCase();
  const url = String(link.url || "").toLowerCase();
  return (
    isPersonalSocialLink(link) ||
    /\b(personal site|personal website|campaign site|project site|fundraiser)\b/.test(label) ||
    /(^|\/\/)(www\.)?(bobmontgomery\.com\.au|mndblue\.org\.au)\b/.test(url)
  );
}

function personSocialLink(person) {
  const candidates = [person?.personalSocial, person?.social].filter(Boolean);
  return candidates.find(isPublicPersonalPresenceLink) || null;
}

function personProfileLink(person) {
  return person?.profile || person?.officialProfile || (!isPersonalSocialLink(person?.social) ? person?.social : null);
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
    const displayName = entity?.name || value;
    const socialLink = personSocialLink(entity);
    if (socialLink?.url) {
      parts.push(
        <a className="person-link" href={socialLink.url} target="_blank" rel="noreferrer" key={`${value}-${match.index}`}>
          {displayName}
        </a>
      );
    } else {
      parts.push(displayName);
    }
    lastIndex = matcher.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function localizedPersonValue(person, field, language) {
  return person?.[field]?.[language] || person?.[field]?.en || "";
}

function localizedPersonList(person, field, language, limit = 3) {
  const value = localizedPersonValue(person, field, language);
  if (Array.isArray(value)) return value.filter(Boolean).slice(0, limit);
  return value ? [value] : [];
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

function socialDiscussionSet(cluster, language) {
  const localized = cluster?.localizedSocialDiscussions || cluster?.socialDiscussionsByLanguage;
  const raw = cluster?.socialDiscussions;
  const groups = [];

  if (localized?.[language]?.length) groups.push(localized[language]);
  if (language !== "en" && localized?.en?.length) groups.push(localized.en);

  if (Array.isArray(raw)) groups.push(raw);

  if (raw && !Array.isArray(raw) && typeof raw === "object") {
    if (raw[language]?.length) groups.push(raw[language]);
    if (language !== "en" && raw.en?.length) groups.push(raw.en);
    if (raw.default?.length) groups.push(raw.default);
  }

  const seen = new Set();
  return groups.flat().filter((item) => {
    const key = String(item?.url || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function validSocialDiscussions(cluster, language = cluster?.language || "en") {
  return socialDiscussionSet(cluster, language)
    .filter((item) => item?.platform && item?.title && item?.url)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, 5);
}

function socialHeat(cluster, language = cluster?.language || "en") {
  const discussions = validSocialDiscussions(cluster, language);
  const score = discussions.reduce((total, item) => total + Number(item.score || 0), 0);
  const level = score >= 1800 ? 4 : score >= 800 ? 3 : score >= 250 ? 2 : score > 0 ? 1 : 0;
  return { score, level, count: discussions.length };
}

function HeatIndicator({ cluster, language }) {
  const heat = socialHeat(cluster, language);
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

function SocialDiscussionList({ discussions, labels }) {
  return (
    <div className="social-discussion-list">
      {discussions.map((item) => {
        const source = item.community || item.account || item.author || item.platform;
        const score = Number(item.score || 0);
        const meta = [source, score > 0 ? `${labels.socialDiscussionMeta}: ${score}` : ""].filter(Boolean).join(" · ");

        return (
          <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>
            <span className="social-platform">{item.platform}</span>
            <span className="social-title">{item.title}</span>
            {meta && <span className="social-meta">{meta}</span>}
            <ExternalLink size={15} />
          </a>
        );
      })}
    </div>
  );
}

function PeopleContextList({ people, labels, language }) {
  return (
    <div className="people-list">
      {people.map((person) => {
        const background = localizedPersonValue(person, "background", language);
        const positions = person.type === "politician" ? localizedPersonList(person, "positions", language, 3) : [];
        const profileLink = personSocialLink(person) || personProfileLink(person);

        return (
          <section className="person-card" key={person.name}>
            <div className="person-card-top">
              <strong>{person.name}</strong>
              {profileLink?.url && (
                <a href={profileLink.url} target="_blank" rel="noreferrer">
                  {profileLink.label || labels.socialProfile}
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
            {positions.length > 0 && (
              <div className="person-positions">
                <span>{labels.politicalPositions}: </span>
                <ul>
                  {positions.map((position) => (
                    <li key={position}>{position}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function App() {
  const sharedId = initialSharedId();
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState(sharedId);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");
  const [heatFilter, setHeatFilter] = useState(initialHeatFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(sharedId);
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
  const pendingCardAnchorRef = useRef(null);
  const sharedScrollDoneRef = useRef(false);

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
    window.localStorage.setItem("brief-heat-filter", String(heatFilter));
  }, [heatFilter]);

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

  function toggleClusterExpansion(id) {
    if (window.matchMedia("(max-width: 760px)").matches) {
      const element = document.getElementById(`brief-${id}`);
      pendingCardAnchorRef.current = element ? { id, top: element.getBoundingClientRect().top } : null;
    }
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

  async function shareCluster(cluster) {
    const displayCluster = { ...cluster, language };
    const shareData = {
      title: displayCluster.headline,
      text: shareTextFor(displayCluster),
      url: shareUrlFor(displayCluster, language)
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    }
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
      const matchesHeat = socialHeat({ ...cluster, language }, language).level >= heatFilter;
      return isRecentCluster(cluster) && matchesSearch && matchesMode && matchesHeat;
    });
  }, [data, heatFilter, language, mode, query]);

  const active = clusters.find((cluster) => cluster.id === activeId) || clusters[0];
  const displayActive = active ? { ...active, language } : null;
  const activeDifferences = uniqueDifferences(displayActive);
  const activeCommentary = showCommentary ? getFourNewsCommentary(displayActive, language) : "";
  const activePeople = showPeopleContext ? mentionedPeople(displayActive) : [];
  const activeSocialDiscussions = validSocialDiscussions(displayActive, language);

  useEffect(() => {
    if (activeId && clusters.length && !clusters.some((cluster) => cluster.id === activeId)) {
      setActiveId(clusters[0].id);
    }
  }, [activeId, clusters]);

  useEffect(() => {
    if (!sharedId || sharedScrollDoneRef.current || !clusters.some((cluster) => cluster.id === sharedId)) return;

    setActiveId(sharedId);
    setExpandedId(sharedId);
    sharedScrollDoneRef.current = true;

    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        document.getElementById(`brief-${sharedId}`)?.scrollIntoView({ block: "center", behavior: "auto" });
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [clusters, sharedId]);

  useEffect(() => {
    if (toolsOpen && window.matchMedia("(max-width: 760px)").matches) {
      setSourcesOpen(true);
    }
  }, [toolsOpen]);

  useLayoutEffect(() => {
    const anchor = pendingCardAnchorRef.current;
    if (!anchor || !window.matchMedia("(max-width: 760px)").matches) {
      return undefined;
    }

    const restoreAnchorPosition = () => {
      const element = document.getElementById(`brief-${anchor.id}`);
      if (!element) return;
      const delta = element.getBoundingClientRect().top - anchor.top;
      if (Math.abs(delta) > 0.5) {
        window.scrollBy({ top: delta, behavior: "auto" });
      }
    };

    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        restoreAnchorPosition();
      });
    });
    const lateFrame = window.setTimeout(() => {
      restoreAnchorPosition();
      pendingCardAnchorRef.current = null;
    }, 180);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(lateFrame);
    };
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
          <a className="brand-identity" href="https://4news.com.au/" aria-label="4News home">
            <img className="brand-mark" src="./icon.svg" alt="4News" />
            <div>
              <h1>{labels.appName}</h1>
              <span className="brand-subtitle">{labels.appSubtitle}</span>
            </div>
          </a>
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

          <label className="setting-control">
            <span>{labels.heatFilter}</span>
            <select
              value={heatFilter}
              onChange={(event) => setHeatFilter(Number(event.target.value))}
              aria-label={labels.heatFilter}
            >
              <option value={0}>{labels.heatAll}</option>
              {[1, 2, 3, 4].map((level) => (
                <option key={level} value={level}>
                  {labels.heatAtLeast} {level}
                </option>
              ))}
            </select>
          </label>

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
            const socialDiscussions = validSocialDiscussions(displayCluster, language);

            return (
              <article
                className={`cluster-card ${cluster.id === active?.id ? "selected" : ""} ${
                  cluster.id === expandedId ? "expanded" : ""
                }`}
                id={`brief-${cluster.id}`}
                key={cluster.id}
              >
              <div className="cluster-card-content">
                <div className="cluster-title-row">
                  <button
                    className="cluster-title-button"
                    onClick={() => toggleClusterExpansion(cluster.id)}
                  >
                    <h3>
                      <span>{displayCluster.headline}</span>
                      <HeatIndicator cluster={displayCluster} language={language} />
                    </h3>
                  </button>
                  <button
                    className="icon-button compact card-share-button"
                    onClick={() => shareCluster(displayCluster)}
                    title={labels.shareBrief}
                    aria-label={labels.shareBrief}
                  >
                    <Share2 size={17} />
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
                    <p>{linkifyPeopleText(displayCluster.voiceScript, true)}</p>
                  </div>

                  {uniqueDifferences(displayCluster).length > 0 && (
                    <div className="mobile-section">
                      <div className="difference-list">
                        {uniqueDifferences(displayCluster).map((difference) => (
                          <p key={difference}>{linkifyPeopleText(difference, true)}</p>
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
                      <p>{linkifyPeopleText(commentary, true)}</p>
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
                    <div className="mobile-section social-panel">
                      <div className="social-heading">
                        <Flame size={16} />
                        <strong>{labels.socialDiscussions}</strong>
                      </div>
                      <SocialDiscussionList discussions={socialDiscussions} labels={labels} />
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
                <h2>
                  <span>{linkifyPeopleText(displayActive.headline, true)}</span>
                  <HeatIndicator cluster={displayActive} language={language} />
                </h2>
              </div>
              <button
                className="icon-button"
                onClick={() => shareCluster(displayActive)}
                title={labels.shareBrief}
                aria-label={labels.shareBrief}
              >
                <Share2 size={19} />
              </button>
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
              <p>{linkifyPeopleText(displayActive.voiceScript, true)}</p>
            </article>

            {activeCommentary && (
              <article className="commentary-panel">
                <div className="commentary-heading">
                  <MessageSquareText size={17} />
                  <strong>{labels.commentaryTitle}</strong>
                </div>
                <p>{linkifyPeopleText(activeCommentary, true)}</p>
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

            {activeSocialDiscussions.length > 0 && (
              <article className="social-panel">
                <div className="social-heading">
                  <Flame size={17} />
                  <strong>{labels.socialDiscussions}</strong>
                </div>
                <SocialDiscussionList discussions={activeSocialDiscussions} labels={labels} />
              </article>
            )}

            <div className={`detail-grid ${activeDifferences.length === 0 ? "single-column" : ""}`}>
              {activeDifferences.length > 0 && (
                <section>
                  <div className="difference-list">
                    {activeDifferences.map((difference) => (
                      <p key={difference}>{linkifyPeopleText(difference, true)}</p>
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
