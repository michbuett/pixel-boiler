module.exports = (function () {
    'use strict';

    var colorLib = require('../lib/Color');

    return {
        /** @lends core.ui.entities.palette.prototype */

        globalToLocal: {
            'colors.selected': 'selected',
            'colors.palette': 'palette',
            'windowWidth': 'windowWidth',
            'windowHeight': 'windowHeight',
        },

        state: {
            selected: '#000000',
            palette: [],
            windowWidth: 800,
            windowHeight: 600,
        },

        vdom: {
            renderer: function renderPaletteVdom(context) {
                var state = context.state;
                var selected = state ? state.val('selected') : 'Unknown Color';
                var palette = state ? state.val('palette') : [];
                var isLandscape = state.val('windowWidth') > state.val('windowHeight');
                var colors = [];
                var h = context.h;

                for (var i = 0, l = palette.length; i < l; i++) {
                    colors.push(context.placeholder('color-' + i));
                }

                return h('div', {
                    id: context.entityId,
                    className: isLandscape ? 'landscape' : 'portrait'
                }, [
                    h('div', {
                        id: 'selected-color',
                        style: {
                            color: colorLib.textColor(selected),
                            backgroundColor: selected
                        },
                    }, '[SELECTED: ' + selected + ']'),

                    h('div.list-wrap', null, [
                        h('ul#palette-items', null, colors)
                    ]),
                ]);
            },
        },

        css: {
            entityRules: function renderPaletteCss(state) {
                var numOfPalettItems = state.val('palette').length;
                return {
                    '&.landscape #selected-color': {
                        'height': '40px',
                        'padding': '5px',
                        'box-sizing': 'border-box',
                    },

                    '&.landscape .list-wrap': {
                        'height': 'calc(100% - 40px)',
                        'overflow': 'auto',
                    },

                    '&.landscape #palette-items': {
                        'width': '100%',
                        'height': (25 * numOfPalettItems) + 'px',
                    },

                    '&.portrait #palette-items': {
                        'width': (40 * numOfPalettItems) + 'px',
                        'height': '100%',
                    },
                };
            },
        },
    };
}());
