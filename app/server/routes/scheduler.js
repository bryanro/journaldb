var express = require('express');
var router = express.Router();
var scheduler = require('../controllers/scheduler');

router.post('/', scheduler.backupDatabaseToDropboxManual);

module.exports = router;