// === IMAGES
// ============================================================================
// sharp replaces the imagemin chain: actively maintained, much faster, and it
// emits modern formats rather than only shrinking the original. Each raster
// source produces an optimised original plus WebP and AVIF siblings, so
// markup can offer them through <picture>.
//
// This runs on plain promises rather than a gulp stream, which also avoids the
// fixed ~500ms cost gulp.src -> gulp.dest carries per task.

import { globSync } from 'node:fs';
import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';

import sharp from 'sharp';

import path from '../settings/paths.js';
import { debug } from '../settings/env.js';

const RASTER = new Set(['.jpg', '.jpeg', '.png']);
const PASSTHROUGH = new Set(['.svg', '.gif', '.ico', '.webp', '.avif']);

async function convert(file) {
    const rel = relative(path.to.img.source, file);
    const target = join(path.to.dist.img, rel);
    const ext = extname(file).toLowerCase();

    await mkdir(dirname(target), { recursive: true });

    // sharp has no advantage over a copy for vectors and animations.
    if (PASSTHROUGH.has(ext)) {
        await copyFile(file, target);
        return [rel];
    }

    if (!RASTER.has(ext)) {
        return [];
    }

    const image = sharp(file);
    const stripExt = target.slice(0, -ext.length);

    await Promise.all([
        ext === '.png'
            ? image.clone().png({ compressionLevel: 9 }).toFile(target)
            : image.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(target),
        image.clone().webp({ quality: 80 }).toFile(`${stripExt}.webp`),
        image.clone().avif({ quality: 55 }).toFile(`${stripExt}.avif`),
    ]);

    return [
        rel,
        `${rel.slice(0, -ext.length)}.webp`,
        `${rel.slice(0, -ext.length)}.avif`,
    ];
}

export async function images() {
    const files = globSync(path.to.img.files, {
        exclude: (entry) => entry === 'node_modules' || entry === '.git',
    });

    if (files.length === 0) {
        return;
    }

    const written = (await Promise.all(files.map(convert))).flat();

    if (debug) {
        written.forEach((file) => console.log(`IMAGES :: ${file}`));
    }
}
