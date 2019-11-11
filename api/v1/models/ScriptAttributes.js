const isEmpty = require("is-empty");
const db = require(process.cwd() + '/library/Mysql');

class ScriptAttributes{

	constructor(){
		this.table = 'script_attributes';
	}

	async getAttributesByIds(sessionScriptIds) {
		console.log('!!!!!!!!!!!!', sessionScriptIds);
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT * FROM ?? WHERE sessionScriptId IN (?) AND status = 1 ORDER BY orderBy ASC', [table, sessionScriptIds], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        })
	}

	async getAttributesByInterestIds(interestId) {
		console.log('!!!!!!!!!!!!', interestId);
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT  sa.attrLabel FROM script_attributes sa INNER JOIN session_script ss on ss.id = sa.sessionScriptId WHERE ss.interestId = ? AND ss.status = 1 AND sa.status = 1  GROUP BY attrLabel', [interestId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        })
	}

	async add(data) {
		let table = this.table;
		console.log('---------lalitdata-------------',data)
        return await new Promise((resolve, reject) => {
        	
        	db.query('INSERT INTO ?? (sessionScriptId, attrLabel, attrValue, status, orderBy) VALUES ?', [table, data], function (error, results, fields) {
			  if (error) reject(error);
			  console.log('---------lalitattribute-------------',results)
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
        })
	}
	
}

module.exports = new ScriptAttributes();