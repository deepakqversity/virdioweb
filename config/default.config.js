const dotenv = require('dotenv');
dotenv.config();

let config = {
	default : {
		maxDisplayUsers : process.env.MAX_DISPLAY_ATTENDEE
	},
	rtm : {
		welcome : { code : 200, 'message' : 'Welcome #USER#'},
		handRaise : { code : 201, 'message' : 'Test hand raise'}
	}
};

module.exports = config;