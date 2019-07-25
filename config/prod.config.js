// Production

let config = {
	rootpath : process.cwd(),
	mongo : {
		uri : process.env.PROD_MONGODB_URI,
	},
	auth : {
		key:"djghhhhuuwiwuewieuwieuriwu",
		flag : true,
		ttl : 31556926
	}
};

module.exports = config;
