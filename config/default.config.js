const dotenv = require('dotenv');
dotenv.config();

let config = {
	default : {
		maxUserLimit : process.env.MAX_ATTENDEE_LIMIT,
		preScreenUserLimit : process.env.PRE_SCREEN_ATTENDEE_LIMIT
	},
	rtm : {
		welcome : { code : 200, 'message' : 'Welcome #USER#'},
		handRaise : { code : 201, 'message' : 'Test hand raise'}
	}
};

module.exports = config;