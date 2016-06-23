// === PATHS
// ============================================================================

var _baseDir = './';

module.exports =
{

	to: {

		allFiles: _baseDir + '/**/**.**',

		css: {
			source: _baseDir + '/css',
			files: _baseDir + '/css/*.css',
		},

		sass: {
			source: _baseDir + '/sass',
			files: _baseDir + '/sass/**/*.scss',
		},

		js: {
			source: _baseDir + '/js',
			partials: _baseDir + '/js/partials/**/*.js',
			vendor: _baseDir + '/js/vendor/**/*.js',
			scripts: _baseDir + '/js/scripts/**/*.js',
			dist: _baseDir + '/js/dist',
		},

		html: {

			source: './Views/**/*.cshtml'
		}



		//templates: {
		//	source: _baseDir + '/templates',
		//	files: _baseDir + '/templates/*.tpl',
		//	partials: _baseDir + '/templates/**/*',
		//	destination: _baseDir + '/html',
		//},

		//svg: {
		//	source: _baseDir + '/svg',
		//	files: _baseDir + '/svg/icons/*.svg',
		//},

		//images: _baseDir + '/images'

	}

};













