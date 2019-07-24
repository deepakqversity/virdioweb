const schema = require('./DbSchema');

class User{

	constructor(){
		this.model = schema.User;
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

	async updateToken(id, token){
		let model = this.model;

		try{
			return await model.updateOne({id:id}, {token:token}, {upsert:false});
		} catch(exception) {
	      return exception;
	    }
	}
}

module.exports = new User();

