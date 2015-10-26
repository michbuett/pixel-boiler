module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');

    /**
     * The controller for the color palette
     *
     * @class
     * @name core.controller.Palette
     */
    return coquoVenenum({
        /** @lends core.controller.Palette.prototype */

        messages: {
            'color:selected': 'onColorSelected'
        },

        onColorSelected: function (state, data) {
            var colors = state.sub('colors').set('selected', data.color);
            return state.set('colors', colors);
        }
    });
}());
