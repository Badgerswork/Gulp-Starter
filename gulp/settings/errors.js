﻿// === ERROR HANDLING

const 	beep = require('beepbeep'),
		notify = require("gulp-notify"),
		c = require('ansi-colors'),
		log = require('fancy-log');

module.exports =
    {
        handleError: function (err) {
			console.log(c.bold.bgMagenta(`

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  
		ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  
		ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  
		ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  ERROR  
		

		ERROR : ${err.plugin} :::  ${err.message}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	`));
		notify.onError(
			beep([1000, 1000, 2000])
		)
		this.emit('end');
	}
};