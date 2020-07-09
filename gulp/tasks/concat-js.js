const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('../settings/paths'),
    errors = require('../settings/errors'),
    babel = require('gulp-babel');
    argv = require('yargs').argv,
    noop = require('gulp-noop');

let dev = argv.dev === true ? true : false; 
let debug = argv.debug === true ? true : false; 

function concatJs() {
    const concatTimer = plugins.duration('Concatenate Scripts Time')
    const babelTimer = plugins.duration('Babel Scripts Time')

	return gulp.src([path.to.js.files
		// EXCLUDE FILES LIKE THIS
        // `! ${path.to.js.source}/filename.js,
    ])
        .pipe(plugins.plumber({
            errorHandler: errors.handleError
        }))
        .pipe(debug ? plugins.debug({ title: 'Partial-Scripts :: SRC' }) : noop())
        // .pipe(plugins.order([
			   ////SPECIFY THE ORDER TO CONCAT THE FILES IN
        //     "components/*.js",
        //     "app.js"
        // ]))
        .pipe(debug ? plugins.debug({ title: 'Partial-Scripts :: ORDER' }) : noop())
        .once('data', concatTimer.start)
        .pipe(plugins.concat("scripts.min.js"))
        .pipe(concatTimer)
        .once('data', babelTimer.start)
        .pipe(babel({
            presets: ['@babel/env', { "sourceType": "script" }],
            compact: false
        }))
        .pipe(babelTimer)
        .pipe(gulp.dest(path.to.dist.js))
        .pipe(plugins.plumber.stop())
        .pipe(debug ? plugins.debug({ title: 'Partial-Scripts :: OUTPUT' }) : noop())
}
exports.concatJs = concatJs;