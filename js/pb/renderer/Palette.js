(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.renderer.Palette
     */
    alchemy.formula.add({
        name: 'pb.renderer.Palette',
        overrides: {
            /** @lends pb.renderer.Palette.prototype */

            render: function (context) {
                var state = context.state;
                var selected = state ? state.val('selected') : 'Unknown Color';
                return context.h('div#palette', null, [
                    context.h('div', {
                        id: 'selected-color',
                        style: {
                            backgroundColor: selected
                        },
                    }, 'Selected: ' + selected),
                    context.h('ul', null, context.renderAllChildren()),
                ]);
            },
        }
    });
}());

