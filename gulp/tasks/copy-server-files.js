// === SERVER FILES
// ============================================================================
// robots.txt, sitemap.xml and friends: copied to the site root untouched.

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { debug } from '../settings/env.js';

export function copyServerFiles() {
    return srcOrEmpty(path.to.serverFiles, { encoding: false })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'SERVER FILES :: SRC' }) : noop())
        .pipe(gulp.dest(path.to.dist.root));
}
