
module.exports = function(app) {
  app.use('/api/v1/user/', require(process.cwd() + '/api/v1/controllers/user/route.js'));
  app.use('/api/v1/session/', require(process.cwd() + '/api/v1/controllers/session/route.js'));
  app.use('/api/v1/cart/', require(process.cwd() + '/api/v1/controllers/cart/route.js'));
};
