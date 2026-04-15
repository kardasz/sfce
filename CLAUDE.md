# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SFCE (Symfony Framework Certification Exam) is a static study guide for the Symfony certification exam, supporting versions 6.0, 7.0, and 8.0 (default). It's an Astro 6 site styled with Tailwind CSS 4, deployed to GitHub Pages with custom domain `sfcelearning.com`. Requires Node.js >= 22.12.0.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (output: `dist/`)
- `npm run preview` — preview production build locally

No test runner or linter is configured.

## Architecture

**Data-driven static site**: Certification content lives in versioned JSON files — `src/data/topics-6.json`, `src/data/topics-7.json`, `src/data/topics-8.json` — each a flat array of `Topic` objects (defined in `src/types.ts`), containing chapters with references (links to Symfony/PHP docs). `src/data/versions.ts` exports a `getTopics(version)` helper. `src/types.ts` also exports `SymfonyVersion`, `VERSIONS`, and `DEFAULT_VERSION`. Pages are statically generated from this data at build time.

**Routing**: Four page files:
- `src/pages/index.astro` — landing page with version cards and stats
- `src/pages/privacy.astro` — privacy policy
- `src/pages/[version]/index.astro` — version-specific topic grid
- `src/pages/[version]/topics/[slug].astro` — topic detail via `getStaticPaths`

**Progress tracking**: Client-side only via `localStorage`. Each reference has a UUID `id`; checking a reference stores `localStorage["sfce:{version}:{id}"] = 'true'`. Progress bars update via inline `<script>` blocks using `data-*` attributes — no framework JS, no hydration.

**Layouts and components**: Two layouts — `BaseLayout.astro` (landing/static pages) and `Layout.astro` (study pages with `Header`, `Sidebar`, and `Footer`). Seven components: `Header`, `Footer`, `Sidebar` (topic nav with version switcher and per-topic progress), `ThemeToggle`, `TopicCard`, `ChapterSection`, `ReferenceItem`. Dark mode via `dark` class on `<html>`, cycled through system/light/dark.

**Deployment**: GitHub Actions workflow (`.github/workflows/pages.yml`) triggers on `v*` tags or manual `workflow_dispatch`, builds with Node 24 (`npm ci && npm run build`), deploys to GitHub Pages. Base path is `/` (configured in `astro.config.mjs`; custom domain handles routing without repo-name prefix).
