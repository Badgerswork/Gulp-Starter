# Gulp-Starter Modernization Plan

**Status:** proposal · **Last verified:** 2026-08-26 · **Baseline commit:** `baeef6a`

## The short version

The build does not install. On Node 22 `npm install` fails outright during
`node-sass` compilation — before a single task can run. Anyone who clones this
repo today gets a stack trace, not a build system.

Fixing that is a one-line swap. The larger opportunity is that roughly a third
of this toolchain exists to serve browsers that no longer exist, and removing it
makes the starter both faster and much easier to explain.

**Direction:** stay Gulp, modernise hard. Target modern browsers only.

**Outcome:** Gulp 5 · dart-sass · ESM · esbuild · sharp · ~40 dependencies down
to ~15 · installs and builds clean on current Node.

---

## 1. Why it's broken

### The install failure

`node-sass` was deprecated by its own maintainers in 2020. It ships native
bindings compiled per Node release; there is no build for Node 22, so npm falls
back to `node-gyp`, which fails:

```
gyp ERR! stack SyntaxError: Missing parentheses in call to 'print'
gyp ERR! node -v v22.22.2
gyp ERR! not ok
Build failed with error code: 1
```

`gulp-sass@4` also pins the compiler internally, so the fix is a paired upgrade,
not a single bump.

### The dependency tree

`package-lock.json` is `lockfileVersion: 1` — npm 6 era, ~2019. Confirmed
deprecated or effectively abandoned in the current tree:

| Package | State | Replacement |
|---|---|---|
| `node-sass` | **Deprecated** upstream | `sass` (dart-sass) `1.103.x` |
| `gulp-sass@4` | Old compiler-coupled API | `gulp-sass@6` — inject compiler |
| `gulp-modernizr` | Serves dead browsers | *delete* |
| `gulp-bless` | IE9 4095-selector limit | *delete* |
| `gulp-duration@0.0.0` | Never released past 0.0.0 | `--verbose` timing or drop |
| `beepbeep`, `gulp-notify` | Desktop-notification noise | plain console output |
| `postcss@7`, `stylelint@13` | Two majors behind | `postcss@8`, `stylelint@17` |
| `gulp@4` | Superseded | `gulp@5` |

### Confirmed bugs in the current code

These are live defects, independent of the version story. Each was verified
against the source, not inferred:

1. **BrowserSync CSS injection never works.** `browser-sync.create()` is called
   three separate times — `gulpfile.js:6`, `gulp/tasks/sass.js:9`,
   `gulp/tasks/critical.js:9`. Only the gulpfile's instance is ever `init`ed, so
   the `.stream()` call in the sass task pushes into an instance with no
   connected clients. Live reload silently does nothing.

2. **Minification is inverted.** `gulp/tasks/sass.js:50` reads
   `.pipe(dev ? postcss(processors) : noop())` where `processors` includes
   `cssnano`. That minifies in **development** and ships **unminified** CSS to
   production. `gulp/tasks/concat-css.js:33` has the correct polarity, so the
   two disagree.

3. **`autoprefixer` is required but not declared.** `gulp/tasks/sass.js:8`
   requires it directly; `package.json` lists only `gulp-autoprefixer`. It
   resolves today purely by transitive hoisting — a flat-tree accident that any
   lockfile change can break.

4. **`copy-server-files.js` throws on the normal path.**  Line 22 calls bare
   `noop()`, but the file never requires `gulp-noop`. With `--debug` unset — the
   default — this is a `ReferenceError`.

5. **Sourcemaps are silently discarded.** `sass.js` opens with
   `gulp.src(..., { sourcemaps: true })` but the matching `gulp.dest` omits
   `{ sourcemaps: '.' }`, so nothing is written.

6. **Ten files leak implicit globals.** A `;` where a `,` belongs — e.g.
   `concat-js.js:7-8` — makes `argv` and `noop` accidental globals. Harmless in
   sloppy mode, fatal under ESM (which is strict by default), so this must be
   fixed as part of the ESM migration rather than after it.

7. **Critical CSS points at a file that isn't produced.** `critical.js` reads
   `dist/css/styles.css`, but the sass task neither concatenates nor renames —
   it emits one CSS file per source `.scss`.

8. **The repo has no source directories.** No `styles/`, `js/`, `images/` or
   `fonts/`. A fresh clone has nothing to build even once install succeeds.

9. **UTF-8 BOMs** on 13 of 15 JS files, and `"start": "npm i && gulp watch"`
   runs an install on every start while assuming a global `gulp`.

---

## 2. What gets deleted

This is the highest-value part of the plan, and it's all downstream of one
decision: modern browsers only.

- **Modernizr + html5shiv** — feature-detection and an IE8 shim. `@supports`
  and native CSS feature queries cover this. Deletes a task, two dependencies
  and a Babel pass.
- **gulp-bless** — worked around IE9's 4095-selector ceiling.
- **Most of Babel** — with a modern `browserslist`, `@babel/preset-env`
  transpiles almost nothing. esbuild handles the remainder faster.
- **`gulp-load-plugins` with `pattern: ['*']`** — auto-requires *every* package
  in `node_modules` on load. It's slow, hides which plugin a task actually
  needs, and defeats static analysis. Replace with explicit imports.
- **`del`** — `fs.rm(path, { recursive: true, force: true })` has been built
  into Node since v14.
- **`vendor-js.js`** — copies files out of `node_modules` by hand-written path.
  Real imports replace it.
- **`gulp-watch`** — `gulp.watch` (chokidar) is built in.
- **The 130-line inline stylelint config** in `lint.js` — every rule in it is
  stylistic, all were deprecated in stylelint 15 and **removed in 16**. That
  task is dead code against stylelint 17. Prettier owns formatting;
  `stylelint-config-standard` owns correctness.
- **The ASCII-art error banner** in `settings/errors.js` — 20 lines of `ERROR`
  plus a system beep. A one-line message with plugin and file is more useful.

The browserslist goes from eleven entries — including `ie >= 8`, `android >= 4`
and `bb >= 10`, i.e. BlackBerry — to `defaults, not dead`.

---

## 3. Target architecture

```
gulpfile.mjs               ESM — required by critical@8 and gulp-imagemin@9
gulp/
  config.mjs               paths + env in one place (merges paths.js/config.js)
  tasks/
    styles.mjs             dart-sass → postcss(autoprefixer, cssnano) → dest
    scripts.mjs            esbuild bundle — ESM in, one file out
    images.mjs             sharp → resize + webp/avif alongside originals
    static.mjs             fonts + robots.txt/sitemap.xml/_headers
    critical.mjs           critical@8
    clean.mjs              fs.rm
src/                       actual starter files, so a clone builds
  styles/main.scss
  scripts/main.js
  images/.gitkeep
  index.html
```

Three structural changes worth calling out:

**ESM is not optional.** `critical@8`, `gulp-imagemin@9` and `del@8` are all
`"type": "module"` — they cannot be `require`d. Gulp 5 loads `gulpfile.mjs`
natively. This is the constraint that sets the migration order in Phase 2.

**esbuild replaces concat + Babel.** Today `concat-js.js` string-concatenates
files in a hand-maintained order, with no module system — which is why
`vendor-js.js` exists to copy library files out of `node_modules`. Real
`import` statements give ordering, tree-shaking and npm packages for free, and
esbuild bundles in milliseconds.

**sharp replaces imagemin.** `gulp-imagemin@9` still works, but the imagemin
plugin ecosystem is thinly maintained and pulls large binary dependencies.
sharp is actively developed, much faster, and can emit modern formats — so the
image task gains WebP/AVIF output rather than only shrinking PNGs.

**One BrowserSync instance**, created in `gulpfile.mjs` and passed to the tasks
that need it. This is what actually fixes bug #1.

### Dependency budget

| | Before | After |
|---|---|---|
| devDependencies | 40 | ~15 |
| Deprecated packages | 2+ | 0 |
| Native/compiled deps | node-sass, imagemin binaries | sharp only |
| Lockfile version | 1 (npm 6) | 3 |

---

## 4. Phased execution

Each phase ends at a working build, so the work can stop or ship at any
boundary.

### Phase 1 — Make it install *(half a day)*
The unblocking step. Nothing else can be tested until this lands.

- `node-sass` → `sass@1.103`; `gulp-sass@4` → `@6`, injecting the compiler:
  `gulpSass(dartSass)`.
- `gulp@4` → `@5`; `postcss@7` → `@8`.
- Delete `package-lock.json`, regenerate on npm 10+ (lockfileVersion 3).
- Add `"engines": { "node": ">=22.11" }` and `.nvmrc`.

**Exit test:** `npm ci` succeeds on Node 22 and 24.

> **Executed 2026-08-26.** Two corrections to this phase as originally written:
>
> 1. `"type": "module"` moved to Phase 2. Setting it here would make Gulp 5 load
>    the still-CommonJS `gulpfile.js` as ESM and fail on `require` — install
>    would pass while the build broke. It belongs with the ESM conversion.
> 2. The `gulp-load-plugins` change moved *into* this phase. Declaring
>    `postcss` and `autoprefixer` correctly (bug #3) collides with
>    `pattern: ['*']`, which namespaces all of `node_modules` and throws
>    `Could not define the property "postcss"`. Restoring the default
>    `['gulp-*', 'gulp.*']` pattern was the minimum fix; the full move to
>    explicit imports stays in Phase 2.
>
> Also found: `gulp-autoprefixer` was never referenced by any task and was
> removed. `gulp-sass@6` calls dart-sass's **modern** `compileStringAsync` API,
> so the options are `style` and `loadPaths` — not node-sass's `outputStyle`
> and `includePaths`.

### Phase 2 — ESM + bug fixes *(one day)*
Do these together: the strict-mode switch surfaces bug #6, and the ESM upgrades
of `critical`/`imagemin` depend on it.

- Convert all 15 files to ESM; strip BOMs; fix the ten implicit-global slips.
- Replace `gulp-load-plugins` with explicit imports.
- Fix bugs #1–#5 and #7 — single BrowserSync instance, correct minify polarity,
  declare `autoprefixer`, repair `copy-server-files`, write sourcemaps, point
  critical at a file that exists.
- Replace `del` with `fs.rm`.

**Exit test:** `gulp build` and `gulp watch` both run; editing a `.scss` file
visibly injects in the browser.

> **Executed 2026-08-26.** Exit test met: `[Browsersync] 2 files changed
> (main.css, main.css.map)` on a live `.scss` edit — a line that could not
> appear before, since the stream targeted an uninitialised instance.
>
> Three things this phase surfaced that the plan did not anticipate:
>
> 1. **Gulp 5 throws ENOENT on a missing source directory** where Gulp 4
>    yielded an empty stream. A starter is routinely missing some of
>    `styles/ js/ images/ fonts/`, so every task needed guarding — added as
>    `gulp/settings/stream.js` (`srcOrEmpty`). Without it `gulp build` fails
>    on a fresh clone, which would have blocked Phase 5's exit test.
> 2. **`critical@1` is not merely old, it is non-functional.** It bundles
>    puppeteer 1.13, whose 2019 Chromium cannot load `libXss.so.1` on any
>    current Linux. This was always broken; it stayed hidden only because the
>    repo had no HTML for the task to process. Critical-path inlining is a
>    production optimisation and has been removed from the dev/watch path
>    (it booted a headless browser on every stylesheet save). `gulp dist`
>    still depends on it, so **Phase 4's `critical@8` upgrade is now a
>    blocker for production builds**, not a nicety.
> 3. **Nothing ever copied HTML into `dist`.** The critical task wrote it as a
>    side effect of inlining, so removing that from dev left the server with
>    nothing to serve. Added `gulp/tasks/html.js`.
>
> Also: `yargs` was dropped rather than upgraded — `yargs/helpers` only exists
> in v16+, and two boolean flags do not need an argument parser. Files keep
> their `.js` extensions rather than moving to `.mjs`; `"type": "module"`
> makes them ESM already, and Phase 4 renames these files anyway.

### Phase 3 — Drop the legacy layer *(half a day)*
- Delete Modernizr, gulp-bless, vendor-js, gulp-watch, gulp-duration, beepbeep,
  gulp-notify tasks and deps.
- `browserslist` → `["defaults", "not dead"]`.
- Rewrite `settings/errors.js` as a plain reporter.

**Exit test:** build output is byte-comparable minus the Modernizr bundle;
install time and `node_modules` size both drop measurably.

### Phase 4 — Modern pipeline *(one to two days)*
- `scripts.mjs` on esbuild; delete `concat-js.js`.
- `images.mjs` on sharp, emitting WebP/AVIF.
- `critical@8`.
- stylelint 17 + `stylelint-config-standard@40`; delete the inline rule block.
- Add Prettier 3 and `.editorconfig`.

**Exit test:** production build produces minified, sourcemapped CSS/JS and
optimised images; `npm run lint` passes clean.

### Phase 5 — Make it a real starter *(half a day)*
This is the "relevant" half of the brief — the difference between a build
script and something someone adopts.

- Add `src/` with a working `index.html`, `main.scss` and `main.js`, so
  `git clone && npm i && npm start` shows a rendered page.
- Rewrite `README.md`: what it's for, why Gulp over Vite for
  static/CMS/WordPress-theme work, quickstart, task reference, how to point it
  at an existing project.
- GitHub Actions CI: install + build + lint on Node 22 and 24, so the
  install-is-broken failure can never recur silently.
- Re-enable Dependabot — the last four commits were all Dependabot bumps, which
  is the only maintenance this repo has had since 2022.
- Add the `LICENSE` file that `package.json` already claims (ISC).
- Fix the package name: `badgerworks_-_gulp-starter` → `gulp-starter`.

**Exit test:** a clean clone builds and serves a page in under two minutes.

---

## 5. Risk and effort

**Total: 3–4 focused days.** Phase 1 alone is half a day and removes the
blocking failure — if only one phase ships, ship that one.

| Risk | Likelihood | Mitigation |
|---|---|---|
| dart-sass rejects legacy syntax (`@import`, `/` division) | High — but only in *consuming* projects, not here | Document the `@use`/`math.div` migration in the README; dart-sass warnings name the exact line |
| `critical@8` needs `node >= 22.13` | Certain | Already implied by the `engines` field; state it in the README |
| esbuild output differs from concat order | Medium | Real `import`s make order explicit; keep the old bundle for one diff |
| Gulp 5 stream changes (streamx, no graceful-fs patch) | Low | Custom transforms are minimal here; plugins in the target set are all Gulp 5 tested |

**One honest caveat:** the sass migration risk lands on projects that consume
this starter, not on the starter itself. It's worth a README section rather than
a code change here.

## 6. Recommended sequence

Land Phase 1 on its own and tag it — a repo that installs is worth publishing
immediately, and it de-risks everything after. Phases 2 and 3 are best done as
one PR since the ESM switch surfaces the strict-mode bugs. Phase 5 matters more
than it looks: without runnable starter files, the repo is a build script rather
than a starter, and that is most of what "relevant" means here.
