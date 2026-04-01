# Void.md — agent handshake

**Protocol source:** [`AI_WORKFLOW.md`](AI_WORKFLOW.md) — master rules for task shape, TASK-XXX IDs, and markdown integrity.

**Product:** Void.md — local-first Kanban over Markdown (`kanban.md`, `archive.md`). **No cloud:** data stays on disk you choose.

**Maintain local grid integrity:**

- Preserve **H1** project title, **H2** column sections, and **H3** task headings (`### TASK-XXX | …`) so `void.html` can parse the board.
- When in doubt, read `AI_WORKFLOW.md` before editing task files.

For developer build/test conventions, see [`AGENTS.md`](AGENTS.md).
