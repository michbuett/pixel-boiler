(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.renderer.PaletteItem
     */
    alchemy.formula.add({
        name: 'pb.renderer.PaletteItem',
        requires: [
            'pb.lib.Color'
        ],

    }, {
        /** @lends pb.renderer.PaletteItem.prototype */

        render: function (context) {
            var state = context.state;
            if (!state) {
                return context.h('li.item', null, 'Unknown color');
            }

            var color = state.val('color');
            var index = state.val('index');
            var selected = state.val('selected');
            var colorLib = alchemy('pb.lib.Color');
            var rgb = colorLib.hexToRgb(color);

            return context.h('li', {
                className: 'item' + (color === selected ? ' selected' : ''),
                dataset: {
                    color: color,
                    index: index,
                },
                style: {
                    color: colorLib.textColor(color),
                    backgroundColor: color
                },
            }, 'R:' + rgb.r + ' G:' + rgb.g + ' B:' + rgb.b);
        },
    });
}());
