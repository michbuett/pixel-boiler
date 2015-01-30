module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.entities.Palette',
        requires: [
            'pb.entities.PaletteItem',
        ],
    }, {
        getEntityDescriptor: function () {
            return {
                children: {
                    fromState: function (state) {
                        return alchemy.each(state.val('palette'), function (color, index) {
                            return {
                                type: 'pb.entities.PaletteItem',
                                id: 'color-' + index,
                                index: index,
                                color: color,
                                selected: state.val('selected'),
                            };
                        });
                    },
                },

                state: {
                    updateEntityStateFromAppState: function (entityState, appState) {
                        return appState.sub('colors');
                    }
                },

                view: {
                    render: function (context) {
                        return context.h('ul#palette', null, context.renderAllChildren());
                    }
                }
            };
        },
    });
};
