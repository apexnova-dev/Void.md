# Documentation

## Quick reference

| Doc | Purpose |
|-----|--------|
| [UI_UX_RECOMMENDATIONS.md](UI_UX_RECOMMENDATIONS.md) | Header, modals, filter bar UX (mostly implemented) |
| [EXPERIMENTAL_FEATURES_ASSESSMENT.md](EXPERIMENTAL_FEATURES_ASSESSMENT.md) | Rich text, comments, slash commands, performance logging |
| [architecture/](architecture/) | Architecture specs, tests, data models, editor standards |
| [templates/](templates/) | Example `kanban.md` and `archive.md` |
| [examples/](examples/) | Sample files and FORMAT.md |

## Current Architecture (v1.3.1)

- **[architecture/ARCHITECTURE_OVERVIEW_v1.3.1.md](architecture/ARCHITECTURE_OVERVIEW_v1.3.1.md)** - **Authoritative overview** of implemented vs. planned features
- **[architecture/PHASE2_IMPLEMENTATION_SUMMARY.md](architecture/PHASE2_IMPLEMENTATION_SUMMARY.md)** - Tiptap implementation details
- **[architecture/editor-standards.md](architecture/editor-standards.md)** - Partial: Tiptap implemented, slash commands planned

> ⚠️ **Important**: Many architecture docs describe the v1.2.0 comments system **specification** which is NOT yet implemented. See the architecture overview for clarity.

## Architecture and tests

- **Tests:** `architecture/tests/unit-tests.js`, `architecture/tests/phase2-tests.js` (run from browser console; see [AGENTS.md](../AGENTS.md)).
- **Concepts:** `architecture/core-concepts.md`, `architecture/data-models.md`, `architecture/editor-standards.md`.
  - Note: These describe planned features (comments, slash commands) that are NOT yet implemented in v1.3.1.

## Root-level docs (repository root)

- **CHANGELOG.md** – Version history.
- **AGENTS.md** – Build/test commands and code style for AI assistants.
- **AI_WORKFLOW.md** – Task format and workflow.
- **README.md** – User-facing project overview.

## Internal and historical

- **internal/** – Session notes and legacy project copies; safe to archive.
- One-off docs (e.g. `FIXES-SUMMARY.md`, `HEADER-CLEANUP.md`, `DOCUMENTATION_UPDATE_PLAN.md`) are historical; refer to **CHANGELOG.md** and **README.md** for current state.
