(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.renderer.Palette
     */
    alchemy.formula.add({
        name: 'pb.renderer.Palette',
        requires: [
            'pb.lib.Color'
        ],

        overrides: {
            /** @lends pb.renderer.Palette.prototype */

            render: function (context) {
                var state = context.state;
                var selected = state ? state.val('selected') : 'Unknown Color';
                var palette = state ? state.val('palette') : [];
                var colors = [];
                var h = context.h;

                for (var i = 0, l = palette.length; i < l; i++) {
                    colors.push(h('li#color-' + i));
                }

                return h('div#palette', null, [
                    h('div', {
                        id: 'selected-color',
                        style: {
                            color: alchemy('pb.lib.Color').textColor(selected),
                            backgroundColor: selected
                        },
                    }, '[SELECTED: ' + selected + ']'),
                    h('ul', null, colors),
                ]);
            },
        }
    });
}());

