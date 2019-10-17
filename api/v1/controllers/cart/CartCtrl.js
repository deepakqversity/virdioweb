const auth = require('../../auth/Auth');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const cartModel = require('../../models/SessionCart');
const cartDetailsModel = require('../../models/CartDetails');

const productOrderModel = require('../../models/ProductOrder');
const productOrderDetailsModel = require('../../models/ProductOrderDetails');

const response = require(process.cwd() + '/util/Response');

class CartCtrl {

	/**
	 * Log for running session activity
	 * @param  {obj} req
	 * @param  {obj} res
	 * @return {obj}
	 */
	async addToCart(req, res) {
		try{

			let searchData = {
				userId : req.currentUser.id,
				sessionId : req.body.sessionId
			};

			let cartId = await cartModel.getCartDetails(searchData);

			var cartDetailsId = '';

			if(true === isEmpty(cartId)){
				
				let cartInsertData = {
					userId : req.currentUser.id,
					sessionId : req.body.sessionId
				};

				let cartInsertedId = await cartModel.add(cartInsertData);

				if(cartInsertedId > 0) {
					let insertData = {
						sessionCartId : cartInsertedId,
						channelId : req.body.channelId,
						sessionScriptId : req.body.productId,
						quantity : req.body.quantity,
						unitPrice : req.body.price,
						totalPrice : req.body.price * req.body.quantity
					};

					cartDetailsId = await cartDetailsModel.add(insertData);

					let cartTotalPrice = (req.body.price * req.body.quantity);

					cartModel.updateCartPrice(cartInsertedId, cartTotalPrice);
				}
				
			} else {

				let searchData  = {
					userId : req.currentUser.id,
					sessionId : cartId[0].sessionId,
					channelId : req.body.channelId,
					sessionScriptId : req.body.productId,
				}

				let cartDataDetails = await cartDetailsModel.getCartProductDetails(searchData);
				
				if(false === isEmpty(cartDataDetails)) {
					let updateData = {
						cartDetailId : cartId[0].id,
						quantity : cartDataDetails.quantity + req.body.quantity,
						totalPrice : cartDataDetails.cart_details_totalPrice + (cartDataDetails.cart_details_unitPrice * req.body.quantity)
					}

					cartDetailsId = await cartDetailsModel.updateCartProductPrice(updateData);
				} else {
					let insertData = {
						sessionCartId : cartId[0].id,
						channelId : req.body.channelId,
						sessionScriptId : req.body.productId,
						quantity : req.body.quantity,
						unitPrice : req.body.price,
						totalPrice : req.body.price * req.body.quantity
					};

					cartDetailsId = await cartDetailsModel.add(insertData);
				}


				let cartTotalPrice = cartId[0].totalPrice + (req.body.price * req.body.quantity);
				cartModel.updateCartPrice(cartId[0].id, cartTotalPrice);
			}

			if (false === isEmpty(cartDetailsId)) {
				response.resp(res, 200, {id : cartDetailsId})
			} else {
				response.resp(res, 500, {message:"Something went wrong."})
			}
		} catch(exception) {
			response.resp(res, 500, exception)
		}
	}

	async orderProducts(req, res) {
		try{

			let searchData = {
				userId : req.currentUser.id,
				sessionId : req.body.sessionId
			};

			let cartId = await cartModel.getCartDetails(searchData);

			var cartDetailsId = '';

			if(false === isEmpty(cartId)){
				
				let cartDetails = cartId[0];

				let orderInsertData = {
					sessionCartId : cartDetails.id,
					userId : req.currentUser.id,
					sessionId : req.body.sessionId,
					totalPrice : cartDetails.totalPrice
				};

				let orderInsertedId = await productOrderModel.add(orderInsertData);

				if(orderInsertedId > 0) {

					let cartData = await cartDetailsModel.getCartDetails(cartDetails.id);

					var finalOrderData = [];

					for(let i in cartData) {

						var rowData = [];

						rowData.push(orderInsertedId);
						rowData.push(cartData[i].channelId);
						rowData.push(cartData[i].sessionScriptId);
						rowData.push(cartData[i].quantity);
						rowData.push(cartData[i].unitPrice);
						rowData.push(cartData[i].totalPrice);

						finalOrderData.push(rowData);
					}

					productOrderDetailsModel.add(finalOrderData);
					
					response.resp(res, 200, {})
				}
			} else {
				response.resp(res, 500, {message:"Something went wrong."});
			}

		} catch(exception) {
			response.resp(res, 500, exception);
		}
	}

	async removeCartItem(req, res) {

		try {

			let searchData  = {
				userId : req.currentUser.id,
				sessionId : req.params.sessionId,
				channelId : req.params.channelId,
				sessionScriptId : req.params.productId
			}

			let cartDataDetails = await cartDetailsModel.getCartProductDetails(searchData);
			
			if(false === isEmpty(cartDataDetails)) {
				cartDataDetails = cartDataDetails[0];

				let cartTotalPrice = cartDataDetails.cart_totalPrice - cartDataDetails.cart_details_unitPrice;
				
				let cartUpdateDetails = await cartModel.updateCartPrice(cartDataDetails.cart_id, cartTotalPrice);
				if (false === isEmpty(cartUpdateDetails)) {

					let updateData = {
						cartDetailId : cartDataDetails.cart_detail_id,
						quantity : cartDataDetails.quantity - 1,
						totalPrice : cartDataDetails.cart_details_totalPrice - cartDataDetails.cart_details_unitPrice
					}

					cartDetailsModel.updateCartProductPrice(updateData);
				}
			}

			response.resp(res, 200, {})
		} catch(exception) {
			console.log(exception);
			response.resp(res, 500, exception);
		}
	}
}

module.exports = new CartCtrl();