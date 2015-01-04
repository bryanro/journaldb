var Datastore = require('nedb');
var _ = require('underscore');
var logger = require('winston');
var Util = require('../modules/util');

var JournalModel = {};

var context = 'JournalModel';

/**
 * Create new entry record
 * @param entryDay
 * @param entryText
 * @param callback
 */
JournalModel.createEntry = function (entryDay, entryText, callback) {

    // check to see if any records already exist for that day
    JournalModel.db.count({ "entryDate.year": entryDay.year, "entryDate.month": entryDay.month, "entryDate.dayOfMonth": entryDay.dayOfMonth }, function (err, count) {
        if (err) {
            callback(err);
        }
        else if (count && count > 0) {
            callback('a record for that entryDay already exists - must update instead of inserting');
        }
        else {
            // no records already exist for that day, so insert
            var journalEntry = {
                entryText: entryText,
                entryDate: {
                    year: entryDay.year,
                    month: entryDay.month,
                    dayOfMonth: entryDay.dayOfMonth,
                    dateTimestamp: (new Date(entryDay.year, entryDay.month, entryDay.dayOfMonth)).getTime()
                },
                createdDate: new Date(),
                lastUpdateDate: new Date()
            };

            JournalModel.db.insert(journalEntry, function (err, insertedEntry) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, insertedEntry);
                }
            });
        }
    });
}

/**
 * Update entry record
 * @param entryDay { year: ####, month: ##, dayOfMonth: ## }
 * @param entryText new text to update
 * @param callback (err, numReplaced)
 */
JournalModel.updateEntry = function (entryDay, entryText, callback) {
    var searchCriteria = { "entryDate.year": entryDay.year, "entryDate.month": entryDay.month, "entryDate.dayOfMonth": entryDay.dayOfMonth };
    JournalModel.db.update(searchCriteria
        , { $set: { entryText: entryText, lastUpdateDate: new Date() } }
        , { }
        , function (err, numReplaced) {
            if (err) {
                callback(err);
            }
            else if (numReplaced && numReplaced < 1) {
                callback('0 records match, none updated');
            }
            else {
                JournalModel.findOneEntry(searchCriteria, callback);
            }
    })
}

/**
 * Find all entries that match the search criteria and sort by date in reverse order
 * @param searchCriteria
 * @param callback
 */
JournalModel.findEntries = function (searchCriteria, callback) {
    JournalModel.db.find(searchCriteria).sort({ 'entryDate.dateTimestamp': -1 }).exec(callback);
}

/**
 * Find entry that match the search criteria and sort by date in reverse order
 * @param searchCriteria
 * @param callback
 */
JournalModel.findOneEntry = function (searchCriteria, callback) {
    JournalModel.db.findOne(searchCriteria).sort({ 'entryDate.dateTimestamp': -1 }).exec(callback);
}

JournalModel.deleteEntry = function () {

}

JournalModel.initialize = function () {
    JournalModel.db = new Datastore({ filename: 'app/server/data/journal.db', autoload: true });
}

JournalModel.initialize();

module.exports = JournalModel;

logger.debug('journal-model.js loaded', context);