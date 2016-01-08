module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name core.ui.MainMenu
     */
    return {
        /** @lends core.ui.entities.MainMenu.prototype */

        vdom: {
            renderer: function renderMainMenuVdom(context) {
                var h = context.h;
                var brand = h('div.brand', null, [
                    h('div.title', 'PIXELBoiler'),
                    h('div.info', '- web version -')
                ]);

                return h('div#mainMenu', {
                    className: 'main-menu',
                }, [
                    brand,
                    h('button.new', 'NEW'),
                    h('button.export', 'EXPORT'),
                    h('button.settings', 'SETTINGS'),
                ]);
            },
        },

        css: {
            typeRules: {
                '.main-menu .brand': {
                    'padding': '5px',

                    '.title': {
                        'font-weight': 'bold',
                        'font-size': '25px',
                    },

                    '.info': {
                        'font-size': '15px',
                        'text-align': 'center',
                    },
                },

                '.main-menu > div': {
                    'display': 'inline-block',
                    'vertical-align': 'top',
                },
            },
        },

        events: {
            'click .new': function (event, state, sendMsg) {
                sendMsg('dialog:opened', {
                    dialog: 'new'
                });
            },
        },
    };
}());
