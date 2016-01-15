module.exports = (function () {
    'use strict';

    return {
        globalToLocal: {
            'sheet.sprites': 'sprites',
        },

        state: {
            sprites: [],
        },

        vdom: {
            renderer: function renderSpriteListVdom(context) {
                var h = context.h;
                var sprites = context.state.val('sprites');
                var items = [];

                for (var i = 0, l = sprites.length; i < l; i++) {
                    items.push(context.placeholder('sprite-' + i));
                }

                return h('div', {
                    className: 'sprite-list',
                }, [
                    h('ul', null, items)
                ]);
            },
        },

        css: {
            entityRules: {
                overflow: 'auto',
            }
        },
    };
}());
