const auth = require('../../auth/Auth');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const sessionModel = require('../../models/Session');
const sessionUserModel = require('../../models/SessionUser');
const activityLogsModel = require('../../models/ActivityLogs');
const clientToken = require( process.cwd() + '/util/ClientToken');

class SessionCtrl {

	async getSessions(req, res) {
	    try {
			let sessionObj = await sessionModel.findAllSessionById(req.currentUser.id);

			res.status(200).send(sessionObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async getSessionDetail(req, res) {
	    try {
			let sessionObj = await sessionModel.findSessionDetail(req.params.sessionId, req.currentUser.id);

			// console.log('sessionObj =============== ',sessionObj);
			
			if(true !== underscore.isEmpty(sessionObj)){
				let token = clientToken.createToken(sessionObj.appId, sessionObj.appCertificate, sessionObj.channelId, sessionObj.userId);
				sessionObj = underscore.extend(sessionObj, {token : token});
				sessionObj = underscore.omit(sessionObj, 'appCertificate');
			}

			res.status(200).send(sessionObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}
	
	async getSessionUsers(req, res) {
	    try {
			let userObj = await sessionModel.findSessionUsers(req.params.sessionId);
			res.status(200).send(userObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async updateSessionUser(req, res) {
	    try {
			let updateData = await sessionUserModel.updateCurrentSessionType(req.params.userId, req.params.sessionId, req.body.state);
			res.status(200).send(updateData);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async updateUserStream(req, res) {
	    try {
			let updateData = await sessionUserModel.updateConferenceUser(req.currentUser.id,  req.params.sessionId, req.body.streamId);
			res.status(200).send(updateData);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async getStreamUser(req, res) {
		try {
			// console.log(req.params);
			let sessionObj = await sessionUserModel.findByStreamUser(req.params.sessionId, req.params.userId);
			res.status(200).send(sessionObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	/**
	 * Log for running session activity
	 * @param  {obj} req
	 * @param  {obj} res
	 * @return {obj}
	 */
	async activityLogs(req, res) {
		try{
			let insertData = {
				userId : req.currentUser.id,
				sessionId : req.body.sessionId,
				userType : req.body.userType,
				type : req.body.type
			};
			let insertedId = await activityLogsModel.add(insertData);

			if(insertedId > 0){
				res.status(200).send({logId : insertedId});
			} else {
				res.status(400).send({message:"Something went wrong."})
			}
		} catch(exception) {
			res.status(500).send(exception)
		}
	}
}

module.exports = new SessionCtrl();