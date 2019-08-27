const auth = require('../../auth/Auth');
const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const userModel = require('../../models/User');
const tokenModel = require('../../models/AuthToken');
const sessionInfoModel = require('../../models/SessionInfo');
const sessionModel = require('../../models/Session');
const clientToken = require( process.cwd() + '/util/ClientToken');
const utils = require(process.cwd() + '/util/Utils');

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
	    	console.log('----------------------%%%%%%%%%%%', userObj)
	    	
			if(!isEmpty(userObj)){
				// let hashedPassword = await bcrypt.hash(password, saltRounds);
    
        		let t = await bcrypt.compare(password, userObj.password);
				if(t){
					const token = await auth.createToken(userObj.id);
					// console.log('token-------------',token);
					let updateUser = await tokenModel.updateToken(userObj.id, token);

					userObj = underscore.extend(userObj, {token:token});

					let currentSession = await sessionModel.getUpcommingSession(userObj.id);

					let sessionData = {};
					if(!isEmpty(currentSession)){
						currentSession = currentSession[0];
						console.log(currentSession, currentSession.scheduleDate);
						let SessionDt = currentSession.scheduleDate;
						utils.dateTimeDiff(currentSession.scheduleDate);

					} else {
						sessionData = {
							sessionData : { message : "There are no sessions available."}
						}
					}
						underscore.extends(userObj, sessionData);

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

	async createClientToken(req, res) {
		try {
			console.log(req.body)
			let sessionObj = await sessionInfoModel.findSessionDetail(req.body.sessionId, req.body.userId);

			console.log('sessionObj =============== ',sessionObj);
			
			if(true !== underscore.isEmpty(sessionObj)){
				let token = clientToken.createToken(sessionObj.appId, sessionObj.appCertificate, sessionObj.channelId, sessionObj.userId);
				sessionObj = underscore.extend(sessionObj, {token : token})
				sessionObj = underscore.omit(sessionObj, 'appCertificate');
			}

			res.status(200).send(sessionObj);
				
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

}

module.exports = new UserCtrl();