const Validator = require("validator");
const isEmpty = require("is-empty");

class UserValidation {

	static login(req, res, next) {
		
		let data = req.body;
		let errors = {};
console.log(data)
		// Convert empty fields to an empty string so we can use validator functions
		data.password = !isEmpty(data.password) ? data.password : "";

		// Name checks
		// if (Validator.isEmpty(data.name)) {
		// 	errors.name = "Name field is required";
		// }

		// Email checks
		if (!data.email || Validator.isEmpty(data.email)) {
			errors.email = "Email field is required";
		} else if (!Validator.isEmail(data.email)) {
			errors.email = "Email is invalid";
		}
		
		// Password checks
		if (Validator.isEmpty(data.password)) {
			errors.password = "Password field is required";
		}

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
		data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
		data.lastName = !isEmpty(data.lastName) ? data.lastName : "";

		// Name checks
		if (Validator.isEmpty(data.firstName)) {
			errors.firstName = "First name is required";
		}

		if (Validator.isEmpty(data.lastName)) {
			errors.lastName = "Last name is required";
		}

		// Password check
		if (Validator.isEmpty(data.password)) {
			errors.password = "Password is required";
		}

		if (Validator.isEmpty(data.phone)) {
			errors.phone = "Mobile is required";
		}
		
		// Email checks
		if (!data.email || Validator.isEmpty(data.email)) {
			errors.email = "Email is required";
		} else if (!Validator.isEmail(data.email)) {
			errors.email = "Email is invalid";
		}

		if(true != isEmpty(errors)){
			res.status(400).json(errors);
		} else {
			next()
		}
	}
	static verifyOtp(req, res, next) {
		let data = req.body;
		let errors = {};

		// Convert empty fields to an empty string so we can use validator functions
		let otp = !isEmpty(req.body.otp) ? req.body.otp : "";

		// Name checks
		if (Validator.isEmpty(otp)) {
			errors.otp = "OTP is required";
		}

		if(true != isEmpty(errors)){
			res.status(400).json(errors);
		} else {
			next()
		}
	}
}

module.exports = UserValidation;