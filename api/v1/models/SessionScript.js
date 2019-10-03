const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class SessionScript{

	constructor(){
		this.table = 'session_script';
	}

	async getProductDetail(sessionId, userId, interest) {
		
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT ss.id, ss.name, ss.description, ssm.sessionScriptId FROM session_script ss LEFT JOIN session_script_mapping ssm ON ssm.sessionScriptId = ss.id WHERE ssm.sessionId = ? AND ss.userId = ? AND status = 1', [sessionId, userId], function (error, results, fields) {
			 	
			 	if (error) reject(error);
			 	console.log('================== results ', results)
			  	
		  		scriptAttr.getAttributesByIds(underscore.pluck(results, 'sessionScriptId'))
			  		.then(function(attributes){

	  					let nestedData = [];
			  			if(!isEmpty(attributes)){

			  			console.log('================== attributes ', attributes)
		  					for(let j in attributes){
			  					let attrData = attributes[j];
			  					
		  						if(interest == 101){
		  							let position = '';
		  							if(attrData.attrLabel == 'TARGET ZONE')
		  								position = 1;
		  							else if(attrData.attrLabel == 'TARGET BPM')
		  								position = 2;
		  							else if(attrData.attrLabel == 'counter')
		  								position = 0;
		  							underscore.extend(attrData, {position : position});
			  						
			  						if(!nestedData[attrData.orderBy]){
					  					for(let i in results){
						  					let sessData = results[i];
						  					if(sessData.id == attrData.sessionScriptId){
						  						sessData.attribute = [];
				  								nestedData[attrData.orderBy] = sessData;
				  							}
						  				}
			  						}
		  							nestedData[attrData.orderBy]['attribute'].push(attrData);
		  						} else if(interest == 100) {
		  							if(!nestedData[attrData.sessionScriptId]){
					  					for(let i in results){
						  					let sessData = results[i];
						  					if(sessData.id == attrData.sessionScriptId){
						  						sessData.attribute = [];
				  								nestedData[attrData.sessionScriptId] = sessData;
				  							}
						  				}
			  						}
		  							nestedData[attrData.sessionScriptId]['attribute'].push(attrData);
		  						}
			  					// console.log('*****************',nestedData);
			  				}	
			  			}
			  			nestedData = underscore.filter(nestedData , function(data){
			  				return data != null;
			  			});
			  			return resolve(nestedData);
			  		});

			  // db.end();
			});
        });
	}	


	async getProductDetail_Bakup(sessionId, userId, interest) {
		
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT ss.*, ssm.sessionScriptId FROM session_script ss LEFT JOIN session_script_mapping ssm ON ssm.sessionScriptId = ss.id WHERE ssm.sessionId = ? AND ss.userId = ? AND status = 1', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  	
		  		scriptAttr.getAttributesByIds(underscore.pluck(results, 'sessionScriptId'))
			  		.then(function(attributes){

			  			let productData = {};
			  			if(!isEmpty(attributes)){

			  			// console.log('================== attributes ', attributes)
			  				for(let i in results){
			  					let sessData = results[i];
			  					let nestedData = [];
			  					for(let j in attributes){
				  					let attrData = attributes[j];
				  					if(sessData.id == attrData.sessionScriptId){
				  						if(interest == 101){
				  							let position = '';
				  							if(attrData.attrLabel == 'TARGET ZONE')
				  								position = 1;
				  							else if(attrData.attrLabel == 'TARGET BPM')
				  								position = 2;
				  							else if(attrData.attrLabel == 'counter')
				  								position = 0;
				  							underscore.extend(attrData, {position : position});
				  						}
				  						nestedData.push(attrData);
				  					}
				  				}
				  				underscore.extend(results[i], { attribute : nestedData});
			  				}		
			  			}
			  			return resolve(results);
			  		});

			  // db.end();
			});
        });
	}	
}

module.exports = new SessionScript();
