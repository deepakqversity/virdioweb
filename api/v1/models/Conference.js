const schema = require('./DbSchema');

class Conference{

	constructor(){
		this.model = schema.Conference;
	}

	async get(find){
		let model = this.model;

		try{
			return await model.find(find);
		} catch(exception) {
	      return exception;
	    }
	}
}

module.exports = new Conference();

