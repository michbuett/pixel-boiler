module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.entities.MainMenu
     */
    alchemy.formula.add({
        name: 'pb.entities.MainMenu',
        requires: [
            'pb.renderer.MainMenu',
        ],

    }, {
        /** @lends pb.entities.MainMenu.prototype */

        getComponents: function () {
            return {
                vdom: {
                    renderer: 'pb.renderer.MainMenu',
                },
            };
        },
    });
};
