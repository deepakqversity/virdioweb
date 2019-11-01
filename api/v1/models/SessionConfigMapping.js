const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class SessionConfigMapping{

    constructor(){
		this.table = 'session_config_mapping';
	}

	/**
	 * Insert New session Config
	 * @param  {int} userId
	 * @param  {int} sessionId
	 * @return {obj} 
	 */
	async addSessionConfig(data) {
        let table = this.table;

        console.log('----------sessionId2222------------------',data)

        //data to be inserted into table
  
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (sessionId, configId) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

                console.log('----------sessionconfig------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}


}

module.exports = new SessionConfigMapping();