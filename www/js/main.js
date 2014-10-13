require.config({
    paths: {
        jquery: 'lib/jquery/jquery-1.10.2',
        backbone: 'lib/backbone/backbone-1.0.0',
        bootstrap: 'lib/bootstrap/bootstrap-3.0.0.min',
        less: 'lib/less/less-1.3.1.min',
        text: 'lib/require/text-2.0.7',
        underscore: 'lib/underscore/underscore-1.5.1.min',
        dropbox: 'lib/dropbox/dropbox-0.10.2.min',
        autosize: 'lib/autosize/autosize-1.17.8.min',
        datepicker: 'lib/bootstrap-datepicker/js/bootstrap-datepicker-1.3.0',
        moment: 'lib/moment/moment-1.7.2.min'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery']
        },
        datepicker: {
            deps: ['jquery'],
            exports: "$.fn.datepicker"
        }
    }
});

require([
    // Load our app module and pass it to our definition function
    'bootstrap',
    'less',
    'app'
], function (Bootstrap, Less, App) {

    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
    App.initialize();
});