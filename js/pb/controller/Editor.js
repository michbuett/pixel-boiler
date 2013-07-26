(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.controller.Editor
     * @extends pb.controller.Prima
     */
    alchemy.formula.add({
        name: 'pb.controller.Editor',
        extend: 'pb.controller.Prima',
        overrides: {
            /** @lends pb.controller.Editor.prototype */

            viewEvents: {
                'mousedown .pixel': 'handleMouseDown',
                'mouseenter .pixel': 'handleMouseEnter',
            },

            /** @protected */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'palette:selectcolor', function (data) {
                        this.color = data.color;
                    }, this);

                    this.observe($('body'), 'mouseup', this.handleMouseUp.bind(this));
                };
            }),



            /** @private */
            handleMouseDown: function (e) {
                var context = this.view.getCanvasContext();
                if (context) {
                    var $pixel = $(e.target);
                    var data = $pixel.data();

                    if (data) {
                        e.preventDefault();
                        this.drawing = true;
                        this.draw(this.color, data.x, data.y, $pixel);
                    }
                }
            },

            /** @private */
            handleMouseUp: function () {
                this.drawing = false;
            },

            /** @private */
            handleMouseEnter: function (e) {
                if (!this.drawing) {
                    return;
                }

                var $pixel = $(e.target);
                var data = $pixel.data();

                if (data) {
                    this.draw(this.color, data.x, data.y, $pixel);
                }
            },

            draw: function (color, x, y, $pixel) {
                var context = this.view.getCanvasContext();
                if (!context) {
                    return;
                }

                $pixel = $pixel || $('.pixel[x=' + x + '][y=' + y + ']');
                if (!$pixel || !$pixel[0]) {
                    return;
                }

                // TODO: clear old transparency
                // draw the new color
                context.fillStyle = color;
                context.fillRect(x, y, 1, 1);
                $pixel.css({'background-color': color});
            },

        }
    });
}());
