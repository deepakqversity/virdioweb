const auth = require('../../auth/Auth');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const sessionInfoModel = require('../../models/SessionInfo');
const sessionUserModel = require('../../models/SessionUser');
const clientToken = require( process.cwd() + '/util/ClientToken');

class SessionCtrl {

	async getSessions(req, res) {
	    try {
			let sessionObj = await sessionInfoModel.findAllSessionById(req.currentUser.id);

			res.status(200).send(sessionObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async getSessionDetail(req, res) {
	    try {
			let sessionObj = await sessionInfoModel.findSessionDetail(req.params.sessionId, req.currentUser.id);

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
			let userObj = await sessionInfoModel.findByUserId(req.currentUser.id);
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
			let updateData = await sessionUserModel.updateConferenceUser(req.currentUser.id,  req.params.sessionId, req.body.streamId, req.body.userType);
			res.status(200).send(updateData);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async getStreamUser(req, res) {
		try {
			let sessionObj = await sessionUserModel.findByStreamUser(req.params.sessionId, req.params.streamId);
			res.status(200).send(sessionObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}
}

module.exports = new SessionCtrl();