(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.controller.Editor
     * @extends alchemy.core.Oculus
     */
    alchemy.formula.add({
        name: 'pb.controller.Editor',
        extend: 'alchemy.core.Oculus',
        overrides: {
            /** @lends pb.controller.Editor.prototype */


            /** @protected */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'app:start', this.initEvents, this);
                };
            }),

            initEvents: function () {
                this.view = this.entities.getComponent('view', this.id);

                // Observe dom events for drawing:
                // - start drawing when mouse down on pixel element
                // - draw as long as the mouse is pressed
                // - draw on single click
                // - stop drawing on mouse up anywhere
                this.observe(this.view, 'mousedown .pixel', this.handleMouseDown, this);
                this.observe(this.view, 'mouseenter .pixel', this.handleMouseEnter, this);
                this.observe($('body'), 'mouseup', this.handleMouseUp.bind(this));
            },

            /** @private */
            handleMouseDown: function (e) {
                var context = this.view.getCanvasContext();
                if (context) {
                    var $pixel = $(e.target);
                    var data = $pixel.data();

                    if (data) {
                        e.preventDefault();
                        this.drawing = true;
                        this.draw('rgba(100, 20, 75, 0.5)', data.x, data.y, $pixel);
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
                    this.draw('rgba(100, 20, 75, 0.5)', data.x, data.y, $pixel);
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

                // clear old color (transparent colors are additive)
                context.fillStyle = 'rgba(0, 0, 0, 0)';
                context.fillRect(x, y, 1, 1);

                // draw the new color
                context.fillStyle = color;
                context.fillRect(x, y, 1, 1);
                $pixel.css({'background-color': color});
            },

        }
    });
}());
