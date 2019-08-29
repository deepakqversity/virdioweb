const moment = require('moment');

module.exports.dateTimeDiff = function(scheduleDateTime) {
	var now  = new Date();
	var then = scheduleDateTime;
	// let diff = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
	let diff = moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss")).fromNow();
	console.log('----',diff);
	return diff
};
