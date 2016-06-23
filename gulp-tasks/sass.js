module.exports = function (gulp, plugins) {

	var path = require('../gulp-settings/paths'),
		gutil = require('gulp-util'),
		argv = require('yargs').argv;

	return function () {
		gulp.src(path.to.sass.files)
			.pipe(plugins.sourcemaps.init())
            .pipe(argv.dist ?

				plugins.sass({
					style: 'expanded',
					sourceComments: 'normal', // none|normal|map
					includePaths: ['scss'],
					errLogToConsole: true
				}) : plugins.sass({
					style: 'compressed',
					sourceComments: 'none', // none|normal|map
					includePaths: ['scss'],
					errLogToConsole: true
				})
			)
			// WRITE SOURCEMAPS IF NOT PRODUCTION
			.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.write())
            .pipe(plugins.autoprefixer())
			.pipe(gulp.dest(path.to.css.source))
			// MINIFY CSS IF PRODUCTION
			.pipe(argv.dist ? plugins.rename({ extname: ".min.css" }) : gutil.noop())
			.pipe(argv.dist ? plugins.cssnano() : gutil.noop())
			.pipe(gulp.dest(path.to.css.source))
			.pipe(plugins.browserSync.stream());
	};
};