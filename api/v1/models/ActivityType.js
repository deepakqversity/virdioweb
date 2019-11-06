const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class ActivityType{

	constructor(){
		this.table = 'interestAttributes';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async getActivityType(interestId){

        let table = this.table;
        console.log('------lalitactivityType---------',interestId)

        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE interestId = ? AND status = 1', [table, interestId], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('================== activityresults ', error)
			  // db.end();
			  return resolve(results);
			});
        });
	}

}

module.exports = new ActivityType();
