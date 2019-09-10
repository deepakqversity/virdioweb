const dotenv = require('dotenv');
dotenv.config();

if(process.env.ENV == 'prod'){
	config = require('./prod.config');
} else {
	config = require('./dev.config');
}
module.exports = config;