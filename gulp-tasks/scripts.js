module.exports = function (gulp, plugins) {

	var path = require('../gulp-settings/paths'),
		gutil = require('gulp-util'),
		argv = require('yargs').argv;


	//CONCATENATE VENDOR SCRIPTS - MAKING JQUERY FIRST
	gulp.task('jsVendor', function () {
		return gulp.src(path.to.js.vendor)
		.pipe(argv.debug ? plugins.debug({ title: 'Vendor :: SRC' }) : gutil.noop())
		.pipe(plugins.order([
		"jquery*.*",
		"**/*.js"
		]))
		.pipe(argv.debug ? plugins.debug({ title: 'Vendor :: ORDER' }) : gutil.noop())
		.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.init())
		.pipe(plugins.concat("vendor.js"))
		.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.write())
	    .pipe(gulp.dest(path.to.js.dist))
		.pipe(argv.debug ? plugins.debug({ title: 'Vendor :: OUTPUT' }) : gutil.noop())
	})

	
	//CONCATENATE SCRIPTS - MAKING JQUERY FIRST
	gulp.task('jsScripts', function () {
		return gulp.src(path.to.js.scripts)
		.pipe(argv.debug ? plugins.debug({ title: 'Scripts :: SRC' }) : gutil.noop())
		.pipe(plugins.order([
			"jquery*.*",
			"**/*.js"
		]))
		.pipe(argv.debug ? plugins.debug({ title: 'Scripts :: ORDER' }) : gutil.noop())
		.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.init())
	    .pipe(plugins.concat("scripts.js"))
		.pipe(argv.dist ? gutil.noop(): plugins.sourcemaps.write())
	    .pipe(gulp.dest(path.to.js.dist))
		.pipe(argv.debug ? plugins.debug({ title: 'Scripts :: OUTPUT' }) : gutil.noop())
	})

	//CONCATENATE PARTIALS
	gulp.task('jsPartials', function () {
		return gulp.src(path.to.js.partials)
		.pipe(argv.debug ? plugins.debug({ title: 'Partials :: SRC' }) : gutil.noop())
		.pipe(plugins.order([
			"**/*.js"
		]))
		.pipe(argv.debug ? plugins.debug({ title: 'Partials :: ORDER' }) : gutil.noop())
		.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.init())
	    .pipe(plugins.concat("partials.js"))

	    .pipe(gulp.dest(path.to.js.dist))
		.pipe(argv.debug ? plugins.debug({ title: 'Partials :: OUTPUT' }): gutil.noop())
	})

	//CONCATENATE THE PRECONCATENATED FILES FROM ABOVE THEN UGLIFY
	gulp.task('buildScripts', function () {
		return gulp.src([path.to.js.dist + '/*.js', '!' + path.to.js.dist + '/main-overrides.**.*'])
		.pipe(argv.debug ? plugins.debug({ title: 'BuildScripts :: SRC' }) : gutil.noop())
		// ORDER THE FILES IN THE CONCAT
		.pipe(plugins.order([
			"vendor.js",
			"scripts.js",
			"partials.js"
		]))
		.pipe(argv.debug ? plugins.debug({ title: 'BuildScripts :: ORDER' }) : gutil.noop())
		.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.init())
	    .pipe(plugins.concat("main.js"))
		.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.write())
		.pipe(gulp.dest(path.to.js.dist))
		.pipe(argv.debug ? plugins.debug({ title: 'BuildScripts :: OUTPUT' }) : gutil.noop())
		// RENAME FILE & UGLIFY IF RUN WITH '--type production'
		.pipe(argv.dist ? plugins.rename({ extname: ".min.js" }) : gutil.noop())
		.pipe(argv.dist ? plugins.uglify() : gutil.noop())
		.pipe(argv.dist ? gutil.noop() : plugins.sourcemaps.write())
		.pipe(argv.dist ? gulp.dest(path.to.js.dist) : gutil.noop())
		.pipe(argv.debug ? plugins.debug({ title: 'build-custom-scripts :: MIN' }) : gutil.noop())
		.pipe(plugins.browserSync.stream());
	});
};
