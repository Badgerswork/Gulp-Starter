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

// REQUIRED EXTERNAL FILES FROM NODE MODULES
const SmoothScroll = "/smoothscroll/smoothscroll.js";
const WhatInput = "/what-input/dist/what-input.js";

function vendorScripts() {
	return gulp.src([
		path.to.nodeModules.root + SmoothScroll,
		path.to.nodeModules.root + WhatInput
	])
	.pipe(debug ? plugins.debug({ title: 'VENDOR SCRIPTS:' }) : noop())
	.pipe(plugins.plumber({
		errorHandler: errors.handleError
	}))
	.pipe(plugins.concat("vendor.js"))
	.pipe(debug ? plugins.debug({ title: 'CONCAT VENDOR SCRIPTS:' }) : noop())
	.pipe(gulp.dest(path.to.js.vendor))
	.pipe(plugins.plumber.stop())
}
exports.vendorScripts = vendorScripts;