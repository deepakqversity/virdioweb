const db = require(process.cwd() + '/library/Mysql');

class Session{

	constructor(){
		this.table = 'sessions';
	}
	/**
	 * Get Sessions by multiple ids [array]
	 * @param  {int} ids array of id
	 * @return object
	 */
	async findByIds(ids){

	    let table = this.table;
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT * FROM ?? WHERE id IN (?) AND status = 1', [table, ids], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
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
	 * Get single session details
	 * @param  {int} id session id
	 * @return {obj}
	 */
	async findById(id){
		console.log('ids ====',ids)
	    let table = this.table;
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT * FROM ?? WHERE id = ? AND status = 1', [table, id], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
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
	 * Get session detail by user id
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findByUserId(userId){

	    let table = this.table;
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT * FROM ?? WHERE userId = ? AND status = 1', [table, userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
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
	 * Get All session session of single user
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findAllSessionById(userId){
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT s.*, su.type, su.sessionType FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId WHERE s.status = 1 AND su.userId = ?', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== ************ results ', results)
				  // db.end();
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
	 * Get session detail by sessionId and user id
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findSessionDetail(sessionId, userId) {
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT s.*, s.userId as hostId, su.type, su.sessionType, su.userId, ac.appId FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId LEFT JOIN agora_config ac ON ac.id = s.configId WHERE s.status = 1 AND su.sessionId = ? AND su.userId = ?', [sessionId, userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== ************ results ', results)
				  // db.end();
				  return resolve(results[0]);
				});
	        })
	    }
	    catch(err)
	    {
	       return err;
	    }

	}
}

module.exports = new Session();

