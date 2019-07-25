const schema = require('./DbSchema');

class ConferenceUser{

	constructor(){
		this.model = schema.ConferenceUser;
	}

	async get(find){
		let model = this.model;

		try{
			return await model.find(find);
		} catch(exception) {
	      return exception;
	    }
	}

	async updateCurrentSessionType(userId, confId, flag){
		let model = this.model;

		try{
			return await model.updateOne({userId:userId, confId:confId}, {sessionType:flag}, {upsert:false});
		} catch(exception) {
	      return exception;
	    }
	}

	async updateConferenceUser(userId, confId, data){
		let model = this.model;

		try{
			return await model.updateOne({userId:userId, confId:confId}, data, {upsert:false});
		} catch(exception) {
	      return exception;
	    }
	}

}

module.exports = new ConferenceUser();

