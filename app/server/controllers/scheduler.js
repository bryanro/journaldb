var logger = require('winston');
var dropbox = require('../controllers/dropbox');

var Scheduler = {};

Scheduler.setupScheduler = function () {
    var cronJob = require('cron').CronJob;
    var backupCronDateTime = '0 0 2 * * *'; // occur every day at 2am

    var backupDataToDropboxJob = new cronJob(backupCronDateTime, Scheduler.backupDatabaseToDropbox, null, true);
    logger.info("Scheduler setup with cronDateTime = " + backupCronDateTime);
}

Scheduler.backupDatabaseToDropbox = function () {
    logger.info('Scheduled Job: backupDatabaseToDropbox', 'backupDatabaseToDropbox');
    dropbox.backupDatabase();
}

Scheduler.backupDatabaseToDropboxManual = function (req, res, next) {
    logger.info('Manual Job: backupDatabaseToDropbox');
    dropbox.backupDatabase(res);
}

module.exports = Scheduler;