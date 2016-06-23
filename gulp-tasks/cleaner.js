module.exports = function (gulp, plugins) {

	var path = require('../gulp-settings/paths'),
		gutil = require('gulp-util'),
		argv = require('yargs').argv;

	//CLEAN OUT THE DIST AND CONCAT DIRECTORIES
	return gulp.task('cleaner', function () {
		return gulp.src([
			path.to.js.dist
		])
		.pipe(argv.debug ? plugins.debug({  title: 'Cleaning Dist Folders' }) : gutil.noop())
		.pipe(plugins.clean())
	});
}