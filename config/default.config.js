const dotenv = require('dotenv');
dotenv.config();

let config = {
	rtm : {
		welcome : { code : 200, 'message' : 'Welcome #USER#'},
		handRaise : { code : 201, 'message' : 'Test hand raise'},

		ftnsStart : { code : 211, 'message' : ''},
		ftnsStop : { code : 212, 'message' : ''},		
		ftnsPause : { code : 213, 'message' : ''},
		ftnsResume : { code : 404, 'message' : ''},
		WinsNext : { code : 214, 'message' : ''},
		WinsPrev : { code : 215, 'message' : ''},
		AttSelect : { code : 227, 'message' : ''}
	
	}
};

module.exports = config;