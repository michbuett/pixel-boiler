module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'core.entities.SpriteListItem',
        requires: [
            'core.renderer.SpriteListItem',
        ],

    }, {
        getComponents: function (cfg) {
            return {
                vdom: {
                    renderer: 'core.renderer.SpriteListItem',
                },

                events: {
                    click: {
                        message: 'sprite:selected',
                    },
                },
            };
        },

        getStaticCss: function () {
            return {
                '.sprite-list .item': {
                    'position': 'relative',
                },


                '.sprite-list .item .sprite-number': {
                    'position': 'absolute',
                    'padding': '5px',
                    'background-color': 'rgba(0, 0, 0, .5)',
                    'top': '5px',
                    'left': '5px',
                },
            };
        },
    });
};
