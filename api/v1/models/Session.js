const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");
const underscore = require("underscore");

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
        	db.query('SELECT s.*, i.code, su.sessionId, su.userId, su.type, u.firstName as hostFirstName, u.lastName as hostLastName, u.email as hostEmail, u.image as hostImage FROM sessions s LEFT JOIN session_users su ON su.sessionId = s.id JOIN users u ON u.id = s.hostId LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ? AND su.status = 1 AND s.status = 1 AND s.scheduleDate IS NOT NULL AND s.scheduleDate > ( NOW() - INTERVAL 10 MINUTE ) ORDER BY s.scheduleDate ASC LIMIT 1', [userId], function (error, results, fields) {
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
			  //return resolve(results[0]);
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
	async findSessionDetail1(sessionId, userId) {

		console.log('-----sessionId, userId----------',sessionId, userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.*, su.type, su.sessionType, su.userId  FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId  WHERE su.status = 1 AND su.sessionId = ? AND su.userId = ?', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('=======lalittiwari=========== ************ results ', results)
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
        	db.query('SELECT u.id, u.firstName, u.lastName, u.email, u.image, u.address1, u.address2, u.city, u.state, u.zip, su.type as userType, su.sessionStatus FROM session_users su LEFT JOIN users u ON u.id = su.userId WHERE u.isBanned = 0 AND su.status = 1 AND su.sessionId = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	async getSessionAgoraConfig(sessionId){
		return await new Promise((resolve, reject) => {
        	db.query('SELECT ac.* FROM agora_config ac LEFT JOIN session_config_mapping acm ON ac.id = acm.configId WHERE ac.status = 1 AND acm.sessionId = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}


		/**
	 * Check for duplicate session name for the same host
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async checkDuplicateSession(userId, sessionName) {
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id FROM ?? WHERE hostId = ? AND name = ? AND status = 1', [this.table, userId, sessionName], function (error, results, fields) {
				  if (error) reject(error);
				  
				  return resolve(results);

			});
        });
	}

		/**
	 * Get ost AllProduct By Host Id 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findAllProductByHost(userId) {

		console.log('-----sessionId, userId----------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ss.*  FROM session_script ss  WHERE ss.status = 1 AND userId = ?' , [userId], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('=======lalittiwari123=========== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

		/**
	 * Insert new session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findAllPrevSessionByChannel(channelId){
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.* FROM session_users su INNER JOIN sessions s ON s.id = su.sessionId INNER JOIN channel_host ch ON ch.hostId= su.userId WHERE su.status = 1 AND ch.channelId = ? group by s.id', [channelId], function (error, results, fields) {
			  if (error) reject(error);			  
			  return resolve(results);
			});
        });
	}
	
	async add(data){
		console.log('============output====== ************ results ',this.table, data)
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET interestId=?, name=?, description=?, hostId=?, scheduleDate=?, duration=?, level=?, minAttendee=?, maxAttendee=?, currency=?, chargeForSession=?,sessionChargeAllowed=?, showParticipantsCount=?, hostReminder=?, participantReminder=?, cutOffTime=?, minNotMetNoticeTime=?, participantDisableDM=?, participantsPickPlaylist=?, showParticipantsPicToOtherPartcipants=?, allowGroupLocation=?, activity=?, heartRateMonitor=?, zoneTracking=?,sessionProperty=?, status=1', [
						this.table,
						data.interestId, 
						data.name, 
						data.description, 
						data.hostId,
						data.scheduleDate,
						data.duration,
						data.level,
						data.minAttendee,
						data.maxAttendee,
						data.currency,
						data.chargeForSession,
						data.sessionChargeAllowed,
						data.showParticipantsCount,
						data.hostReminder,
						data.participantReminder,
						data.cutOffTime,
						data.minNotMetNoticeTime,
						data.participantDisableDM,
						data.participantsPickPlaylist,
						data.showParticipantsPicToOtherPartcipants,
						data.allowGroupLocation,
						data.activity,
						data.heartRateMonitor,
						data.zoneTracking,
						data.sessionProperty
						], function (error, results, fields) {
			  if (error) reject(error);
			  console.log('==========lalitErr======== ************ results ', error)
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

}

module.exports = new Session();

