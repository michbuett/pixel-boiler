(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

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
                return {
                    state: {
                        globalToLocal: {
                            fps: 'fps',
                            orientation: 'orientation',
                        },
                    },

                    vdom: {
                        renderer: 'pb.renderer.Viewport',
                        root: document.getElementById('viewport'),
                    },
                };
            },
        }
    });
}());
