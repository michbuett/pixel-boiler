module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.renderer.SpriteListItem
     */
    alchemy.formula.add({
        name: 'core.renderer.SpriteListItem',

    }, {
        /** @lends core.renderer.SpriteListItem.prototype */

        render: function (context) {
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
    });
};
