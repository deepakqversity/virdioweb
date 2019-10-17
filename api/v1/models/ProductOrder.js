const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class ProductOrder{

	constructor(){
		this.table = 'product_order';
	}

	/**
	 * Add crt details
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async add(data) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET userId=?, sessionCartId =?, sessionId=?, totalPrice=?, status=2', 
				[
					table, 
					data.userId,
					data.sessionCartId, 
					data.sessionId, 
					data.totalPrice
				], function (error, results, fields) {
				  if (error) reject(error);

				  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}
	
}

module.exports = new ProductOrder();

