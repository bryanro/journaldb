define([
    'backbone'
], function (Backbone) {
    var DateModel = Backbone.Model.extend({
        initialize: function () {
            // default entryDate to today
            var dateNow = new Date();
            this.set('entryDate', new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()));
            this.set('dateToday', this.get('entryDate'));
        }
    });

    return DateModel;
});