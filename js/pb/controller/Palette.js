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
                'rendered': 'onRender',
            },

            /**
             * Init color selection after rendering the palette
             * @private
             */
            onRender: function (data) {
                var $firstColor = $(data.target).find('.palette-item:nth-child(2)');
                var elementData = $firstColor.data();

                if (elementData && elementData.color) {
                    $firstColor.click(); // select element
                    this.selectColor(elementData.color); // select color internally
                }
            },

            /**
             * Event handler for clicking at a color palette item
             * @private
             */
            pickColor: function (e) {
                var data = $(e.target).data();
                if (data && data.color) {
                    this.selectColor(data.color);
                }
            },

            /**
             * Sets the selected color and broadcasts the selection
             * @private
             */
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
