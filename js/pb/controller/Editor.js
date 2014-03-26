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
                'editor:drawingStarted': 'handleDrawingStarted',
                'editor:drawingComplete': 'handleDrawingComplete',
                'click .tool-ct button.move-up': 'handlerMoveUp',
                'click .tool-ct button.move-down': 'handlerMoveDown',
                'click .tool-ct button.move-left': 'handlerMoveLeft',
                'click .tool-ct button.move-right': 'handlerMoveRight',
                'click .tool-ct button.undo': 'handleUndo',
                'click .tool-ct button.redo': 'handleRedo',
                'contextmenu': 'handleContextmenu',
            },

            /**
             * The drawing history
             * An array or drawing-history-objects which have the following form:
             * <pre><code>
             * {
             *   x: <number>, // the x-pos of the changed pixel
             *   y: <number>, // the y-pos of the changed pixel
             *   newColor: <string>, // the new color of after the drawing
             *   oldColor: <string>, // the old color before the drawing
             * }
             * </code></pre>
             *
             * @property history
             * @type Array
             * @property
             */
            history: undefined,

            /**
             * The index of the current entry in the drawing history
             *
             * @property historyIndex
             * @type Number
             * @private
             */
            historyIndex: undefined,

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

                    this.history = [];
                    this.historyIndex = 0;
                };
            }),

            /**
             * @function
             */
            dispose: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.sprite = null;
                };
            }),

            setSprite: function (sprite) {
                if (sprite !== this.sprite) {
                    this.sprite = sprite;
                    this.view.setSprite(this.sprite);

                    // reset history (drawing history makes no sense for another sprite)
                    this.history = [];
                    this.historyIndex = 0;
                }
            },

            handleDrawingStarted: function () {
                // clear abandoned history branch
                while (this.history.length > this.historyIndex) {
                    this.history.pop();
                }

                this.history[this.historyIndex] = {};
            },

            handleEditorActivity: function (data) {
                var x = data.x;
                var y = data.y;
                var historyObj = this.history[this.historyIndex];

                if (data.button === 1) {
                    // left mouse button down -> draw with selected color
                    this.draw(data.context, this.color, x, y, historyObj);
                } else if (data.button === 3) {
                    // right mouse button down -> clear canvas
                    this.draw(data.context, null, x, y, historyObj);
                }
            },

            /**
             * Event handler for the view's "editor:drawingComplete" event
             * Draws the latest changes (collected in current history entry)
             * to the sprite sheet
             * @private
             */
            handleDrawingComplete: function () {
                this.drawHistoryEntry(this.historyIndex, function (px, key, spriteContext) {
                    this.draw(spriteContext, px.newColor, px.x, px.y);
                });
                this.historyIndex++;
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

            /**
             * Event handler for the UNDO-button
             * @private
             */
            handleUndo: function () {
                if (this.historyIndex > 0) {
                    this.drawHistoryEntry(this.historyIndex - 1, function (px, key, spriteContext) {
                        spriteContext.clearRect(px.x, px.y, 1, 1);
                        this.draw(spriteContext, px.oldColor, px.x, px.y);
                    });
                    this.historyIndex--;
                    this.view.showSprite();
                }
            },

            /**
             * Event handler for the REDO-button
             * @private
             */
            handleRedo: function () {
                if (this.historyIndex < this.history.length) {
                    this.drawHistoryEntry(this.historyIndex, function (px, key, spriteContext) {
                        spriteContext.clearRect(px.x, px.y, 1, 1);
                        this.draw(spriteContext, px.newColor, px.x, px.y);
                    });
                    this.historyIndex++;
                    this.view.showSprite();
                }
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
            draw: function (context, color, x, y, drawingHistory) {
                if (!context) {
                    // nothing to draw on -> exit
                    return;
                }

                if (drawingHistory) {
                    var historyKey = x + '#' + y;
                    if (drawingHistory[historyKey]) {
                        // already drawn -> exit
                        return;
                    }

                    drawingHistory[historyKey] = {
                        x: x,
                        y: y,
                        newColor: color,
                        oldColor: this.getColor(x, y)
                    };
                }

                if (color) {
                    // draw the new color
                    context.fillStyle = color;
                    context.fillRect(x, y, 1, 1);
                } else {
                    context.clearRect(x, y, 1, 1);
                }
            },

            /**
             * Draws an history entry to the actual sprite
             *
             * @param {Number} index The index of the history entry to be drawn
             * @param {Function} cb The drawing callback which performs the actual
             *      drawing; It is called once for each pixel in the history entry
             *      with the following parameter:
             *      - the pixel configuration
             *      - the pixel key
             *      - the drawing context of the sprite's canvas
             */
            drawHistoryEntry: function (index, cb) {
                var sprite = this.sprite;
                var spriteContext = sprite && sprite.getContext('2d');
                var drawing = this.history[index];

                if (!drawing || !spriteContext) {
                    return;
                }

                // write cached drawings to actual sprite sheet
                alchemy.each(drawing, cb, this, [spriteContext]);

                this.messages.trigger('sheet:draw');
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

                this.messages.trigger('sheet:draw');
                this.view.showSprite();
            },

            getColor: function (x, y) {
                var bytes = this.sprite.getContext('2d').getImageData(x, y, 1, 1).data;
                var r = bytes[0];
                var g = bytes[1];
                var b = bytes[2];
                var a = bytes[3];

                return 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
            },
        }
    });
}());
