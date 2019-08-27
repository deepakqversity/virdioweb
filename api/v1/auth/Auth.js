// Configuration
const jwt = require("jsonwebtoken")
const config = require(process.cwd() + "/config/config");
const userModel = require('../models/User');

class Auth{

	/*
	 Create JWT token
	 */
	static async createToken(id){
		try{
			// console.log('create token')
			return await jwt.sign({id:id}, config.auth.key, {expiresIn: config.auth.ttl});
		} catch(error) {
			return next(error);
		}
	}

	/*
	 Verify JWT token
	 */
	static async verifyToken(req, res, next){
		try{
			// console.log('verify token')
			const token = req.headers.authorization;
			if(!token){
				return res.status(400).json({message : "Invalid access."})
			}
			const payload = await jwt.verify(token, config.auth.key);
			const userObj = await userModel.getUserById(payload.id);
			// console.log('====',userObj);
			req.currentUser = userObj;
			next();
		} catch(error) {
			return res.status(400).json(error)
		}
	}
}
module.exports = Auth;