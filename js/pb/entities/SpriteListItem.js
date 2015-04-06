module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.entities.SpriteListItem',
        requires: [
            'pb.renderer.SpriteListItem',
        ],

    }, {
        getComponents: function (cfg) {
            return {
                vdom: {
                    renderer: 'pb.renderer.SpriteListItem',
                },

                events: {
                    click: {
                        message: 'sprite:selected',
                    },
                },
            };
        }
    });
};
