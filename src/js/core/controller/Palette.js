(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The controller for the color palette
     *
     * @class
     * @name core.controller.Palette
     */
    alchemy.formula.add({
        name: 'core.controller.Palette',

        overrides: {
            /** @lends core.controller.Palette.prototype */

            messages: {
                'color:selected': 'onColorSelected'
            },

            onColorSelected: function (state, data) {
                var colors = state.sub('colors').set('selected', data.color);
                return state.set('colors', colors);
            }
        }
    });
}());
