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
};
