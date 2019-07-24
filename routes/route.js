
module.exports = function(app) {
  app.use('/api/v1/user/', require(process.cwd() + '/api/v1/controllers/user/route.js'));
  // app.use('/api/v1/auth/', require('../api/v1/controllers/auth/route.js'));
};
