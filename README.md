# Gulp Starter

A Gulp build system for static sites and CMS themes. Sass, ES modules bundled
with esbuild, images optimised with sharp, critical CSS inlined for production,
and live reload while you work.

```bash
git clone https://github.com/Badgerswork/Gulp-Starter.git my-site
cd my-site
npm install
npm start
```

That serves <http://localhost:3000> with a working page, and rebuilds as you
edit.

## Why Gulp, and not Vite

Vite is the better choice for an app — a single-page React or Vue build, a dev
server built around HMR and a module graph rooted in JavaScript.

This is for the other kind of work: static marketing sites, WordPress and
Shopify themes, Craft and Kirby templates, HTML email. Jobs where the markup is
rendered by something other than your bundler, where you need real files on
disk in a folder structure someone else's server expects, and where "the CSS
pipeline" and "the JS pipeline" are genuinely separate concerns. Gulp is a task
runner, so you can point it at any folder layout and describe the pipeline you
actually have.

If your project's entry point is a JavaScript file, use Vite. If it's a
template rendered by a CMS, this will fit better.

## Commands

| Command                | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `npm start`            | Build, serve on :3000, watch and live-reload                     |
| `npm run build`        | One-off development build (expanded CSS, sourcemaps)             |
| `npm run build-prod`   | Production build (minified, critical CSS inlined, no sourcemaps) |
| `npm run lint`         | Lint stylesheets with stylelint                                  |
| `npm run lint:fix`     | Lint and autofix what can be fixed                               |
| `npm run format`       | Format everything with Prettier                                  |
| `npm run format:check` | Check formatting without writing (used by CI)                    |

Individual gulp tasks are available too — `npx gulp styles`, `npx gulp scripts`,
`npx gulp images`, `npx gulp criticalPath`. Add `--debug` to any of them to log
every file through the pipeline.

## Layout

```
src/
  index.html          pages — any .html under src/, nesting preserved
  styles/main.scss    stylesheet entry; partials via @use
  scripts/main.js     bundle entry; reached by import
  images/             jpg/png optimised, webp + avif emitted alongside
  fonts/              copied verbatim
  robots.txt          copied to the site root
dist/                 build output — never edit, never commit
```

Paths are configured in [`gulp/settings/paths.js`](gulp/settings/paths.js). To
adopt this in an existing project, point them at the folders you already have
rather than moving files.

## What each pipeline does

**Styles** — stylelint, then dart-sass, then Autoprefixer. Development output is
expanded with sourcemaps; production is minified with cssnano and no sourcemaps.
Browser targets come from `browserslist` in `package.json`.

**Scripts** — esbuild bundles from `src/scripts/main.js`. Use real `import`
statements, including npm packages; esbuild resolves and tree-shakes them.
Targets come from the same `browserslist`, so there is one source of truth.

**Images** — sharp writes an optimised original plus WebP and AVIF siblings, so
you can offer them through `<picture>`. SVG, GIF and ICO pass through untouched.

**Critical CSS** — production builds inline above-the-fold CSS into the document
and defer the rest, with a `<noscript>` fallback. This runs on `build-prod`
only: it boots a headless browser per page, which is too slow for a watch loop.
Run it on demand with `npx gulp criticalPath`.

## Requirements

Node 22.11 or newer (`.nvmrc` pins 22). Node 22.13+ is required by the critical
CSS step specifically.

## Adopting this in an existing project

Sass files written before dart-sass may need two changes: `@import` becomes
`@use`, and `/` for division becomes `math.div()`. dart-sass names the exact
file and line for both, so the migration is mechanical. See
[the Sass migration guide](https://sass-lang.com/documentation/breaking-changes/).

## License

ISC — see [LICENSE](LICENSE).
