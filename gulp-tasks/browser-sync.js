
	
module.exports = function (gulp, plugins) {

	return function () {

		plugins.browserSync.init({
				
			proxy: {
				target: 'localhost:8020'
			}
		});

	};

};

