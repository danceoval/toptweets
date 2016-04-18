var users = require('../../app/controllers/user.server.controllers'),
    passport = require('passport');

module.exports = function(app) {

  app.route('/signup')
      .get(users.renderSignup)
      .post(users.signup);

  app.route('/signin')
      .get(users.renderSignin)
      .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
      }));

  app.get('/signout', users.signout);        

  app.get('/', function(req,res) {
    res.render('index.ejs');
  });

  app.get('/oauth/twitter', passport.authenticate('twitter', {
    failureRedirect : '/signin'
  }));

  app.get('/oauth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/',
      failureRedirect : '/signin',
      failureFlash: true
    }))
  
  // app.route('/signin') 
  //    .get(users.renderSignin) 
  //    .post(passport.authenticate('twitter', { 
  //     successRedirect: '/', 
  //     failureRedirect: '/signin'
  //   }));


  app.route('/users')
    .post(users.create)
    .get(users.list);

  app.route('/users/:userID')  
    .get(users.read)
    .put(users.update)
    .delete(users.delete);


  app.param('userId', users.userByID);  
}