const moment = require('moment');

module.exports.dateTimeDiff = function(scheduleDateTime) {
	var now  = new Date();
	var then = scheduleDateTime;
	// let diff = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
	let diff = moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss")).fromNow();
	// console.log('----',diff);
	return diff
};

module.exports.generateOtp = function(len) {
	let result           = '';
	let characters       = '0123456789';
	let charactersLength = characters.length;
	for ( var i = 0; i < len; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};
