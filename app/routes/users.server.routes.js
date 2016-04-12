var users = require('../../app/controllers/user.server.controllers');

module.exports = function(app) {
  app.route('/users').post(users.create);
}