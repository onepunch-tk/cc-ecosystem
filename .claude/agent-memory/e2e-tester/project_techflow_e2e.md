---
name: TechFlow E2E Testing Context
description: Project type, dev server, component structure, and test patterns for TechFlow landing page E2E testing
type: project
---

Project is a React Router v7 (SSR enabled) app in the monorepo root. E2E tool is agent-browser with Chromium.

Dev server runs via `bun run dev` on localhost:5173. It was already running during first E2E session — check with `lsof -ti:5173` before starting.

Shell components (Phase 1) live under `app/presentation/components/`:
- `layout/Header.tsx` — fixed header, contains "TechFlow" text (no testID, use `header` CSS selector)
- `layout/Footer.tsx` — footer with "© 2026 TechFlow. All rights reserved."
- `sections/HeroSection.tsx` — `section#hero`, h1 "Hero Section"
- `sections/AboutSection.tsx` — `section#about`, h2 "About Section"
- `sections/ServicesSection.tsx` — `section#services`, h2 "Services Section"
- `sections/ContactSection.tsx` — `section#contact`, h2 "Contact Section"

Route: `app/presentation/routes/home.tsx` renders all sections.

agent-browser session flag `--session e2e-techflow` provides isolated reusable sessions. CSS id selectors (`#hero`, `#about`, etc.) work reliably for section targeting. Nav hidden at mobile viewport (375x667) — snapshot confirmed banner only shows "TechFlow" text without nav.

**Why:** Phase 2-3 will replace these placeholders; document now so future E2E runs know the selector contract.
**How to apply:** When Phase 2 components land, verify id attributes and heading text are preserved or update selectors accordingly.
