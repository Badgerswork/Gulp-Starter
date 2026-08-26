// === ERROR HANDLING
// ============================================================================
// Was 20 lines of ASCII-art "ERROR", a system beep and a desktop notification.
// A plugin name, a file and a message is what actually helps. Node's built-in
// util.styleText replaces ansi-colors.

import { styleText } from 'node:util';

import { dev } from './env.js';

export function handleError(err) {
    const plugin = err.plugin ? `[${err.plugin}] ` : '';
    const file = err.relativePath || err.file || '';

    console.error(styleText(['red', 'bold'], `\n${plugin}${err.message}`));
    if (file) {
        console.error(styleText('dim', `  in ${file}\n`));
    }

    // A one-off build that hits an error must exit non-zero, or CI reports a
    // broken stylesheet as a green build. Watch still keeps running, since
    // dying on every typo makes it useless.
    if (!dev) {
        process.exitCode = 1;
    }

    this.emit('end');
}

export default { handleError };
