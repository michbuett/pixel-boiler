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
                'editor:activity': 'handleEditorActivity',
                'click .tool-ct .move-up': 'handlerMoveUp',
                'click .tool-ct .move-down': 'handlerMoveDown',
                'click .tool-ct .move-left': 'handlerMoveLeft',
                'click .tool-ct .move-right': 'handlerMoveRight',
                'contextmenu': 'handleContextmenu',
            },

            /**
             * @function
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'palette:selectcolor', function (data) {
                        this.color = data.color;
                    }, this);

                    this.observe(this.messages, 'sheet:changed', function (data) {
                        this.setSprite(data.sheet.getSprite(0));
                    }, this);

                    this.observe(this.messages, 'sprite:selected', function (data) {
                        this.setSprite(data.sheet.getSprite(data.index));
                    }, this);
                };
            }),

            /**
             * @function
             */
            dispose: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    delete this.sprite;
                };
            }),

            setSprite: function (sprite) {
                if (sprite !== this.sprite) {
                    this.sprite = sprite;
                    this.view.setSprite(this.sprite);
                }
            },

            handleEditorActivity: function (data) {
                if (data.button === 1) {
                    // left mouse button down
                    this.draw(data.context, this.color, data.x, data.y);
                } else if (data.button === 3) {
                    // right mouse button down
                    this.clear(data.context, data.x, data.y);
                }
            },

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


            clear: function (context, x, y) {
                this.draw(context, null, x, y);
            },

            /**
             * Draws the given color at the given location or clears
             * the pixel (makes it transparent)
             *
             * @param {String} color The color to draw; null to clear
             * @param {Number} x The x-coordinate
             * @param {Number} y The y-coordinate
             * @private
             */
            draw: function (context, color, x, y) {
                var sprite = this.sprite;
                var spriteContext = sprite && sprite.getContext('2d');
                if (!context || !spriteContext) {
                    return;
                }

                // clear old transparency to avoid multiplying effects
                context.clearRect(x, y, 1, 1);
                spriteContext.clearRect(x, y, 1, 1);

                if (color) {
                    // draw the new color
                    context.fillStyle = color;
                    context.fillRect(x, y, 1, 1);
                    spriteContext.fillStyle = color;
                    spriteContext.fillRect(x, y, 1, 1);
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
                var sprite = this.sprite;
                if (!sprite) {
                    return;
                }

                var context = sprite.getContext('2d');
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

                this.view.showSprite();
            },
        }
    });
}());
