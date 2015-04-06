module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.entities.SpriteList',
        requires: ['pb.renderer.SpriteList'],
    }, {
        getComponents: function () {
            return {
                state: {
                    globalToLocal: {
                        'sheet.sprites': 'sprites',
                    },
                },

                vdom: {
                    renderer: 'pb.renderer.SpriteList',
                },
            };
        },
    });
};
