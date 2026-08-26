// === SASS LINT
// ============================================================================
// The previous inline rule block was ~130 stylistic rules, all deprecated in
// stylelint 15 and removed in 16 -- it lints nothing against stylelint 17.
// Phase 4 replaces this with stylelint-config-standard + Prettier.

import gulp from 'gulp';
import { srcOrEmpty } from '../settings/stream.js';
import gulpPostcss from 'gulp-postcss';
import stylelint from 'stylelint';
import reporter from 'postcss-reporter';
import scssSyntax from 'postcss-scss';

import path from '../settings/paths.js';

export function cssLint() {
    const processors = [
        stylelint(),
        reporter({ clearMessages: true, throwError: false }),
    ];

    return srcOrEmpty([path.to.sass.files])
        .pipe(gulpPostcss(processors, { syntax: scssSyntax }));
}
