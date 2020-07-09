const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('../settings/paths'),
    errors = require('../settings/errors'),
    argv = require('yargs').argv,
    noop = require('gulp-noop');

let debug = argv.debug === true ? true : false; 

function fonts() {
    return gulp.src(path.to.fonts.files)
        .pipe(plugins.plumber({
            errorHandler: errors.handleError
        }))
        .pipe(debug ? plugins.debug({ title: 'FONTS :: SRC' }) : noop())
        .pipe(gulp.dest(path.to.dist.fonts))
        .pipe(debug ? plugins.debug({ title: 'FONTS :: OUTPUT' }) : noop())
}
exports.fonts = fonts;