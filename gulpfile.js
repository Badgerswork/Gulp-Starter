// === GULPFILE
// ============================================================================

import gulp from 'gulp';

import path from './gulp/settings/paths.js';
import { browserSync, reload } from './gulp/settings/browsersync.js';

import { sass } from './gulp/tasks/sass.js';
import { cleanCss, cleanJs, cleanDist } from './gulp/tasks/clean.js';
import { fonts } from './gulp/tasks/fonts.js';
import { imageToDist, minifyImages } from './gulp/tasks/images.js';
import { modernizr } from './gulp/tasks/modernizr.js';
import { concatJs } from './gulp/tasks/concat-js.js';
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
const styles = gulp.series(sass, reload);
const buildStyles = gulp.series(cleanCss, styles);

const scripts = gulp.series(cleanJs, modernizr, concatJs, reload);

const images = gulp.series(imageToDist, minifyImages);

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

export const build = gulp.parallel(buildStyles, scripts, fonts, images, html);

export const dist = gulp.series(
    cleanDist,
    gulp.parallel(buildStyles, scripts, images, fonts, html, copyServerFiles),
    criticalPath
);

export const watch = gulp.series(build, gulp.parallel(watchFiles, serve));

export {
    styles,
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
