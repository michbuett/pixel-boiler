(function () {
    'use strict';

    var alchemy = require('alchemy');
    alchemy.heatUp({
        path: {
            alchemy: 'js/alchemy/lib',
            pb: 'js/pb',
            nw: 'js/nw',
        },

        require: [
            'pb.Application',
            'nw.overrides',
        ],

        onReady: function () {
            alchemy('nw.overrides').apply();

            var app = alchemy('pb.Application').brew({
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
