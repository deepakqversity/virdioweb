const isEmpty = require("is-empty");
const db = require(process.cwd() + '/library/Mysql');

class ScriptAttributes{

	constructor(){
		this.table = 'script_attributes';
	}

	async getAttributesByIds(sessionScriptIds) {
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT * FROM ?? WHERE sessionScriptId IN (?) AND status = 1', [table, sessionScriptIds], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        })
	}
	
}

module.exports = new ScriptAttributes();