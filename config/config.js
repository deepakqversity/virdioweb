const dotenv = require('dotenv');
dotenv.config();

if(process.env.MODE == 'prod'){
	config = require('./prod.config');
} else {
	config = require('./dev.config');
}
module.exports = config;