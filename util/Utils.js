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

module.exports.encodedString = function(len) {
	//let len = 6
	let result           = '';
	let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789';
	let charactersLength = characters.length;
	for ( var i = 0; i < len; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	console.log('----------encodedString-------------',result)
	return result;

};

module.exports.encodedDecodedString = function(code,type) {

	
	let result;
	console.log('-------code------------',code)
	if(type == 0){
		
		let buf = Buffer.from(code);		
	let encodedData = buf.toString('base64');

	console.log('-------encodedData------------',encodedData)

	 result=encodedData;

	console.log('-------result------------',result)

	}else{
		console.log('-------type1------------',type)
		
		let buff1 = Buffer.from(code, 'base64');


	//console.log('-------buff1------------',buff1)

	let text = buff1.toString('ascii');	

	console.log('-------text------------',text)
	
	 result=text;
	}


	return result;

};
