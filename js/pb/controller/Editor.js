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
                'click .tool-ct .move-up': 'handlerMoveUp',
                'click .tool-ct .move-down': 'handlerMoveDown',
                'click .tool-ct .move-left': 'handlerMoveLeft',
                'click .tool-ct .move-right': 'handlerMoveRight',
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

            /**
             * Event handler for the "▲" button
             * @private
             */
            handlerMoveUp: function () {
                this.shift(0, -1);
            },

            /**
             * Event handler for the "▼" button
             * @private
             */
            handlerMoveDown: function () {
                this.shift(0, 1);
            },

            /**
             * Event handler for the "◀" button
             * @private
             */
            handlerMoveLeft: function () {
                this.shift(-1, 0);
            },

            /**
             * Event handler for the "▶" button
             * @private
             */
            handlerMoveRight: function () {
                this.shift(1, 0);
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

            /**
             * Move the sprite content
             * @private
             *
             * @param {Number} dx The number of pixel to move along the X-axes
             * @param {Number} dy The number of pixel to move along the Y-axes
             */
            shift: function (dx, dy) {
                var sprite = this.view.getSelectedSprite();
                var context = this.view.getCanvasContext();
                if (!sprite || !context) {
                    return;
                }

                var sw = sprite.width;
                var sh = sprite.height;
                var sourceX = Math.abs(Math.min(dx, 0));
                var sourceY = Math.abs(Math.min(dy, 0));
                var targetX = Math.max(dx, 0);
                var targetY = Math.max(dy, 0);
                var imgData = context.getImageData(sourceX, sourceY, sw - sourceX, sh - sourceY);
                context.putImageData(imgData, targetX, targetY);

                if (dx !== 0) {
                    context.clearRect(dx > 0 ? 0 : sw + dx, 0, Math.abs(dx), sh);
                }
                if (dy !== 0) {
                    context.clearRect(0, dy > 0 ? 0 : sh + dy, sw, Math.abs(dy));
                }

                this.view.refresh();
            },
        }
    });
}());
