const express = require('express');
const auth = require('../../auth/Auth');
const SessionCtrl = require('./SessionCtrl');
const route = express.Router();

route
  .get('/', auth.verifyToken, SessionCtrl.getSessions)
  .get('/:sessionId', auth.verifyToken, SessionCtrl.getSessionDetail)
  .get('/:sessionId/users', auth.verifyToken, SessionCtrl.getSessionUsers)
  // .put('/:sessionId/:userId', auth.verifyToken, SessionCtrl.updateSessionUser)
  .put('/:sessionId/stream-id', auth.verifyToken, SessionCtrl.updateUserStream)
  .get('/:sessionId/:userId/stream-id', auth.verifyToken, SessionCtrl.getStreamUser)
  .post('/activity-log', auth.verifyToken, SessionCtrl.activityLogs)

module.exports = route;
