const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const productAttr = require('./ProductAttributes');

class Products{

	constructor(){
		this.table = 'products';
	}

	async getProductDetail(sessionId, userId) {
		try
	    {
	        return await new Promise((resolve, reject) => {
            	
            	db.query('SELECT p.*, pa.productId FROM products p LEFT JOIN product_session pa ON pa.productId = p.id WHERE sessionId = ? AND userId = ?', [sessionId, userId], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  	
			  		productAttr.getAttributesByIds(underscore.pluck(results, 'productId'))
				  		.then(function(attributes){

				  			let productData = {};
				  			if(!isEmpty(attributes)){

				  			// console.log('================== attributes ', attributes)
				  				for(let i in results){
				  					let sessData = results[i];
				  					let nestedData = [];
				  					for(let j in attributes){
					  					let attrData = attributes[j];
					  					if(sessData.id == attrData.productId){
					  						nestedData.push(attrData);
					  					}
					  				}
					  				underscore.extend(results[i], { attribute : nestedData});


				  				}		
				  // console.log('================== results ', results)
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

module.exports = new Products();
