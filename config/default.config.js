const dotenv = require('dotenv');
dotenv.config();

let config = {
	defaultConfig : {
		maxDisplayUsers : process.env.MAX_DISPLAY_ATTENDEE
	}
};

module.exports = config;