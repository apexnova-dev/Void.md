# Documentation summary — April 2026

This file replaces the January 2026 “documentation update summary” as a **lightweight maintenance index**. For the full map of files, see **[`docs/README.md`](README.md)**.

---

## Canonical sources (truth order)

1. **[`CHANGELOG.md`](../CHANGELOG.md)** — released versions and notable changes  
2. **[`README.md`](../README.md)** — user-facing overview and quick start  
3. **[`docs/AI_WORKFLOW.md`](AI_WORKFLOW.md)** — markdown task protocol (column IDs, task shape, archives)  
4. **[`docs/architecture/ARCHITECTURE_OVERVIEW_v1.3.1.md`](architecture/ARCHITECTURE_OVERVIEW_v1.3.1.md)** — what is implemented in `void.html` vs specified for later  

---

## What changed in the 2026-04 documentation pass

- **[`docs/README.md`](README.md)** — structured index (audience-based), links to architecture, templates, core package, and AI workflow.  
- **[`docs/DOCUMENTATION_SUMMARY.md`](DOCUMENTATION_SUMMARY.md)** (this file) — refreshed; older January metrics and “v1.1.1 complete” narrative are **obsolete**.  
- **[`README.md`](../README.md)** — documentation map and current version line in the roadmap.  
- **[`core-package/AI_GUIDE.md`](../core-package/AI_GUIDE.md)** — column `Name (id)` requirement and checklist (aligned with `AI_WORKFLOW.md`).  
- **[`core-package/HOW-TO-RUN.md`](../core-package/HOW-TO-RUN.md)** — troubleshooting for empty Kanban when column IDs are missing.  

---

## Ongoing maintenance

| Task | Frequency |
|------|-----------|
| After a release | Update `CHANGELOG.md`, README roadmap “Current” version, and this index if doc layout changed |
| When `void.html` behavior changes | Update `ARCHITECTURE_OVERVIEW` supplement or section, and `AGENTS.md` if tests/commands change |
| When AI markdown rules change | Edit **`docs/AI_WORKFLOW.md`** first, then shorten **`core-package/AI_GUIDE.md`** to match |

---

## Superseded or historical

- **[`DOCUMENTATION_UPDATE_PLAN.md`](DOCUMENTATION_UPDATE_PLAN.md)** — planning checklist from an earlier cycle; do not treat as current tasks without re-validating against `void.html`.  
- **`DOCUMENTATION_SUMMARY.md` (January 2026)** — archived narrative; use this April 2026 file instead.  

---

*Last reviewed: 2026-04-07*
