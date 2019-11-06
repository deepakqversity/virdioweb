const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class SessionEquipmentMapping{

	constructor(){
		this.table = 'session-equipment_mapping';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addSessionEquipment(data){

        let table = this.table;
        console.log('------lalitactivityType---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (sessionId, equipment_id,quantity,link) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

                console.log('----------sessionequipment11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

}

module.exports = new SessionEquipmentMapping();
