const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class InterestEquipment{

	constructor(){
		this.table = 'Interest_equipment';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} equipmentId
	 * @return {obj} 
	 */
	async getChannelHostsList(channelId) {

		console.log('------lalitgetchannel---------',channelId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ch.hostId as userId, CONCAT(u.firstName, " ", u.lastName) as username FROM channel_host as ch INNER JOIN users as u WHERE ch.hostId = u.id AND u.isBanned = 0  AND ch.channelAdmin = 0  AND  ch.channelId = ?', [channelId], function (error, results, fields) {
				  if (error) reject(error);
				  
				  console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}
}

module.exports = new InterestEquipment();
