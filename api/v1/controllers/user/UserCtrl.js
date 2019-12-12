const auth = require('../../auth/Auth');
const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const userModel = require('../../models/User');
const interestGroupModel = require('../../models/InterestGroup');
const tokenModel = require('../../models/AuthToken');
const sessionModel = require('../../models/Session');
const settingModel = require('../../models/Settings');
const otpModel = require('../../models/Otp');
const sessionScriptModel = require('../../models/SessionScript');
const clientToken = require( process.cwd() + '/util/ClientToken');
const utils = require(process.cwd() + '/util/Utils');
const response = require(process.cwd() + '/util/Response');
const SendMail = require(process.cwd() + '/util/SendMail');
const defaultConfig = require(process.cwd() + '/config/default.config');

const saltRounds = 10;

class UserCtrl {

	async userDetail(req, res) {
	    try {
			let user1 = await userModel.getUserById(req.currentUser.id);
			// res.status(200).send(user1);
			response.resp(res, 200, user1)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async create_group(req, res) {
	    try {

			console.log('--------req.body----------',req.body)
	    	let name = req.body.group_name;
			let group = await interestGroupModel.addInterestGroup(name);
			// res.status(200).send(user1);
			response.resp(res, 200, group)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async admin_login(req, res) {
	    try {
			console.log('--------req.body----------',req.body)
	    	let email = req.body.email;
	    	let password = req.body.password;
			let userObj = await userModel.getUserByEmail(email);
			console.log('--------userObj----------',userObj);
	    	let currentTS = Date.now();

			if(!isEmpty(userObj)){

    			if(userObj.status == 0){
    				// res.status(400).send({message:"user already exists but inactive."})
    				response.resp(res, 400, {message:"user already exists but inactive."})
    			} else {

    				userObj = underscore.extend(userObj, {serverTimestamp:currentTS});

	        		let t = await bcrypt.compare(password, userObj.password);
					if(t){
						if(userObj.isBanned == 1){
		    				// res.status(400).send({message:"Sorry! You cannot login."})
		    				response.resp(res, 400, {message:"Sorry! You cannot login."})
		    			} else {

							if(isEmpty(userObj.image)){
								userObj.image = process.env.IMAGES + 'profile.png';
							} else {
								userObj.image = process.env.IMAGES + userObj.image;
							}

							const token = await auth.createToken(userObj.id);
							 //console.log('token-1111------------',token);
							let updateUser = await tokenModel.updateToken(userObj.id, token);
							
							userObj = underscore.extend(userObj, {token:token});

							userObj = underscore.omit(userObj, 'password');
							userObj = underscore.omit(userObj, 'status');
							userObj = underscore.omit(userObj, 'isBanned');
							
							//underscore.extend(userObj, defaultConfig);

							// let settings = await settingModel.getSettings();

							// underscore.extend(userObj, {default: settings});
						
							response.resp(res, 200, userObj)
						}
					} else {
						// res.status(400).send({password:"Invalid password"})
						response.resp(res, 400, {password:"Invalid password"})
					}
				}
			} else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
				response.resp(res, 400, {email:"User doesn\'t exists in system."})
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async admin_dashboardData(req, res) {
		try {
		//if(!isEmpty(req.body)){
		let val=req.body;
		let email = val.email;
		let userType = val.type;
		let userObj = await userModel.getUserByEmail(email);
		console.log('-------userObj-------',userObj)
		if(!isEmpty(userObj)){
			if(userObj.status == 0){
				// res.status(400).send({message:"user already exists but inactive."})
				response.resp(res, 400, {message:"user already exists but inactive."})
			} else {
			let currentSession = await sessionModel.getNextSession(userObj.id);
				console.log('----currentSession-----------',currentSession)
			let sessionData = {};
			if(!isEmpty(currentSession)){
		
				console.log('----currentSession11-----------',currentSession)

				userObj = underscore.omit(userObj, 'password');
				userObj = underscore.omit(userObj, 'status');
				userObj = underscore.omit(userObj, 'isBanned');
	

				userObj = underscore.extend(userObj, {sessionData:currentSession});

			
			response.resp(res, 200, userObj)
		} else {

			underscore.extend({ message : "There are no sessions available."});
			// underscore.extend(userObj, { sessionData : []});
		}
	}
			}else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
				response.resp(res, 400, {email:"User doesn\'t exists in system."})
			}
				

		}catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }

	}


	async admin_past_sessiondData(req, res) {
		try {
		//if(!isEmpty(req.body)){
		let val=req.body;
		let email = val.email;
		let userType = val.type;
		let userObj = await userModel.getUserByEmail(email);
		console.log('-------userObj-------',userObj)
		if(!isEmpty(userObj)){
			if(userObj.status == 0){
				// res.status(400).send({message:"user already exists but inactive."})
				response.resp(res, 400, {message:"user already exists but inactive."})
			} else {
			let currentSession = await sessionModel.getPastSession(userObj.id);
				console.log('----currentSession-----------',currentSession)
			let sessionData = {};
			if(!isEmpty(currentSession)){
		
				console.log('----currentSession11-----------',currentSession)

				userObj = underscore.omit(userObj, 'password');
				userObj = underscore.omit(userObj, 'status');
				userObj = underscore.omit(userObj, 'isBanned');
	

				userObj = underscore.extend(userObj, {sessionData:currentSession});

			
			response.resp(res, 200, userObj)
		} else {

			underscore.extend({ message : "There are no sessions available."});
			// underscore.extend(userObj, { sessionData : []});
		}
	}
			}else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
				response.resp(res, 400, {email:"User doesn\'t exists in system."})
			}
				

		}catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }

	}
	
	

	async login(req, res) {
	    try {
	    	let email = req.body.email;
	    	let password = req.body.password;
	    	let userObj = await userModel.getUserByEmail(email);
	    	let currentTS = Date.now();

			if(!isEmpty(userObj)){

    			if(userObj.status == 0){
    				// res.status(400).send({message:"user already exists but inactive."})
    				response.resp(res, 400, {message:"user already exists but inactive."})
    			} else {

    				userObj = underscore.extend(userObj, {serverTimestamp:currentTS});

	        		let t = await bcrypt.compare(password, userObj.password);
					if(t){
						if(userObj.isBanned == 1){
		    				// res.status(400).send({message:"Sorry! You cannot login."})
		    				response.resp(res, 400, {message:"Sorry! You cannot login."})
		    			} else {

							if(isEmpty(userObj.image)){
								userObj.image = process.env.IMAGES + 'profile.png';
							} else {
								userObj.image = process.env.IMAGES + userObj.image;
							}

							const token = await auth.createToken(userObj.id);
							 //console.log('token-1111------------',token);
							let updateUser = await tokenModel.updateToken(userObj.id, token);
							
							userObj = underscore.extend(userObj, {token:token});

							let currentSession = await sessionModel.getUpcommingSession(userObj.id);
							
							let sessionData = {};
							if(!isEmpty(currentSession)){
								currentSession = currentSession[0];
								if(currentSession.logo && !isEmpty(currentSession.logo)){
									currentSession.logo = process.env.LOGOS + currentSession.logo;
								} else {
									currentSession.logo = process.env.IMAGES + 'login-logo.png';
								}

								

								let scriptInfo = {scriptTitle:'', scriptType:''};
								if(currentSession.code == 100) {
									scriptInfo = {scriptTitle:'Wine Script', scriptType:'wine'};
								} else if(currentSession.code == 101) {
									scriptInfo = {scriptTitle:'Fitness Script', scriptType:'fitness'};
								} else if(currentSession.code == 102) {
									scriptInfo = {scriptTitle:'Cooking Script', scriptType:'cooking'};
								}
								underscore.extend(currentSession, scriptInfo);

								underscore.extend(userObj, {userType : currentSession.type});	
								
								// get timing remaining
								let str = utils.dateTimeDiff(currentSession.scheduleDate);
								underscore.extend(currentSession, {messgae:str});

								let agoraConfig = await sessionModel.getSessionAgoraConfig(currentSession.id);
								
								if(!isEmpty(agoraConfig)){
									for(let i in agoraConfig){
										if(agoraConfig[i].type == 1){
											underscore.extend(currentSession, {appId: agoraConfig[i].appId});
											// generate streaming token
											let streamToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, currentSession.channelId, currentSession.userId);

											// dummy token for bandwidth check
											let channelUid = 9999999999 + '' + currentSession.channelId + '' + userObj.id;
											let streamDummyToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, channelUid, currentSession.userId);

											underscore.extend(currentSession, {streamToken : streamToken});
											underscore.extend(currentSession, {streamDummyToken : streamDummyToken});
											// currentSession = underscore.omit(currentSession, 'appCertificate');
										} else if(agoraConfig[i].type == 2){
											underscore.extend(currentSession, {rtmAppId: agoraConfig[i].appId});
										}
									}
								}
								

								let scriptDetail = await sessionScriptModel.getProductDetail(currentSession.id, currentSession.hostId, currentSession.code );
								//console.log('--------scriptDetail------',scriptDetail)
								underscore.extend(currentSession, {scriptDetail : scriptDetail});
								
								if(isEmpty(currentSession.hostImage)){
									currentSession.hostImage = process.env.IMAGES + 'profile.png';
								} else {
									currentSession.hostImage = process.env.IMAGES + currentSession.hostImage;
								}

								underscore.extend(userObj, { sessionData : currentSession });

							} else {

								underscore.extend(userObj, { message : "There are no sessions available."});
								// underscore.extend(userObj, { sessionData : []});
							}

							userObj = underscore.omit(userObj, 'password');
							userObj = underscore.omit(userObj, 'status');
							userObj = underscore.omit(userObj, 'isBanned');
							
							underscore.extend(userObj, defaultConfig);

							let settings = await settingModel.getSettings();

							underscore.extend(userObj, {default: settings});

							// res.status(200).send(userObj);
							// res.status(200).send(response.resp(200, userObj));
							response.resp(res, 200, userObj)
						}
					} else {
						// res.status(400).send({password:"Invalid password"})
						response.resp(res, 400, {password:"Invalid password"})
					}
				}
			} else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
				response.resp(res, 400, {email:"User doesn\'t exists in system."})
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async register(req, res) {
	    try {
			//let participent=req.body.participentDetail;
			let participent=req.body;
	    	let email = participent.email;

	    	let userObj = await userModel.getExistsUserByEmail(email);
	    	
			if(isEmpty(userObj)){

				let password = await bcrypt.hash(participent.password, saltRounds);

				let userData = {
					name:participent.firstName+" "+participent.lastName,
					firstName	 : participent.firstName,
					lastName : participent.lastName,
					email : participent.email,
					type : participent.type,
					password : password,
					address1 : participent.address1,
					address2 : participent.address2,
					city : participent.city,
					state : participent.state,
					zip : participent.zip,
					image : participent.image,
					phone : participent.phone
				};
				console.log('--------userData-------------',userData)
				let insertedId = await userModel.add(userData);
				if(insertedId > 0){

					let msg = 'Your account created successfully, Please check';
					let encodedstring=utils.encodedString(4);
					let emailUpdate = await otpModel.add(insertedId, encodedstring, 0);
					//console.log('------emailUpdate-------',emailUpdate)
					if(emailUpdate > 0){
						//msg += ' email for verification link';
						msg += ' email for OTP';
						
						let html="<p>Please put this OTP  </p>"+encodedstring;

						console.log('-------html--------',html)
		
						let to=participent.email;
						let subject='Mail From Virdio For OTP';
						let text='Please Check ur Mail';
		
						let sendmail = await SendMail.emailInput(to,subject,html);

					}

					// if(participent.phone != ''){
					// 	//let otpUpdate = await otpModel.add(insertedId, utils.generateOtp(4), 1);
					// 	let otpUpdate = await otpModel.add(insertedId, encodedstring, 1);
					// 	if(otpUpdate){
					// 		msg += ' or OTP sent';
					// 	}
					// } 

					response.resp(res, 200, {message : msg+". Please verify account."})
				} else {

					response.resp(res, 400, {message:"Something went wrong."})
				}
			} else {
				if(userObj.status == 0){

					response.resp(res, 400, {message:"Email already exists but inactive."})
				} else {

					response.resp(res, 400, {message:"user already exists."})
				}
			}
				
	    } catch(exception) {

			response.resp(res, 500, exception)
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

			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
	}
	/**
	 * verify otp
	 * @param  {obj} req 
	 * @param  {obj} res 
	 * @return {json} 
	 */
	async verifyOtp(req, res){
		try {
			let dta=req.body;
			let email = dta.email != undefined ? dta.email : '';
			let phone = dta.phone != undefined ? dta.phone : '';

	    	let userObj = await userModel.getExistsUserByEmailOrMobile(email, phone);

			if(!isEmpty(userObj)){

				//let verifyChannel = phone != '' ? 1 : 0;

				let verifyChannel = email != '' ? 0 : 1;

				let otpObj = await otpModel.verify(dta.code, userObj.id, verifyChannel);

				if(!isEmpty(otpObj)){
					console.log('otpObj.status = ', otpObj.status);
					if(otpObj.status == 0){

						let updateOtp = await otpModel.updateOtp(dta.code, userObj.id);
						
						if(updateOtp){
							// res.status(200).send({message:"Account activated successfully."});
							response.resp(res, 200, {message:"Account activated successfully."})
						} else {
							// res.status(400).send({message:"Something went wrong."});
							response.resp(res, 400, {message:"Something went wrong."})
						}
					} else {
						let errorMsg = 'OTP already Verified';
						if(otpObj.status == 2)
							errorMsg = 'OTP Expired';
						else if(otpObj.status == 3)
							errorMsg = 'OTP Failed';

						// res.status(400).send({message:errorMsg});
						response.resp(res, 400, {message:errorMsg})
					}
				} else {

					// res.status(400).send({message:"Invalid OTP"});
					response.resp(res, 400, {message:"Invalid OTP"})
				}

			} else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
				response.resp(res, 400, {email:"User doesn\'t exists in system."})
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async forgotPassword(req, res) {
		try {
			let email = req.body.email;

			let userObj = await userModel.getExistsUserByEmail(email);
			
			if(!isEmpty(userObj)){

				let otpObj = await otpModel.check(userObj.id, 0, 0);
				let code='';
				// check if otp already sent
				if(!isEmpty(otpObj)){
					code = otpObj.code;
					console.log('--------code1--------',code);

				} else {
					
					code = utils.encodedString();

					console.log('--------code2--------',code);

					let emailUpdate = await otpModel.add(userObj.id, code, 0);
				}

				let resultant_code = await utils.encodedDecodedString(code,0);

				console.log('-------resultant_code--------',resultant_code)

				let encoded_email = await utils.encodedDecodedString(email,0);

				console.log('-------encoded_email12--------',encoded_email) 

				console.log('-------process.cwd()--------',process.cwd())

				let html='<p>Click <a href="'+process.env.DOMAIN_URL+"/"+ encoded_email+"/"+resultant_code + '">here</a> to reset your password</p>';

				console.log('-------html--------',html)

				let to=email;
				let subject='Mail From Virdio';
				let text='Please Check ur Mail';

				let sendmail = await SendMail.emailInput(to,subject,html);

				let msg = 'Email has been sent to your email id';

				// res.status(200).send({message:msg, link: code });
				response.resp(res, 200, {message:msg, link: code })

			} else {
				// res.status(400).send({email:"Email doesn\'t exists in system."});
				response.resp(res, 400, {email:"Email doesn\'t exists in system."})
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async verifyLink(req, res) {
		try {

	    	let email = req.body.email;
			let otpcode = req.body.otpcode;
			
			console.log('----------email------otpcode-----',email,otpcode)

			let decoded_email = await utils.encodedDecodedString(email,1);


			 let emailObj = await userModel.getExistsUserByEmail(decoded_email);


			if(!isEmpty(emailObj)){

				let decoded_otp = await utils.encodedDecodedString(otpcode,1);


				let otp_exist = await otpModel.otpExist(emailObj.id, decoded_otp, 0);


				if(!isEmpty(otp_exist)){

				let msg = 'your link is verified';


				res.status(200).send({message:msg, link:decoded_email });

				}else {
					res.status(400).send({email:"OTP is not Valid."});
				}

			}else {
				res.status(400).send({email:"Email not exists in system."});
			}
			
			//res.status(200).send({message:"Account activated successfully."});

	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async updatePassword(req, res) {
		try {

			let email = req.body.email;
			
			console.log('-------------email12345------------------',email)

			let userObj = await userModel.getExistsUserByEmail(email);

			console.log('-------------userObj------------------',userObj)

			if(!isEmpty(userObj)){

				let password = await bcrypt.hash(req.body.password, saltRounds);

				console.log('-------------password------------------',password)

				let output= await userModel.updatePassword(email,password);

				console.log('-------------output------------------',output)

				res.status(200).send({message:"password updated"});

			}else {
				if(userObj.status == 0){

					res.status(400).send({message:"Email  exists but inactive."})
				} else {

					res.status(400).send({message:"Email Doesnot exists."})
				}
			}

			
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

}

module.exports = new UserCtrl();