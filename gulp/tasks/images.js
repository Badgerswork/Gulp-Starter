// === IMAGES
// ============================================================================
// One pass: read from images/, optimise, write to dist/images.
//
// This previously copied images into dist and then re-read dist/images to
// minify them in place (and never wrote the result back, so nothing was
// actually optimised). That second glob walked dist/ while the clean tasks
// were deleting from it, which raced and failed the build intermittently.

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

export function images() {
    return srcOrEmpty(path.to.img.files, { encoding: false })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'IMAGES :: SRC' }) : noop())
        .pipe(imagemin({ verbose: false, use: [pngquant()] }))
        .pipe(debug ? gulpDebug({ title: 'IMAGES :: OUT' }) : noop())
        .pipe(gulp.dest(path.to.dist.img));
}
