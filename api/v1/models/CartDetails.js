const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class CartDetails{

	constructor(){
		this.table = 'cart_details';
	}

	/**
	 * Add crt details
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async add(data) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET sessionCartId=?, channelId=?, sessionScriptId=?, quantity=?, unitPrice=?, totalPrice=?', 
				[
					table, 
					data.sessionCartId,
					data.channelId, 
					data.sessionScriptId, 
					data.quantity, 
					data.unitPrice,
					data.totalPrice
				], function (error, results, fields) {
				  if (error) reject(error);

				  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

	/**
	 * Get session detail by sessionId and user id
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getCartDetails(sessionCartId) {
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE sessionCartId = ? AND quantity>0', [this.table, sessionCartId], function (error, results, fields) {
			  if (error) reject(error);

			  return resolve(results);
			});
        });
	}
	
	/**
	 * Get details of cart product
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getCartProductDetails(data) {
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT sc.id as cart_id, sc.totalPrice as cart_totalPrice, cd.id as cart_detail_id, cd.unitPrice as cart_details_unitPrice, cd.totalPrice as cart_details_totalPrice, cd.quantity FROM session_cart sc INNER JOIN cart_details cd WHERE sc.id = cd.sessionCartId AND sc.userId=? AND sc.sessionId=? AND cd.channelId=? AND cd.sessionScriptId=?', [data.userId,data.sessionId,data.channelId,data.sessionScriptId], function (error, results, fields) {
			  if (error) {
			  	console.log(error);
			  	reject(error);
			  }
			  return resolve(results);
			});
        });
	}

	/**
	 * update cart product total price
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async updateCartProductPrice(data) {

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? SET quantity = ?, totalPrice = ? WHERE id = ?', [table, data.quantity, data.totalPrice, data.cartDetailId], function (error, results, fields) {
	 		 	if (error) reject(error);

			  	return resolve(results);
			});
		});
	}

}

module.exports = new CartDetails();

