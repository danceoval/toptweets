exports.render = function(req, res) {
  res.render('index', {
    title : "Top Tweets NYC",
    user : JSON.stringify(req.user)
  });
};