var logger = require('./modules/logger');
var express = require('express');
var router = express.Router();

module.exports = function (app) {

    // Export the app so it can be used by the controllers
    module.exports.app = app;

    // Test
    app.route('/test')
        .get(function (req, res, next) {
            res.send('API is running');
        });

    logger.info('Finished setting up routes', 'routes.js');
}