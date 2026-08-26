// === PATHS
// ============================================================================
// Everything the build reads lives under src/; everything it writes lives
// under dist/. Point these at an existing project's folders to adopt the
// build without moving files.

const _srcDir = './src';
const _distDir = './dist';

const path = {
    to: {
        src: {
            root: _srcDir,
        },

        sass: {
            source: _srcDir + '/styles',
            files: _srcDir + '/styles/**/*.scss',
        },

        js: {
            source: _srcDir + '/scripts',
            files: _srcDir + '/scripts/**/*.js',
            // Bundling needs a single entry; imports reach everything else.
            entry: _srcDir + '/scripts/main.js',
        },

        img: {
            source: _srcDir + '/images',
            files: _srcDir + '/images/**/*.*',
        },

        fonts: {
            source: _srcDir + '/fonts',
            files: _srcDir + '/fonts/**/*.*',
        },

        html: {
            // Cheap globstar now that it is scoped to src/ rather than the
            // whole project.
            files: _srcDir + '/**/*.html',
        },

        // Copied to the site root verbatim.
        serverFiles: [
            _srcDir + '/robots.txt',
            _srcDir + '/sitemap.xml',
            _srcDir + '/_headers',
        ],

        dist: {
            js: _distDir + '/js',
            css: _distDir + '/css',
            img: _distDir + '/images',
            fonts: _distDir + '/fonts',
            root: _distDir,
        },
    },
};

export default path;
