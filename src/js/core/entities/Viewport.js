(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name core.entities.ViewPort
     */
    alchemy.formula.add({
        name: 'core.entities.Viewport',

        requires: [
            'core.renderer.Viewport',
        ],

        overrides: {
            /** @lends core.entities.Viewport.prototype */

            getComponents: function () {
                return {
                    state: {
                        globalToLocal: {
                            windowWidth: 'width',
                            windowHeight: 'height',
                        },
                    },

                    vdom: {
                        renderer: alchemy('core.renderer.Viewport').renderVdom,
                        root: document.getElementById('viewport'),
                    },

                    css: {
                        renderer: alchemy('core.renderer.Viewport').renderCss,
                    },
                };
            },
        }
    });
}());
