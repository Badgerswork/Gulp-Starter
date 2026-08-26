// === SASS LINT
// ============================================================================
// stylelint's own API, not a postcss pipeline. The previous task carried ~130
// inline stylistic rules, all deprecated in stylelint 15 and removed in 16 --
// it lints nothing against stylelint 17. Rules now live in .stylelintrc.json;
// Prettier owns formatting, stylelint owns correctness.

import stylelint from 'stylelint';

import path from '../settings/paths.js';
import { dev } from '../settings/env.js';

export async function cssLint() {
    const { report, errored } = await stylelint.lint({
        files: path.to.sass.files,
        formatter: 'string',
        allowEmptyInput: true,
    });

    if (report.trim()) {
        console.log(report);
    }

    // Fail a one-off build so CI catches it; keep watch alive during dev.
    if (errored && !dev) {
        process.exitCode = 1;
    }
}
