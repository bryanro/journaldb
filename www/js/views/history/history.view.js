define([
    'jquery',
    'underscore',
    'backbone',
    'autosize',
    'datepicker',
    'moment',
    'models/date.model',
    'models/entry.model',
    'collections/entries.collection',
    'text!./templates/history.html'
], function ($, _, Backbone, Autosize, DatePicker, moment, DateModel, EntryModel, EntriesCollection, HistoryTemplate) {

    var HistoryView = Backbone.View.extend({

        initialize: function (options) {
            console.log(options);
            this.options = options || {};
            this.dateModel = this.options.dateModel;
        },

        render: function () {
            var that = this;
            this.historyTemplate= _.template(HistoryTemplate);

            this.entryCollection = new EntriesCollection();
            this.dateModel.on("change:entryDate", this.getHistoryDayForDay, this);

            $('textarea').autosize();
        },

        events: {

        },

        getHistoryDayForDay: function () {
            var entryDate = $('#datepicker').datepicker('getDate');

            this.entryCollection.setEntryDate(entryDate);

            var that = this;
            this.entryCollection.fetch({
                data: {
                    entryDate: JSON.stringify(that.entryCollection.getEntryDate())
                },
                success: function(collection, response, options) {
                    that.renderHistoryData();
                },
                error: function(collection, response, options) {
                    //TODO: output error to user
                    console.log('Collection fetch error getting history for day: ' + response.responseText);
                }
            });
        },

        renderHistoryData: function() {
            console.log(this.entryCollection);
            console.log(this.entryCollection.models);
            this.$el.html(this.historyTemplate({
                entryDate: this.dateModel.get('entryDate'),
                historyCollection: this.entryCollection
            }));
        }

    });

    return HistoryView;
});