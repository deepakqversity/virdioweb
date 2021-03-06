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
		console.log('------table-----------',table)
		return await new Promise((resolve, reject) => {
			db.query('SELECT * FROM ?? WHERE id = ? AND status = 1', [table, id], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('================== results ', error)
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
			db.query('SELECT id, firstName, lastName, email, password, image, status,type, isBanned FROM ?? WHERE email = ? AND status = 1 limit 1', [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
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
			db.query("SELECT id, firstName, lastName, email, password, status FROM ?? WHERE email = ? AND status = 1 AND isBanned = 0  LIMIT 1", [table, email], function (error, results, fields) {
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
	async getExistsUserByEmailOrMobile(email, phone){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query("SELECT id, firstName, lastName, email, password, status FROM ?? WHERE (email = ? OR (phone = ? AND phone != '' )) LIMIT 1", [table, email, phone], function (error, results, fields) {
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
			db.query('INSERT INTO ?? SET name=?, firstName=?, lastName=?, email=?, password=?,address1=?,address2=?,city=?,state=?,zip=?,image=?,type=?, phone=?, status=0', [table,userData.name, userData.firstName, userData.lastName, userData.email, userData.password, userData.address1, userData.address2, userData.city, userData.state, userData.zip, userData.image, userData.type, userData.phone], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}
	async updatePassword(email,password) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? SET password = ? WHERE email = ? AND status = 1', [table,password, email], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();

			  console.log('-----updatepassword--------',results)
			  return resolve(isEmpty(results) ? 0 : results);
			});
		});
	}
}

module.exports = new User();

