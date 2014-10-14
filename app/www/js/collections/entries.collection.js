define([
    'backbone',
    'models/entry.model'
], function (Backbone, EntryModel) {
    var EntriesCollection = Backbone.Collection.extend({
        model: EntryModel,
        url: '/entries',
        defaults: {
        },
        initialize: function() {
            // default entryDate to today
            var dateNow = new Date();
            this.entryDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
        },
        comparator: function(item) {
            // sort in reverse chronological order
            return item.get('yearNumber') * -1;
        },
        setEntryDate: function(date) {
            this.entryDate = date;
        },
        getEntryDate: function() {
            return this.entryDate;
        }
    });
    return EntriesCollection;
});