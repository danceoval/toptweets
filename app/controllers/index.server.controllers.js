exports.render = function(req, res) {
  
  //session mgmt
  if(req.session.lastVisit) {
    console.log("last visit", req.session.lastVisit);
  }

  req.session.lastVisit = new Date();

  res.render('index', {
    title : "Top Tweets NYC",
    userFullName : req.user ? req.user.fullName : ''
  });
};