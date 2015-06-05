module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'core.entities.Palette',
        requires: [
            'core.renderer.Palette',
            'core.entities.PaletteItem',
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
                    renderer: alchemy('core.renderer.Palette').renderVdom,
                },

                css: {
                    renderer: alchemy('core.renderer.Palette').renderCss,
                },
            };
        },
    });
};
