const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class SessionShoppingList{

	constructor(){
		this.table = 'session_shopping_list';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addSessionshoppingList(data){

        let table = this.table;
        console.log('------lalitshopping---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (sessionId, shopping_list_id,quantity,item_note,link) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

                console.log('----------sessionshoppinht11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

}

module.exports = new SessionShoppingList();
