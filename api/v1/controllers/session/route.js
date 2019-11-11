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
  //.get('/hosts-list/:channelId', auth.verifyToken, SessionCtrl.getHosts)
  //.get('/hosts-list1/:channelId', SessionCtrl.getHosts)
  .get('/:channelId/hosts-list1', SessionCtrl.getHosts)
  //.get('/equipments/:interestId', SessionCtrl.getEquipments)
  .get('/:interestId/equipments', SessionCtrl.getEquipments)
  //.get('/shoppinglist/:interestId', SessionCtrl.getShoppingList)
  .get('/:interestId/shoppinglist', SessionCtrl.getShoppingList)
  //.get('/activityType/:interestId', SessionCtrl.getActivityType)
  .get('/:interestId/activityType', SessionCtrl.getActivityType)
  .post('/createwineSession',  SessionCtrl.createWineSession)
  .get('/:interestId/emojiesList', SessionCtrl.getEmojiesList)
  .get('/:channelId/product-list', SessionCtrl.getProductList)
  .get('/:interestId/attributeList', SessionCtrl.getAttributeList)
  .post('/addProduct', SessionCtrl.addNewProduct)
  .get('/:channelId/interest', SessionCtrl.getInterestBychannelId)
  .post('/createchannel', SessionCtrl.createNewChannel)

module.exports = route;
