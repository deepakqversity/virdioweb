const auth = require('../../auth/Auth');
const isEmpty = require("is-empty");
const bcrypt = require('bcrypt');
const underscore = require("underscore");
const sessionModel = require('../../models/Session');
const sessionUserModel = require('../../models/SessionUser');
const userModel = require('../../models/User');
const sessionConfigMappingModel = require('../../models/SessionConfigMapping');
const sessionScriptModel = require('../../models/SessionScript');
const sessionScriptMappingModel = require('../../models/SessionScriptMapping');
const scriptAttributesModel = require('../../models/ScriptAttributes');
const channelHostModel = require('../../models/ChannelHost');
const InterestEquipmentModel = require('../../models/InterestEquipment');
const InterestShoppingModel = require('../../models/InterestShoppingList');
const ActivityTypeModel = require('../../models/ActivityType');
const SessionEmojiesModel = require('../../models/SessionEmojies');
const SessionEquipmentMappingModel = require('../../models/SessionEquipmentMapping');
const SessionShoppingListModel = require('../../models/SessionShoppingList');
const EmojiesModel = require('../../models/Emojies');
const ChannelsModel = require('../../models/Channels');
const ChannelProductModel = require('../../models/ChannelProduct');
const ChannelInterestModel = require('../../models/ChannelInterest');
const activityLogsModel = require('../../models/ActivityLogs');
const clientToken = require( process.cwd() + '/util/ClientToken');
const utils = require(process.cwd() + '/util/Utils');
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
				hostId : "3",
				scheduleDate : req.body.session.start_date,
				duration : req.body.session.duration,
				level : req.body.session.level,
				//level : "2",
				minAttendee : req.body.session.min_participants,
				maxAttendee : req.body.session.max_participants, 
				currency : 'USD',
				chargeForSession  : req.body.session.amountCharge ? req.body.session.amountCharge : 0,
				sessionChargeAllowed  : req.body.session.session_charge == true ? 1 : 0,
				showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
				sessionProperty : req.body.session.sessionProperty == true ? 1 : 0,
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

			//console.log('----------sessionId1111------------------',sessionId)

			if(sessionId > 0){


				console.log('----------insertData11111------------------',req.body.host_list)

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

				console.log('----------sessionId5555------------------',req.body.host_list.hostList.length)

				if(req.body.host_list.hostList.length != 0)
				{
					let hostlist=[];
					 hostlist=req.body.host_list.hostList;					 

					 let sessionUserData;

					 for(let i in hostlist){
						sessionUserData = [[sessionId,hostlist[i],3,0,1]]
						console.log('----------sessionId23333------------------',sessionUserData)

					let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
					

					 }


				}

				

				if(req.body.equipment_list.equipmentList.length != 0)
				{
					let equipmentList=[];
					equipmentList=req.body.equipment_list.equipmentList;

					console.log('----------equipment_list------------------',equipmentList)

					 let sessionEquipData;

					 for(let i in equipmentList){
						sessionEquipData = [[sessionId,equipmentList[i].id,equipmentList[i].Quantity,equipmentList[i].Link]]
						console.log('----------sessionEquipData------------------',sessionEquipData)

					let sessionEquipresult = await SessionEquipmentMappingModel.addSessionEquipment(sessionEquipData);
					
					 }


				}

				console.log('----------shopping_list------------------',req.body.shopping_list.shoppingList)

				if(req.body.shopping_list.shoppingList.length != 0)
				{
					let shoppingList=[];
					shoppingList=req.body.shopping_list.shoppingList;

					console.log('----------shoppingList------------------',shoppingList)

					 let sessionshopData;

					 for(let i in shoppingList){
						sessionshopData = [[sessionId,shoppingList[i].id,shoppingList[i].Quantity,shoppingList[i].itemNote,shoppingList[i].Link]]
						console.log('----------sessionshopData------------------',sessionshopData)

					let sessionshopresult = await SessionShoppingListModel.addSessionshoppingList(sessionshopData);
					console.log('-------session shopping data will be inserted-------')
					 }


				}


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

						let scriptAttributeId = await scriptAttributesModel.add(attributes);
					}
				}

				// res.status(200).send({logId : insertedId});

				console.log('----------scriptAttributeId------------------',sessionId)
				let sessId=sessionId+100;
				let optcode=sessId+'#'+'virdio';

				console.log('----------script------------------',optcode)
				let resultant_code = await utils.encodedDecodedString(optcode,0);

				console.log('-------resultant_code--------',resultant_code)

				let urlcode=process.env.DOMAIN_URL_FOR_USER+"/"+resultant_code;

				console.log('-------urlcode--------',urlcode)
							
			let sessionDt = await sessionModel.findSessionDetailBySessId(sessionId);

			console.log('------sessionDt-----------',sessionDt)

				response.resp(res, 200, {urlcode,sessionDt})
			} else {
				response.resp(res, 500, {message:"Something went wrong."})
			} 




		} catch(exception) {
				response.resp(res, 500, exception);
			}
		}



		async verifyUser(req, res) {
			try {
				//let inerestId = 1;
				console.log('-------lllt------------',req.body)
	
	
				let decoded_sessid = await utils.encodedDecodedString(req.body.sessId,1);
	
				console.log('-------llltttttt------------',decoded_sessid)
	
				 let sessdta = decoded_sessid.split("#");
	
				 console.log('-------sessdta------------',sessdta[0])
	
				 let sessionId= sessdta[0]-100;
	
				 console.log('-------sessionId------------',sessionId)

				 let sessionDta = await sessionModel.findSessionDetailBySessId(sessionId);
					
				console.log('------sessionDta1111---------',sessionDta)
	
				response.resp(res, 200, {sessionDta})
			} catch(exception) {
				response.resp(res, 500, exception);
			}
		}


		async createWineSession(req, res) {
			try {
	
				console.log('----------req.bodylalit111------------------',req.body)
	
				let insertData = {	
					interestId : 1,	
					channelId : req.body.session.channelId,
					name : req.body.session.name,
					description : req.body.session.description,
					hostId : "1",
					scheduleDate : req.body.session.start_date,
					duration : req.body.session.duration,
					level : req.body.session.level,
					//level : "2",
					minAttendee : req.body.session.min_participants,
					maxAttendee : req.body.session.max_participants, 
					currency : 'USD',
					chargeForSession  : req.body.session.amountCharge ? req.body.session.amountCharge : 0,
					sessionChargeAllowed  : req.body.session.session_charge == true ? 1 : 0,
					showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
					sessionProperty : req.body.session.sessionProperty == true ? 1 : 0,
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
	
				
	
				// // insert into sessions table

				 let sessionId = await sessionModel.add(insertData);
	
				//console.log('----------sessionId1111------------------',sessionId)
	
				if(sessionId > 0){
	
	
					console.log('----------insertData11111------------------',sessionId)
	
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
	
					//console.log('----------sessionId5555------------------',req.body.host_list.hostList.length)
	
					if(req.body.host_list.hostList.length != 0)
					{
						let hostlist=[];
						 hostlist=req.body.host_list.hostList;					 
	
						 let sessionUserData;
	
						 for(let i in hostlist){
							sessionUserData = [[sessionId,hostlist[i],3,0,1]]
							console.log('----------sessionId23333------------------',sessionUserData)
	
						let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
						
	
						 }
	
	
					}
	
					
	
					if(req.body.equipment_list.equipmentList.length != 0)
					{
						let equipmentList=[];
						equipmentList=req.body.equipment_list.equipmentList;
	
						console.log('----------equipment_list------------------',equipmentList)
	
						 let sessionEquipData;
	
						 for(let i in equipmentList){
							sessionEquipData = [[sessionId,equipmentList[i].id,equipmentList[i].Quantity,equipmentList[i].Link]]
							console.log('----------sessionEquipData------------------',sessionEquipData)
	
						let sessionEquipresult = await SessionEquipmentMappingModel.addSessionEquipment(sessionEquipData);
						
						 }
	
	
					}
	
				//	console.log('----------shopping_list------------------',req.body.shopping_list.shoppingList)
	
					if(req.body.shopping_list.shoppingList.length != 0)
					{
						let shoppingList=[];
						shoppingList=req.body.shopping_list.shoppingList;
	
						console.log('----------shoppingList------------------',shoppingList)
	
						 let sessionshopData;
	
						 for(let i in shoppingList){
							sessionshopData = [[sessionId,shoppingList[i].id,shoppingList[i].Quantity,shoppingList[i].itemNote,shoppingList[i].Link]]
							console.log('----------sessionshopData------------------',sessionshopData)
	
						let sessionshopresult = await SessionShoppingListModel.addSessionshoppingList(sessionshopData);
						console.log('-------session shopping data will be inserted-------')
						 }
	
	
					}
	console.log('------req.body.activities--------',req.body.activities);
	
					if(false === isEmpty(req.body.activities)){
						
						let activities = req.body.activities;
	
						console.log('----------activities------------------',activities)
	
						for(let i in activities){
	
							var attributes = [];
	
							let sessionScriptInsertData = {	
												interestId : 1,			
												name : activities[i].wineChoice,
												description : '',
												//userId : req.currentUser.id,
												userId : 11,
											}
	
							 // insert into session_script table
							let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);
	
							 // insert into session_script_mapping table
							sessionScriptMappingModel.add({ sessionId: sessionId, sessionScriptId : sessionScriptId});

							console.log('------activities[i].attributes----------',activities[i])

								
							let activityEmojies = activities[i].Emojies;
							console.log('---------activityEmojies-----------------',activityEmojies);
							for(let j in activityEmojies){
								console.log('---------activityEmojies[j].id-----------------',activityEmojies[j].id);
								console.log('---------activityEmojies[j].type-----------------',activityEmojies[j].type);
								var emojiesArr = [];
								emojiesArr.push(sessionId);
								emojiesArr.push(sessionScriptId);							
								emojiesArr.push(activityEmojies[j].id);
								emojiesArr.push(activityEmojies[j].emojies_type);
								emojiesArr.push(1);									
								console.log('---------emojiesArr-----------------',emojiesArr);
							let emojiesArrr=[emojiesArr];
							let sessionEmojiesdata = SessionEmojiesModel.addSessionEmojies(emojiesArrr);
							}							
							
						}
					}
	

					console.log('----------scriptAttributeId------------------',sessionId)
					let sessId=sessionId+100;
					let optcode=sessId+'#'+'virdio';
	
					console.log('----------script------------------',optcode)
					let resultant_code = await utils.encodedDecodedString(optcode,0);
	
					console.log('-------resultant_code--------',resultant_code)
	
					let urlcode=process.env.DOMAIN_URL_FOR_USER+"/"+resultant_code;
	
					console.log('-------urlcode--------',urlcode)
								
				let sessionDt = await sessionModel.findSessionDetailBySessId(sessionId);
	
				console.log('------sessionDt-----------',sessionDt)
	
					response.resp(res, 200, {urlcode,sessionDt})

					// res.status(200).send({logId : insertedId});
					//response.resp(res, 200, {})
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

			let userId=11;
			console.log('------lalitgethost---------',req.param)
			
			let hostsList = await channelHostModel.getChannelHostsList(req.params.channelId,userId);

			console.log('------lalitgethostlist---------',hostsList)

			response.resp(res, 200, hostsList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getHostsForChannel(req, res) {
	    try {

			let userId=11;
			console.log('------lalitgethost---------',req.param)
			let hostsList = await userModel.getUserById(userId);
			//let hostsList = await channelHostModel.getChannelHostsList(req.params.channelId,userId);

			console.log('------lalitgethostlist---------',hostsList)

			response.resp(res, 200, hostsList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getEquipments(req, res) {
	    try {
			console.log('------getEquipments---------',req.params.interestId)
			let equipmentList = await InterestEquipmentModel.getEquipments(req.params.interestId);

			console.log('------lalitgetequipment---------',equipmentList)

			response.resp(res, 200, equipmentList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getShoppingList(req, res) {
	    try {
			console.log('------getShopping---------',req.params.interestId)
			
			let shopping_List = await InterestShoppingModel.getInterestShoppingList(req.params.interestId);

			console.log('------lalitgetshopping---------',shopping_List)

			response.resp(res, 200, shopping_List);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getActivityType(req, res) {
	    try {
			console.log('------getActivityType---------',req.params.interestId)
			
			let activity_List = await ActivityTypeModel.getActivityType(req.params.interestId);

			console.log('------lalitgetactivity---------',activity_List)

			response.resp(res, 200, activity_List);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getEmojiesList(req, res) {
	    try {
			console.log('------Emojies---------',req.params.interestId)
			
			let emojiesList = await EmojiesModel.getEmojies(req.params.interestId);

			console.log('------emojies_List---------',emojiesList)

			// for(let i in emojiesList){

			// var emojiesArray = [];
			// //console.log('------emojiesArray---------',emojiesList[i])
				
			// emojiesArray[emojiesList[i].emojies_type]=emojiesList[i];
			// }
			//var emojiesArray1 = JSON.stringify(emojiesArray);

			//console.log('------emojiesArray11---------',emojiesArray)

			response.resp(res, 200, emojiesList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getProductList(req, res) {
	    try {
			console.log('------getProductList---------',req.params.channelId)
			
			let productList = await ChannelProductModel.getproductsByChannel(req.params.channelId);

			console.log('------productList---------',productList)

			response.resp(res, 200, productList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getAttributeList(req, res) {
	    try {
			//let inerestId = 1;
			console.log('------getAttributeList---------',req.params.interestId)
			
			let attributeList = await scriptAttributesModel.getAttributesByInterestIds(req.params.interestId);

			console.log('------getAttributeList---------',attributeList)

			response.resp(res, 200, attributeList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async addNewProduct(req, res) {
	    try {
			//let inerestId = 1;
			console.log('------addNewProduct---------',req.body)
			
			if(false === isEmpty(req.body)){
					
				let newproducts = req.body;

				console.log('----------products------------------',newproducts)

				for(let i in newproducts){

					//var newproducts = [];
					var attributesnewArr = [];

					let sessionScriptInsertData = {	
										interestId : 1,			
										name : newproducts.name,
										description : '',
										//userId : req.currentUser.id,
										userId : 11,
									}
					console.log('----------sessionScriptInsertData------------------',sessionScriptInsertData)
					 // insert into session_script table
					let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);

				

					let productsAttributes = newproducts.attributes;
					for(let j in productsAttributes){

						var attributesArr = [];

						attributesArr.push(sessionScriptId);
						attributesArr.push(newproducts.attributes[j].attrKey);
						attributesArr.push(newproducts.attributes[j].attrValue);
						attributesArr.push(1);
						attributesArr.push(2);
						
						console.log('----------attributesArr------------------',attributesArr)

						attributesnewArr.push(attributesArr);

						console.log('----------attributesnewArr------------------',attributesnewArr)

					}

					var scriptAttributeres = await scriptAttributesModel.add(attributesnewArr);

					console.log('------scriptAttributeres---------',scriptAttributeres)
				}
			}

		
			response.resp(res, 200, scriptAttributeres);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	
	async getInterestBychannelId(req, res) {
	    try {
			//let inerestId = 1;
			console.log('------channelId---------',req.params.channelId)
			
			let interestList = await ChannelInterestModel.getInterestBychannel(req.params.channelId);

			console.log('------interestList---------',interestList)

			response.resp(res, 200, interestList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async createNewChannel(req, res) {
	    try {

			console.log('-------lllt------------',req.body)

			if(false === isEmpty(req.body)){

			let insertData = {	
	
				name : req.body.channel.name,
				description : req.body.channel.description,
				individualOrBusiness : "1",
				image : req.body.channel.image ? req.body.channel.image : 0,
				userId:3,
				phone : req.body.channel.phone,
				//level : "2",
				street_address1 : req.body.channel.street_address1,
				street_address2 : req.body.channel.street_address2, 
				charge_amount  : req.body.channel.charge_amount ? req.body.channel.charge_amount : 0,
				chargeForSession  : req.body.channel.chargeForSession == true ? 1 : 0,
				city : req.body.channel.city,
				state_code : req.body.channel.state_code,
				zip_code : req.body.channel.zip_code,
				account_name : req.body.channel.account_name,
				account_number : req.body.channel.account_number,
				account_type : req.body.channel.account_type,
				routing_number : req.body.channel.routing_number,
				ss : req.body.channel.ss,
				ein : req.body.channel.ein,
				has_shopping_list : req.body.channel.has_shopping_list == true ? 1 : 0,
				has_equipment_list : req.body.channel.has_equipment_list == true ? 1 : 0,
				has_product_list : req.body.channel.has_product_list == true ? 1 : 0
			};

			console.log('----------insertData------------------',insertData)

			

			// insert into sessions table
			var channelId = await ChannelsModel.addchannel(insertData);

		}

			response.resp(res, 200, channelId);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}




}

module.exports = new SessionCtrl();