// === MODERNIZR
// ============================================================================
// Removed in Phase 3 -- feature detection and the html5shiv are only needed
// for browsers this starter no longer targets.

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';
import modernizrPlugin from 'gulp-modernizr';
import babel from 'gulp-babel';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { debug } from '../settings/env.js';

export function modernizr() {
    return srcOrEmpty([path.to.sass.files, path.to.js.files])
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(debug ? gulpDebug({ title: 'MODERNIZR :: SRC' }) : noop())
        .pipe(
            modernizrPlugin({
                options: ['setClasses', 'addTest', 'html5shiv', 'testProp'],
                excludeTests: ['hidden'],
            })
        )
        .pipe(babel({ presets: ['@babel/env'], compact: false }))
        .pipe(debug ? gulpDebug({ title: 'MODERNIZR :: OUTPUT' }) : noop())
        .pipe(gulp.dest(path.to.dist.js));
}
