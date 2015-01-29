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
        key: 'preview',
        text: 'Preview',
    }];

    /**
     * @class
     * @name pb.view.MainMenu
     */
    alchemy.formula.add({
        name: 'pb.entities.MainMenu',
        overrides: {
            /** @lends pb.entities.MainMenu.prototype */

            getEntityDescriptor: function () {
                function renderButtons(context) {
                    return alchemy.each(buttons, function renderButton(cfg) {
                        return context.h('button', {
                            id: 'btn-' + cfg.key,
                            events: {
                                click: 'handleClick-' + cfg.key
                            }
                        }, cfg.text);
                    });
                }

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
                        render: function (context) {
                            var brand = context.h('div.brand', null, [
                                context.h('div.title', 'PIXELBoiler'),
                                context.h('div.file-info', 'Untitled.png')
                            ]);

                            return context.h('div', {
                                className: 'main-menu'
                            }, [brand].concat(renderButtons(context)));
                        },
                    },
                };
            },
        }
    });
}());

