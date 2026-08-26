// Tests for srcOrEmpty -- the one piece of genuinely hand-written logic in the
// build. It exists because Gulp 5 throws ENOENT on a missing source directory
// where Gulp 4 yielded an empty stream, and a starter is routinely missing
// some of styles/ scripts/ images/ fonts/.

import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

import { srcOrEmpty } from '../gulp/settings/stream.js';

let dir;
let cwd;

/** Collect a vinyl stream into a sorted list of paths relative to the fixture. */
function collect(stream) {
    return new Promise((resolve, reject) => {
        const files = [];
        stream
            .on('data', (file) => files.push(relative(dir, file.path)))
            .on('error', reject)
            .on('end', () => resolve(files.sort()));
    });
}

before(async () => {
    dir = await mkdtemp(join(tmpdir(), 'gulp-starter-'));
    cwd = process.cwd();
    process.chdir(dir);

    await mkdir(join(dir, 'styles'), { recursive: true });
    await mkdir(join(dir, 'node_modules/some-pkg'), { recursive: true });
    await writeFile(join(dir, 'styles/main.scss'), 'a{color:red}');
    await writeFile(join(dir, 'styles/_partial.scss'), '$x: 1;');
    await writeFile(join(dir, 'node_modules/some-pkg/index.scss'), 'b{}');
    // deliberately no scripts/ directory
});

after(async () => {
    process.chdir(cwd);
    await rm(dir, { recursive: true, force: true });
});

describe('srcOrEmpty', () => {
    test('yields matching files for a directory that exists', async () => {
        const files = await collect(srcOrEmpty('./styles/**/*.scss'));
        assert.deepEqual(files, ['styles/_partial.scss', 'styles/main.scss']);
    });

    test('returns an empty stream instead of throwing when the directory is absent', async () => {
        const files = await collect(srcOrEmpty('./scripts/**/*.js'));
        assert.deepEqual(files, []);
    });

    test('accepts a bare string as well as an array', async () => {
        const asString = await collect(srcOrEmpty('./styles/**/*.scss'));
        const asArray = await collect(srcOrEmpty(['./styles/**/*.scss']));
        assert.deepEqual(asString, asArray);
    });

    // The regression this file exists for: the first implementation used
    // .some(), so one present directory sent every pattern to gulp.src and the
    // absent one threw ENOENT.
    test('filters per pattern when only some directories exist', async () => {
        const files = await collect(
            srcOrEmpty(['./styles/**/*.scss', './scripts/**/*.js']),
        );
        assert.deepEqual(files, ['styles/_partial.scss', 'styles/main.scss']);
    });

    test('is empty when no pattern matches anything', async () => {
        const files = await collect(
            srcOrEmpty(['./nope/**/*.js', './also-nope/*.css']),
        );
        assert.deepEqual(files, []);
    });

    test('honours negated patterns', async () => {
        const files = await collect(
            srcOrEmpty(['./styles/**/*.scss', '!./styles/_partial.scss']),
        );
        assert.deepEqual(files, ['styles/main.scss']);
    });

    test('does not traverse node_modules', async () => {
        const files = await collect(srcOrEmpty('./**/*.scss'));
        assert.ok(
            !files.some((file) => file.includes('node_modules')),
            `node_modules leaked into the stream: ${files.join(', ')}`,
        );
    });

    test('passes options through to gulp.src', async () => {
        const stream = srcOrEmpty('./styles/**/*.scss', { read: false });
        const contents = [];
        await new Promise((resolve, reject) =>
            stream
                .on('data', (file) => contents.push(file.contents))
                .on('error', reject)
                .on('end', resolve),
        );
        assert.ok(
            contents.every((c) => c === null),
            'read:false should leave contents null',
        );
    });
});
