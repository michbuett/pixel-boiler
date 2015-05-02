module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.renderer.SpriteListItem
     */
    alchemy.formula.add({
        name: 'pb.renderer.SpriteListItem',

    }, {
        /** @lends pb.renderer.SpriteListItem.prototype */

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
