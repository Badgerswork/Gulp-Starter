// === HTML
// ============================================================================
// Previously nothing copied HTML into dist -- the critical-path task happened
// to write it as a side effect of inlining, so dev builds served nothing.

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { debug } from '../settings/env.js';

export function html() {
    return srcOrEmpty(path.to.html.files, { base: path.to.src.root })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'HTML :: SRC' }) : noop())
        .pipe(gulp.dest(path.to.dist.root));
}
