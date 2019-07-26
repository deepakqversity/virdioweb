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

			let updateData = confUserModel.updateCurrentSessionType(userId, confId, req.body.state);
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

			// console.log(token);
			let updateData = confUserModel.updateConferenceUser(userId, confId, {streamId : streamId});
			res.status(200).send(updateData);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}
}

module.exports = new ConferenceCtrl();