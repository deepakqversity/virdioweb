const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class User{

	constructor(){
		this.table = 'users';
	}

	/**
	 * Get all active users
	 * @return {obj}
	 */
	async getUsers(){

		let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE status = 1', [table], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        })
	}

	/**
	 * Get single user Detail
	 * @param  {int} id
	 * @return {obj} 
	 */
	async getUserById(id){

		let table = this.table;
		
		return await new Promise((resolve, reject) => {
			db.query('SELECT * FROM ?? WHERE id = ? AND status = 1', [table, id], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results[0]);
			});
		});
		
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getUserByEmail(email){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query('SELECT id, name, email, password, status FROM ?? WHERE email = ? AND status = 1 limit 1', [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getExistsUserByEmail(email){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query('SELECT id, name, email, password, status FROM ?? WHERE email = ? LIMIT 1', [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

	/**
	 * add new record
	 * @param {obj} userData
	 */
	async add(userData) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET firstName=?, lastName=?, email=?, password=?, phone=?, status=0', [table, userData.firstName, userData.lastName, userData.email, userData.password, userData.phone], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}
}

module.exports = new User();

