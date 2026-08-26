// === GULPFILE
// ============================================================================

import gulp from 'gulp';

import path from './gulp/settings/paths.js';
import { browserSync, reload } from './gulp/settings/browsersync.js';

import { sass } from './gulp/tasks/sass.js';
import { cleanCss, cleanJs, cleanDist } from './gulp/tasks/clean.js';
import { fonts } from './gulp/tasks/fonts.js';
import { images } from './gulp/tasks/images.js';
import { scripts as bundleScripts } from './gulp/tasks/scripts.js';
import { cssLint } from './gulp/tasks/lint.js';
import { criticalPath } from './gulp/tasks/critical.js';
import { copyServerFiles } from './gulp/tasks/copy-server-files.js';
import { html } from './gulp/tasks/html.js';

// ---------------------------------------------------------------------------
// SERVER
// ---------------------------------------------------------------------------

function serve(done) {
    browserSync.init({
        // proxy: { target: 'http://my-site.local' },
        server: { baseDir: path.to.dist.root },
        port: 3000,
        open: true,
        injectChanges: true,
        watchEvents: ['add', 'change'],
    });
    done();
}

// ---------------------------------------------------------------------------
// COMPOSITE TASKS
// ---------------------------------------------------------------------------
// gulp.series/parallel already return task functions. The previous versions
// wrapped each one in an extra `done` callback and invoked it immediately,
// which defeated gulp's own task tracking.

// Critical-path inlining is a production optimisation: it boots a headless
// browser per page, so running it on every stylesheet save made watch slow and
// coupled dev builds to a browser binary. It belongs in `dist` only.
const styles = gulp.series(cssLint, sass, reload);
const scripts = gulp.series(bundleScripts, reload);

function watchFiles() {
    gulp.watch(path.to.sass.files, styles);
    gulp.watch(path.to.img.files, images);
    gulp.watch(path.to.fonts.files, fonts);
    gulp.watch(path.to.js.files, scripts);
    gulp.watch(path.to.html.files, gulp.series(html, reload));
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

// Cleaning happens once, in series, before anything writes. Per-pipeline
// cleans used to run inside the parallel group, so one branch deleted a
// subdirectory of dist while another was writing to it -- gulp.dest scandirs
// the destination tree, so that raced and failed the build intermittently.
export const build = gulp.series(
    cleanDist,
    gulp.parallel(styles, scripts, fonts, images, html),
);

export const dist = gulp.series(
    cleanDist,
    gulp.parallel(styles, scripts, images, fonts, html, copyServerFiles),
    criticalPath,
);

export const watch = gulp.series(build, gulp.parallel(watchFiles, serve));

export {
    styles,
    cssLint as lint,
    html,
    scripts,
    images,
    fonts,
    criticalPath,
    copyServerFiles as serverfiles,
    cleanCss,
    cleanJs,
    cleanDist,
};

export default build;
