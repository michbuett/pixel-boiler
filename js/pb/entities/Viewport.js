(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');
    var components = {
        state: {
            globalToLocal: {
                orientation: 'orientation',
            },
        },

        vdom: {
            renderer: 'pb.renderer.Viewport',
            root: document.getElementById('viewport'),
        },
    };

    /**
     * @class
     * @name pb.view.ViewPort
     */
    alchemy.formula.add({
        name: 'pb.entities.Viewport',

        requires: [
            'pb.entities.MainMenu',
            'pb.entities.Palette',
            'pb.renderer.Viewport',
        ],

        overrides: {
            /** @lends pb.entities.Viewport.prototype */

            getComponents: function () {
                return components;
            },
        }
    });
}());
