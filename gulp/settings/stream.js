// === SOURCE HELPER
// ============================================================================
// Gulp 5 (vinyl-fs 4) throws ENOENT when a glob's directory does not exist,
// where Gulp 4 yielded an empty stream. A starter is routinely missing some of
// styles/ js/ images/ fonts/, so a missing directory must be a no-op, not a
// failed build.

import { Readable } from 'node:stream';
import { globSync } from 'node:fs';
import gulp from 'gulp';

export function srcOrEmpty(globs, opts = {}) {
    const patterns = Array.isArray(globs) ? globs : [globs];
    const included = patterns.filter((pattern) => !pattern.startsWith('!'));
    const hasMatch = included.some((pattern) => globSync(pattern).length > 0);

    if (!hasMatch) {
        return Readable.from([], { objectMode: true });
    }

    return gulp.src(globs, opts);
}
