const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class ActivityLogs{

	constructor(){
		this.table = 'activity_logs';
	}

	/**
	 * Get upcomming session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async add(data) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET userId=?, sessionId=?, userType=?, type=?, status=0', [table, data.userId, data.sessionId, data.userType, data.type], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

}

module.exports = new ActivityLogs();

