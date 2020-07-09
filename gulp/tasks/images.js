const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('../settings/paths'),
    errors = require('../settings/errors'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant')
    argv = require('yargs').argv,
    noop = require('gulp-noop');

let dev = argv.dev === true ? true : false; 
let debug = argv.debug === true ? true : false; 



function imageToDist() {
    return gulp.src(path.to.img.files)
        .pipe(plugins.plumber({
            errorHandler: errors.handleError
        }))
        .pipe(plugins.debug({ title: 'MOVE IMAGES :: IN' }))
        .pipe(gulp.dest(path.to.dist.img))
        .pipe(plugins.debug({ title: 'MOVE IMAGES :: OUT' }))
        .pipe(plugins.plumber.stop())
}

function minifyImages() {
    return gulp.src(path.to.dist.img + "/**/**.*")
        .pipe(plugins.plumber({
            errorHandler: errors.handleError
        }))
		.pipe(debug ? plugins.debug({ title: 'IMAGES :: SRC' }) : noop())
		        
        .pipe(imagemin({
            verbose: false,
            progressive: true,
            use: [pngquant()]
        }))

        .pipe(debug ? plugins.debug({ title: 'IMAGES :: OUT' }) : noop())
        .pipe(plugins.plumber.stop())
}

exports.imageToDist = imageToDist;
exports.minifyImages = minifyImages;