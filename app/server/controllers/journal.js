var _ = require('underscore');
var logger = require('winston').Logger;
var Journal = require('../models/journal-model');

var JournalController = {};

/**
 *
 * @param req
 *      entryText: the text for that day's entry
 *      entryDay: JSON object with: { year: ####, month: ##, dayOfMonth: ## }
 * @param res
 * @param next
 */
JournalController.createNewEntry = function (req, res, next) {

    var entryText = req.param('entryText');
    var entryDay = req.param('entryDay');
    if (typeof entryDay == 'string') {
        entryDay = JSON.parse(req.param('entryDay'));
    }

    if (!entryText && !entryDay.year && !entryDay.month && !entryDay.dayOfMonth) {
        res.status(400).send({ message: 'One of the following fields is not present: entryText, entryDay.year, entryDay.month, entryDay.dayOfMonth' });
        return;
    }

    Journal.createEntry(entryDay, entryText, function (err, journalRecord) {
        if (err) {
            res.status(500).send({ message: err });
        }
        else {
            res.status(201).send(journalRecord);
        }
    });
}

JournalController.updateEntryByDay = function (req, res, next) {

    var entryText = req.param('entryText');
    var entryDay = req.param('entryDay');
    if (typeof entryDay == 'string') {
        entryDay = JSON.parse(req.param('entryDay'));
    }

    if (!entryText && !entryDay.year && !entryDay.month && !entryDay.dayOfMonth) {
        res.status(400).send({ message: 'One of the following fields is not present: entryText, entryDay.year, entryDay.month, entryDay.dayOfMonth' });
        return;
    }

    Journal.updateEntry(entryDay, entryText, function (err, journalRecord) {
        if (err) {
            res.status(500).send({ message: err });
        }
        else {
            res.status(200).send(journalRecord);
        }
    });

}

JournalController.updateEntryById = function (req, res, next) {

    var id = req.param('id');
    var entryText = req.param('entryText');

    JournalEntry.updateEntry(id, entryText, function (err, journalRecord) {
        if (err) {
            res.status(500).status({ message: err });
        }
        else {
            res.status(200).send(journalRecord);
        }
    });

}

JournalController.findAllEntries = function (req, res, next) {

    Journal.findEntries({}, function (err, results) {
        if (err) {
            res.status(500).send({ message: err });
        }
        else {
            res.status(200).send(results);
        }
    });

}

JournalController.findEntriesForDay = function (req, res, next) {

    var month = parseInt(req.param('month'));
    var dayOfMonth = parseInt(req.param('dayOfMonth'));

    Journal.findEntries({ "entryDate.month": month, "entryDate.dayOfMonth": dayOfMonth }, function (err, results) {
        if (err) {
            res.status(500).send({message: err});
        }
        else {
            res.status(200).send(results);
        }
    });

}

JournalController.findEntriesForDate = function (req, res, next) {

    var year = parseInt(req.param('year'));
    var month = parseInt(req.param('month'));
    var dayOfMonth = parseInt(req.param('dayOfMonth'));

    Journal.findOneEntry({ "entryDate.year": year, "entryDate.month": month, "entryDate.dayOfMonth": dayOfMonth }, function (err, results) {
        if (err) {
            res.status(500).send({message: err});
        }
        else {
            res.status(200).send(results);
        }
    });

}

module.exports = JournalController;