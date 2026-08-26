// === CLEAN
// ============================================================================
// `del` is no longer needed: fs.rm has been built into Node since v14.

import { rm } from 'node:fs/promises';
import path from '../settings/paths.js';

const remove = (target) => rm(target, { recursive: true, force: true });

export const cleanCss = () => remove(path.to.dist.css);
export const cleanJs = () => remove(path.to.dist.js);
export const cleanDist = () => remove(path.to.dist.root);
