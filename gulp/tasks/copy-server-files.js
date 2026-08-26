// === SERVER FILES
// ============================================================================

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { debug } from '../settings/env.js';

const filesToCopy = ['robots.txt', 'sitemap.xml', '_headers.txt'];

export function copyServerFiles() {
    return gulp
        .src(filesToCopy, { allowEmpty: true, encoding: false })
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'MOVE SERVER FILES ::: ' }) : noop())
        .pipe(gulp.dest(path.to.dist.root));
}
