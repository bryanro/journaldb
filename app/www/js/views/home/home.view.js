define([
    'jquery',
    'underscore',
    'backbone',
    'autosize',
    'datepicker',
    'moment',
    'views/history/history.view',
    'models/date.model',
    'models/entry.model',
    'text!./templates/home.html'
], function ($, _, Backbone, Autosize, DatePicker, moment, HistoryView, DateModel, EntryModel, HomeTemplate) {

    var HomeView = Backbone.View.extend({

        el: $('#main-container'),

        initialize: function (options) {
        },

        render: function () {
            var that = this;
            this.homeTemplate= _.template(HomeTemplate);

            this.dateModel = new DateModel();

            this.dateToday = this.dateModel.get('entryDate');

            this.$el.html(this.homeTemplate({
                dateToday: this.dateToday
            }));


            $('#datepicker').datepicker({
                format: 'mm/dd/yyyy',
                todayHighlight: true,
                autoclose: true
            });
            $('#datepicker').datepicker('update', this.dateToday);
            $('#datepicker').datepicker().on('changeDate', $.proxy(this.updateDateModel, this));

            this.historyView = new HistoryView({el: '#journal-history', dateModel: this.dateModel});
            this.historyView.render();

            $('textarea').autosize();
        },

        events: {
            "click #entry-submit": "postEntry"
        },

        postEntry: function (e) {
            var entryText = $('#entry-text').val();

            var newEntry = new EntryModel({
            });
            newEntry.save({entryText: entryText}, {
                success: function (model, response, options) {
                    // TODO: confirm to user that entry is saved
                    console.log('New entry saved');
                },
                error: function (model, response, options) {
                    // TODO: show error to user
                    console.log('Error saving new entry: ' + response.responseText);
                }
            })
        },

        getTodaysDate: function() {
            var dateNow = new Date();
            return new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
        },

        updateDateModel: function() {
            this.dateModel.set('entryDate', $('#datepicker').datepicker('getDate'));
        }

    });

    return HomeView;
});