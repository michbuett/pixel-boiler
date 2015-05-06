(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name core.view.MainMenu
     */
    alchemy.formula.add({
        name: 'core.view.MainMenu',
        overrides: {
            /** @lends core.view.MainMenu.prototype */

            render: function (context) {
                var brand = context.h('div.brand', null, [
                    context.h('div.title', 'PIXELBoiler'),
                    context.h('div.file-info', 'Untitled.png')
                ]);

                return context.h('div', {
                    className: 'main-menu'
                }, [brand].concat(renderButtons(this.buttons, context)));
            },
        }
    });

    /** @private */
    function renderButtons(buttons, context) {
        return alchemy.each(buttons, function renderButton(cfg) {
            return context.h('button', {
                id: 'btn-' + cfg.key,
                events: {
                    click: 'handleClick-' + cfg.key
                }
            }, cfg.text);
        });
    }
}());

