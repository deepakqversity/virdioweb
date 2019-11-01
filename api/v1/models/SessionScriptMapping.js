const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class SessionScript{

	constructor(){
		this.table = 'session_script_mapping';
	}

	/**
	 * Insert new session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async add(data) {
		console.log('mapping data-------', data);
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET sessionId=?, sessionScriptId=?', 
					[
						table,
						data.sessionId, 
						data.sessionScriptId
					], function (error, results, fields) {
			  if (error) reject(error);

			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}
}

module.exports = new SessionScript();
