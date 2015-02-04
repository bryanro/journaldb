var express = require('express')
    , http = require('http')
// Load environment based configuration
    , env = process.env.NODE_ENV || 'development'
    , config = require('./config')[env]
    , logger = require('winston')
    , scheduler = require('./app/server/controllers/scheduler');

var app = express();

app.config = config;

app.set('port', process.env.PORT || 3005);

var server = app.listen(app.get('port'), function() {
    logger.info('Express server listening on port ' + server.address().port);
});

scheduler.setupScheduler();

require('./app/express-settings')(app);
require('./app/server/express-routes')(app);

module.exports = app;
