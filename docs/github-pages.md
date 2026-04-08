# GitHub Pages — hosting the Void.md client

Void.md is a **static client** (`void.html` + a few assets). GitHub Pages can serve it over **HTTPS** so others can open the app in a browser. **Task data** (`kanban.md`, `archive.md`) still lives in folders users pick on their machines; nothing is uploaded to GitHub by the app itself.

## One site, three branch builds

This repository’s workflow (`.github/workflows/github-pages.yml`) deploys **three subfolders** from branches **`production`**, **`core`**, and **`experimental`**:

| URL pattern | Branch |
|-------------|--------|
| `…/production/void.html` | `production` |
| `…/core/void.html` | `core` |
| `…/experimental/void.html` | `experimental` |

The site root lists all three: `…/index.html`.

If a branch does not exist or is missing a file, that folder may be empty or incomplete until the next successful deploy.

## Setup (once per repository)

1. Add **`.github/workflows/github-pages.yml`** and **`.github/pages-index.html`** to the repo. A push uses the workflow file **from that commit**, so merge these into **`production`**, **`core`**, and **`experimental`** if you want every branch push to deploy (or push once from a branch that contains them).
2. In GitHub: **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions** (not “Deploy from a branch” unless you prefer that older model).
4. Push to `production`, `core`, or `experimental`, or run the workflow manually (**Actions → Deploy GitHub Pages → Run workflow**).

After the first run, Pages shows the public URL (often `https://<user>.github.io/<repo>/`).

## Requirements

- **Browser:** Chromium-based (Chrome, Edge, Opera) for folder pick / File System Access API.
- **Assets:** The workflow copies `void.html`, `logo.svg`, and `favicon.svg` from each branch. Keep those paths stable on each branch.

## Private repositories

GitHub Pages for **private** repos is available on paid plans; on free accounts, Pages from a private repo may be restricted. Use a **public** repo for a free public client, or distribute `void.html` as a release asset instead.

## Alternatives

- **GitHub Releases:** Attach `void.html` or a `core-package` zip for download.
- **Any static host** (Netlify, Azure Static Web Apps, S3): upload the same files; same subfolder idea applies.

See also **[`BRANCH_MANAGEMENT.md`](../BRANCH_MANAGEMENT.md)** for branch roles.
