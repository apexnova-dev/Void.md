# 🤖 AI Instructions

This project uses **Void.md** — local-first Kanban over Markdown (`kanban.md`). No cloud.

📖 Full: [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md)

---

## ⭐ Key Rule

**Every code change = one task in kanban.md** (never code without a task)

---

## 📋 Required 5 Fields

- `### TASK-XXX |` — unique ID + title
- `**Priority**:` — Critical/High/Medium/Low
- `**Category**:` — Frontend/Backend/DevOps
- `**Created**:` — YYYY-MM-DD
- `**Author**:` — name (or AI + Session)

---

## ❌ Forbidden

1. `##`/`###` inside tasks — use `**Notes**:` instead
2. Code without creating task first
3. Fabricate results

---

## ✅ Example

```markdown
### TASK-001 | Add login

**Priority**: High | **Category**: Frontend
**Created**: 2025-04-09
**Author**: Claude Code | **Session**: ses_abc123

**Result**: Added button

**Modified files**:
- void.html (42-58)
```

## 🔧 Commits: `git commit -m "feat: (TASK-001)"`

*Archive only on user request.*