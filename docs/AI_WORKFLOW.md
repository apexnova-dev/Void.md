# Void.md — Markdown Task Protocol (AI)

> **Local-first Kanban** with Neon City soul (dark theme, cyan/magenta accents).

**Data sovereignty:** No cloud — your Markdown files are the source of truth. **Void.md** is the local-first Kanban; open **`void.html`** in a supported browser to edit the same files live.

This file is the **master protocol** for all AI assistants (Claude, ChatGPT, Copilot, Gemini, Cursor, etc.) working with `kanban.md` and `archive.md`.

### Kanban structure (`kanban.md`)

| Level | Role |
|-------|------|
| `#` H1 | Project / board title |
| `##` H2 | Column sections (Kanban columns) |
| `###` H3 | Tasks: `### TASK-XXX \| Title` (see template below) |

**TASK-XXX IDs** must stay unique and sequential per project rules (e.g. TASK-001, TASK-002).

**Column IDs (required for a working board):** On the `**Columns**:` line, each column must use `Emoji Name (column-id)`, separated by `|`. Example: `📝 To Do (todo) | 🚀 In Progress (in-progress)`. The text before `(…)` must match each column’s `##` heading exactly. If IDs are omitted, Void.md cannot parse columns and falls back to default names (`📝 To Do`, etc.); your `##` section titles then no longer match, tasks parse into the wrong place or the board looks empty. Keep the `---` line after the Configuration block so the app reads columns, categories, and tags reliably.

### Metadata keys

Tasks use **Priority**, **Category**, **Assigned**, **Tags**, and the date/author fields in the template below. Optional fields follow the same line format.

### Archive

Finished work may move to **`archive.md`** under user direction; see **Archiving** in Workflow. The app does not silently delete tasks from disk.

---

## 📋 Strict Task Format

### Mandatory Template

```markdown
### TASK-XXX | Task title

**Priority**: [Value] | **Category**: [Value] | **Assigned**: @user1, @user2
**Created**: YYYY-MM-DD | **Started**: YYYY-MM-DD | **Due**: YYYY-MM-DD | **Finished**: YYYY-MM-DD
**Author**: [Name/AI] | **Session**: [Session ID] | **AI Version**: [Model if applicable]
**Tags**: #tag1 #tag2 #tag3

Free text description. **NO `##` or `###` headings allowed**.

**Subtasks**:
- [ ] First subtask
- [x] Completed subtask

**Notes**:
Additional notes with subsections `**Title**:`.

**Result**:
What was done.

**Modified files**:
- file.js (lines 42-58)
```

### Fields

**REQUIRED**: `### TASK-XXX |`, `**Priority**:`, `**Category**:`, `**Created**:`, `**Author**:`

**STRONGLY RECOMMENDED**: `**Session**:` (for AI sessions) or `**Author**:` for humans

**OPTIONAL**: `**Assigned**:`, `**Started**:`, `**Due**:`, `**Finished**:`, `**AI Version**:`, `**Tags**:`, Description, `**Subtasks**:`, `**Notes**:`

### Author Tracking Fields

| Field | Format | When to Use | Examples |
|-------|--------|-------------|----------|
| `**Author**:` | Human name or AI identity | ALWAYS | `John Doe`, `Claude Code`, `ChatGPT-4` |
| `**Session**:` | Session identifier | AI sessions | `ses_abc123`, `cli_20240115_001` |
| `**AI Version**:` | Model/version | AI tasks only | `claude-3-sonnet`, `gpt-4-turbo` |

### ❌ FORBIDDEN

- `## Title` or `### Title` inside a task
- `**Subtasks**` or `**Notes**` without `:`

**Why?** Void.md (`void.html`) does not treat `##` / `###` inside a task body as structure — keep task text free of inner headings.

### ✅ Integrity rule

**Only document work that was actually performed.** Do not invent or fabricate:

- **Result**: Write only what was really done.
- **Modified files**: List only files that were actually changed (with real line ranges if applicable).
- **Tests performed**: Describe only tests that were actually run.

Fabricated notes undermine trust and make the audit trail meaningless.

---

## 🔄 Workflow

### 1. New request

1. Create task in `kanban.md` → "📝 To Do"
2. Unique ID (TASK-XXX) auto-incremented
3. Add author tracking information:
   - Humans: `**Author**:` with name
   - AI: `**Author**:` + `**Session**:` + optional `**AI Version**:`
4. Break down into subtasks if needed

### 2. Start work

1. Move → "🚀 In Progress"
2. Add `**Started**: YYYY-MM-DD`
3. Check off subtasks progressively

### 3. Finish work

1. Move → "✅ Done"
2. Add `**Finished**: YYYY-MM-DD`
3. Document in `**Notes**:`:
   - `**Result**:` - What was done
   - `**Modified files**:` - List with lines
   - `**Technical decisions**:` - Choices made
   - `**Tests performed**:` - Validated tests

### 4. Archiving

**⚠️ Tasks are NOT archived immediately!**

- Completed tasks remain in "✅ Done"
- **Only on user request** → move to `archive.md` section `## ✅ Archives`
- **Never archive directly at the end of work**

---

### Core vs Full App

The same `void.html` may contain **experimental features** (rich text editor, comments, slash commands). These are **disabled by default** in the core experience:

| Mode | Features | How Enabled |
|------|----------|-------------|
| **Core** | Kanban, task CRUD, filters, archives, multi-project, themes, language | Default (out of box) |
| **Experimental** | Rich text (Tiptap), comments, slash commands | User enables in Settings |

The `core-package/` folder provides the portable core-only version. For this AI guide, treat the **default** experience as "core" — optional flags are **off** unless the user explicitly enables them.

> **Note:** If working with just the portable `core-package/` folder (no full repo), see `AI_GUIDE.md` in that folder for a concise version of this guide.

---

## 📝 Examples

### Simple Task (Human Created)

```markdown
### TASK-001 | Fix login bug

**Priority**: Critical | **Category**: Backend | **Assigned**: @bob
**Created**: 2025-01-20 | **Due**: 2025-01-21
**Author**: John Doe
**Tags**: #bug #urgent

Users cannot log in. Error 500 in logs.

**Notes**:
Check Redis, related to yesterday's deployment.
```

### Simple Task (AI Created)

```markdown
### TASK-001 | Fix login bug

**Priority**: Critical | **Category**: Backend | **Assigned**: @bob
**Created**: 2025-01-20 | **Due**: 2025-01-21
**Author**: Claude Code | **Session**: ses_abc123 | **AI Version**: claude-3-sonnet
**Tags**: #bug #urgent

Users cannot log in. Error 500 in logs.

**Notes**:
Check Redis, related to yesterday's deployment.
```

### Complete Task (Human Created)

```markdown
### TASK-042 | Notification system

**Priority**: High | **Category**: Backend | **Assigned**: @alice
**Created**: 2025-01-15 | **Started**: 2025-01-18 | **Finished**: 2025-01-22
**Author**: Sarah Chen
**Tags**: #feature

Real-time notifications with WebSockets.

**Subtasks**:
- [x] Setup WebSocket server
- [x] REST API
- [x] Email sending
- [x] Notifications UI
- [x] E2E tests

**Notes**:

**Result**:
✅ Functional system with WebSocket, REST API and emails.

**Modified files**:
- src/websocket/server.js (lines 1-150)
- src/api/notifications.js (lines 20-85)

**Technical decisions**:
- Socket.io for WebSockets
- SendGrid for emails
- 30-day history in MongoDB

**Tests performed**:
- ✅ 100 simultaneous connections
- ✅ Auto-reconnection
- ✅ Emails < 2s
```

### Complete Task (AI Created)

```markdown
### TASK-042 | Notification system

**Priority**: High | **Category**: Backend | **Assigned**: @alice
**Created**: 2025-01-15 | **Started**: 2025-01-18 | **Finished**: 2025-01-22
**Author**: Claude Code | **Session**: ses_def456 | **AI Version**: claude-3-sonnet
**Tags**: #feature

Real-time notifications with WebSockets.

**Subtasks**:
- [x] Setup WebSocket server
- [x] REST API
- [x] Email sending
- [x] Notifications UI
- [x] E2E tests

**Notes**:

**Result**:
✅ Functional system with WebSocket, REST API and emails.

**Modified files**:
- src/websocket/server.js (lines 1-150)
- src/api/notifications.js (lines 20-85)

**Technical decisions**:
- Socket.io for WebSockets
- SendGrid for emails
- 30-day history in MongoDB

**Tests performed**:
- ✅ 100 simultaneous connections
- ✅ Auto-reconnection
- ✅ Emails < 2s
```

---

## 🎯 Golden Rules

### ✅ ALWAYS

1. Create task BEFORE coding
2. Strict format (no `##` inside tasks)
3. Include author tracking (`**Author**:` required, `**Session**:` for AI)
4. Break down if complex
5. Real-time progress
6. Document result in `**Notes**:`
7. Reference tasks in commits (`TASK-XXX`)
8. Leave in "Done" (archive only on user request)

### ❌ NEVER

1. `## Title` in a task
2. Code without creating task
3. Forget to check off subtasks
4. Archive immediately (stay in "Done")
5. Forget to document the result

---

## 📦 File Structure

### kanban.md

**⚠️ ID comment format**: `<!-- Config: Last Task ID: XXX -->` (auto-incremented by application)

```markdown
# Kanban Board

<!-- Config: Last Task ID: 42 -->

## ⚙️ Configuration

**Columns**: 📝 To Do (todo) | 🚀 In Progress (in-progress) | 👀 Review (review) | ✅ Done (done)
**Categories**: Frontend, Backend, DevOps
**Users**: @alice, @bob
**Tags**: #bug, #feature, #docs

---

## 📝 To Do

### TASK-001 | Title
[...]

## 🚀 In Progress

## 👀 Review

## ✅ Done

### TASK-003 | Completed task
[...]
```

### archive.md

```markdown
# Task Archive

> Archived tasks

## ✅ Archives

### TASK-001 | Archived task
[... full content ...]

---

### TASK-002 | Another archived task
[... full content ...]
```

---

## 🔧 User Commands

```bash
# Planning
"Plan [feature]"
"Create roadmap for 3 months"

# Execution
"Do TASK-XXX"
"Continue TASK-XXX"

# Tracking
"Where are we?"
"Weekly status"

# Modifications
"Break down TASK-XXX"
"Add subtask to TASK-XXX"

# Search
"Search in archives: [keyword]"

# Maintenance
"Archive completed tasks"
```

---

## 📘 Git Integration

```bash
# Commits with reference
git commit -m "feat: Add feature (TASK-042 - 3/5)"
git commit -m "fix: Bug fix (TASK-001)"

# Branches
git checkout -b feature/TASK-042-notifications
```

---

## 🔍 Session Tracking & Audit Trail

### Why Session Tracking Matters

1. **Debugging broken code**: Trace back through AI sessions that introduced bugs
2. **Context recovery**: Understand decisions made in previous sessions
3. **Performance analysis**: Compare different AI models/sessions
4. **Accountability**: Know which AI/human made which changes
5. **Learning**: Identify patterns in successful vs problematic sessions

### Session ID Format

| Type | Format | Example | When to Use |
|------|--------|---------|-------------|
| **Claude Code** | `ses_[timestamp]` | `ses_1705123456` | CLI sessions |
| **Web Interface** | `web_[timestamp]_[random]` | `web_1705123456_abc` | Browser-based AI |
| **API/CLI** | `[tool]_[date]_[sequence]` | `openai_20240115_001` | API-based tools |
| **Human** | `human_[initials]_[date]` | `human_jd_20240115` | Manual creation |

### AI Version Tracking

| AI | Version Format | Example |
|----|----------------|---------|
| **Claude** | `claude-3-[model]` | `claude-3-sonnet`, `claude-3-haiku` |
| **GPT** | `gpt-[version]` | `gpt-4-turbo`, `gpt-3.5-turbo` |
| **Gemini** | `gemini-[version]` | `gemini-pro`, `gemini-advanced` |
| **Local Models** | `[name]-[version]` | `llama2-7b`, `mistral-7b` |

### Audit Trail Benefits

#### When Things Go Wrong

```bash
# Search for all tasks from problematic session
grep "Session: ses_1705123456" kanban.md

# Find what AI worked on when
grep "Author: Claude Code" kanban.md | grep "Session:"
```

#### When Things Go Right

```bash
# Find successful patterns from top-performing AI
grep "AI Version: claude-3-sonnet" kanban.md | grep -A5 "Result:"

# Track human vs AI productivity
grep -c "Author: human" kanban.md
grep -c "Author: Claude Code" kanban.md
```

#### Session Continuity

```markdown
### TASK-007 | Continue session ses_1705123456 work

**Priority**: Medium | **Category**: Maintenance
**Created**: 2025-01-16
**Author**: Claude Code | **Session**: ses_1705123456 | **AI Version**: claude-3-sonnet

Continuing work from previous session where we implemented notification system.
Previous session completed TASK-042.

**Notes**:
**Previous session context**:
- TASK-042: Notification system completed
- All tests passing
- Ready for deployment

**Next steps**:
- Deploy notification system
- Monitor performance
- Document API usage
```

---

## 📁 AI-Specific Configuration

Each AI has its own configuration file:

| AI Assistant | Configuration File | Location |
|--------------|-------------------|----------|
| **Claude** | `CLAUDE.md` | Project root |
| **GitHub Copilot** | `copilot-instructions.md` | `.github/` |
| **OpenAI CLI** | `OPENAI_CLI.md` | Project root |
| **ChatGPT** | `CHATGPT.md` or Custom GPT | Root or Web |
| **Gemini** | `GEMINI.md` or `instructions.md` | Root or `.gemini/` |
| **Qwen** | `QWEN.md` or `.qwenrc` | Project root |
| **Codeium / Windsurf** | `instructions.md` | `.windsurf/` or `.codeium/` |

**These files must:**

1. Reference this file `AI_WORKFLOW.md`
2. Be adapted to each AI's specifics
3. Remain minimalist (only a few lines)

### Minimal Template for AI Configuration File

```markdown
# 🤖 Instructions for [AI NAME]

## 📋 Task Management System

**Every action = One documented task in kanban.md**

## 📚 Complete Documentation

**⚠️ READ IMMEDIATELY**: `AI_WORKFLOW.md`

This file contains everything: format, workflow, commands, examples.

## ⚙️ Critical Rule #1

**NO `##` or `###` headings inside a task**
- Use `**Subtasks**:` and `**Notes**:` with colons
- Subsections: `**Result**:`, `**Modified files**:`

**Why?** The HTML parser does not recognize `##` inside tasks.

---

**Read `AI_WORKFLOW.md` now.**
```

---

## 🎓 First Use

### Initialization

On your first interaction with the AI:

```
"Read AI_WORKFLOW.md and use the task system"
```

The AI will automatically:

1. Read `AI_WORKFLOW.md`
2. Understand the complete format and workflow
3. Be ready to manage tasks according to defined rules

### Usage Examples

**Create a task:**

```
"Plan adding a real-time notification system"
```

**Work on a task:**

```
"Do TASK-007"
```

**Status update:**

```
"Where are we?"
```

**Archive:**

```
"Archive completed tasks"
```

---

**This guide ensures complete transparency and traceability of AI work.**
