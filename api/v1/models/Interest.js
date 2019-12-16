const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class Interest{

	constructor(){
		this.table = 'interest';
	}


    /**
	 * Add Interest
	 * @param  {int} userId 
	 * @return {obj} 
	 */

	async addInterest(data) {

		console.log('------addInterest---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? SET interestCode=?,title=?,groupId=?,description=?,image=?,video=?,haveShoppingList=?,haveEquipment=?,haveProductList=?,attendeesAreCalled=?,virtualRoomIsCalled=?,inProduction=?, status=1', [
                this.table,
                data.interestCode, 
                data.title, 
                data.groupId, 
                data.description,
                data.image,
                data.video,
                data.haveShoppingList,
                data.haveEquipment,
                data.haveProductList,
                data.attendeesAreCalled,
                data.virtualRoomIsCalled,
                data.inProduction], function (error, results, fields) {
                if (error) reject(error);

				console.log('----------sessionuser------------------',error)
				
				console.log('----------addInterest22------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}

}

module.exports = new Interest();
