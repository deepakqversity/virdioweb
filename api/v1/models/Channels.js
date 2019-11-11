const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class Channels{

	constructor(){
		this.table = 'channels';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addchannel(data){

        let table = this.table;
        console.log('------addchannel---------',data)

        return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET name=?, description=?, individualOrBusiness=?, ss=?, ein=?, chargeForSessiones=?, image=?, userId=?, phone=?, street_address1=?, street_address2=?,city=?, state_code=?, zip_code=?, account_name=?, account_number=?, account_type=?, routing_number=?, charge_amount=?, has_shopping_list=?, has_equipment_list=?, has_product_list=?, status=1', [
                this.table,
                data.name, 
                data.description, 
                data.individualOrBusiness, 
                data.ss,
                data.ein,
                data.chargeForSession,
                data.image,
                data.userId,
                data.phone,
                data.street_address1,
                data.street_address2,
                data.city,                            
                data.state_code,
                data.zip_code,
                data.account_name,
                data.account_number,
                data.account_type,
                data.routing_number,
                data.charge_amount,
                data.has_shopping_list,
                data.has_equipment_list,
                data.has_product_list
                ], function (error, results, fields) {
      if (error) reject(error);
      console.log('==========lalitErr======== ************ results ', results)
      return resolve(isEmpty(results) ? 0 : results.insertId);
    });;
        });
	}

}

module.exports = new Channels();
