const express = require('express');
const auth = require('../../auth/Auth');
const SessionCtrl = require('./SessionCtrl');
const route = express.Router();

route
  .get('/', auth.verifyToken, SessionCtrl.getSessions)
  .get('/:sessionId', auth.verifyToken, SessionCtrl.getSessionDetail)
  .get('/:sessionId/users', auth.verifyToken, SessionCtrl.getSessionUsers)
  // .put('/:sessionId/:userId', auth.verifyToken, SessionCtrl.updateSessionUser)
  .put('/:sessionId/joinstatus', auth.verifyToken, SessionCtrl.updateSessionStatus)
  .put('/:sessionId/updatestatus', auth.verifyToken, SessionCtrl.updateSessionjoinStatus)
  .put('/:sessionId/stream-id', auth.verifyToken, SessionCtrl.updateUserStream)
  .get('/:sessionId/:userId/stream-id', auth.verifyToken, SessionCtrl.getStreamUser)
  .post('/activity-log', auth.verifyToken, SessionCtrl.activityLogs)

  .get('/:channelId/channel', SessionCtrl.getSessionsByChannel)
  .get('/:sessionId/sess', SessionCtrl.getSessionDetail1)
  .get('/:userId/product', SessionCtrl.getAllProductByHost)
  .get('/:sessionId', auth.verifyToken, SessionCtrl.getSessions1)
  //.post('/create', auth.verifyToken, SessionCtrl.createSession)
  .post('/create',  SessionCtrl.createSession)
  .get('/check/:sessionName', auth.verifyToken, SessionCtrl.checkDuplicateSession)
  .get('/hosts-list/:channelId', auth.verifyToken, SessionCtrl.getHosts)

module.exports = route;
