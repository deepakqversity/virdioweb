const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class SessionEmojies{

	constructor(){
		this.table = 'session_emojies';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addSessionEmojies(data){

        let table = this.table;
        console.log('------lalitEmojies---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (session_id, sessionScriptId,emojies_id,emojies_type,status) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

                console.log('----------lalitEmojies11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

}

module.exports = new SessionEmojies();
