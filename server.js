#!/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var session = require('cookie-session');
var logger = require('./app/server/modules/logger');

console.log('***************');
console.log('***************');

/**
 * Define the application.
 */
var JournalDBApp = function() {

    // Scope.
    var self = this;

    /* ================================================================ */
    /* Helper functions. */
    /* ================================================================ */

    /**
     * Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        /// Set the environment variables we need.
        self.ipaddress = '127.0.0.1';
        self.port      = 3002; // default to port 3001 when run locally
    };

    /**
     * terminator === the termination handler Terminate server on receipt of the
     * specified signal.
     *
     * @param {string}
     *            sig Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            logger.warn('Received ' + sig + ' - terminating application', 'server.js');
            process.exit(1);
        }
        logger.warn('Node server stopped', 'server.js');
    };


    /**
     * Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        // Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
                process.on(element, function() { self.terminator(element); });
            });
    };


    /* ================================================================ */
    /* App server functions (main app logic here). */
    /* ================================================================ */

    /**
     * Initialize the server (express) and create the routes and register the
     * handlers.
     */
    self.initializeServer = function() {
        var env = 'development'; // default to development
        logger.info('Environment: ' + env, 'server.js');

        self.app = express();
        // set the config based on the environment
        self.app.config = require('./app/config')[env];

        // set logging verbosity level
        logger.setVerbosity(self.app.config.verbosityLevel);

        // export the app so it can be used in other files
        module.exports.app = self.app;

        /*self.app.configure(function () {
            self.app.use(express.cookieParser()),
            self.app.use(express.bodyParser({ uploadDir: __dirname + '/app/upload' })), // set the default upload directory
            self.app.use(express.session({
                secret: '!!!my secret goes here!!!',
                cookie: {
                    maxAge: self.app.config.sessionExpiration
                }
            }));
            self.app.use(self.app.router),
            self.app.use(express.static(__dirname + '/www')),
            self.app.use(errorHandler());
        });*/

        self.app.use(express.static(__dirname + '/www'));
        self.app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
        self.app.use(bodyParser.json());    // parse application/json
        self.app.use(session({
            secret: "!!!journaldb!!!'"
        }));
        self.app.use(errorhandler());

        // initialize the routes
        require('./app/server/routes')(self.app);
    };


    /**
     * Initializes the application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     * Start the server (starts up the application).
     */
    self.start = function() {
        // Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            logger.info('Node server started: ' + self.ipaddress + ':' + self.port, 'server.js');
        });
    };
};



/**
 * main(): Main code.
 */
var journalDBApp = new JournalDBApp();
journalDBApp.initialize();
journalDBApp.start();