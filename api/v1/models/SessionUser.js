const db = require(process.cwd() + '/library/Mysql');

class SessionUser{

	constructor(){
		this.table = 'session_users';
	}

	/**
	 * Get session user detail
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findById(userId){
	    let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE userId = ? AND status = 1', [table, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}

	/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findByStreamUser(sessionId, userId){
		let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE sessionId = ? AND userId = ? AND status = 1', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  return resolve(results[0]);
			});
        })
	}

	/**
	 * Update session user with current running session
	 * @param  {int} userId 
	 * @param  {int} sessionId
	 * @param  {int} flag
	 * @return {obj} 
	 */
	async updateCurrentSessionType(userId, sessionId, flag){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {

			db.query('UPDATE ?? SET sessionType = ? WHERE sessionId = ? AND userId = ?', [table, flag, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}

	/**
	 * Update joined session user detail
	 * @param  {int} userId
	 * @param  {int} sessionId
	 * @param  {int} streamId
	 * @param  {int} type
	 * @return {obj} 
	 */
	async updateConferenceUser(userId, sessionId, streamId){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {
			db.query('UPDATE ?? SET streamId = ? WHERE sessionId = ? AND userId = ?', [table, streamId, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}

		/**
	 * Update joined session status
	 * @param  {int} userId
	 * @param  {int} sessionId
	 * @return {obj} 
	 */

	async updateSessionUser(userId, sessionId){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {
			db.query('UPDATE ?? SET sessionStatus = 1 WHERE sessionId = ? AND userId = ?', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}

	async updatejoinSessionUser(userId, sessionId){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {
			db.query('UPDATE ?? SET sessionStatus = 0 WHERE sessionId = ? AND userId = ?', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}
}

module.exports = new SessionUser();