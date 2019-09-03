const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class Otp{

	constructor(){
		this.table = 'otp';
	}

	/**
	 * add new record
	 * @param {obj} userData
	 */
	async add(userId, code, channel) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET userId=?, code=?, channel=?, status=0', [table, userId, code, channel], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

	async verify(code, userId, channel){

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('SELECT * FROM ?? WHERE code = ? AND userId = ? AND channel = ? limit 1', [table, code, userId, channel], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('results = ', results);
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

	async updateOtp(code, userId){

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? SET status = 1 WHERE code = ? AND userId = ? AND status = 0', [table, code, userId], function (error, results, fields) {
			  if (error) reject(error);
			  return resolve(results);
			});
		});
	}
}

module.exports = new Otp();