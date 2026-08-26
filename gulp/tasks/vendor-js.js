// === VENDOR SCRIPTS
// ============================================================================
// Removed in Phase 4: copying files out of node_modules by hand-written path
// only exists because the script pipeline has no module system. Real `import`
// statements replace this once esbuild lands.

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';
import concat from 'gulp-concat';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { debug } from '../settings/env.js';

const vendorFiles = [
    '/smoothscroll/smoothscroll.js',
    '/what-input/dist/what-input.js',
];

export function vendorScripts() {
    return gulp
        .src(
            vendorFiles.map((file) => path.to.nodeModules.root + file),
            { allowEmpty: true }
        )
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'VENDOR :: SRC' }) : noop())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(path.to.dist.js));
}
