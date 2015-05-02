(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.renderer.MainMenu
     */
    alchemy.formula.add({
        name: 'pb.renderer.MainMenu',
        overrides: {
            /** @lends pb.renderer.MainMenu.prototype */

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

