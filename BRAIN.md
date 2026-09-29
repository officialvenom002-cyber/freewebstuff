# FreeWebStuff — Master Project Brain & Knowledge Base

> **Welcome AI Assistant / Developer!**  
> This file is the single source of truth for **FreeWebStuff** (`freewebstuff.site`). Read this document to instantly understand the project's purpose, architectural foundations, directory layout, monetization rules, and development guidelines.

---

## 1. Project Overview & Mission

- **Project Name:** FreeWebStuff (also referenced as `freewebstuff` or `freewebstuff.site`)
- **Website URL:** [https://freewebstuff.site](https://freewebstuff.site)
- **Primary Purpose:** An independent, lightning-fast, community-curated directory indexing over **20,000+ verified free web tools, open-source software, streaming platforms, AI assistants, developer utilities, privacy services, and educational vaults**.
- **Inspiration & Heritage:** Built in the spirit of open-web indexing initiatives like *FreeMediaHeckYeah (FMHY)*, providing a modern, searchable, highly accessible interface with zero paywalls.
- **Core Value Proposition:**
  1. **Instant Fuzzy Search:** Client-side Fuse.js search with pre-warmed JSON cache for sub-50ms query response.
  2. **Community Verification:** Automated daily link health bots and user report systems to weed out dead links and malware.
  3. **Privacy-Respecting Experience:** Clean UI, zero invasive tracking, and dedicated ad-free zones.
  4. **The 75% Compassion Pledge:** 75% of all donor contributions are directly utilized for humanitarian relief (hot meals for the poor, food & medical treatment for stray dogs, and winter blankets for homeless families), with 25% sustaining server infrastructure.

---

## 2. Technology Stack & Core Dependencies

| Layer | Technologies Used | Description / Purpose |
|---|---|---|
| **Framework** | Next.js 14.2 (App Router) | Server-side rendering, static generation, API routes |
| **Language** | TypeScript 5 | End-to-end type safety |
| **UI & Styling** | React 18, Tailwind CSS 3, Vanilla CSS (`app/globals.css`) | Custom dark theme, glassmorphic accents, high-DPI icons |
| **Icons** | Lucide React (`lucide-react`) | Consistent iconography throughout the app |
| **Search Engine** | Fuse.js (`fuse.js`) | Client-side fuzzy search over precomputed category boxes |
| **Data Storage** | Local JSON files & in-memory store (`lib/db/`) | High-speed static data serving without database overhead |
| **Monetization** | Adsterra, Monetag, AdsCore | Managed programmatic ads with strict route filtering |
| **Hosting** | Vercel | Edge routing, custom headers, PWA support |

---

## 3. Directory Layout & File Organization

```
freewebstuff/
├── app/                                 # Next.js 14 App Router
│   ├── layout.tsx                       # Root layout (fonts, metadata, schema, AdScripts, MonetagGuardian)
│   ├── page.tsx                         # Landing page (hero, quick filters, category grid, banner)
│   ├── globals.css                      # Master CSS styles, theme variables, custom scrollbars
│   ├── categories/                      # Category browse views
│   │   └── [slug]/page.tsx              # Dynamic category page (renders CategoryView with extracted boxes)
│   ├── search/                          # Full-page fuzzy search interface
│   ├── support/ & donate/               # Support & donation portal (STRICTLY 100% AD-FREE)
│   │   ├── support/page.tsx             # Aliases /donate
│   │   └── donate/page.tsx              # Ko-fi, PayPal, crypto wallets, and Wall of Honor
│   ├── admin/ & shobhitadmin/           # Protected admin dashboard (JWT authentication)
│   ├── submit/                          # Community resource submission form
│   ├── report/                          # Broken link / malicious site reporting form
│   ├── trending/                        # Trending and popular resources
│   ├── new/                             # Recently added tools
│   ├── bookmarks/                       # Client-side local bookmark manager
│   ├── collections/                     # Curated themed collections
│   ├── guidelines/, privacy/, terms/    # Legal, policy, and contributor guidelines
│   └── api/                             # Backend API handlers
│       ├── search/                      # Search endpoint
│       ├── supporters/                  # Wall of honor / live top supporters endpoint
│       ├── submit/ & report/            # User submissions and issue reports
│       ├── live-users/                  # Real-time concurrent visitor tracker
│       └── admin/                       # Admin auth, customizations, and moderation APIs
│
├── components/                          # Modular React Components
│   ├── layout/                          # Layout shells
│   │   ├── ClientLayout.tsx             # Handles Header, Footer, and conditional AdsterraBanner
│   │   ├── Header.tsx                   # Top navigation bar, search shortcut, category links
│   │   └── Footer.tsx                   # Global site footer, legal links, community links
│   ├── ads/                             # Monetization & Ad Orchestration
│   │   ├── AdScripts.tsx                # Client script loader (disables ads on /support, /donate, /admin)
│   │   ├── AdsterraBanner.tsx           # Lazy-loaded, high-viewability banner (suppressed on support/admin)
│   │   └── MonetagGuardian.tsx          # Popunder frequency capping & ad-free route protection
│   ├── categories/                      # Category presentation components
│   │   ├── CategoryView.tsx             # Interactive subcategory switcher, quick jump pills, box cards
│   │   └── CategoryGrid.tsx             # Homepage category grid with tool counts and accent styling
│   ├── resources/                       # Individual resource cards and lists
│   │   ├── ResourceCard.tsx             # Card with tags, safety badges, visit link, copy link, bookmarking
│   │   └── ResourceList.tsx             # List layout for resources
│   └── admin/                           # Admin dashboard components
│       └── AdminDashboardClient.tsx     # Submissions, reports, top supporters, site config panel
│
├── lib/                                 # Core Utilities & Business Logic
│   ├── types.ts                         # Master TypeScript interfaces (Category, Resource, TopSupporter, etc.)
│   ├── categories/
│   │   ├── boxExtractor.ts              # Parses category sections into clean, typed UI boxes
│   │   └── serverBoxLoader.ts           # Server-side box file loader
│   ├── config/
│   │   └── donationConfig.ts            # Payment handles (Ko-fi, PayPal, crypto, tiers, perks)
│   ├── db/
│   │   ├── allCategorySections.json     # Master category dataset with full sections and items
│   │   ├── categories.ts                # Category registry, metadata, slugs, and icon mapping
│   │   ├── siteConfig.ts                # Site configuration and TopSupporter model
│   │   ├── siteCustomizations.json      # Dynamic admin settings and Wall of Honor list
│   │   └── store.ts                     # In-memory storage for reports, submissions, and bookmarks
│   ├── rateLimit.ts                     # API rate limiter for submissions and reports
│   └── seo/schema.ts                    # Structured JSON-LD schema generators for SEO
│
├── public/                              # Static Assets
│   ├── data/
│   │   ├── all-categories-boxes.json    # Precompiled category boxes for instant client rendering
│   │   └── site-health.json             # Link scanner status and health check results
│   ├── logo.png, favicon.png            # Official branding icons
│   └── sw.js                            # PWA Service Worker
│
└── scripts/                             # Automation & Maintenance Scripts
    ├── daily-health-check.mjs           # Automated daily link health verification bot
    └── importAllFmhyCategories.js       # Script to import / synchronize FMHY datasets
```

---

## 4. Key Architectural Patterns & Data Flow

### A. How Categories & Resources Are Rendered
1. Raw categories originate from structured datasets (`lib/db/allCategorySections.json`).
2. `lib/categories/boxExtractor.ts` parses headings, subheadings, and links into strongly typed **Boxes** (`TypedBox`).
3. For maximum client speed, `public/data/all-categories-boxes.json` contains pre-extracted boxes.
4. When a user opens `/categories/[slug]`, `CategoryView.tsx` renders subcategory selector pills, fuzzy in-category search, and responsive cards (`ResourceCard.tsx`).

### B. Fuzzy Search System
- Handled via `fuse.js`.
- Upon entering queries in `/search` or the category search bar, Fuse searches across title, description, tags, and URLs.
- Results display safety verification badges, platform pills (Web, Windows, Android, etc.), and direct external links.

### C. Automated Health Check Bot
- Run with `npm run check:sites` (`scripts/daily-health-check.mjs`).
- Periodically crawls indexed URLs with HEAD/GET requests, detects dead mirrors, 404s, or domain expirations, and saves logs into `public/data/site-health.json`.

---

## 5. Monetization & Ad Rules (CRITICAL POLICY)

The platform relies on programmatic advertising to pay for server bandwidth, edge caching, and domain costs. However, **user trust and donor dignity are paramount**.

### Strict Ad-Free Zones (ZERO ADS ALLOWED):
1. **Support & Donation Pages (`/support`, `/donate`):**
   - When users are learning how to back the project or making a donation, **NO banner ads, NO script tags, and NO popunders are allowed**.
   - Backed by:
     - `components/ads/AdScripts.tsx`: Completely skips loading AdsCore, Monetag, and Adsterra scripts on support routes.
     - `components/ads/AdsterraBanner.tsx`: Returns `null` on `/support` and `/donate`.
     - `components/layout/ClientLayout.tsx`: Suppresses the global `<AdsterraBanner />` when on support routes.
     - `components/ads/MonetagGuardian.tsx`: Blocks all third-party popunders, removes floating ad DOM nodes, and only permits whitelisted donor destinations (Ko-fi, PayPal, Buy Me a Coffee, Telegram, Discord, QR code servers).
2. **Admin Dashboards (`/admin`, `/shobhitadmin`):**
   - 100% ad-free environment for content moderation and site administration.

### General Ad Implementation (Allowed on Index, Search, and Category Pages):
- **High-Viewability Banner:** `components/ads/AdsterraBanner.tsx` uses an `IntersectionObserver` to trigger only when the user scrolls near the element, achieving >85% DSP viewability scores without layout shifts (CLS = 0).
- **Popunder Orchestrator:** `components/ads/MonetagGuardian.tsx` enforces frequency caps (maximum 8 impressions per 24 hours, minimum 45 seconds between popunders) and intercepts `window.open` to prevent intrusive spam loops.

---

## 6. Admin Panel & Moderation System

- **Routes:** `/shobhitadmin` (and `/admin`)
- **Authentication:** Protected with JSON Web Tokens (JWT).
- **Environment Variables Required (`.env.local`):**
  - `ADMIN_USERNAME`: Master admin username
  - `ADMIN_PASSWORD`: Master admin password
  - `ADMIN_JWT_SECRET`: Random 32+ character key for signing authentication tokens
- **Capabilities:**
  - Review and approve/reject user tool submissions.
  - Review and resolve broken link / malware reports.
  - Manage the **Wall of Honor (Top Supporters)** list displayed on `/donate` and `/support`.
  - Update dynamic site customization settings stored in `lib/db/siteCustomizations.json`.

---

## 7. Development Guidelines for Future AI Assistants & Engineers

When you are asked to make modifications to this codebase, follow these rules:

1. **Preserve Category & Box Extraction:**
   - Always verify that changes to `CategoryView.tsx` or `boxExtractor.ts` do not break existing category routes.
2. **Respect the Ad Policy:**
   - Never inject ad components or scripts into `/support`, `/donate`, or admin routes.
   - If introducing new ad units, always route them through `components/ads/` and ensure route guards exist.
3. **Maintain Visual Excellence:**
   - Adhere to the established sleek dark theme (`#090B0E` / `#0B0C0E` background with `#111317` cards, subtle borders `#22252C`, and `#EDEDEE` high-contrast typography).
   - Use Lucide icons and Tailwind utility classes consistently.
4. **Type Safety & Builds:**
   - Ensure all new components and functions have proper TypeScript types in `lib/types.ts`.
   - Validate with `npx tsc --noEmit` before concluding work.

---

## 8. Common Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Create optimized production build
npm run build

# Start production server
npm run start

# Run daily health check on external resource links
npm run check:sites

# Run link health check and auto-update sources
npm run check:sites:update
```

---

*This brain file was generated to serve as an instant, infallible guide for any AI coding assistant or developer working on the FreeWebStuff project.*
