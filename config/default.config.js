const dotenv = require('dotenv');
dotenv.config();

let config = {
	default : {
		maxUserLimit : process.env.MAX_ATTENDEE_LIMIT,
		preScreenUserLimit : process.env.PRE_SCREEN_ATTENDEE_LIMIT,
		maxJoinDuration : 20
	},
	rtm : {
		welcome : { code : 200, 'message' : 'Welcome #USER#'},
		handRaise : { code : 201, 'message' : 'Test hand raise'},

		ftnsStart : { code : 211, 'message' : ''},
		ftnsStop : { code : 212, 'message' : ''},		
		ftnsPause : { code : 213, 'message' : ''},
		WinsNext : { code : 214, 'message' : ''},
		WinsPrev : { code : 215, 'message' : ''}
	}
};

module.exports = config;