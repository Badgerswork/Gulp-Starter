var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['*'],
	}),
	path = require('./gulp-settings/paths'),
	browserSync = require('browser-sync').create(),
    reload = browserSync.reload;


require('./gulp-tasks/scripts')(gulp, plugins);
require('./gulp-tasks/cleaner')(gulp, plugins);
require('./gulp-tasks/lint')(gulp, plugins);
gulp.task('sass', require('./gulp-tasks/sass')(gulp, plugins));
gulp.task('browser-sync', require('./gulp-tasks/browser-sync')(gulp, plugins));


gulp.task('default', function () {
	watchFiles();
});
gulp.task('watch', ['default', 'browser-sync'], function () {
	watchFiles();
});

//	LINTER RUNS FIRST AS DEPENDENCY TO KEEP CODE QUALITY UP
gulp.task('sassLint', ['css-lint'], function () {
	gulp.start('sass');
});

// PUBLISH-SCRIPTS TASK DEPENDANT ON OTHER CONCAT TASKS FIRST
// FOR MINIMISED VERSION USE FLAG '--dist'
gulp.task('concatScripts', ['jsVendor', 'jsScripts', 'jsPartials'], function () {
	gulp.start('buildScripts');
});

gulp.task('scripts', ['cleaner'], function () {
	gulp.start('concatScripts');
});

function watchFiles() {
	gulp.watch(path.to.sass.files, ['sassLint',  browserSync.reload]);
	gulp.watch([path.to.js.partials, path.to.js.scripts, path.to.js.vendor], ['scripts', browserSync.reload]);
}