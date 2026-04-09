# AI Quick Reference — Void.md Task Format

> **Local-first Kanban** | Data stays on your disk | Open `void.html` in browser

---

## 1. Task Format Template

```markdown
### TASK-XXX | Task title

**Priority**: Value | **Category**: Value | **Assigned**: @user1, @user2
**Created**: YYYY-MM-DD | **Started**: YYYY-MM-DD | **Due**: YYYY-MM-DD | **Finished**: YYYY-MM-DD
**Author**: Name | **Session**: session_id | **AI Version**: model
**Tags**: #tag1 #tag2

Description text here. NO ## or ### inside.

**Subtasks**:
- [ ] First subtask
- [x] Completed subtask

**Notes**:
Additional notes.

**Result**:
What was done.

**Modified files**:
- filename.js (lines 10-25)
```

---

## 2. Required Fields Checklist

| Field | Required | Notes |
|-------|----------|-------|
| `### TASK-XXX \|` | ✅ Yes | Must be unique |
| `**Priority**:` | ✅ Yes | Critical/High/Medium/Low |
| `**Category**:` | ✅ Yes | Frontend/Backend/DevOps/etc |
| `**Created**:` | ✅ Yes | YYYY-MM-DD format |
| `**Author**:` | ✅ Yes | Human name or AI identity |
| `**Session**:` | ⚠️ AI only | For AI sessions: `ses_timestamp` |
| `**AI Version**:` | ⚠️ AI only | Model version |
| `**Assigned**:` | Optional | @username |
| `**Tags**:` | Optional | #hashtag format |

---

## 3. Forbidden Patterns

| ❌ DON'T DO | ✅ DO INSTEAD |
|------------|---------------|
| `## Heading` inside task | Use `**Bold:**` for subsections |
| `### Heading` inside task | Use `**Subtasks**:`, `**Notes**:` |
| `**Subtasks**` (no colon) | `**Subtasks**:` (with colon) |
| Create task without ID | Always use `TASK-XXX` format |
| Code without creating task | Create task first in "To Do" |
| Archive without user request | Leave in "Done" column |

**Why?** The HTML parser (`void.html`) treats `##` / `###` as structure delimiters, not task content.

---

## 4. Column ID Format (CRITICAL)

**Columns line must use this format:**

```markdown
**Columns**: 📝 To Do (todo) | 🚀 In Progress (in-progress) | 👀 Review (review) | ✅ Done (done)
```

**Rules:**
- Each column: `Emoji Name (column-id)`
- Text before `(...)` must match `##` heading **exactly**
- Use `|` to separate columns
- Keep the `---` separator after Configuration block

**What breaks the board:**
- Missing `(id)` → columns don't parse, board looks empty
- Mismatched `##` heading vs column text → tasks in wrong column

---

## 5. Example: Minimal Task

```markdown
### TASK-001 | Fix login bug

**Priority**: Critical | **Category**: Backend
**Created**: 2025-04-09 | **Author**: Claude Code
**Tags**: #bug

Users cannot log in. Error 500 in server logs.

**Notes**:
Investigating Redis connection from yesterday's deployment.
```

---

## 6. Example: Complete Task

```markdown
### TASK-042 | Notification system

**Priority**: High | **Category**: Backend | **Assigned**: @alice
**Created**: 2025-04-01 | **Started**: 2025-04-02 | **Finished**: 2025-04-05
**Author**: Claude Code | **Session**: ses_123456 | **AI Version**: claude-3-sonnet
**Tags**: #feature #websocket

Real-time notifications with WebSockets.

**Subtasks**:
- [x] Setup WebSocket server
- [x] REST API endpoints
- [x] Email notifications
- [x] E2E tests

**Result**:
✅ Functional notification system with Socket.io and SendGrid.

**Modified files**:
- src/websocket/server.js (lines 1-150)
- src/api/notifications.js (lines 20-85)

**Tests performed**:
- ✅ 100 concurrent connections
- ✅ Auto-reconnection
- ✅ Email delivery < 2s
```

---

## 7. Golden Rules

1. **Create task BEFORE coding** — always start with task in "To Do"
2. **Unique TASK-XXX ID** — never reuse, increment sequentially
3. **No ## or ### inside tasks** — breaks the HTML parser
4. **Document real work only** — don't fabricate Results or Modified files
5. **Stay in Done** — archive only when user explicitly requests it

---

**Quick Command Reference:**

| Action | Command |
|--------|---------|
| Plan | "Plan [feature]" |
| Start work | "Do TASK-XXX" |
| Status | "Where are we?" |
| Archive | "Archive completed tasks" (user request only) |

**Files:** `kanban.md` (active) | `archive.md` (archived)
