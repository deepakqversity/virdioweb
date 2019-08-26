const db = require(process.cwd() + '/library/Mysql')

class AuthToken{

	constructor(){
		this.table = 'token';
	}

	/**
	 * Create user auth token 
	 * @param  {int} userId
	 * @param  {string} token 
	 * @return {obj}
	 */
	async updateToken(userId, token){

	    let table = this.table;
		try
	    {
			return await new Promise( (resolve, reject) => {
				 db.query('INSERT IGNORE INTO ?? (token, userId) VALUES (?, ?)', [table, token, userId], function (error, results, fields) {
					if (error) reject(error);

					// console.log('*******************', results)
					if(results.insertId == 0){

						 db.query('UPDATE ?? SET token = ? WHERE userId = ?', [table, token, userId], function (error, results, fields) {
						  if (error) reject(error);
						  // console.log('================== 123 results ', results)
						  // db.end();
						  return resolve(results);
						});
					}

				});

			});
		}
	    catch(err)
	    {
	    	console.log('err = ',err)
	       return err;
	    }
	}
}

module.exports = new AuthToken();

