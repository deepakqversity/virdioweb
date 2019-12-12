const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class InterestGroup{

	constructor(){
		this.table = 'interest_group';
	}

	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelHostsList(channelId,userId) {

		console.log('------lalitgetchannel---------',channelId,userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ch.hostId as userId, CONCAT(u.firstName, " ", u.lastName) as username FROM channel_host as ch INNER JOIN users as u WHERE ch.hostId = u.id AND u.isBanned = 0  AND ch.channelAdmin = 0  AND  u.id !=?  AND ch.channelId = ?', [userId,channelId], function (error, results, fields) {
				  if (error) reject(error);
				  
				  console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}

	async addInterestGroup(data) {

		console.log('------channelHostData11---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? SET name=?, status=1', [this.table, data], function (error, results, fields) {
                if (error) reject(error);

				console.log('----------sessionuser------------------',error)
				
				console.log('----------channelHostData22------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}

}

module.exports = new InterestGroup();
