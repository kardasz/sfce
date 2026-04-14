# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SFCE (Symfony Framework Certification Exam) is a static study guide for the Symfony 7.0 certification exam. It's an Astro 6 site styled with Tailwind CSS 4, deployed to GitHub Pages at `kardasz.github.io/sfce`.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (output: `dist/`)
- `npm run preview` — preview production build locally

No test runner or linter is configured.

## Architecture

**Data-driven static site**: All certification content lives in `src/data/topics.json` — a flat array of `Topic` objects (defined in `src/types.ts`), each containing chapters with references (links to Symfony/PHP docs). Pages are statically generated from this JSON at build time.

**Routing**: Two pages — `src/pages/index.astro` (topic grid) and `src/pages/topics/[slug].astro` (topic detail via `getStaticPaths`).

**Progress tracking**: Client-side only via `localStorage`. Each reference has a UUID `id`; checking a reference stores `localStorage[id] = 'true'`. Progress bars update via inline `<script>` blocks using `data-*` attributes — no framework JS, no hydration.

**Layout**: Single `Layout.astro` wrapping all pages with `Header`, `Sidebar` (topic nav with per-topic progress), and `Footer`. Dark mode via `dark` class on `<html>`, cycled through system/light/dark.

**Deployment**: GitHub Actions workflow (`.github/workflows/pages.yml`) triggers on `v*` tags, builds with `npm ci && npm run build`, deploys to GitHub Pages. Base path is `/sfce` (configured in `astro.config.mjs`).
