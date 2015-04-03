module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.entities.PaletteItem',
        requires: [
            'pb.renderer.PaletteItem',
        ],

    }, {
        getComponents: function (cfg) {
            return {
                vdom: {
                    renderer: 'pb.renderer.PaletteItem',
                },

                events: {
                    click: {
                        message: 'color:selected',
                    },
                    handleClick: function (ev, context) {
                        console.log('select color #' + context.state.val('index'));
                        context.sendMessage('color:selected', {
                            color: context.state.val('color')
                        });
                    },
                },
            };
        }
    });
};
