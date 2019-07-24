const mongoose = require("mongoose");

// Configuration
const config = require(process.cwd() + "/config/config");

// Connect to MongoDB
mongoose
	.connect(
		config.mongo.uri,
		{ useNewUrlParser: true }
	)
	.then(() => console.log("MongoDB successfully connected"))
	.catch(err => console.log(err));