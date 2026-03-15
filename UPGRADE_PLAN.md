# Upgrade Plan: Gatsby 5 + Node.js 24

This document outlines a phased plan to upgrade the blog from **Gatsby 2 / Node 11** to **Gatsby 5 / Node 24** without feature breaks or visual regressions.

---

## Current State

| Component | Current Version |
|---|---|
| Gatsby | ^2.1.27 |
| Node.js (.nvmrc) | v11.10.0 |
| React / ReactDOM | ^16.8.4 |
| MDX plugin | `gatsby-mdx` ^0.4.2 (unmaintained) |
| MDX core | `@mdx-js/mdx` ^0.20.3, `@mdx-js/tag` ^0.20.3 |
| Sass | `node-sass` ^4.11.0 (deprecated) + `sass` ^1.17.2 |
| Image processing | `gatsby-image` ^2.0.31 (deprecated) |
| SEO | `react-helmet` + `gatsby-plugin-react-helmet` |
| ESLint | ^5.15.0 |
| Prettier | ^1.16.4 |
| Jest | ^24.1.0 |

## Target State

| Component | Target Version |
|---|---|
| Gatsby | ^5.16.0 (latest) |
| Node.js | 24.x LTS (Krypton) |
| React / ReactDOM | ^18.x |
| MDX plugin | `gatsby-plugin-mdx` ^5.x (MDX v2) |
| MDX core | `@mdx-js/mdx` ^2.x |
| Sass | `sass` (Dart Sass) latest |
| Image processing | `gatsby-plugin-image` (replaces `gatsby-image`) |
| SEO | Gatsby Head API (replaces `react-helmet`) |
| ESLint | ^8.x or ^9.x |
| Prettier | ^3.x |
| Jest | ^29.x |

---

## Upgrade Strategy

The upgrade must go through three major version jumps (v2→v3→v4→v5). Each jump has breaking changes that must be addressed before moving to the next. The phases below are ordered for minimal risk and maximum testability.

---

## Phase 1: Foundation — Node.js and Tooling

**Goal:** Get the build tooling onto modern Node.js without changing Gatsby yet.

### 1.1 Upgrade Node.js to 18 (minimum for Gatsby 5)

- Update `.nvmrc` from `v11.10.0` to `18` (or `20`/`24` — see note below).
- Update `.travis.yml` to test on Node 18+ only (drop `'11'` and `'lts/*'` older entries).
- Node 18 is the minimum for Gatsby 5; we can go directly to 24 since Gatsby 5.16 supports it.

### 1.2 Replace `node-sass` with `sass` (Dart Sass)

- `node-sass` is deprecated and will not compile on Node 18+.
- The project already has `sass` in devDependencies. Remove `node-sass` from dependencies.
- `gatsby-plugin-sass` already has `implementation: require('sass')` configured — no config change needed.
- **Risk:** Dart Sass has some behavioral differences from LibSass (e.g., `/` as division is deprecated in favor of `math.div()`). Audit all `.scss` files for division operators.

### 1.3 Upgrade dev tooling

- Upgrade ESLint to v8+ (v5 won't run on Node 18).
- Upgrade Prettier to v3+.
- Upgrade Stylelint to v15+.
- Upgrade Jest to v29+ and `babel-jest` accordingly.
- Update `@babel/core` and `babel-preset-gatsby` to latest.

**Verification:** `npm run lint`, `npm run format`, `npm run test` all pass.

---

## Phase 2: Gatsby v2 → v3

**Goal:** Upgrade to Gatsby 3 and address its breaking changes.

### 2.1 Upgrade Gatsby and all `gatsby-*` plugins to v3

Update in `package.json`:

```
gatsby                          → ^3.0.0
gatsby-plugin-catch-links       → ^3.0.0
gatsby-plugin-feed              → ^3.0.0
gatsby-plugin-manifest          → ^3.0.0
gatsby-plugin-offline           → ^4.0.0
gatsby-plugin-react-helmet      → ^4.0.0
gatsby-plugin-sass              → ^4.0.0
gatsby-plugin-sharp             → ^3.0.0
gatsby-plugin-sitemap           → ^3.0.0
gatsby-plugin-web-font-loader   → latest compatible
gatsby-remark-copy-linked-files → ^3.0.0
gatsby-source-filesystem        → ^3.0.0
gatsby-transformer-sharp        → ^3.0.0
gatsby-transformer-yaml         → ^3.0.0
gatsby-plugin-robots-txt        → latest compatible
```

### 2.2 Breaking changes in Gatsby 3

1. **Webpack 5:** Gatsby 3 uses webpack 5. Node polyfills are no longer auto-included. The project uses `debug` and `acorn` — verify they still work without polyfills.
2. **React 17:** Update `react` and `react-dom` to `^17.0.0`. React 17 has no breaking API changes, so components should work as-is.
3. **GraphQL 15:** Minor query behavioral changes; generally non-breaking.
4. **ESM-only packages:** Some dependencies may have moved to ESM-only. Add fallbacks or update imports as needed.
5. **`gatsby-image` → `gatsby-plugin-image`:** `gatsby-image` is deprecated in v3. Replace with `gatsby-plugin-image` and its `GatsbyImage`/`StaticImage` components. *However*, this project's images go through the custom `gatsby-remark-mdx-images` plugin which generates raw HTML — so `gatsby-image` may not be directly used in components. Verify.

### 2.3 Migrate `gatsby-mdx` to `gatsby-plugin-mdx` v2/v3

This is the **highest-risk change** in the entire upgrade.

`gatsby-mdx` (ChristopherBiscardi's package) was folded into the official `gatsby-plugin-mdx` in 2019. The migration:

| `gatsby-mdx` | `gatsby-plugin-mdx` (v2/v3) |
|---|---|
| `gatsby-mdx` in config | `gatsby-plugin-mdx` in config |
| `mdPlugins` option | `remarkPlugins` option |
| `globalScope` option | Use `MDXProvider` with components |
| `import MDXRenderer from 'gatsby-mdx/mdx-renderer'` | `import { MDXRenderer } from 'gatsby-plugin-mdx'` |
| `@mdx-js/tag` | Remove (no longer needed) |

#### Files requiring changes:

| File | Change |
|---|---|
| `gatsby-config.js` | Replace `gatsby-mdx` with `gatsby-plugin-mdx`; rename `mdPlugins` → `remarkPlugins`; remove `globalScope` |
| `src/components/MDXBody.js` | Update `MDXRenderer` import from `gatsby-plugin-mdx` |
| `src/components/InlineSegment.js` | Update `MDXRenderer` import |
| `core/on-create-node/on-create-mdx-documents.js` | Internal type may change; verify `node.internal.type === 'Mdx'` still works |
| `plugins/gatsby-remark-mdx-images/` | Update `peerDependencies` for `gatsby` ^3.0.0 |

#### `globalScope` removal:

The current config injects `InlineMath` and `MathBlock` via `globalScope`. In `gatsby-plugin-mdx`, use `MDXProvider` with components prop instead. The `MDXBody.js` component already wraps `MDXRenderer` and passes `components` — this may work out of the box once `globalScope` is removed and the KaTeX components are included in the MDX provider.

**Verification:** Build the site and check that:
- Posts render correctly with headings, code blocks, math (KaTeX), images
- The RSS feed generates properly
- The custom image plugin processes images correctly

---

## Phase 3: Gatsby v3 → v4

**Goal:** Upgrade to Gatsby 4 and address its breaking changes.

### 3.1 Upgrade all packages to v4

```
gatsby                          → ^4.0.0
gatsby-plugin-mdx               → ^3.0.0 (v3 of the plugin for Gatsby 4)
gatsby-plugin-catch-links       → ^4.0.0
gatsby-plugin-feed              → ^4.0.0
gatsby-plugin-manifest          → ^4.0.0
gatsby-plugin-offline           → ^5.0.0
gatsby-plugin-react-helmet      → ^5.0.0
gatsby-plugin-sass              → ^5.0.0
gatsby-plugin-sharp             → ^4.0.0
gatsby-plugin-sitemap           → ^5.0.0
gatsby-remark-copy-linked-files → ^5.0.0
gatsby-source-filesystem        → ^4.0.0
gatsby-transformer-sharp        → ^4.0.0
gatsby-transformer-yaml         → ^4.0.0
```

### 3.2 Breaking changes in Gatsby 4

1. **Node 14.15+:** Already met if we're on 18+.
2. **`createFieldExtension`/`createTypes` must be in `createSchemaCustomization`:** The project uses `setFieldsOnGraphQLNodeType` which is still valid, but should be migrated to `createSchemaCustomization` + `createResolvers` for future-proofing (required in v5).
3. **No node creation in resolvers:** Verify `set-fields-on-graphql-node-type-*.js` files don't create nodes inside resolvers (they appear not to — they only read from nodes).

**Verification:** Full build + visual check of all page types.

---

## Phase 4: Gatsby v4 → v5 (Target)

**Goal:** Upgrade to Gatsby 5, the final target.

### 4.1 Upgrade all packages to v5

```
gatsby                          → ^5.16.0
gatsby-plugin-mdx               → ^5.0.0  (MDX v2 — see below)
gatsby-plugin-catch-links       → ^5.0.0
gatsby-plugin-feed              → ^5.0.0
gatsby-plugin-manifest          → ^5.0.0
gatsby-plugin-offline           → ^6.0.0
gatsby-plugin-sass              → ^6.0.0
gatsby-plugin-sharp             → ^5.0.0
gatsby-plugin-sitemap           → ^6.0.0
gatsby-remark-copy-linked-files → ^6.0.0
gatsby-source-filesystem        → ^5.0.0
gatsby-transformer-sharp        → ^5.0.0
gatsby-transformer-yaml         → ^5.0.0
gatsby-plugin-image             → ^3.0.0 (new)
```

### 4.2 React 18

- Update `react` and `react-dom` to `^18.0.0`.
- Update `react-test-renderer` to `^18.0.0`.
- React 18 is required by Gatsby 5.
- **Breaking changes to watch for:**
  - `React.createContext` API changes — used via `create-react-context` (remove this polyfill).
  - `ReactDOM.render` → `ReactDOM.createRoot` — Gatsby handles this internally.
  - `react-lifecycles-compat` — remove (no longer needed with React 18).
  - `defaultProps` on function components is deprecated — audit `SEO.js` and others.

### 4.3 MDX v2 migration (`gatsby-plugin-mdx` v5)

This is the **second highest-risk change**. `gatsby-plugin-mdx` v5 uses MDX v2, which is a complete rewrite.

#### Key breaking changes:

| Before (gatsby-mdx / gatsby-plugin-mdx v2-v3) | After (gatsby-plugin-mdx v5 / MDX v2) |
|---|---|
| `MDXRenderer` component | No longer needed — MDX is compiled at build time |
| `code.body` / `code.scope` in GraphQL | Removed from GraphQL; MDX rendered differently |
| `mdPlugins` / `remarkPlugins` in config | `mdxOptions.remarkPlugins` in config |
| `globalScope` | Use `MDXProvider` |
| `@mdx-js/mdx` ^0.x | `@mdx-js/mdx` ^2.x (installed automatically) |
| `@mdx-js/tag` | Remove entirely |

#### Migration approach:

1. **Remove `MDXRenderer`:** In v5, MDX content is available as a React component directly. Templates access it via `children` prop.
2. **Update templates (`Post.js`, `Page.js`):**
   - Remove `code { body scope }` from GraphQL queries.
   - Receive MDX content as `children` prop instead.
   - Wrap `children` with `MDXProvider` supplying custom components.
3. **Update `MDXBody.js`:**
   - Remove `MDXRenderer` usage.
   - Use `MDXProvider` from `@mdx-js/react` to provide components.
   - Render `children` directly.
4. **Update `gatsby-config.js`:**
   - Move remark plugins to `mdxOptions: { remarkPlugins: [...] }`.
   - Remove `globalScope`.
5. **Update `InlineSegment.js`:** Remove `MDXRenderer` import.
6. **Update GraphQL queries:** Remove `code { body scope }` fields; add `body` field if needed for excerpts.
7. **Custom remark plugin (`mdx-tag-katex.js`):** Verify compatibility with MDX v2's remark pipeline.
8. **`gatsby-remark-mdx-images` custom plugin:** This plugin manipulates the markdown AST before MDX compilation. It should continue to work since it operates at the remark level, but must be tested. Update its peer dependencies.

### 4.4 GraphQL sort/aggregation syntax

Gatsby 5 changes the sort syntax:

```graphql
# Before (v2-v4)
sort: { fields: [createdTime], order: DESC }

# After (v5)
sort: { createdTime: DESC }
```

A codemod is available: `npx gatsby-codemods@latest sort-and-aggr-graphql`.

#### Files with sort queries:

| File | Query |
|---|---|
| `core/create-pages/create-pages-for-each-post.js` | `allPost(sort: ...)` |
| `core/create-pages/create-page-of-home.js` | `allPost(sort: ...)` |
| `core/create-pages/create-pages-for-each-tag.js` | `allPost(sort: ...)` |
| `core/create-pages/create-pages-for-each-category.js` | `allPost(sort: ...)` |
| `gatsby-plugin-feed-options.js` | `allPost(sort: ...)` |
| `src/templates/Index.js` | Potentially has sort |
| `src/templates/Taxonomies.js` | Potentially has sort |

### 4.5 `setFieldsOnGraphQLNodeType` → `createSchemaCustomization`

While `setFieldsOnGraphQLNodeType` still works in Gatsby 5, migrating to `createSchemaCustomization` + `createResolvers` is recommended:

#### Current pattern:

```javascript
// gatsby-node.js
exports.setFieldsOnGraphQLNodeType = require('./core/set-fields-on-graphql-node-type');
```

#### New pattern:

```javascript
// gatsby-node.js
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type Post implements Node {
      isPublished: Boolean
      subtitle: String
      lastModifiedTime: Date
      license: String
      keywords: [String]
      tags: [String]
      category: String
    }
    type Page implements Node {
      isPublished: Boolean
      subtitle: String
      lastModifiedTime: Date
      license: String
      keywords: [String]
    }
  `);
};

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Post: {
      isPublished: { resolve: (source, args, context) => { /* ... */ } },
      // ... other resolvers
    },
  });
};
```

### 4.6 Remove deprecated packages

| Package | Action |
|---|---|
| `gatsby-image` | Remove; replace with `gatsby-plugin-image` if needed |
| `@mdx-js/tag` | Remove |
| `gatsby-mdx` | Remove; replaced by `gatsby-plugin-mdx` |
| `create-react-context` | Remove (React 16.3+ has native Context) |
| `react-lifecycles-compat` | Remove (React 16.3+ has native lifecycle methods) |
| `node-sass` | Remove (already using Dart Sass) |
| `core-js` ^2.x | Update to `core-js` ^3.x or remove if unnecessary |
| `acorn` | Remove if no longer directly needed |

### 4.7 Update `gatsby-plugin-feed` queries

The RSS feed uses `mdx.html` which may not be available in MDX v2. Alternatives:
- Use a remark/rehype plugin to generate HTML from MDX at build time.
- Use `mdx.excerpt` only for feed descriptions.
- Implement a custom `html` resolver.

### 4.8 Migrate SEO from `react-helmet` to Gatsby Head API (optional, recommended)

Gatsby 5 provides a native Head API that replaces `react-helmet`:

```javascript
// Before
import Helmet from 'react-helmet';
<Helmet title={title} meta={[...]} />

// After
export const Head = ({ data }) => (
  <>
    <title>{title}</title>
    <meta name="description" content={description} />
  </>
);
```

This is optional — `react-helmet` still works — but recommended for better SSR performance.

### 4.9 Replace `StaticQuery` with `useStaticQuery` (optional, recommended)

8 components use `StaticQuery` with render props. These can be converted to `useStaticQuery` hooks for cleaner code. Not a breaking change, but recommended:

- `SEO.js`
- `NavigationBar.js`
- `Navigation.js`
- `PageInfo.js`
- `License.js`
- `SocialBar.js`
- `SiteFooter.js`
- `CC40Image.js`

---

## Phase 5: Dependency Modernization

### 5.1 Update remaining dependencies

| Package | From | To | Notes |
|---|---|---|---|
| `@fortawesome/fontawesome-svg-core` | ^1.2.15 | ^6.x | Major update; icon names may change |
| `@fortawesome/react-fontawesome` | ^0.1.4 | ^0.2.x | API changes |
| `katex` | ^0.10.1 | ^0.16.x | Minor API changes |
| `react-katex` | ^2.0.2 | ^3.x or replace with `rehype-katex` | Check compatibility |
| `prism-react-renderer` | ^0.1.6 | ^2.x | API changes (theme import) |
| `react-live` | ^1.12.0 | ^4.x | API changes |
| `react-media` | ^1.9.2 | ^1.10.x or replace with CSS | Minimal changes |
| `styled-components` | ^4.1.3 | ^6.x | Migration guide available |
| `remark` | ^10.0.1 | ^14.x+ (unified ecosystem) | Major rewrite |
| `remark-math` | ^1.0.5 | ^5.x+ | API changes |
| `remark-parse` | ^5.0.0 | ^10.x+ | API changes |
| `unist-util-visit` | ^1.4.0 | ^5.x | ESM-only |
| `debug` | ^4.1.1 | ^4.x (latest) | Minor update |
| `i18n-locales` | 0.0.2 | Latest | Check if still maintained |

### 5.2 Update `gatsby-remark-mdx-images` custom plugin

- Update `peerDependencies` to `gatsby` ^5.0.0 and `gatsby-plugin-sharp` ^5.0.0.
- The plugin uses `fluid` and `resize` from `gatsby-plugin-sharp`. In v5, these APIs may have changed — verify and update.
- The `tracedSVG` option has been removed in newer `gatsby-plugin-sharp` — remove it from defaults.
- `bluebird` (Promise) can be replaced with native Promises.
- `slash` ^1.0.0 can be updated or replaced with native `path.posix`.

---

## Phase 6: CI/CD and Deployment

### 6.1 Update `.travis.yml`

```yaml
language: node_js
os:
  - linux
node_js:
  - '24'
script:
  - npm ci
  - npm run format
  - npm run lint
  - npm run test
  - npm run build
```

Or migrate to GitHub Actions if preferred.

### 6.2 Update `netlify.toml`

Ensure Netlify uses Node 24:

```toml
[build.environment]
  NODE_VERSION = "24"
```

### 6.3 Update `.nvmrc`

```
24
```

---

## Phase 7: Visual Regression Testing

### 7.1 Before starting any upgrades

1. Build the site on the current stack and capture screenshots of:
   - Home page (paginated)
   - A post with code blocks, math (KaTeX), images, headings
   - A page (e.g., Profile)
   - Tag index page
   - Category index page
   - 404 page
   - RSS feed output (`/rss.xml`)
2. Save these as baseline screenshots.

### 7.2 After each phase

1. Run `gatsby build && gatsby serve`.
2. Compare each page type visually against the baseline.
3. Verify:
   - Layout and typography match (fonts, spacing, colors)
   - Code blocks render with syntax highlighting
   - KaTeX math renders inline and block equations
   - Images render with responsive `<picture>` / `<img>` tags
   - Navigation works (links, pagination)
   - RSS feed validates
   - SEO meta tags are present
   - PWA manifest and offline support work

---

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| `gatsby-mdx` → `gatsby-plugin-mdx` v5 (MDX v2) | **Critical** | Phase 2-4 migration in steps; test MDX rendering at each stage |
| Custom `gatsby-remark-mdx-images` plugin compatibility | **High** | Test image processing early; may need rewrite for sharp v5 API |
| `code.body` / `code.scope` removal in MDX v2 | **High** | Refactor templates to use `children` prop pattern |
| KaTeX rendering with MDX v2 | **Medium** | Test `remark-math` + `rehype-katex` pipeline |
| SCSS `/` division deprecation in Dart Sass | **Low** | Audit and fix SCSS files |
| Font Awesome major version jump | **Low** | Icon names are generally stable |
| `gatsby-plugin-feed` HTML content | **Medium** | May need custom HTML generation for RSS |
| GraphQL sort syntax changes | **Low** | Codemod available |

---

## Recommended Execution Order

Given the risks and dependencies, the recommended order is:

1. **Capture visual baselines** (Phase 7.1)
2. **Phase 1** — Node.js + tooling (lowest risk, unblocks everything)
3. **Phase 2** — Gatsby v2 → v3 + `gatsby-mdx` → `gatsby-plugin-mdx` (highest risk, do early)
4. **Phase 3** — Gatsby v3 → v4 (straightforward)
5. **Phase 4** — Gatsby v4 → v5 + MDX v2 + React 18 (second highest risk)
6. **Phase 5** — Dependency modernization (can be incremental)
7. **Phase 6** — CI/CD updates
8. **Phase 7.2** — Final visual regression verification

Each phase should be a separate, testable commit (or set of commits) so regressions can be bisected.

---

## Estimated Effort

| Phase | Effort |
|---|---|
| Phase 1: Node.js + Tooling | 2-4 hours |
| Phase 2: Gatsby v3 + MDX migration | 8-16 hours |
| Phase 3: Gatsby v4 | 2-4 hours |
| Phase 4: Gatsby v5 + MDX v2 + React 18 | 8-16 hours |
| Phase 5: Dependency modernization | 4-8 hours |
| Phase 6: CI/CD | 1-2 hours |
| Phase 7: Visual regression testing | Throughout |
| **Total** | **~25-50 hours** |

---

## Quick-Start Checklist

- [ ] Capture baseline screenshots
- [ ] Update `.nvmrc` to `24`
- [ ] Remove `node-sass` from dependencies
- [ ] Upgrade ESLint, Prettier, Stylelint, Jest
- [ ] Upgrade Gatsby to v3 + all `gatsby-*` plugins
- [ ] Migrate `gatsby-mdx` → `gatsby-plugin-mdx`
- [ ] Update React to v17
- [ ] Verify build + visual check
- [ ] Upgrade Gatsby to v4 + all `gatsby-*` plugins
- [ ] Migrate `setFieldsOnGraphQLNodeType` → `createSchemaCustomization`
- [ ] Verify build + visual check
- [ ] Upgrade Gatsby to v5 + all `gatsby-*` plugins
- [ ] Update React to v18
- [ ] Migrate to MDX v2 (`gatsby-plugin-mdx` v5)
- [ ] Run GraphQL sort codemod
- [ ] Update `MDXBody.js` — remove `MDXRenderer`, use `children`
- [ ] Update templates (`Post.js`, `Page.js`) for MDX v2
- [ ] Update `gatsby-plugin-feed-options.js` for MDX v2
- [ ] Update custom `gatsby-remark-mdx-images` plugin
- [ ] Remove deprecated packages
- [ ] Update remaining dependencies
- [ ] Update CI/CD configuration
- [ ] Final visual regression check
