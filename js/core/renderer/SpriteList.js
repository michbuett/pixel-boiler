module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'core.renderer.SpriteList',

    }, {
        render: function (context) {
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
    });
};