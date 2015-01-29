(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');
    var buttons = [{
        key: 'new',
        text: 'New',
    }, {
        key: 'open',
        text: 'Open',
    }, {
        key: 'save',
        text: 'Save',
    }, {
        key: 'saveas',
        text: 'Save As',
    }, {
        key: 'settings',
        text: 'Settings',
    }];

    /**
     * @class
     * @name pb.entities.MainMenu
     */
    alchemy.formula.add({
        name: 'pb.entities.MainMenu',

        requires: [
            'pb.view.MainMenu',
        ],

        overrides: {
            /** @lends pb.entities.MainMenu.prototype */

            getEntityDescriptor: function () {

                var events = {};
                alchemy.each(buttons, function (cfg) {
                    var key = cfg.key;
                    events['handleClick-' + key] = function (ev, context) {
                        console.log('CLICK BUTTON', key);
                        context.sendMessage('user:' + key);
                    };
                });

                return {
                    events: events,

                    view: {
                        potion: 'pb.view.MainMenu',
                        buttons: buttons,
                    },
                };
            },
        }
    });
}());

