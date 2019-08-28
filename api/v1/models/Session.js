const db = require(process.cwd() + '/library/Mysql');

class Session{

	constructor(){
		this.table = 'sessions';
	}

	async getUpcommingSession(userId) {
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT s.*, su.sessionId, su.userId, su.type, ac.appId, ac.appCertificate FROM sessions s LEFT JOIN session_users su ON su.sessionId = s.id LEFT JOIN agora_config ac ON ac.id = s.configId WHERE su.userId = ? AND su.status = 1 AND s.status = 1 AND s.scheduleDate IS NOT NULL AND s.scheduleDate > ( NOW() - INTERVAL 10 MINUTE ) ORDER BY s.scheduleDate ASC LIMIT 1', [userId], function (error, results, fields) {
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

module.exports = new Session();

