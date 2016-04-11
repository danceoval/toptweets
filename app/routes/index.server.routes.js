module.exports = function(app) {
  var index = require("../controllers/index.server.controllers.js");
  app.get('/', index.render);
}