const schema = require('./DbSchema');

class AuthToken{

	constructor(){
		this.model = schema.Token;
	}

	async get(){
		let model = this.model;

		try{
			return await model.find();
		} catch(exception) {
	      return exception;
	    }
	}

	async getUser(find){

		let model = this.model;

		try{
			return await model.findOne(find);
		} catch(exception) {
	      return exception;
	    }
		
	}

	async updateToken(userId, token){
		let model = this.model;

		try{
			return await model.updateOne({userId:userId}, {userId:userId ,token:token}, {upsert:true});
		} catch(exception) {
	      return exception;
	    }
	}
}

module.exports = new AuthToken();

