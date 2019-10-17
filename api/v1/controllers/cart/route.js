const express = require('express');
const auth = require('../../auth/Auth');
const CartController = require('./CartCtrl');
const route = express.Router();

route
  .post('/add-to-cart', auth.verifyToken, CartController.addToCart)
  .post('/order', auth.verifyToken, CartController.orderProducts)
  .delete('/:channelId/:sessionId/:productId', auth.verifyToken, CartController.removeCartItem)

module.exports = route;
