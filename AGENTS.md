# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is **Gatsblog** — a Gatsby.js v2 static blog system. It generates a static website from MDX/Markdown content files in `/content/`.

### Node.js version

The project requires **Node.js v11.10.0** (specified in `.nvmrc`). Use `nvm use` to activate the correct version before running any commands. All npm/node commands must be run under this version — newer Node versions are incompatible with `node-sass@4.11.0` and other native dependencies.

### Key commands

All available scripts are in `package.json`. Key ones:

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Dev server (port 8000) | `npm run develop` |
| Lint (ESLint + Stylelint) | `npm run lint` |
| Tests (Jest) | `npm test` |
| Build | `npm run build` |

### Content and submodule requirement

The blog posts live in `content/_posts/` which is a **git submodule** pointing to `https://github.com/WeZZard/MyWorks.git`. You must initialize it before the dev server will work:

```
git submodule update --init content/_posts
```

Without initialized posts, all pages fail with GraphQL compilation errors (`Unknown field 'allPost'`, `Unknown field 'allCategory'`), because the Post/Category/Tag GraphQL types are only created when post content exists.

Posts follow the naming pattern `YYYY-MM-DD-post-name.md` (or `.mdx`). The `isPublished` frontmatter field uses strict string comparison — omit it entirely (defaults to published) or use the string `"true"` in quotes. Boolean `true` in YAML will NOT work due to the comparison logic in `core/on-create-node/on-create-mdx-documents.js`.

### Pre-existing lint issues

ESLint and Stylelint report pre-existing formatting errors (mostly Prettier-related). These are in the original codebase and are not regressions.

### Starting the dev server

```
source ~/.nvm/nvm.sh && nvm use 11.10.0
npm run develop
```

The dev server runs on `0.0.0.0:8000` with hot reload. It clears `.cache` before starting (via the `clear_cache` script).
