const auth = require('../../auth/Auth');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const sessionModel = require('../../models/Session');
const sessionUserModel = require('../../models/SessionUser');
const sessionConfigMappingModel = require('../../models/SessionConfigMapping');
const sessionScriptModel = require('../../models/SessionScript');
const sessionScriptMappingModel = require('../../models/SessionScriptMapping');
const scriptAttributesModel = require('../../models/ScriptAttributes');
const channelHostModel = require('../../models/ChannelHost');
const activityLogsModel = require('../../models/ActivityLogs');
const clientToken = require( process.cwd() + '/util/ClientToken');
const response = require(process.cwd() + '/util/Response');

class SessionCtrl {

	async getSessions(req, res) {
	    try {
			let sessionObj = await sessionModel.findAllSessionById(req.currentUser.id);

			// res.status(200).send(sessionObj);
			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
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

			// res.status(200).send(sessionObj);
			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}
	
	async getSessionUsers(req, res) {
	    try {
			let userObj = await sessionModel.findSessionUsers(req.params.sessionId);

			if(!isEmpty(userObj)){
				for(let i in userObj){
					if(isEmpty(userObj[i].image)){
						userObj[i].image = process.env.IMAGES + 'profile.png';
					} else {
						userObj[i].image = process.env.IMAGES + userObj[i].image;
					}
				}
			}
			// res.status(200).send(userObj);
			response.resp(res, 200, userObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateSessionUser(req, res) {
	    try {
			let updateData = await sessionUserModel.updateCurrentSessionType(req.params.userId, req.params.sessionId, req.body.state);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateUserStream(req, res) {
	    try {
			let updateData = await sessionUserModel.updateConferenceUser(req.currentUser.id,  req.params.sessionId, req.body.streamId);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateSessionStatus(req, res) {
	    try {
			let updateData = await sessionUserModel.updateSessionUser(req.currentUser.id,  req.params.sessionId);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
			
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateSessionjoinStatus(req, res) {
	    try {
			let updateData = await sessionUserModel.updatejoinSessionUser(req.currentUser.id,  req.params.sessionId);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async getStreamUser(req, res) {
		try {
			// console.log(req.params);
			let sessionObj = await sessionUserModel.findByStreamUser(req.params.sessionId, req.params.userId);
			// res.status(200).send(sessionObj);
			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
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
			console.log('req.body=====', req.body);
			let insertData = {
				userId : req.currentUser.id,
				sessionId : req.body.sessionId,
				userType : req.body.userType,
				type : req.body.type
			};
			let insertedId = await activityLogsModel.add(insertData);

			if(insertedId > 0){
				// res.status(200).send({logId : insertedId});
				response.resp(res, 200, {logId : insertedId})
			} else {
				// res.status(400).send({message:"Something went wrong."})
				response.resp(res, 500, {message:"Something went wrong."})
			}
		} catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
		}
	}






	async getSessionsByChannel(req, res) {

		let userId = req.params.channelId;
		 console.log('------asdds+++++lalit-----------',req.params.channelId);
	    try {			
			let sessionObj = await sessionModel.findAllPrevSessionByChannel(req.params.channelId);
			 console.log('sessionObj======lalit--------=======',sessionObj);
			 response.resp(res, 200, sessionObj);			
			} catch(exception) {
				response.resp(res, 500, exception);
			}
		}

	async getSessions1(req, res) {
	    try {
			let sessionObj = await sessionModel.findAllSessionById(req.currentUser.id);

			response.resp(res, 200, sessionObj);			
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async createSession(req, res) {
	    try {

			console.log('----------req.bodylalit111------------------',req.body)

		
			let insertData = {	
				interestId : 2,	
				channelId : req.body.session.channelId,
				name : req.body.session.name,
				description : req.body.session.description,
				hostId : "11",
				scheduleDate : req.body.session.start_date,
				duration : req.body.session.duration,
				//level : req.body.session.level,
				level : "2",
				minAttendee : req.body.session.min_participants,
				maxAttendee : req.body.session.max_participants, 
				currency : 'USD',
				chargeForSession  : req.body.session.amountCharge ? req.body.session.amountCharge : 0,
				sessionChargeAllowed  : req.body.session.session_charge == true ? 1 : 0,
				showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
				hostReminder : req.body.reminder.host_reminder,
				participantReminder : req.body.reminder.participants_reminder,
				cutOffTime : req.body.reminder.cutoff_date_time,
				minNotMetNoticeTime : req.body.reminder.min_participants_not_met,
				participantDisableDM : req.body.privacy.allow_participants_disable_dm == true ? 1 : 0,
				participantsPickPlaylist : req.body.privacy.allow_participants_pick_playlist == true ? 1 : 0,
				showParticipantsPicToOtherPartcipants : req.body.privacy.show_part_pic_to_other_part == true ? 1 : 0,
				allowGroupLocation : req.body.groups.allow_group_location == true ? 1 : 0,
				activity : req.body.script.next_activity,
				heartRateMonitor : req.body.script.heart_rate_monitor == true ? 1 : 0,
				zoneTracking : req.body.script.zone_tracking == true ? 1 : 0
			};

			console.log('----------insertData------------------',insertData)

			// insert into sessions table
			let sessionId = await sessionModel.add(insertData);

			console.log('----------sessionId1111------------------',sessionId)

			if(sessionId > 0){

				let userId=11;

				
				let sessionUserId;

				 sessionUserId = await sessionUserModel.addSessionUser(sessionId,userId);

			
					let c1=2;
					let c2=3;

					let dataval = [
						[ sessionId, c1],
						[ sessionId, c2],            
					];
			
					console.log('----------dataval------------------',dataval)

				let sessionconfig = await sessionConfigMappingModel.addSessionConfig(dataval);

				console.log('----------sessionId5555------------------',sessionId)

				if(false === isEmpty(req.body.activities)){
					
					let activities = req.body.activities;

					console.log('----------activities------------------',activities)

					for(let i in activities){

						var attributes = [];

						let sessionScriptInsertData = {	
											interestId : 2,			
											name : activities[i].name,
											description : '',
											//userId : req.currentUser.id,
											userId : 11,
										}

			 			// insert into session_script table
						let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);

			 			// insert into session_script_mapping table
						sessionScriptMappingModel.add({ sessionId: sessionId, sessionScriptId : sessionScriptId});

						let activityAttributes = activities[i].attributes;
						for(let j in activityAttributes){

							var attributesArr = [];

							attributesArr.push(sessionScriptId);
							attributesArr.push(activities[i].attributes[j].attrKey);
							attributesArr.push(activities[i].attributes[j].attrValue);
							attributesArr.push(1);
							attributesArr.push(activities[i].attributes[j].orderNo);

							attributes.push(attributesArr);
						}

						let scriptAttributeId = scriptAttributesModel.add(attributes);
					}
				}

				// res.status(200).send({logId : insertedId});
				response.resp(res, 200, {})
			} else {
				response.resp(res, 500, {message:"Something went wrong."})
			} 




		} catch(exception) {
				response.resp(res, 500, exception);
			}
		}






	async getSessionDetail1(req, res) {
	    try {
			let user_id=11;
			console.log('------userid-----------',user_id)
			let sessionObj = await sessionModel.findSessionDetail1(req.params.sessionId, user_id);

			console.log('sessionObj ====munmun=========== ',sessionObj);
			
			// if(true !== underscore.isEmpty(sessionObj)){
			// 	let token = clientToken.createToken(sessionObj.appId, sessionObj.appCertificate, sessionObj.channelId, sessionObj.userId);
			// 	sessionObj = underscore.extend(sessionObj, {token : token});
			// 	sessionObj = underscore.omit(sessionObj, 'appCertificate');
			// }

			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	async getAllProductByHost(req, res) {
	    try {
			
			console.log('------userid-----------',req.params.userId)
			let sessionObj = await sessionModel.findAllProductByHost(req.params.userId);

			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}



	async checkDuplicateSession(req, res) {
	    try {
	    	let sessionName = req.params.sessionName;

			let sessionObj = await sessionModel.checkDuplicateSession(req.currentUser.id, sessionName);

			if (isEmpty(sessionObj)) {
				response.resp(res, 200, sessionObj);
			} else {
				response.resp(res, 500, {message:"Session name already exists"})
			}		
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getHosts(req, res) {
	    try {

			let hostsList = await channelHostModel.getChannelHostsList(req.params.channelId);

			response.resp(res, 200, hostsList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}



}

module.exports = new SessionCtrl();