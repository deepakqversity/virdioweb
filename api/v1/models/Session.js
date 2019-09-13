const db = require(process.cwd() + '/library/Mysql');

class Session{

	constructor(){
		this.table = 'sessions';
	}

	/**
	 * Get upcomming session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getUpcommingSession(userId) {
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.*, su.sessionId, su.userId, su.type, ac.appId, ac.appCertificate, u.name as hostName FROM sessions s LEFT JOIN session_users su ON su.sessionId = s.id LEFT JOIN agora_config ac ON ac.id = s.configId JOIN users u ON u.id = s.hostId WHERE su.userId = ? AND su.status = 1 AND s.status = 1 AND s.scheduleDate IS NOT NULL AND s.scheduleDate > ( NOW() - INTERVAL 10 MINUTE ) ORDER BY s.scheduleDate ASC LIMIT 1', [userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	/**
	 * Get session detail by sessionId and user id
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findSessionDetail(sessionId, userId) {
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.*, su.type, su.sessionType, su.userId, ac.appId, ac.appCertificate FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId LEFT JOIN agora_config ac ON ac.id = s.configId WHERE su.status = 1 AND su.sessionId = ? AND su.userId = ?', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results[0]);
			});
        });
	}

	/**
	 * Get session detail by user id
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findByUserId(userId){

	    let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE hostId = ? AND status = 1', [table, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	/**
	 * Get All session session of single user
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findAllSessionById(userId){
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.*, su.type, su.sessionType FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId WHERE su.status = 1 AND su.userId = ?', [userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}	

	async findSessionUsers(sessionId){

        return await new Promise((resolve, reject) => {
        	db.query('SELECT u.id, u.name, u.email, su.type as userType FROM session_users su LEFT JOIN users u ON u.id = su.userId WHERE su.status = 1 AND su.sessionId = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}
}

module.exports = new Session();

