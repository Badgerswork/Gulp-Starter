
const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
    }),
    postcss = require('gulp-postcss'),
    sassCompiler = require('gulp-sass')(require('sass')),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    browserSync = require('browser-sync').create(),
    path = require('../settings/paths'),
    errors = require('../settings/errors'),
    argv = require('yargs').argv,
    noop = require('gulp-noop'),
    setup = require('../settings/config');


    let dev = argv.dev === true ? true : false;
    let debug = argv.debug === true ? true : false;



function sass() {

    const sassTimer = plugins.duration('Compile SASS time');
    const processors = [
        autoprefixer,
        cssnano
    ];
    return gulp.src(path.to.sass.files, { sourcemaps: true })
        .pipe((debug) ? plugins.debug({ title: 'SASS SRC' + path.to.sass.files }) : noop())
        //// PIPE ERRORS VIA PLUMBER TO FIX STREAM AND GET BETTER ERROR REPORTING
        .pipe(plugins.plumber({
            errorHandler: errors.handleError
        }))

        // .pipe((dev) ? plugins.sourcemaps.init() : noop())

        .pipe((debug) ? plugins.debug({ title: 'INIT SRCMAP' }) : noop())
        // .once('data', sassTimer.start)
        .pipe(sassCompiler({
            style: dev ? setup.dev.sassStyle : setup.prod.sassStyle,
            loadPaths: [path.to.sass.source],
        }).on('error', sassCompiler.logError))
       
        // MINIFY CSS IF PRODUCTION
        .pipe(dev ? postcss(processors) : noop())

        // WRITE SOURCE MAPS
        // .pipe(dev ? plugins.sourcemaps.write() : noop())

        .pipe(debug ? plugins.debug({ title: path.to.dist.css }) : noop())
        // SAVE TO CSS FOLDER
        .pipe(gulp.dest("./dist/css"))

        // Trigger browsersync update
        .pipe(browserSync.stream())
        //.pipe(bs2.reload({ stream: true }))

        // PLUMBER STOP
        .pipe(plugins.plumber.stop())
}

exports.sass = sass;