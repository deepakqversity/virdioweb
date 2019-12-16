const express = require('express');
const auth = require('../../auth/Auth');
const UserCtrl = require('./UserCtrl');
const UserValidation = require('./UserValidation');
const route = express.Router();

route
  .post('/login', UserValidation.login, UserCtrl.login)
  .post('/createGroup',  UserCtrl.create_group)
  .post('/addInterest',  UserCtrl.add_interest)
  .post('/getAllGroupsWithInterest',  UserCtrl.get_group)
  .post('/adminLogin', UserValidation.login, UserCtrl.admin_login)
  .post('/adminPastSessionData', UserCtrl.admin_past_sessiondData)
  .post('/adminDashboardData', UserCtrl.admin_dashboardData)
  .post('/register', UserValidation.register, UserCtrl.register)
  .post('/verify-otp', UserValidation.verifyOtp, UserCtrl.verifyOtp)
  .post('/client-token', UserCtrl.createClientToken)
  .post('/forgotpassword', UserCtrl.forgotPassword)
  .post('/verify-link', UserCtrl.verifyLink)
  .put('/update-password', UserCtrl.updatePassword)
  .get('/user-detail', auth.verifyToken, UserCtrl.userDetail)

module.exports = route;
