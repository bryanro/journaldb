var logger = require('winston');
var Dropbox = require('dropbox');
var fs = require('fs');

var DropboxController = {};

DropboxController.backupDatabase = function (res) {
    // read file
    fs.readFile("app/server/data/journal.db", function (error, journalFileData) {
        if (error) {
            logger.error("Error reading journal file: " + error);
            if (res) {
                res.status(500).send({ message: "Error reading journal file: " + error});
            }
        }
        else {
            logger.debug("Read journal file");
            var env = process.env.NODE_ENV || 'development';
            var config = require('../../../config')[env];

            var dbClient = new Dropbox.Client({
                key: config.dropboxKey,
                secret: config.dropboxSecret,
                token: config.dropboxToken
            });

            dbClient.authDriver(new Dropbox.AuthDriver.NodeServer(8191));
            dbClient.authenticate(function (error, client) {
                if (error) {
                    logger.error("Error authenticating dropbox user: " + error);
                }
                else {
                    logger.debug("Successfully authenticated dropbox user");
                }
            });
            dbClient.getAccountInfo(function (error, accountInfo) {
                if (error) {
                    logger.error("Error getting account info: " + error);
                    if (res) {
                        res.status(500).send({ message: "Error getting account info: " + error});
                    }
                }
                else {
                    logger.info("Successfully retrieved account info for: " + accountInfo.name);
                }
            });
            dbClient.writeFile("backup/journal.db", journalFileData, function (error, stat) {
                if (error) {
                    logger.error("Error writing file: " + error);
                    if (res) {
                        res.status(500).send({ message: "Error writing file: " + error});
                    }
                }
                else {
                    console.log("File saved as revision " + stat.versionTag);
                    if (res) {
                        res.status(200).send({ stat: stat});
                    }
                }
            });
        }
    });
}

module.exports = DropboxController;