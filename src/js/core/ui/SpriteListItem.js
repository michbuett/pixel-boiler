module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');

    return {
        globalToLocal: function (appState, currentState) {
            var sheet = appState.sub('sheet');
            var selectedIndex = sheet.val('selected');

            return {
                imageData: sheet.sub('sprites').val(currentState.index),
                isSelected: currentState.index === selectedIndex,
                width: sheet.sub('spriteWidth'),
                height: sheet.sub('spriteHeight'),
            };
        },

        vdom: {
            renderer: function renderSpriteListItemVdom(context) {
                var state = context.state;
                if (!state) {
                    return context.h('li.item', null, 'Unknown sprite');
                }

                var isSelected = state.val('isSelected');
                var index = state.val('index');

                return context.h('li', {
                    className: 'item' + (isSelected ? ' selected' : ''),
                    dataset: {
                        index: index,
                    },
                }, [
                    context.h('span.sprite-number', null, '[' + index + ']'),
                    context.h('div.cvs-wrap', null, [
                        context.h('canvas#cvs-sprite-' + index, {
                            width: state.val('width'),
                            height: state.val('height'),
                        }),
                    ]),
                ]);
            },
        },

        events: {
            click: function handleItemClick(event, state, sendMsg) {
                sendMsg('sheet:spriteSelected', {
                    index: state.val('index')
                });
            },
        },

        css: {
            typeRules: {
                '.sprite-list .item': {
                    'position': 'relative',
                    'cursor': 'pointer',

                    'canvas': {
                        'margin': '0 auto',
                        'display': 'block',
                    }
                },

                '.sprite-list .item .sprite-number': {
                    'position': 'absolute',
                    'padding': '5px',
                    'background-color': 'rgba(0, 0, 0, .5)',
                    'top': '5px',
                    'left': '5px',
                },
            },
        },

        fromState: createSpriteListItems,
    };

    /** @private */
    function createSpriteListItems(state) {
        var sprites = state.sub('sheet').val('sprites');
        var result = {};

        each(sprites, function (sprite, index) {
            var id = 'sprite-' + index;
            result[id] = {
                id: id,

                type: 'core.ui.entities.SpriteListItem',

                state: {
                    index: index,
                    sprite: sprite,
                },

                sheet: {
                    canvas: '#cvs-sprite-' + index,
                }
            };
        });

        return result;
    }
}());
