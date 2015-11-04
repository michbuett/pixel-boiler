module.exports = (function () {
    'use strict';

    var colorLib = require('../lib/Color');

    return {
        /** */

        vdom: {
            renderer: function renderPaletteItemVdom(context) {
                var state = context.state;
                if (!state) {
                    return context.h('li.item', null, 'Unknown color');
                }

                var color = state.val('color');
                var index = state.val('index');
                var selected = state.val('selected');
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
        },

        events: {
            click: {
                message: 'color:selected',
            },
        },
    };
}());
