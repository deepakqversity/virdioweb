const express = require('express');
const auth = require(process.cwd() + '/library/Auth');
const ConferenceCtrl = require('./ConferenceCtrl');
const route = express.Router();

route
  .get('/channel', auth.verifyToken, ConferenceCtrl.getChannel)
  .get('/:confId/channel', auth.verifyToken, ConferenceCtrl.getChannel)
  .get('/:confId/users', auth.verifyToken, ConferenceCtrl.getConferenceUsers)
  .put('/:confId/:userId', auth.verifyToken, ConferenceCtrl.updateCurrentUserSession)
  .put('/:confId/:userId/stream-id', auth.verifyToken, ConferenceCtrl.updateUserStream)

module.exports = route;