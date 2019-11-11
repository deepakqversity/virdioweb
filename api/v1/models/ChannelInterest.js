const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class ChannelInterest{

	constructor(){
		this.table = 'channel_interest';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} channelId
	 * @return {obj} 
	 */


    async getInterestBychannel(channelId){

        let table = this.table;
        console.log('------getInterestBychannel---------',channelId)

        return await new Promise((resolve, reject) => {
            db.query('SELECT  inte.id,inte.title FROM channel_interest ca INNER JOIN interest inte on inte.id = ca.interestId WHERE ca.channelId = ? AND inte.status = 1   GROUP BY inte.id', [channelId], function (error, results, fields) {
                if (error) reject(error);
             console.log('=======InterestBychanne=========== ', error)
                // db.end();
                return resolve(results);
              });
        });
	}

}

module.exports = new ChannelInterest();
