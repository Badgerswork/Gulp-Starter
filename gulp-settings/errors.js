// === ERROR HANDLING

var gutil = require('gulp-util'),
    bs = require('browser-sync');


module.exports =
{
	handleError: function (err) {
		gutil.log(gutil.colors.green(err));
		bs.notify(err, 360000);
		this.emit('end');
	}
};