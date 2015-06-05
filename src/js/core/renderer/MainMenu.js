(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name core.renderer.MainMenu
     */
    alchemy.formula.add({
        name: 'core.renderer.MainMenu',
        overrides: {
            /** @lends core.renderer.MainMenu.prototype */

            render: function (context) {
                var brand = context.h('div.brand', null, [
                    context.h('div.title', 'PIXELBoiler'),
                    context.h('div.file-info', 'Untitled.png')
                ]);

                return context.h('div#mainMenu', {
                    className: 'main-menu',
                }, [brand].concat(context.renderAllChildren()));
            },
        }
    });
}());

