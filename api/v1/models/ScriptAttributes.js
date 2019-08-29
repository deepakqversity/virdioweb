const isEmpty = require("is-empty");
const db = require(process.cwd() + '/library/Mysql');

class ScriptAttributes{

	constructor(){
		this.table = 'script_attributes';
	}

	async getAttributesByIds(productIds) {
		let table = this.table;
		try
	    {
	        return await new Promise((resolve, reject) => {
            	
            	db.query('SELECT * FROM ?? WHERE productId IN (?) AND status = 1', [table, productIds], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
				  return resolve(results);
				});
	        })
	    }
	    catch(err)
	    {
	    	console.log(err)
	       return err;
	    }
	}
	
}

module.exports = new ScriptAttributes();
