module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.entities.MainMenu
     */
    alchemy.formula.add({
        name: 'core.entities.MainMenu',
        requires: [
            'core.renderer.MainMenu',
        ],

    }, {
        /** @lends core.entities.MainMenu.prototype */

        getComponents: function () {
            return {
                vdom: {
                    renderer: 'core.renderer.MainMenu',
                },
            };
        },
    });
};
