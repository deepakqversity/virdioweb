const isEmpty = require("is-empty");
const db = require(process.cwd() + '/library/Mysql');

class Settings{

	constructor(){
		this.table = 'default_settings';
	}

	/**
	 * Get default settings
	 * @param  {int}  
	 * @return {obj} 
	 */
	async getSettings() {
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT `field`, `value` FROM ?? WHERE  status = 1', [table], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  let settings = {};
			  if(!isEmpty(results)){
			  	for(let i in results){
			  		settings[results[i].field] = results[i].value;
			  	}
			  }
			  return resolve(settings);
			});
        });
	}
}

module.exports = new Settings();

