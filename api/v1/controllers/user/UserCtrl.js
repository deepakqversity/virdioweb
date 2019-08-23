const auth = require('../../auth/Auth');
const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const userModel = require('../../models/User');
const tokenModel = require('../../models/AuthToken');

const saltRounds = 10;

class UserCtrl {

	async index(req, res) {
		try {
			let userObj = await userModel.getUsers();
			res.status(200).send(userObj);
					
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async userDetail(req, res) {
	    try {
			let user1 = await userModel.getUserById(req.currentUser._id);
			res.status(200).send(user1);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async login(req, res) {
	    try {
	    	let email = req.body.email;
	    	let password = req.body.password;
	    	let userObj = await userModel.getUserByEmail(email);
	    	
			if(!isEmpty(userObj)){
				// let hashedPassword = await bcrypt.hash(password, saltRounds);
    
        		let t = await bcrypt.compare(password, userObj.password);
				if(t){
					const token = await auth.createToken(userObj.id);
					console.log('token-------------',token);
					let updateUser = tokenModel.updateToken(userObj.id, token);
					
					res.status(200).send({token:token, id:userObj.id, name:userObj.name, email:userObj.email, userType:req.body.type});
				} else {
					res.status(400).send({password:"Invalid password"})
				}
			} else {
				res.status(400).send({email:"User doesn\'t exists in system."});
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
				res.status(200).send({token:token, id:userObj.id});
			} else {
				res.status(400).send({message:"user not found"})
			}
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

}

module.exports = new UserCtrl();