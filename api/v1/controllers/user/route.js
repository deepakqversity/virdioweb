const express = require('express');
const auth = require('../../auth/Auth');
const UserCtrl = require('./UserCtrl');
const UserValidation = require('./UserValidation');
const route = express.Router();

route
  .get('/', UserCtrl.index)
  .post('/client-token', UserCtrl.createClientToken)
  .post('/login', UserValidation.login, UserCtrl.login)
  .post('/register', UserValidation.register, UserCtrl.register)
  .get('/user-detail', auth.verifyToken, UserCtrl.userDetail)

module.exports = route;
