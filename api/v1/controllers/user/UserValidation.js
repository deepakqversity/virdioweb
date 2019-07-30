const Validator = require("validator");
const isEmpty = require("is-empty");

class UserValidation {

	static login(req, res, next) {
		
		let data = req.body;
		let errors = {};

		// Convert empty fields to an empty string so we can use validator functions
		data.name = !isEmpty(data.name) ? data.name : "";

		// Name checks
		if (Validator.isEmpty(data.name)) {
			errors.name = "Name field is required";
		}
		// Email checks
		// if (!data.email || Validator.isEmpty(data.email)) {
		// 	errors.email = "Email field is required";
		// } else if (!Validator.isEmail(data.email)) {
		// 	errors.email = "Email is invalid";
		// }

		if(true != isEmpty(errors)){
			res.status(400).json(errors);
		} else {
			next()
		}
	}

	static register(req, res, next) {
		
		let data = req.body;
		let errors = {};

		// Convert empty fields to an empty string so we can use validator functions
		data.name = !isEmpty(data.name) ? data.name : "";

		// Name checks
		if (Validator.isEmpty(data.name)) {
			errors.name = "Name field is required";
		}

		// Password check
		if (Validator.isEmpty(data.password)) {
			errors.password = "Password field is required";
		}
		// Email checks
		// if (!data.email || Validator.isEmpty(data.email)) {
		// 	errors.email = "Email field is required";
		// } else if (!Validator.isEmail(data.email)) {
		// 	errors.email = "Email is invalid";
		// }

		if(true != isEmpty(errors)){
			res.status(400).json(errors);
		} else {
			next()
		}
	}
}

module.exports = UserValidation;