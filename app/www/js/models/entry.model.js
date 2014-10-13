define([
    'backbone'
], function (Backbone) {
    var EntryModel = Backbone.Model.extend({
        urlRoot: '/entries',
        defaults: {
        },
        initialize: function () {
            /*

            fileName
            folderPath
            fullPath
            isJournalFile
            thumbnailUrl
            entryText
            yearNumber
            entryDate

             */
        }
    });

    return EntryModel;
});