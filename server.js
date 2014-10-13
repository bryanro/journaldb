#!/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var session = require('cookie-session');
var logger = require('./app/server/modules/logger');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

console.log('***************');
console.log('***************');

/**
 * Define the application.
 */
var JournalDBApp = function() {

    // Scope.
    var self = this;

    var context = 'server.js';

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
        logger.warn('Node server stopped', context);
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
        logger.info('Environment: ' + env, context);

        self.app = express();
        // set the config based on the environment
        self.app.config = require('./app/config')[env];

        // set logging verbosity level
        logger.setVerbosity(self.app.config.verbosityLevel);



        passport.use(new LocalStrategy(
            function(username, password, done) {
                console.log('passport use');
                return done(null, {username:"test", password:"test1"});
            }
        ));



        // export the app so it can be used in other files
        module.exports.app = self.app;

        self.app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
        self.app.use(bodyParser.json());    // parse application/json
        self.app.use(session({
            secret: "!!!journaldb!!!'"
        }));
        self.app.use(express.static(__dirname + '/app/www'));
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

    self.initializeDropbox = function() {

        var Dropbox = require('dropbox');
        self.app.client = new Dropbox.Client({
            key: self.app.config.dropboxKey,
            secret: self.app.config.dropboxSecret,
            token: self.app.config.dropboxToken
        });
        self.app.client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));
        self.app.client.authenticate(function(error, client) {
            if (error) {
                // Replace with a call to your own error-handling code.
                //
                // Don't forget to return from the callback, so you don't execute the code
                // that assumes everything went well.
                logger.error('Error authenticating: ' + error), context;
            }

            // Replace with a call to your own application code.
            //
            // The user authorized your app, and everything went well.
            // client is a Dropbox.Client instance that you can use to make API calls.
            logger.debug('Successfully authenticated!', context);
        });
        self.app.client.getAccountInfo(function(error, accountInfo) {
            if (error) {
                logger.error('Error getting account info: ' + error, context);  // Something went wrong.
            }

            logger.info('Hello, ' + accountInfo.name, context);
        });
    };


    /**
     * Start the server (starts up the application).
     */
    self.start = function() {
        // Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            logger.info('Node server started: ' + self.ipaddress + ':' + self.port, context);
        });
    };
};



/**
 * main(): Main code.
 */
var journalDBApp = new JournalDBApp();
journalDBApp.initialize();
journalDBApp.start();
journalDBApp.initializeDropbox();