
const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('../settings/paths'),
    errors = require('../settings/errors'),
    critical = require('critical').stream,
    browserSync = require('browser-sync').create()
    argv = require('yargs').argv,
    noop = require('gulp-noop');

let dev = argv.dev === true ? true : false; 
 

function criticalPath() {
    return gulp.src(path.to.html.files)
    .pipe(plugins.plumber({
        errorHandler: errors.handleError
    }))
    .pipe(critical({
      base: './',
      inline: true,
      css: [
        'dist/css/styles.css',
      ],
      dimensions: [{
        height: 200,
        width: 500
      }, {
          height: 900,
          width: 1200
      }]
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(dev ? browserSync.stream() : noop())
}

exports.criticalPath = criticalPath;