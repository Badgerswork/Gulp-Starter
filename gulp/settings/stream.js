// === SOURCE HELPER
// ============================================================================
// Gulp 5 (vinyl-fs 4) throws ENOENT when a glob's directory does not exist,
// where Gulp 4 yielded an empty stream. A starter is routinely missing some of
// styles/ js/ images/ fonts/, so a missing directory must be a no-op, not a
// failed build.

import { Readable } from 'node:stream';
import { globSync } from 'node:fs';
import gulp from 'gulp';

// Directories a source glob should never descend into. Probing without this
// walks node_modules, which costs ~250ms per task on every build.
const alwaysExclude = ['node_modules', '.git'];

export function srcOrEmpty(globs, opts = {}) {
    const patterns = Array.isArray(globs) ? globs : [globs];
    const negated = patterns.filter((pattern) => pattern.startsWith('!'));

    // Honour the caller's own negations in the probe as well, or it traverses
    // directories the real glob was explicitly told to skip.
    const excluded = [
        ...alwaysExclude,
        ...negated.map((pattern) =>
            pattern.replace(/^!\.?\/?/, '').replace(/\/\*\*$/, ''),
        ),
    ].filter(Boolean);

    const exclude = (entry) =>
        excluded.some((dir) => entry === dir || entry.startsWith(dir + '/'));

    // Filter per pattern, not all-or-nothing: a task sourcing both styles/ and
    // js/ must still work when only one of them exists.
    const live = patterns
        .filter((pattern) => !pattern.startsWith('!'))
        .filter((pattern) => globSync(pattern, { exclude }).length > 0);

    if (live.length === 0) {
        return Readable.from([], { objectMode: true });
    }

    // The probe skips these, so the real glob must too -- otherwise a
    // project-root pattern reports "no matches" while gulp.src happily reads
    // half of node_modules.
    const ignore = [
        ...alwaysExclude.map((dir) => `**/${dir}/**`),
        ...(opts.ignore ?? []),
    ];

    return gulp.src([...live, ...negated], { ...opts, ignore });
}
