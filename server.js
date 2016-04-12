process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    db = mongoose(),
    app = express();

app.listen(3000);

module.exports = app;