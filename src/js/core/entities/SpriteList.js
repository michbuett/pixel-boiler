module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'core.entities.SpriteList',
        requires: ['core.renderer.SpriteList'],
    }, {
        getComponents: function () {
            return {
                state: {
                    globalToLocal: {
                        'sheet.sprites': 'sprites',
                    },
                },

                vdom: {
                    renderer: 'core.renderer.SpriteList',
                },
            };
        },
    });
};
