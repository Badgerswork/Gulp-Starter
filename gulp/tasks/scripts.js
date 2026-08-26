// === SCRIPTS
// ============================================================================
// esbuild replaces concat + babel. Concatenation had no module system, which
// is why a vendor task existed to copy libraries out of node_modules by hand;
// real `import` statements give ordering, tree-shaking and npm packages for
// free. Targets come from the browserslist in package.json, so there is one
// source of truth for browser support.

import { existsSync } from 'node:fs';

import * as esbuild from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';

import path from '../settings/paths.js';
import { dev } from '../settings/env.js';

export async function scripts() {
    if (!existsSync(path.to.js.entry)) {
        return;
    }

    await esbuild.build({
        entryPoints: [path.to.js.entry],
        outfile: `${path.to.dist.js}/main.js`,
        bundle: true,
        format: 'esm',
        target: browserslistToEsbuild(),
        minify: !dev,
        sourcemap: dev,
        logLevel: 'warning',
    });
}
