const gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['*'],
	}),
	path = require('../settings/paths'),
	errors = require('../settings/errors'),
	babel = require('gulp-babel');
    argv = require('yargs').argv,
    noop = require('gulp-noop');

let debug = argv.debug === true ? true : false; 

function modernizr() {
    const ModernizrTimer = plugins.duration('Modernizr time')
    return gulp.src([path.to.sass.files, path.to.js.files])
        .pipe(debug ? plugins.debug({ title: 'Modernizr SRC' }) : noop())
        .pipe(plugins.plumber({
            errorHandler: errors.handleError
        }))
        .once('data', ModernizrTimer.start)
        .pipe(plugins.modernizr({
            options: [
                "setClasses",
                "addTest",
                "html5shiv",
                "testProp"
            ],
            excludeTests: ['hidden']
        }))
		.pipe(ModernizrTimer)
		.pipe(babel({
            presets: ['@babel/env', { "sourceType": "script" }],
            compact: false
        }))
        .pipe(debug ? plugins.debug({ title: 'Modernizr Complete Style' }) : noop())
        .pipe(gulp.dest(path.to.dist.js))
        .pipe(plugins.plumber.stop())
}
exports.modernizr = modernizr;