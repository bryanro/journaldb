var app = module.parent.exports.app;
var logger = require('../modules/logger');
var Dropbox = require('dropbox');
var _ = require('underscore');
var async = require('async');

var context = 'journal.js';

var JournalController = {};

JournalController.createNewEntry = function(req, res, next) {
    var context = 'createNewEntry';
    logger.debug('Entering method', context);

    // default entryDate to today
    var entryDate = JournalController.getTodaysDate();

    if (req.param('entryDate')) {
        entryDate = req.param('entryDate');
        logger.debug('entryDate set by parameter', context);
    }

    logger.debug('entryDate: ' + entryDate.toDateString(), context);

    // path to save file
    var filepath = JournalController.getPathFromDate(entryDate, false);
    var filename = JournalController.getFileName(entryDate);
    logger.debug('path to save file: ' + filepath);
    logger.debug('filename: ' + filename);
    logger.debug('filepath + filename: ' + filepath + filename);

    var entryText = req.param('entryText');
    logger.debug('entryText: ' + entryText);

    app.client.writeFile(filepath + filename, entryText, function(error, stat) {
        if (error) {
            logger.error(error);
            res.status(403).send('Bad Request');
        }
        else {
            logger.debug("File '" + stat.name + "' saved to [" + stat.path + "] with revision " + stat.versionTag);
            logger.debug('Success, sending 200 response', context);
            res.status(200).send({
                entryText: entryText,
                fileName: stat.name,
                folderPath: stat.path.replace(stat.name, ''),
                fullPath: stat.path,
                isJournalFile: true,
                yearNumber: entryDate.getFullYear(),
                entryDate: entryDate
            });
        }
    });
}

JournalController.getEntriesForDay = function(req, res, next) {
    var context = 'getEntryForDay';

    var lookupDate = JournalController.getTodaysDate();
    if (req.param('entryDate')) {
        lookupDate = new Date(JSON.parse(req.param('entryDate')));
    }
    logger.debug('lookupDate: ' + lookupDate, context);

    var datePath = JournalController.getPathFromDate(lookupDate, false);

    app.client.readdir(datePath, function(error, yearfolders) {
        var dataForDay = [];

        if (error) {
            logger.info('Error reading directory "' + datePath + '": likely no data exists for that date yet', context);
            res.status(204).send('No Content');
        }
        else {
            logger.debug('Entries: ' + JSON.stringify(yearfolders, null, 2));
                async.each(yearfolders, function(fileName, doneProcessingFile) {
                    var fullFilePath = datePath + fileName;
                    if (JournalController.isJournalFile(fileName)) {
                        app.client.readFile(fullFilePath, function (error, fileContents) {
                            if (error) {
                                logger.error('Error reading contents of "' + fullFilePath + '": ' + error, context);
                            }
                            else {
                                logger.debug('Successfully read file contents: ' + fileContents, context);
                                dataForDay.push({
                                    fileName: fileName,
                                    folderPath: datePath,
                                    fullPath: fullFilePath,
                                    isJournalFile: true,
                                    entryText: fileContents,
                                    yearNumber: JournalController.getYearFromFilename(fileName),
                                    entryDate: new Date(JournalController.getYearFromFilename(fileName), lookupDate.getMonth(), lookupDate.getDate())
                                });
                            }
                            doneProcessingFile();
                        });
                    }
                    else if (JournalController.isFileImage(fileName)) {
                        app.client.thumbnailUrl(fullFilePath, function (error, url) {
                            if (error) {
                                logger.error('Unable to create thumbnail URL for "' + fullFilePath + '": ' + error, context);
                            }
                            else {
                                logger.debug('Successfully created thumbnail URL for "' + fullFilePath + '": ' + url, context);
                                dataForDay.push({
                                    fileName: fileName,
                                    //folderPath: yearFolderPath,
                                    folderPath: datePath,
                                    fullPath: fullFilePath,
                                    isJournalFile: false,
                                    thumbnailUrl: url,
                                    yearNumber: JournalController.getYearFromFilename(fileName),
                                    entryDate: new Date(JournalController.getYearFromFilename(fileName), lookupDate.getMonth(), lookupDate.getDate())
                                });
                            }
                            doneProcessingFile();
                        })
                    }
                    else {
                        logger.warn('Ignoring file "' + fileName + '": not a journal.txt or an image', context);
                        doneProcessingFile();
                    }
                },
                // for completion of processing files in folder
                function (fileIterationError) {
                    if (fileIterationError) {
                        logger.error('Error looping through year folders: ' + error, context);
                        res.status(400).send(error);
                    }
                    else {
                        logger.debug('Done looping through files in date folder', context);
                        if (dataForDay.length < 1) {
                            logger.info('Folder exists for day, but no content within folder', context);
                            res.status(204).send('No Content');
                        }
                        else {
                            logger.debug(dataForDay.length + ' items found for day', context);
                            res.status(200).send(dataForDay);
                        }
                    }
                });
        }
    });
}

JournalController.getTodaysDate = function() {
    var dateNow = new Date();
    return new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 0, 0 ,0, 0);
}

JournalController.getPathFromDate = function(date, includeYear) {
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    if (includeYear) {
        return month + "/" + day + "/" + year + "/";
    }
    else {
        return month + "/" + day + "/";
    }
}

JournalController.getFileName = function(date) {
    return date.getFullYear() + '.jnl';
}

JournalController.getYearFromFilename = function(fileName) {
    return fileName.replace('.jnl', '');
}

JournalController.isJournalFile = function(fileName) {
    return fileName.match(/\.(jnl)$/);
}

JournalController.isFileImage = function(fileName) {
    return fileName.match(/\.(jpg|jpeg|png|gif)$/);
}

module.exports = JournalController;

logger.debug('journal.js controller loaded', context);
