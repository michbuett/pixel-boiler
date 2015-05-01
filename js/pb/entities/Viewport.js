(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.entities.ViewPort
     */
    alchemy.formula.add({
        name: 'pb.entities.Viewport',

        requires: [
            'pb.renderer.Viewport',
        ],

        overrides: {
            /** @lends pb.entities.Viewport.prototype */

            getComponents: function () {
                return {
                    state: {
                        globalToLocal: {
                            windowWidth: 'width',
                            windowHeight: 'height',
                        },
                    },

                    vdom: {
                        renderer: alchemy('pb.renderer.Viewport').renderVdom,
                        root: document.getElementById('viewport'),
                    },

                    css: {
                        renderer: alchemy('pb.renderer.Viewport').renderCss,
                    },
                };
            },
        }
    });
}());
