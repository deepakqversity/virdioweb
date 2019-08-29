const db = require(process.cwd() + '/library/Mysql');

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
		try
	    {
	        return await new Promise((resolve, reject) => {
            	db.query('SELECT * FROM ?? WHERE status = 1', [table], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
				  return resolve(results);
				});
	        })
	    }
	    catch(err)
	    {
	       return err;
	    }
	}

	/**
	 * Get single user Detail
	 * @param  {int} id
	 * @return {obj} 
	 */
	async getUserById(id){

		let table = this.table;
		try
	    {
			return await new Promise((resolve, reject) => {
				db.query('SELECT * FROM ?? WHERE id = ? AND status = 1', [table, id], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
				  return resolve(results[0]);
				});
			});
		}
	    catch(err)
	    {
	       return err;
	    }
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getUserByEmail(email){

		let table = this.table;
		try
	    {
			return await new Promise((resolve, reject) => {
				db.query('SELECT id, name, email, password FROM ?? WHERE email = ? AND status = 1 limit 1', [table, email], function (error, results, fields) {
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
				  return resolve(results[0]);
				});
			});
		}
	    catch(err)
	    {
	       return err;
	    }
	}
}

module.exports = new User();

