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
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT * FROM ?? WHERE userId = ? AND status = 1', [table, userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  return resolve(results);
				});
	        })
	    }
	    catch(err)
	    {
	       return err;
	    }
	}

	/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findByStreamUser(sessionId, userId){
		let table = this.table;
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT * FROM ?? WHERE sessionId = ? AND userId = ? AND status = 1', [table, sessionId, userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  return resolve(results[0]);
				});
	        })
	    }
	    catch(err)
	    {
	    	console.log(err)
	       return err;
	    }
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
		try
	    {
			return await new Promise( (resolve, reject) => {

				db.query('UPDATE ?? SET sessionType = ? WHERE sessionId = ? AND userId = ?', [table, flag, sessionId, userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== 123 results ', results)
				  // db.end();
				  return resolve(results);
				});
			});
		}
	    catch(err)
	    {
	       return err;
	    }
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
		try
	    {
			return await new Promise( (resolve, reject) => {
				db.query('UPDATE ?? SET streamId = ? WHERE sessionId = ? AND userId = ?', [table, streamId, sessionId, userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== 123 results ', results)
				  // db.end();
				  return resolve(results);
				});
			});
		}
	    catch(err)
	    {
	    	console.log('err = ',err)
	       return err;
	    }
	}
}

module.exports = new SessionUser();