var users = require('../../app/controllers/user.server.controllers');

module.exports = function(app) {
  app.route('/users')
    .post(users.create)
    .get(users.list);

  app.route('/users/:userID')  
    .get(users.read)
    .put(users.update)
    .delete(users.delete);


  app.param('userId', users.userByID);  
}