(function () {
    'use strict';

    var alchemy = require('alchemy');
    alchemy.heatUp({
        path: {
            alchemy: 'js/alchemy/lib',
            core: 'js/core',
            nw: 'js/nw',
        },

        require: [
            'core.Application',
            'win.overrides',
        ],

        onReady: function () {
            alchemy('win.overrides').apply();

            var app = alchemy('core.Application').brew({
                title: 'The Pixel Boiler'
            });
            app.launch();

            app.messages.once('app:start', function () {
                $('#intro').css('opacity', 0);
                window.setTimeout(function () {
                    $('#intro').remove();
                }, 2000);
            });

            window.app = app;
        }
    });
}());
