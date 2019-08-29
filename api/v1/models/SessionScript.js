const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class SessionScript{

	constructor(){
		this.table = 'session_script';
	}

	async getProductDetail(sessionId, userId) {
		try
	    {
	        return await new Promise((resolve, reject) => {
            	
            	db.query('SELECT ss.*, ssm.sessionScriptId FROM session_script ss LEFT JOIN session_script_mapping ssm ON ssm.sessionScriptId = ss.id WHERE ssm.sessionId = ? AND ss.userId = ?', [sessionId, userId], function (error, results, fields) {
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
	        })
	    }
	    catch(err)
	    {
	    	console.log(err)
	       return err;
	    }
	}
	
}

module.exports = new SessionScript();
