# Void.md — documentation index

This folder holds **technical and process documentation** for the repository. The **primary user-facing** entry point is the root [`README.md`](../README.md).

**Current app version:** see [`CHANGELOG.md`](../CHANGELOG.md) (the `void.html` header badge should match the latest numbered release).

---

## Start here

| Audience | Document | Purpose |
|----------|----------|---------|
| **Everyone** | [`README.md`](../README.md) | Install, features, `kanban.md` format overview |
| **AI assistants & editors** | [`AI_WORKFLOW.md`](AI_WORKFLOW.md) | **Canonical** task shape, column IDs, archive rules (root [`AI_WORKFLOW.md`](../AI_WORKFLOW.md) points here) |
| **Developers / agents** | [`AGENTS.md`](../AGENTS.md) | Tests in browser, code style, modal/header behavior |
| **Portable zip / minimal copy** | [`../core-package/AI_GUIDE.md`](../core-package/AI_GUIDE.md) | Short markdown contract; full protocol still in `AI_WORKFLOW.md` |

---

## Configuration and data files

| Topic | Document |
|-------|----------|
| **`kanban.md` column IDs** | [`AI_WORKFLOW.md`](AI_WORKFLOW.md) — each column on `**Columns**:` must be `Emoji Name (id)` or the board may not show tasks correctly |
| **Templates** | [`templates/kanban.md`](templates/kanban.md), [`templates/archive.md`](templates/archive.md) |
| **Examples** | [`examples/`](examples/), [`examples/FORMAT.md`](examples/FORMAT.md) |

---

## Architecture and implementation

| Doc | Notes |
|-----|--------|
| [`architecture/ARCHITECTURE_OVERVIEW_v1.3.1.md`](architecture/ARCHITECTURE_OVERVIEW_v1.3.1.md) | **Authoritative** implemented vs planned (filename kept for stable links; see supplement for v1.3.2 in same file) |
| [`architecture/PHASE2_IMPLEMENTATION_SUMMARY.md`](architecture/PHASE2_IMPLEMENTATION_SUMMARY.md) | Tiptap / rich text Notes |
| [`architecture/core-concepts.md`](architecture/core-concepts.md), [`architecture/data-models.md`](architecture/data-models.md), [`architecture/editor-standards.md`](architecture/editor-standards.md) | Mix of **implemented** (e.g. rich text) and **planned** (threaded comments) — read overview first |
| [`architecture/tests/unit-tests.js`](architecture/tests/unit-tests.js), [`phase2-tests.js`](architecture/tests/phase2-tests.js) | Browser-console tests (see `AGENTS.md`) |

> Many files under `architecture/` labeled **v1.2.0** describe a **comments system specification** that is **not** shipped in the current app. Treat [`ARCHITECTURE_OVERVIEW_v1.3.1.md`](architecture/ARCHITECTURE_OVERVIEW_v1.3.1.md) as the gate for what exists in `void.html`.

---

## Publishing the client (static hosting)

| Doc | Purpose |
|-----|---------|
| [`github-pages.md`](github-pages.md) | GitHub Pages: one site, `production` / `core` / `experimental` subfolders (`.github/workflows/github-pages.yml`) |

## UI / UX and product process

| Doc | Purpose |
|-----|---------|
| [`UI_UX_RECOMMENDATIONS.md`](UI_UX_RECOMMENDATIONS.md) | Header, modals, filter bar (largely implemented) |
| [`EXPERIMENTAL_FEATURES_ASSESSMENT.md`](EXPERIMENTAL_FEATURES_ASSESSMENT.md) | Feature flags (rich text, comments, slash commands, etc.) |
| [`BRANCHING_AND_BUGFIX_WORKFLOW.md`](BRANCHING_AND_BUGFIX_WORKFLOW.md) | Git workflow |
| [`BRANCH_MANAGEMENT.md`](../BRANCH_MANAGEMENT.md) | Branch naming and version suffixes (`-core`, `-exp`) |

---

## Historical and session notes

| Location | Purpose |
|----------|---------|
| [`changelog/SESSION_DOCUMENTATION_2026-03-17.md`](changelog/SESSION_DOCUMENTATION_2026-03-17.md) | Session log |
| [`DOCUMENTATION_SUMMARY.md`](DOCUMENTATION_SUMMARY.md) | High-level documentation maintenance summary (April 2026) |
| [`DOCUMENTATION_UPDATE_PLAN.md`](DOCUMENTATION_UPDATE_PLAN.md) | Older checklist — see notice at top of file |
| [`../archive/historical-versions/`](../archive/historical-versions/) | Archived release notes and milestones |

---

## Core package (standalone folder)

The [`../core-package/`](../core-package/) directory is a **minimal distribution**: `void.html`, templates, `HOW-TO-RUN.md`, `AI_GUIDE.md`. It is intended to track the **`core`** branch intent (stable Kanban). Updating procedure: [`core-package/HOW-TO-RUN.md`](../core-package/HOW-TO-RUN.md) (“Updating this package”).

---

## Conventions

- **Void.md** is the product name; legacy “Markdown Task Manager” may still appear in old paths or screenshots.
- **Single-file app:** behavior lives in [`void.html`](../void.html) (mirrored under `core-package/`).
- **AI edits to `kanban.md`:** always preserve column `**Columns**:` lines with `Name (id)` segments matching `##` headings — see [`AI_WORKFLOW.md`](AI_WORKFLOW.md).
