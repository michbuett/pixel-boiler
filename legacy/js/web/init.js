(function () {
    'use strict';

    var alchemy = require('alchemy');

    alchemy.heatUp({
        path: {
            alchemy: '../support/alchemy/lib',
            core: 'js/core',
            web: 'js/web',
        },

        require: [
            'core.Application',
            'web.ui.Main',
        ],

        onReady: function () {
            window.app = alchemy('core.Application').brew({
                ui: alchemy('web.ui.Main').brew(),
            });

            window.app.launch();
        }
    });
}());
