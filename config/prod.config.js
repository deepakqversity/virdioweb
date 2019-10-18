// Production

let config = {
	rootpath : process.cwd(),
	mongo : {
		uri : process.env.PROD_MONGODB_URI,
	},
	auth : {
		key:"djghhhhuuwiwuewieuwieuriwu",
		flag : true,
		ttl : 86400
	}
};

module.exports = config;
