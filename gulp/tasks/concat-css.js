// === CONCAT PLAIN CSS
// ============================================================================
// Not wired into gulpfile.js -- kept for projects that ship hand-written CSS
// alongside sass.

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';
import concat from 'gulp-concat';
import gulpPostcss from 'gulp-postcss';
import cssnano from 'cssnano';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { dev, debug } from '../settings/env.js';

export function concatCss() {
    return srcOrEmpty([path.to.css.files], { sourcemaps: dev })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'CSS :: SRC' }) : noop())
        .pipe(concat('main.min.css'))
        .pipe(dev ? noop() : gulpPostcss([cssnano]))
        .pipe(gulp.dest(path.to.dist.css, { sourcemaps: dev ? '.' : false }));
}
