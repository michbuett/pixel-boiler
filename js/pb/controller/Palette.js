(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.controller.Palette
     * @extends pb.controller.Prima
     */
    alchemy.formula.add({
        name: 'pb.controller.Palette',
        extend: 'pb.controller.Prima',
        overrides: {
            /** @lends pb.controller.Palette.prototype */

            viewEvents: {
                'click .palette-item': 'pickColor',
            },

            pickColor: function (e) {
                console.log('pick color', e);
                var data = $(e.target).data();
                if (data && data.color) {
                    this.selectColor(data.color);
                }
            },

            selectColor: function (color) {
                if (color !== this.color) {
                    this.color = color;
                    this.messages.trigger('palette:selectcolor', {
                        color: color
                    });
                }
            }
        }
    });
}());
