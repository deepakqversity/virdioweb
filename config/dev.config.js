// Development

let config = {
	rootpath : process.cwd(),
	mongo : {
		// uri : process.env.DEV_MONGODB_URI,
	},
	mysql : {
		host : process.env.MYSQL_HOST,
		user : process.env.MYSQL_USERNAME,
		pwd : process.env.MYSQL_PASSWORD,
		db : process.env.MYSQL_DB
	},
	auth : {
		key:"djghhhhuuwiwuewieuwieuriwu",
		flag : true,
		ttl : 31556926
	}
};

module.exports = config;
