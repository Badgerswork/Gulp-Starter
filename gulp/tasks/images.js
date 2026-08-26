// === IMAGES
// ============================================================================

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { debug } from '../settings/env.js';

export function imageToDist() {
    return srcOrEmpty(path.to.img.files, { encoding: false })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'MOVE IMAGES :: IN' }) : noop())
        .pipe(gulp.dest(path.to.dist.img))
        .pipe(debug ? gulpDebug({ title: 'MOVE IMAGES :: OUT' }) : noop());
}

export function minifyImages() {
    return srcOrEmpty(path.to.dist.img + '/**/**.*', { encoding: false })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'IMAGES :: SRC' }) : noop())
        .pipe(imagemin({ verbose: false, use: [pngquant()] }))
        .pipe(gulp.dest(path.to.dist.img))
        .pipe(debug ? gulpDebug({ title: 'IMAGES :: OUT' }) : noop());
}
