const auth = require(process.cwd() + '/library/Auth');
const user = require('../../models/User');

class UserCtrl {

	index(req, res) {
	    try {
			
			res.send({message:"success"});
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async userDetail(req, res) {
	    try {
	    	console.log(req.currentUser)
			let user1 = await user.getUser({_id : req.currentUser._id});
			res.send({status:true, data:user1});
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async login(req, res) {
	    try {
	    	let userObj = await user.getUser({name : req.body.name});
	    	// console.log(userObj)
			if(req.body.name == userObj.name){
				const token = await auth.createToken(userObj._id);
				// console.log(token);
				let updateUser = user.updateToken(userObj.id, token);
				res.send({status:true, data:{token:"Bearer " +token, id:userObj.id}});
			} else {
				res.status(400).send({status:false, message:"user not found"})
			}
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async register(req, res) {
	    try {
	    	let userObj = await user.getUser({name : req.body.name});
	    	// console.log(userObj)
			if(req.body.name == userObj.name){
				const token = await auth.createToken(userObj._id);
				// console.log(token);
				let updateUser = user.updateToken(userObj.id, token);
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