const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class SessionCart{

	constructor(){
		this.table = 'session_cart';
	}

	/**
	 * Get session detail by sessionId and user id
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getCartDetails(data) {
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id, totalPrice FROM ?? WHERE userId = ? AND sessionId = ?', [this.table, data.userId, data.sessionId], function (error, results, fields) {
			  if (error) reject(error);

			  return resolve(results);
			});
        });
	}

	/**
	 * Add crt details
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async add(data) {

		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET userId=?, sessionId=?, status=2', 
				[
					table, 
					data.userId, 
					data.sessionId
				], function (error, results, fields) {
				  if (error) {
				  	console.log('#####', error);
				  	reject(error);
			  	}
				  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

	/**
	 * update cart total price
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async updateCartPrice(cartId, totalPrice) {

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? SET totalPrice = ? WHERE id = ?', [table, totalPrice, cartId], function (error, results, fields) {
	 		 	if (error) reject(error);

			  	return resolve(results);
			});
		});
	}
}

module.exports = new SessionCart();

