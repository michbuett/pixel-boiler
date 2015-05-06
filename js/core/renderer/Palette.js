(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name core.renderer.Palette
     */
    alchemy.formula.add({
        name: 'core.renderer.Palette',
        requires: [
            'core.lib.Color'
        ],

        overrides: {
            /** @lends core.renderer.Palette.prototype */

            renderVdom: function (context) {
                var state = context.state;
                var selected = state ? state.val('selected') : 'Unknown Color';
                var palette = state ? state.val('palette') : [];
                var colors = [];
                var h = context.h;

                for (var i = 0, l = palette.length; i < l; i++) {
                    colors.push(context.placeholder('color-' + i));
                }

                return h('div#palette', null, [
                    h('div', {
                        id: 'selected-color',
                        style: {
                            color: alchemy('core.lib.Color').textColor(selected),
                            backgroundColor: selected
                        },
                    }, '[SELECTED: ' + selected + ']'),

                    h('div.list-wrap', null, [
                        h('ul#palette-items', null, colors)
                    ]),
                ]);
            },

            renderCss: function (state) {
                var numOfPalettItems = state.val('palette').length;
                return {
                    '.landscape #palette-items': {
                        'width': '100%',
                        'height': (25 * numOfPalettItems) + 'px',
                    },

                    '.portrait #palette-items': {
                        'width': (40 * numOfPalettItems) + 'px',
                        'height': '100%',
                    },
                };
            },
        }
    });
}());

