# FreeWebStuff AI Agent Instructions & Workspace Rules

> **Note for AI Coding Assistants:**  
> Detailed architecture, file layout, and component maps are documented in [BRAIN.md](file:///t:/freeinternetstuff/BRAIN.md). Read [BRAIN.md](file:///t:/freeinternetstuff/BRAIN.md) first to get the complete picture of this project.

## Core Rules for This Workspace

1. **Project Mission:** FreeWebStuff (`freewebstuff.site`) is an independent directory indexing 20,000+ free web tools, open-source software, and educational vaults (inspired by FMHY).
2. **Strict Ad-Free Policy:**
   - **`/support` and `/donate` MUST REMAIN 100% AD-FREE.** No banners, no popunders, and no programmatic ad scripts.
   - Admin routes (`/admin`, `/shobhitadmin`) are also 100% ad-free.
   - Any ad-related code belongs exclusively in `components/ads/` (`AdScripts.tsx`, `AdsterraBanner.tsx`, `MonetagGuardian.tsx`).
3. **Data Integrity:**
   - Precomputed category boxes live in `public/data/all-categories-boxes.json` and `lib/db/allCategorySections.json`.
   - Never mutate or overwrite category extraction pipelines without testing `boxExtractor.ts` and `CategoryView.tsx`.
4. **Design & Aesthetics:**
   - Dark theme (`#0B0C0E` / `#111317` surface, `#22252C` border, `#EDEDEE` text).
   - Use Lucide React icons, Tailwind CSS, and keep layout shift (CLS) at zero.
