const db = require(process.cwd() + '/library/Mongodb')
const mongoose = require("mongoose");
const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

mongoose.set('debug', true);

//User Schema
const userSchema = new Schema({
  id: ObjectId,
  name: {type: String, require: true},
  email: {type: String, require: false},
  password: {type: String, require: false},
  status: {type:Boolean, default:false}
})
const User = mongoose.model('users', userSchema);

// Auth Token Schema
const tokenSchema = new Schema({
  id: ObjectId,
  userId: ObjectId,
  token: {type: String, require: require}
})
const Token = mongoose.model('tokens', tokenSchema);

//Role Schema
const roleSchema = new Schema({
  id: ObjectId,
  role: {type: String, require: true}
})
const Role = mongoose.model('roles', roleSchema);

// conference Schema
const conferenceSchema = new Schema({
  id: ObjectId,
  userId: ObjectId, // only host id
  channel: {type: String, require: require},
  status: {type:Boolean, default:false}
})
const Conference = mongoose.model('conferences', conferenceSchema);

// conference user Schema
const conferenceUserSchema = new Schema({
  id: ObjectId,
  confId: ObjectId,
  userId: ObjectId,
  type: Number, // 0= host , 1 = attendies , 2 = attendies 
  sessionType: Number, // 0 = aduence (audio only) , 1 = broadcaster (audio + video)
  streamId: String,
  status: {type:Boolean, default:false}
})
const ConferenceUser = mongoose.model('conference_users', conferenceUserSchema);

module.exports = {
    Role: Role,
    User: User,
    Token: Token,
    Conference: Conference,
    ConferenceUser: ConferenceUser

};