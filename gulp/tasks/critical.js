// === CRITICAL PATH CSS
// ============================================================================

import { globSync } from 'node:fs';

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import plumber from 'gulp-plumber';
import noop from 'gulp-noop';
import { stream as critical } from 'critical';

import path from '../settings/paths.js';
import { handleError } from '../settings/errors.js';
import { dev } from '../settings/env.js';
import { browserSync } from '../settings/browsersync.js';

export function criticalPath() {
    // Previously hardcoded to 'dist/css/styles.css', which the sass task never
    // produces -- it emits one file per source .scss. Resolve what was actually
    // built instead; if nothing matches, let critical discover the stylesheets
    // from the document's own <link> tags.
    const builtCss = globSync(path.to.dist.css + '/**/*.css').filter(
        (file) => !file.endsWith('.min.css')
    );

    return srcOrEmpty(path.to.html.files)
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(
            critical({
                base: './',
                inline: true,
                ...(builtCss.length > 0 ? { css: builtCss } : {}),
                dimensions: [
                    { height: 200, width: 500 },
                    { height: 900, width: 1200 },
                ],
            })
        )
        .pipe(gulp.dest(path.to.dist.root))
        .pipe(dev ? browserSync.stream() : noop());
}
