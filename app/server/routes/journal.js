var express = require('express');
var router = express.Router();
var journal = require('../controllers/journal');

router.post('/', journal.createNewEntry);
router.put('/', journal.updateEntryByDay);
router.get('/', journal.findAllEntries);
router.get('/month/:month/dayOfMonth/:dayOfMonth', journal.findEntriesForDay);
router.get('/year/:year/month/:month/dayOfMonth/:dayOfMonth', journal.findEntriesForDate);
//router.get('/:id', journal.findEntryById);
router.put('/:id', journal.updateEntryById);

module.exports = router;