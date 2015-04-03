(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.renderer.PaletteItem
     */
    alchemy.formula.add({
        name: 'pb.renderer.PaletteItem',
    }, {
        /** @lends pb.renderer.PaletteItem.prototype */

        render: function (context) {
            var state = context.state;
            if (!state) {
                return context.h('li.item', null, 'Unknown color');
            }

            var color = state.val('color');
            var index = state.val('index');
            var selected = state.val('selected');

            return context.h('li', {
                className: 'item' + (color === selected ? ' selected' : ''),
                dataset: {
                    color: color,
                    index: index,
                },
                style: {
                    backgroundColor: color
                },
            }, color);
        },
    });
}());
