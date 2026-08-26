// === ENVIRONMENT FLAGS
// ============================================================================
// Parsed once, here, rather than re-derived in every task file. The old
// per-file `argv = require('yargs').argv` lines leaked implicit globals,
// which is fatal under ESM's strict mode.
//
// Two boolean flags do not need an argument parser, so yargs is gone.

const flags = new Set(process.argv.slice(2));

export const dev = flags.has('--dev');
export const debug = flags.has('--debug');
