const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('../settings/paths'),
    errors = require('../settings/errors'),
    argv = require('yargs').argv,
    noop = require('gulp-noop');

let dev = argv.dev === true ? true : false; 
let debug = argv.debug === true ? true : false; 


function concatCss() {
    const cssnanoTimer = plugins.duration('CSS-Nano time')
    const concatTimer = plugins.duration('Concatenate Time')

    return gulp
		.src([path.to.css.files, '!' + path.to.css.source + '/quote-forms.css'])
		.pipe(argv.debug ? plugins.debug({ title: 'CSS SRC' }) : noop())

		.pipe(
			plugins.plumber({
				errorHandler: errors.handleError,
			})
		)
		.pipe(plugins.sourcemaps.init())
		.once('data', concatTimer.start)
		.pipe(plugins.concat('main.min.css'))
		.pipe(concatTimer)

		.once('data', cssnanoTimer.start)
		.pipe(dev ? noop() : plugins.cssnano()) // MINIFY CSS IF PRODUCTION
		.pipe(cssnanoTimer)

		.pipe(dev ? plugins.sourcemaps.write() : noop())

		.pipe(gulp.dest(path.to.dist.css))

		.pipe(debug ? plugins.debug({ title: 'CSS SRC ORDER' }) : noop())

		.pipe(plugins.plumber.stop());
}
exports.concatCss = concatCss;