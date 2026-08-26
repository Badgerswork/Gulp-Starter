// === BROWSERSYNC
// ============================================================================
// A single shared instance. Previously `.create()` was called separately in
// gulpfile.js, tasks/sass.js and tasks/critical.js; only the gulpfile's copy
// was ever init'ed, so `.stream()` from the sass task pushed CSS into an
// instance with no connected clients and live reload silently did nothing.

import browserSyncLib from 'browser-sync';

export const browserSync = browserSyncLib.create();

export function reload(done) {
    browserSync.reload();
    done();
}
