const auth = require('../../auth/Auth');
const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const userModel = require('../../models/User');
const tokenModel = require('../../models/AuthToken');
const sessionModel = require('../../models/Session');
const productModel = require('../../models/Products');
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

						underscore.extend(userObj, {userType : currentSession.type});	
						
						// get timing remaining
						let str = utils.dateTimeDiff(currentSession.scheduleDate);
						underscore.extend(currentSession, {messgae:str});

						// generate streaming token
						let streamToken = clientToken.createToken(currentSession.appId, currentSession.appCertificate, currentSession.channelId, currentSession.userId);
						underscore.extend(currentSession, {streamToken : streamToken});
						currentSession = underscore.omit(currentSession, 'appCertificate');


						let productDetail = await productModel.getProductDetail(currentSession.id, currentSession.hostId );
						underscore.extend(currentSession, {productDetail : productDetail});
						
						underscore.extend(userObj, { sessionData : currentSession });

					} else {
						underscore.extend(userObj, {sessionData : { message : "There are no sessions available."}});
					}

					res.status(200).send(userObj);
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
			let sessionObj = await sessionModel.findSessionDetail(req.body.sessionId, req.body.userId);

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