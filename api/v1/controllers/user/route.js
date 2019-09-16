const express = require('express');
const auth = require('../../auth/Auth');
const UserCtrl = require('./UserCtrl');
const UserValidation = require('./UserValidation');
const route = express.Router();

route
  .post('/login', UserValidation.login, UserCtrl.login)
  .post('/register', UserValidation.register, UserCtrl.register)
  .post('/verify-otp', UserValidation.verifyOtp, UserCtrl.verifyOtp)
  .post('/client-token', UserCtrl.createClientToken)
  .post('/forgot-password', UserCtrl.forgotPassword)
  .post('/verify-link', UserCtrl.verifyLink)
  .put('/update-password', UserCtrl.updatePassword)
  .get('/user-detail', auth.verifyToken, UserCtrl.userDetail)

module.exports = route;
