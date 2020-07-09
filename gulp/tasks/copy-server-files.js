const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('../settings/paths'),
    errors = require('../settings/errors'),
    argv = require('yargs').argv;

    let debug = argv.debug === true ? true : false;

let filesToCopy = [
    'robots.txt', 
    'sitemap.xml',
    '_headers.txt'
];

function copyServerFiles() {
    return gulp.src(filesToCopy, { allowEmpty: true })
    .pipe(plugins.plumber({
        errorHandler: errors.handleError
    }))
    .pipe((debug) ? plugins.debug({ title: 'MOVE SERVER FILES ::: ' }) : noop())
    .pipe(gulp.dest(path.to.dist.root))
}

exports.copyServerFiles = copyServerFiles;