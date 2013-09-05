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
                'contextmenu': 'handleContextmenu',
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


            /**
             * Prevent browser context menu; The right-click should clear a pixel
             * @private
             */
            handleContextmenu: function (e) {
                e.preventDefault();
                return false;
            },


            /** @private */
            handleMouseDown: function (e) {
                var context = this.view.getCanvasContext();
                if (context) {
                    var $pixel = $(e.target);
                    var data = $pixel.data();

                    if (data) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.drawing = e.button === 0 ? 'draw' : 'clear';
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
                var $pixel = $(e.target);
                var data = $pixel.data();

                if (!data) {
                    return;
                }

                if (this.drawing) {
                    this.draw(this.color, data.x, data.y, $pixel);
                }
                $('#editor-pane .info-x span').html(data.x);
                $('#editor-pane .info-y span').html(data.y);
            },

            /**
             * Draws the given color at the given location or clears
             * the pixel (makes it transparent)
             *
             * @param {String} color The color to draw; null to clear
             * @param {Number} x The x-coordinate
             * @param {Number} y The y-coordinate
             * @param {Object} [$pixel] The jQuery object refering to the pixel; Will be determined
             *      by the coordinates if ommittet but pass it if you know it because its faster
             * @private
             */
            draw: function (color, x, y, $pixel) {
                var context = this.view.getCanvasContext();
                if (!context) {
                    return;
                }

                $pixel = $pixel || $('.pixel[x=' + x + '][y=' + y + ']');
                if (!$pixel || !$pixel[0]) {
                    return;
                }

                if (color && this.drawing === 'draw') {
                    // clear old transparency to avoid multiplying effects
                    context.clearRect(x, y, 1, 1);
                    // draw the new color
                    context.fillStyle = color;
                    context.fillRect(x, y, 1, 1);
                    $pixel.css({'background-color': color});
                } else {
                    // clear pixel
                    context.clearRect(x, y, 1, 1);
                    $pixel.css({'background-color': 'transparent'});
                }
            },
        }
    });
}());
