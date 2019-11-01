const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class SessionScript{

	constructor(){
		this.table = 'channel_host';
	}

	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelHostsList(channelId) {
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ch.hostId as userId, CONCAT(u.firstName, " ", u.lastName) as username FROM channel_host as ch INNER JOIN users as u WHERE ch.hostId = u.id AND u.isBanned = 0 AND ch.channelAdmin = 0', [userId], function (error, results, fields) {
			  	if (error) reject(error);

			  	return resolve(results);
			});
        });
	}
}

module.exports = new SessionScript();
