module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.entities.PaletteItem',
    }, {
        getEntityDescriptor: function (cfg) {
            var immutatio = alchemy('Immutatio');

            return {
                state: {
                    updateEntityStateFromAppState: function (entityState, appState) {
                        var index = entityState.val('index');
                        var color = immutatio.find(appState, 'colors.palette.' + index);
                        var selected = immutatio.find(appState, 'colors.selected');

                        return entityState.set({
                            color: color,
                            selected: selected
                        });
                    },

                    current: immutatio.makeImmutable({
                        color: cfg.color,
                        index: cfg.index,
                        selected: cfg.selected,
                    })
                },

                view: {
                    render: function (context, state) {
                        var color = state.val('color');
                        var index = state.val('index');
                        var selected = state.val('selected');

                        return context.h('li.item', {
                            className: 'item' + (color === selected ? ' selected' : ''),
                            dataset: {
                                color: color,
                                index: index,
                            },
                            style: {
                                backgroundColor: color
                            },
                            events: {
                                click: 'handleClick',
                            },
                        });
                    },
                },

                events: {
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
