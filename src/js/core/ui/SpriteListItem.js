module.exports = (function () {
    'use strict';

    return {
        vdom: {
            renderer: function renderSpriteListItemVdom(context) {
                var state = context.state;
                if (!state) {
                    return context.h('li.item', null, 'Unknown sprite');
                }

                var selected = state.val('selected');
                var index = state.val('index');

                return context.h('li', {
                    className: 'item' + (index === selected ? ' selected' : ''),
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
            click: {
                message: 'sprite:selected',
            },
        },

        css: {
            typeRules: {
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
            },
        },
    };
}());
