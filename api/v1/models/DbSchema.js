const db = require(process.cwd() + '/library/Mongodb')
const mongoose = require("mongoose");
const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

//User Schema
const userSchema = new Schema({
  id: ObjectId,
  name: {type: String, require: true},
  email: {type: String, require: true},
  token: {type: String, require: false}
})
const User = mongoose.model('users', userSchema);

//Role Schema
const roleSchema = new Schema({
  id: ObjectId,
  role: {type: String, require: true}
})
const Role = mongoose.model('role', roleSchema);

module.exports = {
    User: User,
    Role: Role
};