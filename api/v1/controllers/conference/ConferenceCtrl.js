const auth = require(process.cwd() + '/library/Auth');
const isEmpty = require("is-empty");
const userModel = require('../../models/User');
const confModel = require('../../models/Conference');
const confUserModel = require('../../models/ConferenceUser');

class ConferenceCtrl {


	async getChannel(req, res) {
	    try {
	    	console.log(req.currentUser)
			let userObj = await userModel.getUser({_id : req.currentUser._id});
			res.status(200).send(userObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async getConferenceUsers(req, res) {
	    try {
	    	console.log(req.currentUser)
			let userObj = await userModel.getUser({_id : req.currentUser._id});
			res.status(200).send(userObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async updateCurrentUserSession(req, res) {
	    try {
	    	let confId = req.params.confId;
	    	let userId = req.params.userId;

			let updateData = await confUserModel.updateCurrentSessionType(userId, confId, req.body.state);
			res.status(200).send(updateData);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async updateUserStream(req, res) {
	    try {
	    	let confId = req.params.confId;
	    	let userId = req.params.userId;
	    	let streamId = req.body.streamId;
	    	let userType = req.body.userType;

	    	confId = '5d39850a71adb09e6afa6806';
	    	// if(confId == '2222')
	    	// 	confId = '5d39850a71adb09e6afa6806';

			// console.log(token);
			let updateData = await confUserModel.updateConferenceUser(userId, confId, {streamId : streamId, type: userType});
			res.status(200).send(updateData);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async getStreamUser(req, res) {
		try {
	    	let confId = req.params.confId;
	    	let streamId = req.params.streamId;

	    	confId = '5d39850a71adb09e6afa6806';
	    	// if(confId == '2222')
	    	// 	confId = '5d39850a71adb09e6afa6806';

			console.log('req.params = ',req.params, {streamId : streamId, confId: confId});
			let updateData = await confUserModel.getOne({streamId : streamId, confId: confId});
			res.status(200).send(updateData);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}
}

module.exports = new ConferenceCtrl();