// === SASS
// ============================================================================

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import gulpDebug from 'gulp-debug';
import noop from 'gulp-noop';
import gulpPostcss from 'gulp-postcss';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import path from '../settings/paths.js';
import setup from '../settings/config.js';
import { handleError } from '../settings/errors.js';
import { dev, debug } from '../settings/env.js';
import { browserSync } from '../settings/browsersync.js';

// gulp-sass no longer bundles a compiler; dart-sass is injected here.
const sassCompiler = gulpSass(dartSass);

export function sass() {
    // Autoprefixer runs in both modes -- it is a correctness pass, not an
    // optimisation. cssnano runs for production only. Previously the whole
    // postcss step was gated on `dev`, which minified development builds and
    // shipped unprocessed CSS to production.
    const processors = [autoprefixer, ...(dev ? [] : [cssnano])];

    return srcOrEmpty(path.to.sass.files, { sourcemaps: dev })
        .pipe(debug ? gulpDebug({ title: 'SASS :: SRC' }) : noop())
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(
            sassCompiler({
                // dart-sass's modern API: `style` and `loadPaths`, not
                // node-sass's `outputStyle` and `includePaths`.
                style: dev ? setup.dev.sassStyle : setup.prod.sassStyle,
                loadPaths: [path.to.sass.source],
            }).on('error', sassCompiler.logError)
        )
        .pipe(gulpPostcss(processors))
        .pipe(debug ? gulpDebug({ title: 'SASS :: OUTPUT' }) : noop())
        // `sourcemaps` must be set on dest too, or gulp silently drops them.
        .pipe(gulp.dest(path.to.dist.css, { sourcemaps: dev ? '.' : false }))
        .pipe(browserSync.stream());
}
