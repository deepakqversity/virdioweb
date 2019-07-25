const auth = require(process.cwd() + '/library/Auth');
const isEmpty = require("is-empty");
const userModel = require('../../models/User');
const tokenModel = require('../../models/AuthToken');

class UserCtrl {

	index(req, res) {
		res.send({status:true});
	}

	async userDetail(req, res) {
	    try {
	    	console.log(req.currentUser)
			let user1 = await userModel.getUser({_id : req.currentUser._id});
			res.send({status:true, data:user1});
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async login(req, res) {
	    try {
	    	let userObj = await userModel.getUser({name : req.body.name});
	    	console.log(userObj)
			if(userObj != null && req.body.name == userObj.name){
				const token = await auth.createToken(userObj._id);
				// console.log(token);
				let updateUser = tokenModel.updateToken(userObj._id, token);
				res.send({status:true, data:{token:"Bearer " +token, id:userObj._id}});
			} else {
				res.status(400).send({status:false, message:"user not found"})
			}
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async register(req, res) {
	    try {
	    	let userObj = await userModel.getUser({name : req.body.name});
	    	// console.log(userObj)
			if(isEmpty(userObj)){
				const token = await auth.createToken(userObj._id);
				// console.log(token);
				let updateUser = userModel.updateToken(userObj.id, token);
				res.send({status:true, data:{token:"Bearer " +token, id:userObj.id}});
			} else {
				res.status(400).send({status:false, message:"user not found"})
			}
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

}

module.exports = new UserCtrl();