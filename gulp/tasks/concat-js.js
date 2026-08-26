// === SCRIPTS
// ============================================================================
// Replaced by an esbuild bundle in Phase 4; concatenation has no module
// system, which is why vendor-js.js exists to copy files out of node_modules.

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';
import concat from 'gulp-concat';
import babel from 'gulp-babel';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { dev, debug } from '../settings/env.js';

export function concatJs() {
    return srcOrEmpty([path.to.js.files], { sourcemaps: dev })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'SCRIPTS :: SRC' }) : noop())
        .pipe(concat('scripts.min.js'))
        .pipe(babel({ presets: ['@babel/env'], compact: false }))
        .pipe(debug ? gulpDebug({ title: 'SCRIPTS :: OUTPUT' }) : noop())
        .pipe(gulp.dest(path.to.dist.js, { sourcemaps: dev ? '.' : false }));
}
