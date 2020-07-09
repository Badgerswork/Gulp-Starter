// === PATHS
// ============================================================================

const _baseDir = '.';
const _distDir = './dist';
const _nodeModules = "./node_modules";

let path = {
    to: {

        allFiles: _baseDir + '/**/**.**',

        sass: {
            source: _baseDir + '/styles',
            files: _baseDir + '/styles/**/*.scss',
        },

        css: {
            source: _baseDir + '/css',
            files: _baseDir + '/css/**/*.css',
        },

        js: {
            source: _baseDir + '/js',
            files: _baseDir + '/js/**/**.**',
        },

        img: {
            source: _baseDir + '/images',
            files: _baseDir + '/images/**/**.**',
        },

        html: {
            files: _baseDir + '/**.html',
        },

        templates: {
            source: _baseDir + '/_site',
            files: _baseDir + '/_site/**/**.*',
        },

        includes: {
            source: _baseDir + '/_includes',
        },

        fonts: {
            source: _baseDir + '/fonts',
            files: _baseDir + '/fonts/**/**.*',
        },

        svg: {
            source: _baseDir + '/svg',
            files: _baseDir + '/svg/*.svg',
            icons: _baseDir + '/svg/icons/*.svg',
        },

        dist: {
            js: _distDir + '/js',
            css: _distDir + '/css',
            img: _distDir + '/images',
            fonts: _distDir + '/fonts',
            svg: _distDir + '/svg',
            root: _distDir,
        },

        nodeModules: {
            root: _nodeModules
        },
    }
};

module.exports = path;