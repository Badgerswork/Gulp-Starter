const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['*'],
    }),
    path = require('./gulp/settings/paths'),
    browsersync = require('browser-sync').create();

////*******************//
////	REQUIRE FILES
////*******************//
const { sass } = require('./gulp/tasks/sass')
const { cleanCss, cleanJs, cleanDist } = require('./gulp/tasks/clean');
const { fonts } = require('./gulp/tasks/fonts');
const { imageToDist, minifyImages } = require('./gulp/tasks/images');
// const { cssLint } = require('./gulp/tasks/lint');
const { modernizr } = require('./gulp/tasks/modernizr');
const { concatJs } = require('./gulp/tasks/concat-js');
const { criticalPath } = require('./gulp/tasks/critical');
const { copyServerFiles } = require('./gulp/tasks/copy-server-files')

////*******************//
////	TASKS
////*******************//

const taskSeries = {

    browserSync(done) {
        browsersync.init({
            // proxy: {
            //     target: 'http://my-site.local' //// Uncomment proxy settings if you have your site running on a specific local url 
            // },
          server: {
            baseDir: "./dist/"
          },
          port: 3000, //// SET WHICH PORT NUMBER YOU PREFER TO SERVE UPON
          open: true,
            injectChanges: true,
            watchEvents: ['add', 'change']
        });
        done();
    },
      
      // BrowserSync Reload
    browserSyncReload(done) {
        browsersync.reload();
        done();
    },

    runStyles(done) {
        return gulp.series(cleanCss, sass, criticalPath, browserSyncReload, (seriesDone) => {
            seriesDone();
            done();
        })();
    },

    styles(done) {
        return gulp.series(sass, criticalPath, browserSyncReload, (seriesDone) => {
            seriesDone();
            done();
        })();
    },

    runScripts(done) {
        return gulp.series(cleanJs, gulp.parallel(modernizr), concatJs, browserSyncReload, (seriesDone) => {
            seriesDone();
            done();
        })();
    },

    images(done) {
        return gulp.series(imageToDist, minifyImages, (seriesDone) => {
            seriesDone();
            done();
        })();
    },

    serverfiles(done) {
        return gulp.series(copyServerFiles, (seriesDone) => {
            seriesDone();
            done();
        })();
    },

    cleanDistFiles(done) {
        return gulp.series(cleanDist, (seriesDone) => {
            seriesDone();
            done();
        })();
    },

    watchFiles() {
        gulp.watch("./styles/**/**.*", styles);
        gulp.watch("./images/**/**.*", images);
        gulp.watch("./fonts/**/**.*", fonts);
        gulp.watch("./js/**/**.*", runScripts);
        gulp.watch("./**.html", gulp.series(criticalPath, browserSyncReload));
    },
}

const { runStyles, styles, runScripts, images, watchFiles, browserSync, browserSyncReload, serverfiles, cleanDistFiles} = taskSeries;

exports.default = gulp.parallel(runStyles, runScripts, fonts, images);
exports.dist = gulp.series(cleanDistFiles, gulp.parallel(runStyles, runScripts, images, fonts, serverfiles), criticalPath);
exports.build = exports.default;
exports.styles = styles;
exports.scripts = runScripts;
exports.criticalPath = criticalPath;
exports.watch = gulp.parallel(watchFiles, browserSync);
exports.serverfiles = serverfiles;
exports.cleanCss = cleanCss;
exports.cleanJs = cleanJs;
exports.cleanDist = cleanDist;