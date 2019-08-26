const db = require(process.cwd() + '/library/Mysql');

class Session{

	constructor(){
		this.table = 'sessions';
	}
}

module.exports = new Session();

