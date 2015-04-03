module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.entities.Palette',
        requires: [
            'pb.renderer.Palette',
            'pb.entities.PaletteItem',
        ],
    }, {
        getComponents: function () {
            return {
                children: {
                    fromState: {
                        strategy: createPaletteItems,
                    },
                },

                state: {
                    globalToLocal: {
                        'colors.selected': 'selected',
                        'colors.palette': 'palette',
                    }
                },

                vdom: {
                    renderer: 'pb.renderer.Palette',
                }
            };
        },
    });

    function createPaletteItems(state) {
        var palette = state.palette;
        var selected = state.selected;

        return alchemy.each(palette, function (color, index) {
            var globalToLocal = {
                'colors.selected': 'selected'
            };

            globalToLocal['colors.palette.' + index] = 'color';

            return {
                id: 'color-' + index,
                type: 'pb.entities.PaletteItem',

                state: {
                    initial: {
                        index: index,
                        color: color,
                        selected: selected,
                    },

                    globalToLocal: globalToLocal,
                },
            };
        });
    }
};
