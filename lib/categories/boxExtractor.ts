import { Resource } from "@/lib/types";

export interface PrivacySectionItem {
  id: string;
  raw: string;
  isStarred: boolean;
  isIndex: boolean;
  isCrossLink: boolean;
}

export interface PrivacySection {
  id: string;
  slug: string;
  title: string;
  titleUrl?: string | null;
  level: number;
  tip?: string | null;
  items: PrivacySectionItem[];
}

export interface WebsiteEntry {
  id: string;
  name: string;
  url: string;
  isStarred: boolean;
}

export interface TypedBox {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  tagline?: string;
  accent: string;
  websites: WebsiteEntry[];
}

const AUX_WORDS = new Set([
  "discord","github","reddit","twitter","telegram","wiki","guide","docs","documentation",
  "mirror","mirrors","backup","apk","ios","android","grading","status","web","app",
  "2","3","4","5","6","7","8","9","10","source","client","code","script","userscript",
  "addon","extension","firefox","chrome","changelog","discussion","discussions","issues",
  "faq","support","download","download guide","ad-block guide","ratings","fix",
  "steam store hover","display magnets","timestamp fix","highlighter","tutorial","video guide",
  "demo","add features","subreddit","presets / themes","presets","themes","redirect bypass",
  "translator","x","gitlab","ports","bookmarklet","cli","uploader","lite version","note",
  "whitelist note","plugins","config","imdb ratings","telegram bot","bot","wiki comparisons",
  "ad-block guide","essentials list","proxy","steam button","aws s3"
]);

export function extractWebsitesFromRaw(item: PrivacySectionItem): WebsiteEntry[] {
  const raw = item.raw.trim();
  if (/^\*\*(?:Warning|Note|Notice|Tip|Important|Instructions|Report Issues)\*\*/i.test(raw)) {
    return [];
  }
  const entries: WebsiteEntry[] = [];
  const regex = /(?:\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
  let match;
  let isFirstInLine = true;
  while ((match = regex.exec(raw)) !== null) {
    let name = (match[1] || match[3] || "").trim();
    const url = (match[2] || match[4] || "").trim();
    name = name.replace(/^[\s\uFEFF\xA0\u200B\u2060•\-\*\>]+/, "").trim();
    name = name.replace(/[\s\uFEFF\xA0\u200B\u2060]+$/, "").trim();

    const lower = name.toLowerCase();
    if (AUX_WORDS.has(lower)) continue;
    if (lower.startsWith("guide") || lower.startsWith("how to") || lower.startsWith("tutorial")) continue;
    if (/github\.com\/.*\/issues|reddit\.com\/r\/|t\.me\//.test(url) && !isFirstInLine) continue;
    if (name.length < 2 || name.length > 50) continue;
    if (/^(https?:\/\/|\/|#)/.test(name)) continue;

    entries.push({
      id: `${item.id}-${entries.length}`,
      name,
      url,
      isStarred: item.isStarred && entries.length === 0,
    });
    if (entries.length >= 2) break;
    isFirstInLine = false;
  }
  return entries;
}

export const CATEGORY_DEFAULT_EMOJIS: Record<string, string> = {
  "privacy": "🛡️",
  "ai": "🤖",
  "video": "🎬",
  "audio": "🎵",
  "gaming": "🎮",
  "reading": "📚",
  "downloading": "💾",
  "torrenting": "🌊",
  "educational": "🎓",
  "mobile": "📱",
  "linux-macos": "🐧",
  "non-english": "🌐",
  "misc": "✨",
  "system-tools": "🛠️",
  "file-tools": "📁",
  "internet-tools": "🌐",
  "social-media-tools": "💬",
  "text-tools": "📝",
  "gaming-tools": "🕹️",
  "image-tools": "🖼️",
  "video-tools": "🎥",
  "developer-tools": "💻",
  "storage": "☁️",
};

export function getSectionEmoji(title: string, catSlug: string): string {
  const t = title.toLowerCase();

  if (t.includes("torrent") || t.includes("p2p") || t.includes("magnet") || t.includes("tracker") || t.includes("seed")) return "🌊";
  if (t.includes("translat")) return "🌐";

  if (t.includes("adblock") || t.includes("tracker") || t.includes("anti-malware") || t.includes("antivirus") || t.includes("telemetry") || t.includes("scanner")) return "🛡️";
  if (t.includes("vpn") || t.includes("proxy") || /\btor\b/.test(t) || t.includes("tunnel") || t.includes("encrypt") || t.includes("security")) return "🔒";
  if (t.includes("dns")) return "🌐";
  if (t.includes("search") || t.includes("cse")) return "🔍";
  if (t.includes("browser") || t.includes("firefox") || t.includes("chrome") || t.includes("chromium")) return "🧭";
  if (t.includes("mail") || t.includes("inbox") || t.includes("email")) return "✉️";
  if (t.includes("password") || t.includes("auth") || t.includes("2fa") || t.includes("passkey")) return "🔑";

  if (t.includes("model") || t.includes("llm") || t.includes("gpt") || t.includes("claude") || t.includes("gemini") || t.includes("neural")) return "🧠";
  if (t.includes("chat") || t.includes("bot") || t.includes("assistant") || t.includes("roleplay")) return "🤖";
  if (t.includes("ai") || t.includes("artificial") || t.includes("prompt")) return "✨";

  if (catSlug === "audio" || t.includes("music") || t.includes("song") || t.includes("audio") || t.includes("sound") || t.includes("flac") || t.includes("spotify") || t.includes("album")) return "🎵";
  if (t.includes("radio") || t.includes("broadcast") || t.includes("ambient") || t.includes("relaxation")) return "📻";
  if (t.includes("podcast") || t.includes("voice") || t.includes("speech") || t.includes("audiobook")) return "🎙️";

  if (t.includes("repack") || t.includes("fitgirl") || t.includes("dodi") || t.includes("crack")) return "⚡";
  if (t.includes("emulator") || t.includes("emulation") || t.includes("rom") || t.includes("retro") || t.includes("abandonware")) return "🕹️";
  if (catSlug === "gaming" || catSlug === "gaming-tools" || t.includes("game") || t.includes("gaming") || t.includes("steam")) return "🎮";

  if (t.includes("anime") || t.includes("manga") || t.includes("hianime")) return "⛩️";
  if (t.includes("cartoon") || t.includes("animation") || t.includes("animated")) return "🍿";
  if (t.includes("sport") || t.includes("cricket") || t.includes("football") || t.includes("soccer")) return "⚽";
  if (t.includes("tv") || t.includes("television") || t.includes("channel") || t.includes("cable") || t.includes("satellite")) return "📺";
  if (catSlug === "video" || catSlug === "video-tools" || t.includes("movie") || t.includes("film") || t.includes("cinema") || t.includes("stream") || t.includes("show")) return "🎬";

  if (t.includes("pdf")) return "📑";
  if (t.includes("comic") || t.includes("webtoon")) return "🦸";
  if (catSlug === "reading" || t.includes("book") || t.includes("read") || t.includes("epub") || t.includes("kindle") || t.includes("calibre") || t.includes("novel")) return "📚";

  if (catSlug === "downloading" || t.includes("download") || t.includes("debrid") || t.includes("grabber") || t.includes("usenet") || t.includes("ripper")) return "💾";

  if (t.includes("git") || t.includes("github") || t.includes("repo")) return "🐙";
  if (t.includes("database") || t.includes("sql") || t.includes("backend")) return "🗄️";
  if (t.includes("api") || t.includes("rest") || t.includes("graphql")) return "🔌";
  if (catSlug === "developer-tools" || t.includes("code") || t.includes("dev") || t.includes("program") || t.includes("script") || t.includes("ide") || t.includes("compiler")) return "💻";

  if (t.includes("linux") || t.includes("unix") || t.includes("distro") || t.includes("terminal") || /\bcli\b/.test(t) || t.includes("shell")) return "🐧";
  if (t.includes("mac") || t.includes("apple") || t.includes("ios")) return "🍎";
  if (t.includes("windows") || t.includes("pc") || t.includes("desktop")) return "🪟";
  if (catSlug === "mobile" || t.includes("android") || t.includes("apk") || t.includes("phone") || t.includes("mobile")) return "📱";

  if (catSlug === "storage" || t.includes("storage") || t.includes("cloud") || t.includes("drive") || t.includes("backup") || t.includes("sync") || t.includes("host")) return "☁️";

  if (catSlug === "image-tools" || t.includes("image") || t.includes("photo") || t.includes("art") || t.includes("upscale") || t.includes("drawing") || t.includes("wallpaper")) return "🎨";

  if (t.includes("math") || t.includes("calcul") || t.includes("algebra")) return "📐";
  if (t.includes("science") || t.includes("physics") || t.includes("chemistry") || t.includes("biology")) return "🔬";
  if (t.includes("language") || t.includes("vocab")) return "🗣️";
  if (catSlug === "educational" || t.includes("course") || t.includes("learn") || t.includes("school") || t.includes("university") || t.includes("academy") || t.includes("study")) return "🎓";

  if (catSlug === "social-media-tools" || t.includes("discord") || t.includes("reddit") || t.includes("social") || t.includes("community") || t.includes("chat")) return "💬";
  if (catSlug === "text-tools" || t.includes("text") || t.includes("note") || t.includes("write") || t.includes("editor") || t.includes("pastebin")) return "📝";
  if (catSlug === "file-tools" || t.includes("file") || t.includes("compress") || t.includes("archive") || t.includes("extract") || t.includes("convert")) return "📁";
  if (catSlug === "system-tools" || t.includes("system") || t.includes("hardware") || t.includes("tweak") || t.includes("cleaner") || t.includes("monitor")) return "🛠️";

  return CATEGORY_DEFAULT_EMOJIS[catSlug] || "📁";
}

export type VideoBoxDef = Omit<TypedBox, "websites"> & {
  websites: Array<{ name: string; url: string; isStarred?: boolean }>;
};

export const VIDEO_SPECIALIZED_BOXES: VideoBoxDef[] = [
  {
    id:"movies-english", slug:"movies-english",
    title:"Movies & TV — English", emoji:"🎬", accent:"sky",
    tagline:"Hollywood · Series · Originals",
    websites:[
      {name:"Flixer",url:"https://flixer.gd",isStarred:true},
      {name:"Cineby",url:"https://cineby.at",isStarred:true},
      {name:"Movy",url:"https://www.movy.bz",isStarred:true},
      {name:"Moovie",url:"https://moovie.fun",isStarred:true},
      {name:"HiveX",url:"https://hivex.stream"},
      {name:"NOVA",url:"https://novahd.cc"},
      {name:"ArrowTV",url:"https://arrowtv.net"},
      {name:"Cinezo",url:"https://www.cinezo.org"},
      {name:"Cinemove",url:"https://cinemove.cc"},
      {name:"Chillflix",url:"https://chillflix.lol"},
      {name:"Streamo",url:"https://streamo.pro"},
      {name:"Surface Stream",url:"https://watchsurface.stream"},
      {name:"Hexa",url:"https://hexa.su"},
      {name:"NomorFlix",url:"https://nomorflix.cc"},
      {name:"DioStream",url:"https://diostream.cc"},
      {name:"Stigstream",url:"https://stigstream.ru"},
      {name:"NetPlay",url:"https://netplayz.icu"},
      {name:"Cinelove",url:"https://cinelove.live"},
    ]
  },
  {
    id:"movies-hindi", slug:"movies-hindi",
    title:"Movies — Hindi & Bollywood", emoji:"🇮🇳", accent:"amber",
    tagline:"Bollywood · Dubbed · South Indian",
    websites:[
      {name:"VegaMovies",url:"https://vegamovies.ist",isStarred:true},
      {name:"BollyFlix",url:"https://bollyflix.vip",isStarred:true},
      {name:"DesiCinemas",url:"https://desicinemas.tv",isStarred:true},
      {name:"KatMovieHD",url:"https://katmoviehd.to",isStarred:true},
      {name:"MoviesMod",url:"https://moviesmod.org"},
      {name:"HDHub4u",url:"https://hdhub4u.tv"},
      {name:"FilmyZilla",url:"https://filmyzilla.org"},
      {name:"MP4Moviez",url:"https://mp4moviez.guru"},
      {name:"HindiLinks4u",url:"https://hindilinks4u.link"},
      {name:"Bolly4u",url:"https://bolly4u.org"},
      {name:"Movies4u",url:"https://movies4u.vip"},
      {name:"7StarHD",url:"https://7starhd.run"},
      {name:"FilmyWap",url:"https://filmywap.com"},
      {name:"Yo-Desi",url:"https://yodesi.net"},
      {name:"ApneTV",url:"https://apnetv.cc"},
      {name:"IBomma",url:"https://ibomma.com"},
      {name:"Cinevez",url:"https://cinevez.in"},
    ]
  },
  {
    id:"anime-english", slug:"anime-english",
    title:"Anime — English Sub & Dub", emoji:"⛩️", accent:"violet",
    tagline:"Subbed · Dubbed · Seasonal",
    websites:[
      {name:"HiAnime",url:"https://hianime.to",isStarred:true},
      {name:"AniWatch",url:"https://aniwatchtv.to",isStarred:true},
      {name:"AnimePahe",url:"https://animepahe.ru",isStarred:true},
      {name:"Gogoanime",url:"https://anitaku.to",isStarred:true},
      {name:"Kaido",url:"https://kaido.to"},
      {name:"KickAssAnime",url:"https://kaas.to"},
      {name:"Zoro Anime",url:"https://zorox.to"},
      {name:"Aniwave",url:"https://aniwave.to"},
      {name:"AnimeDex",url:"https://animedex.live"},
      {name:"YugenAnime",url:"https://yugenanime.tv"},
      {name:"Marin Anime",url:"https://marin.moe"},
      {name:"AllAnime",url:"https://allanime.to"},
      {name:"AnimeSuge",url:"https://animesuge.to"},
      {name:"Animesaturn",url:"https://animesaturn.in"},
    ]
  },
  {
    id:"anime-hindi", slug:"anime-hindi",
    title:"Anime — Hindi Dubbed", emoji:"🇮🇳", accent:"rose",
    tagline:"Hindi · Tamil · Telugu Dubs",
    websites:[
      {name:"AnimeTM",url:"https://animetm.net",isStarred:true},
      {name:"RareToonsIndia",url:"https://raretoonsindia.rtx.to",isStarred:true},
      {name:"ToonWorldTamil",url:"https://toonworldtamil.net",isStarred:true},
      {name:"AnimeHindi",url:"https://animehindi.com",isStarred:true},
      {name:"DeadToonsIndia",url:"https://deadtoons.cc"},
      {name:"AnimeDex Hindi",url:"https://animedex.live/hindi"},
      {name:"HindiAnimeClub",url:"https://hindianimeclub.com"},
      {name:"DubbedAnimeHD",url:"https://dubbedanimehd.com"},
      {name:"PureToons",url:"https://puretoons.me"},
      {name:"ToonHub4u",url:"https://toonhub4u.com"},
      {name:"AnimeRulz Hindi",url:"https://animerulz.in"},
    ]
  },
  {
    id:"live-sports", slug:"live-sports",
    title:"Live Sports & Cricket", emoji:"⚽", accent:"emerald",
    tagline:"Football · Cricket · NBA · F1 · UFC",
    websites:[
      {name:"StreamEast",url:"https://thestreameast.to",isStarred:true},
      {name:"VIPRow",url:"https://viprow.nu",isStarred:true},
      {name:"BuffStreams",url:"https://buffstreams.sx",isStarred:true},
      {name:"FootyBite",url:"https://footybite.to"},
      {name:"CrackStreams",url:"https://crackstreams.me"},
      {name:"Sportsurge",url:"https://sportsurge.to"},
      {name:"MethStreams",url:"https://methstreams.com"},
      {name:"TotalSportek",url:"https://totalsportek.pro"},
      {name:"CricHD",url:"https://crichd.com"},
      {name:"DaddyLive Sports",url:"https://daddylive.me"},
      {name:"Rojadirecta",url:"https://rojadirecta.me"},
      {name:"HesGoal",url:"https://hesgoal.com"},
      {name:"StrikeOut",url:"https://strikeout.im"},
    ]
  },
  {
    id:"live-tv", slug:"live-tv",
    title:"Live TV & News Channels", emoji:"📺", accent:"indigo",
    tagline:"Satellite · Cable · Network · News",
    websites:[
      {name:"DaddyLive",url:"https://daddylive.me",isStarred:true},
      {name:"TVRex",url:"https://tvrex.net",isStarred:true},
      {name:"TheTVApp",url:"https://thetvapp.to",isStarred:true},
      {name:"USTVGO",url:"https://ustvgo.tv"},
      {name:"123TV",url:"https://123tv.live"},
      {name:"Photocall TV",url:"https://photocall.tv"},
      {name:"LiveStream365",url:"https://livestream365.com"},
      {name:"Time4TV",url:"https://time4tv.stream"},
      {name:"WorldTVMobile",url:"https://worldtvmobile.com"},
      {name:"AirlessTV",url:"https://airlesstv.com"},
      {name:"FreeInterTV",url:"https://freeintertv.com"},
      {name:"Pluto TV",url:"https://pluto.tv"},
    ]
  },
  {
    id:"movie-downloads", slug:"movie-downloads",
    title:"HD Downloads — 4K / 1080p", emoji:"📥", accent:"sky",
    tagline:"Direct Links · Torrents · MKV",
    websites:[
      {name:"YTS.mx",url:"https://yts.mx",isStarred:true},
      {name:"1337x",url:"https://1337x.to",isStarred:true},
      {name:"Pahe.li",url:"https://pahe.li",isStarred:true},
      {name:"PSArips",url:"https://psarips.uk",isStarred:true},
      {name:"OlaMovies",url:"https://olamovies.top"},
      {name:"MKVcinemas",url:"https://mkvcinemas.lat"},
      {name:"DownloadHub",url:"https://downloadhub.lat"},
      {name:"TorrentGalaxy",url:"https://torrentgalaxy.to"},
      {name:"FitGirl Repacks",url:"https://fitgirl-repacks.site"},
      {name:"LimeTorrents",url:"https://limetorrents.lol"},
      {name:"EZTV",url:"https://eztvx.to"},
    ]
  },
  {
    id:"kdrama-asian", slug:"kdrama-asian",
    title:"Asian Drama & K-Drama", emoji:"🎭", accent:"rose",
    tagline:"Korean · Chinese · J-Drama",
    websites:[
      {name:"Dramacool",url:"https://dramacool.ch",isStarred:true},
      {name:"MyAsianTV",url:"https://myasiantv.ac",isStarred:true},
      {name:"KissAsian",url:"https://kissasian.lu",isStarred:true},
      {name:"AsianLoad",url:"https://asianload.to"},
      {name:"ViewAsian",url:"https://viewasian.co"},
      {name:"Viki",url:"https://viki.com"},
      {name:"DramaNice",url:"https://dramanice.la"},
      {name:"WatchAsian",url:"https://watchasian.sk"},
      {name:"FastDrama",url:"https://fastdrama.me"},
      {name:"KShow123",url:"https://kshow123.tv"},
    ]
  },
  {
    id:"cartoons-animated", slug:"cartoons-animated",
    title:"Cartoons & Animation", emoji:"🍿", accent:"amber",
    tagline:"Disney · Cartoon Network · Nick",
    websites:[
      {name:"KimCartoon",url:"https://kimcartoon.li",isStarred:true},
      {name:"WCOFun",url:"https://wcofun.net",isStarred:true},
      {name:"WatchCartoonOnline",url:"https://watchcartoononline.io"},
      {name:"SuperCartoons",url:"https://supercartoons.net"},
      {name:"ToonJet",url:"https://toonjet.com"},
      {name:"CartoonCrazy",url:"https://cartooncrazy.tv"},
      {name:"KissCartoon",url:"https://kisscartoon.sh"},
    ]
  },
  {
    id:"subtitles-tools", slug:"subtitles-tools",
    title:"Subtitles & Captions", emoji:"💬", accent:"emerald",
    tagline:"SRT · English · Hindi · 50+ langs",
    websites:[
      {name:"Subscene",url:"https://subscene.best",isStarred:true},
      {name:"OpenSubtitles",url:"https://opensubtitles.org",isStarred:true},
      {name:"Subdl",url:"https://subdl.com",isStarred:true},
      {name:"YIFY Subtitles",url:"https://yifysubtitles.ch"},
      {name:"Podnapisi",url:"https://podnapisi.net"},
      {name:"Addic7ed",url:"https://addic7ed.com"},
      {name:"TVsubs",url:"https://tvsubs.net"},
    ]
  }
];

export const ACCENT_MAP: Record<string, { header: string; dot: string; star: string; pillActive: string; link: string; border: string; glow: string }> = {
  sky:     { header:"from-sky-500/12 via-transparent",    dot:"bg-sky-400",     star:"text-amber-400", pillActive:"bg-sky-500 text-slate-950",    link:"hover:text-sky-300",    border:"hover:border-sky-500/50",   glow:"group-hover:shadow-sky-500/10" },
  violet:  { header:"from-violet-500/12 via-transparent", dot:"bg-violet-400",  star:"text-amber-400", pillActive:"bg-violet-500 text-white",      link:"hover:text-violet-300", border:"hover:border-violet-500/50", glow:"group-hover:shadow-violet-500/10" },
  amber:   { header:"from-amber-500/12 via-transparent",  dot:"bg-amber-400",   star:"text-amber-400", pillActive:"bg-amber-500 text-slate-950",   link:"hover:text-amber-300",  border:"hover:border-amber-500/50",  glow:"group-hover:shadow-amber-500/10" },
  emerald: { header:"from-emerald-500/12 via-transparent",dot:"bg-emerald-400", star:"text-amber-400", pillActive:"bg-emerald-500 text-slate-950", link:"hover:text-emerald-300",border:"hover:border-emerald-500/50",glow:"group-hover:shadow-emerald-500/10" },
  rose:    { header:"from-rose-500/12 via-transparent",   dot:"bg-rose-400",    star:"text-amber-400", pillActive:"bg-rose-500 text-white",        link:"hover:text-rose-300",   border:"hover:border-rose-500/50",   glow:"group-hover:shadow-rose-500/10" },
  indigo:  { header:"from-indigo-500/12 via-transparent", dot:"bg-indigo-400",  star:"text-amber-400", pillActive:"bg-indigo-500 text-white",      link:"hover:text-indigo-300", border:"hover:border-indigo-500/50", glow:"group-hover:shadow-indigo-500/10" },
  cyan:    { header:"from-cyan-500/12 via-transparent",   dot:"bg-cyan-400",    star:"text-amber-400", pillActive:"bg-cyan-500 text-slate-950",    link:"hover:text-cyan-300",   border:"hover:border-cyan-500/50",   glow:"group-hover:shadow-cyan-500/10" },
  fuchsia: { header:"from-fuchsia-500/12 via-transparent",dot:"bg-fuchsia-400", star:"text-amber-400", pillActive:"bg-fuchsia-500 text-white",      link:"hover:text-fuchsia-300",border:"hover:border-fuchsia-500/50",glow:"group-hover:shadow-fuchsia-500/10" },
};

export const ACCENT_CYCLE = ["sky", "violet", "emerald", "amber", "rose", "indigo", "cyan", "fuchsia"];

/**
 * Builds clean, pre-processed TypedBox list.
 * Can be run on server during SSG/SSR or on client as fallback.
 */
export function buildTypedBoxes(
  categorySlug: string,
  initialSections: PrivacySection[],
  deletedUrls?: Set<string>
): TypedBox[] {
  const isVideo = categorySlug === "video";
  const del = deletedUrls || new Set<string>();

  if (isVideo) {
    return VIDEO_SPECIALIZED_BOXES.map((box) => ({
      ...box,
      websites: box.websites
        .filter((w) => !del.has(w.url) && !del.has(w.url.replace(/\/+$/, "")))
        .map((w, idx) => ({
          id: `${box.id}-${idx}`,
          name: w.name,
          url: w.url,
          isStarred: !!w.isStarred,
        })),
    }));
  }

  const boxes: TypedBox[] = [];
  let accentIdx = 0;

  initialSections.forEach((sec) => {
    const websites: WebsiteEntry[] = [];
    sec.items.forEach((item) => {
      const extracted = extractWebsitesFromRaw(item).filter(
        (w) => !del.has(w.url) && !del.has(w.url.replace(/\/+$/, ""))
      );
      websites.push(...extracted);
    });

    if (websites.length === 0) return;

    const emoji = getSectionEmoji(sec.title, categorySlug);

    if (websites.length <= 22) {
      boxes.push({
        id: sec.id,
        slug: sec.slug,
        title: sec.title,
        emoji,
        accent: ACCENT_CYCLE[accentIdx % ACCENT_CYCLE.length],
        tagline: sec.tip || undefined,
        websites,
      });
      accentIdx++;
    } else {
      const chunkSize = 20;
      for (let i = 0; i < websites.length; i += chunkSize) {
        const partNum = Math.floor(i / chunkSize) + 1;
        const totalParts = Math.ceil(websites.length / chunkSize);
        boxes.push({
          id: `${sec.id}-${partNum}`,
          slug: `${sec.slug}-${partNum}`,
          title: totalParts > 1 ? `${sec.title} · Part ${partNum}` : sec.title,
          emoji,
          accent: ACCENT_CYCLE[accentIdx % ACCENT_CYCLE.length],
          tagline: sec.tip || undefined,
          websites: websites.slice(i, i + chunkSize),
        });
        accentIdx++;
      }
    }
  });

  return boxes;
}
