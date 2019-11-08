const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class ChannelProduct{

	constructor(){
		this.table = 'channel_product';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} channelId
	 * @return {obj} 
	 */


    async getproductsByChannel(channelId){

        let interestId=1;

        let table = this.table;
        console.log('------lalitproducts---------',interestId,channelId)

        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE interestId = ? AND channelId = ? AND status = 1', [table, interestId,channelId], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('==================productlist ', error)
			  // db.end();
			  return resolve(results);
			});
        });
	}

}

module.exports = new ChannelProduct();
