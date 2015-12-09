module.exports = (function () {
    'use strict';

    var Utils = require('alchemy.js/lib/Utils');
    var colorLib = require('../lib/Color');

    var PaletteItem = {
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
                    className: 'palette-item' + (color === selected ? ' selected' : ''),
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

        css: {
            typeRules: {
                '.palette-item': {
                    height: '50px',
                    width: '50%',
                    cursor: 'pointer',
                    display: 'inline-block',
                    padding: '5px',
                    'box-sizing': 'border-box',
                    'vertical-align': 'bottom',
                }
            },
        },

        fromState: function createPaletteItems(state) {
            var colors = state.sub('colors');
            var palette = colors.val('palette');
            var selected = colors.val('selected');
            var result = {};

            for (var i = 0, l = palette.length; i < l; i++) {
                var id = 'color-' + i;
                var globalToLocal = {
                    'colors.selected': 'selected'
                };

                globalToLocal['colors.palette.' + i] = 'color';

                result[id] = Utils.mix({}, PaletteItem, {
                    id: id,

                    globalToLocal: globalToLocal,

                    state: {
                        index: i,
                        color: palette[i],
                        selected: selected,
                    },
                });
            }

            return result;
        },
    };

    return PaletteItem;
}());
