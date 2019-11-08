const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class Emojies{

	constructor(){
		this.table = 'emojies';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async getEmojies(interestId){

        let table = this.table;
        console.log('------lalitEmojies---------',interestId)

        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE interestId = ? AND status = 1', [table, interestId], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('================== shoppingpresults ', error)
			  // db.end();
			  return resolve(results);
			});
        });
	}

}

module.exports = new Emojies();
