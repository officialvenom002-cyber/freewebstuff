export interface CategoryShortcut {
  label: string;
  slug: string;
  emoji: string;
  href?: string;
}

export const CATEGORY_SHORTCUTS: Record<string, CategoryShortcut[]> = {
  video: [
    { label: "Movies & TV", slug: "stream-aggregators", emoji: "🎬" },
    { label: "Ad-Free Streams", slug: "p-stream-forks", emoji: "⚡" },
    { label: "Direct Servers", slug: "dedicated-server", emoji: "🍿" },
    { label: "Multi-Server", slug: "multi-server", emoji: "📺" },
    { label: "Free w/ Ads", slug: "free-w-ads", emoji: "🆓" },
  ],
  privacy: [
    { label: "Adblocking", slug: "adblocking", emoji: "🛡️" },
    { label: "Adblock Filters", slug: "adblock-filters", emoji: "📜" },
    { label: "DNS Adblock", slug: "dns-adblocking", emoji: "🌐" },
    { label: "Antivirus & Malware", slug: "antivirus-anti-malware", emoji: "🦠" },
    { label: "File Scanners", slug: "file-scanners", emoji: "🔍" },
  ],
  ai: [
    { label: "AI Models", slug: "official-model-sites", emoji: "🤖" },
    { label: "Chatbots", slug: "specialized-chatbots", emoji: "💬" },
    { label: "Image Gen", slug: "image-generation", emoji: "🎨" },
    { label: "Local AI", slug: "local-ai-frontends", emoji: "💻" },
    { label: "Self-Hosting", slug: "self-hosting-tools", emoji: "🏠" },
  ],
  gaming: [
    { label: "PC Games", slug: "download-games", emoji: "🎮" },
    { label: "Game Repacks", slug: "game-repacks", emoji: "📦" },
    { label: "Retro & Emulation", slug: "abandonware-retro", emoji: "🕹️" },
    { label: "VR Games", slug: "virtual-reality", emoji: "🕶️" },
    { label: "Indie Games", slug: "indie-games", emoji: "👾" },
  ],
  downloading: [
    { label: "Software Sites", slug: "software-sites", emoji: "💾" },
    { label: "FOSS Apps", slug: "foss-sites", emoji: "🟢" },
    { label: "Freeware", slug: "freeware-sites", emoji: "⚡" },
    { label: "Directories", slug: "download-directories", emoji: "📁" },
    { label: "Search Sites", slug: "search-sites", emoji: "🔍" },
  ],
  reading: [
    { label: "Ebooks", slug: "ebooks", emoji: "📚" },
    { label: "PDF Search", slug: "pdf-search", emoji: "🔍" },
    { label: "Manga & Comics", slug: "calibre-libraries", emoji: "📖" },
    { label: "Public Domain", slug: "public-domain", emoji: "🏛️" },
    { label: "E-Readers", slug: "ebook-readers", emoji: "📱" },
  ],
  torrenting: [
    { label: "Torrent Sites", slug: "torrent-sites", emoji: "🌊" },
    { label: "Search & Trackers", slug: "aggregators", emoji: "📊" },
    { label: "Torrent Clients", slug: "torrent-clients", emoji: "⚡" },
    { label: "qBittorrent Tools", slug: "qbittorrent-tools", emoji: "⚙️" },
    { label: "Remote Torrenting", slug: "remote-torrenting", emoji: "📡" },
  ],
  audio: [
    { label: "Music Streaming", slug: "streaming-sites", emoji: "🎵" },
    { label: "YouTube Music", slug: "youtube-music-tools", emoji: "🎶" },
    { label: "Podcasts & Radio", slug: "podcast-streaming", emoji: "🎙️" },
    { label: "Live Concerts", slug: "concerts-live-shows", emoji: "🎸" },
    { label: "Streaming Apps", slug: "streaming-apps", emoji: "🎧" },
  ],
  educational: [
    { label: "Learning Sites", slug: "learning-sites", emoji: "🎓" },
    { label: "Documentaries", slug: "documentaries", emoji: "📽️" },
    { label: "Science & Math", slug: "science-math", emoji: "🔬" },
    { label: "Virtual Tours", slug: "virtual-tours", emoji: "🏛️" },
    { label: "Streaming", slug: "streaming", emoji: "⚡" },
  ],
  mobile: [
    { label: "Modded APKs", slug: "modded-apks", emoji: "📱" },
    { label: "FOSS Apps", slug: "foss-apks", emoji: "🟢" },
    { label: "App Launchers", slug: "app-launchers", emoji: "🚀" },
    { label: "APK Tools", slug: "apk-tools", emoji: "🔧" },
    { label: "Untouched APKs", slug: "untouched-apks", emoji: "🛡️" },
  ],
  "linux-macos": [
    { label: "Linux Apps", slug: "linux-apps", emoji: "🐧" },
    { label: "Distros", slug: "linux-distros", emoji: "💻" },
    { label: "CLI Cheat Sheets", slug: "cli-cheat-sheets", emoji: "📜" },
    { label: "Software Sites", slug: "software-sites", emoji: "💾" },
    { label: "Guides", slug: "linux-guides", emoji: "📖" },
  ],
  "system-tools": [
    { label: "System Tools", slug: "system-tools", emoji: "🛠️" },
    { label: "Tweaks & Optimizers", slug: "system-tweaks", emoji: "⚡" },
    { label: "Package Managers", slug: "package-managers", emoji: "📦" },
    { label: "Terminal / CLI", slug: "terminal-cli", emoji: "💻" },
    { label: "Automation", slug: "task-automation", emoji: "🤖" },
  ],
  "file-tools": [
    { label: "File Managers", slug: "file-managers", emoji: "📁" },
    { label: "Download Managers", slug: "download-managers", emoji: "⚡" },
    { label: "Archiving", slug: "archiving-compression", emoji: "🗜️" },
    { label: "Converters", slug: "file-converters", emoji: "🔄" },
    { label: "File Search", slug: "file-searching", emoji: "🔍" },
  ],
  "internet-tools": [
    { label: "Network Tools", slug: "network-tools", emoji: "🌐" },
    { label: "Password Managers", slug: "password-managers", emoji: "🔑" },
    { label: "Paywall Bypass", slug: "paywall-bypass", emoji: "🔓" },
    { label: "Chat Tools", slug: "chat-tools", emoji: "💬" },
    { label: "Captcha Tools", slug: "captcha-tools", emoji: "🤖" },
  ],
  "image-tools": [
    { label: "Image Editing", slug: "image-editing", emoji: "🖼️" },
    { label: "Online Editors", slug: "online-editors", emoji: "🎨" },
    { label: "AI Upscaling", slug: "upscale-restore", emoji: "🔍" },
    { label: "Content Removers", slug: "content-removers", emoji: "🪄" },
    { label: "Painting & Drawing", slug: "painting-drawing", emoji: "🖌️" },
  ],
  "video-tools": [
    { label: "Video Tools", slug: "video-tools", emoji: "🎥" },
    { label: "Screen Recording", slug: "screen-recording", emoji: "🔴" },
    { label: "FFmpeg Tools", slug: "ffmpeg-tools", emoji: "⚙️" },
    { label: "Processing", slug: "processing-encoding", emoji: "🔄" },
    { label: "Video Hosts", slug: "video-file-hosts", emoji: "☁️" },
  ],
  "developer-tools": [
    { label: "Dev Tools", slug: "developer-tools", emoji: "💻" },
    { label: "Online Toolkits", slug: "online-toolkits", emoji: "🛠️" },
    { label: "Databases", slug: "database-tools", emoji: "🗄️" },
    { label: "Git Tools", slug: "git-tools", emoji: "🌿" },
    { label: "Communities", slug: "dev-communities", emoji: "🌐" },
  ],
  "social-media-tools": [
    { label: "Discord Tools", slug: "discord-tools", emoji: "💬" },
    { label: "Discord Bots", slug: "discord-bots", emoji: "🤖" },
    { label: "Discord Clients", slug: "discord-clients", emoji: "📱" },
    { label: "Reddit Tools", slug: "reddit-tools", emoji: "🌐" },
  ],
  "text-tools": [
    { label: "Pastebins", slug: "pastebins", emoji: "📝" },
    { label: "Translators", slug: "translators", emoji: "🌐" },
    { label: "Audio Transcription", slug: "audio-transcription", emoji: "🎙️" },
    { label: "Grammar Check", slug: "grammar-check", emoji: "✍️" },
    { label: "Encode / Decode", slug: "encode-decode", emoji: "🔐" },
  ],
  "gaming-tools": [
    { label: "Game Launchers", slug: "game-launchers", emoji: "🚀" },
    { label: "Optimization", slug: "optimization-tools", emoji: "⚡" },
    { label: "Controller Tools", slug: "controller-tools", emoji: "🎮" },
    { label: "Game Mods", slug: "game-mods", emoji: "🧩" },
    { label: "Game Maps", slug: "game-maps", emoji: "🗺️" },
  ],
  storage: [
    { label: "Design Resources", slug: "design-resources", emoji: "🎨" },
    { label: "CSS Frameworks", slug: "css-framework-tools", emoji: "💻" },
    { label: "Data Visualization", slug: "data-visualization-tools", emoji: "📊" },
    { label: "Dynamic DNS", slug: "dynamic-dns-services-subdomains", emoji: "🌐" },
    { label: "Site Mockups", slug: "app-site-mockups", emoji: "🖼️" },
  ],
  misc: [
    { label: "Free Stuff", slug: "free-stuff", emoji: "🎁" },
    { label: "Free Games", slug: "free-games", emoji: "🎮" },
    { label: "Random Discovery", slug: "random-sites-discovery", emoji: "🌐" },
    { label: "Indexes", slug: "indexes", emoji: "📋" },
    { label: "Git Projects", slug: "git-project-indexes", emoji: "🌿" },
  ],
  "non-english": [
    { label: "Arabic", slug: "arabic", emoji: "🌐" },
    { label: "Bangla", slug: "bangla", emoji: "🌐" },
    { label: "Downloading", slug: "downloading", emoji: "💾" },
    { label: "Torrenting", slug: "torrenting", emoji: "🌊" },
    { label: "Streaming", slug: "streaming", emoji: "🎬" },
  ],
};

export const ALL_CATEGORIES_SHORTCUTS: CategoryShortcut[] = [
  { label: "Movies & TV", slug: "video", emoji: "🎬", href: "/categories/video" },
  { label: "AI Tools", slug: "ai", emoji: "🤖", href: "/categories/ai" },
  { label: "Privacy", slug: "privacy", emoji: "🛡️", href: "/categories/privacy" },
  { label: "Gaming", slug: "gaming", emoji: "🎮", href: "/categories/gaming" },
  { label: "Downloads", slug: "downloading", emoji: "💾", href: "/categories/downloading" },
];
