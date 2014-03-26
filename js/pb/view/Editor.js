(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.view.Editor
     * @extends alchemy.browser.View
     */
    alchemy.formula.add({
        name: 'pb.view.Editor',
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.Editor.prototype */

            templateId: 'tpl-editor',

            /**
             * The number of pixel columns
             * @property dimX
             * @type Number
             */
            dimX: 32,

            /**
             * The number of pixel rows
             * @property dimY
             * @type Number
             */
            dimY: 32,

            /**
             * The factor to scale the source sprites to the editor canvas
             * @property scale
             * @type Number
             */
            scale: 1,

            /**
             * The current sprite
             * @property sprite
             * @type Canvas
             */
            sprite: undefined,

            /**
             *
             */
            button: 0,

            /** @function */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe($(window), 'resize', this.onWindowResize.bind(this));
                    this.on('rendered', this.onRendered, this);
                    this.on('mousemove #editor-canvas', this.onMousemove, this);
                    this.on('mousedown #editor-canvas', this.onMousedown, this);
                    this.on('mouseup #editor-canvas', this.onMouseup, this);
                    this.on('mouseout #editor-canvas', this.onMouseup, this);
                };
            }),

            /** @function */
            finish: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.sprite = null;
                    this.canvasPos = null;
                    this.context = null;
                    this.$ghost = null;
                    this.$infoX = null;
                    this.$infoY = null;
                };
            }),

            /** @function */
            getData: function () {
                return {
                    scale: this.scale,
                    dimX: this.dimX,
                    dimY: this.dimY,
                    orientation: this.orientation
                };
            },

            /**
             * Sets the sprite which should be rendered to the editor canvas
             *
             * @param {Canvas} sprite The sprite to show
             */
            setSprite: function (sprite) {
                if (sprite && (this.sprite !== sprite)) {
                    this.sprite = sprite;
                    this.setResolution(sprite.width, sprite.height);
                    this.showSprite();
                }
            },

            /**
             * Renders the current sprite to the editor canvas
             */
            showSprite: (function () {
                // helper method to convert the image data values to an rgba color
                var getColor = function (r, g, b, a) {
                    return 'rgba(' + [r, g, b, a / 255].join(',') + ')';
                };

                return function () {
                    if (this.context && this.sprite) {
                        var x = 0;
                        var y = 0;
                        var w = this.dimX;
                        var h = this.dimY;
                        var spriteContext = this.sprite.getContext('2d');
                        var imageData = spriteContext.getImageData(0, 0, w, h);
                        var d = imageData.data;

                        // clear canvas
                        this.context.clearRect(0, 0, w, h);
                        // draw new content pixel by pixel to avoid scale blur
                        // (imageSmoothingEnabled does not work in IE10 and IE11 preview)
                        for (var i = 0, l = d.length; i < l; i += 4) {
                            this.context.fillStyle = getColor(d[i], d[i + 1], d[i + 2], d[i + 3]);
                            this.context.fillRect(x, y, 1, 1);

                            x++;
                            if (x === w) {
                                x = 0;
                                y++;
                            }
                        }
                    }
                };
            }()),

            //
            //
            // private helper
            //
            //

            /** @private */
            setResolution: function (dimX, dimY) {
                if (dimX === this.dimX && dimY === this.dimY) {
                    return;
                }

                this.dimX = dimX;
                this.dimY = dimY;
                this.updateScale();
                this.refresh();
            },

            /** @private */
            updateOrientation: function () {
                var $editorPane = $('#editor-pane');
                var newOrientation = ($editorPane.height() > $editorPane.width()) ? 'portrait' : 'landscape';

                if (newOrientation === this.orientation) {
                    return;
                }
                $editorPane.removeClass(this.orientation);
                $editorPane.addClass(newOrientation);
                this.orientation = newOrientation;
                this.refresh();
            },

            /** @private */
            updateScale: function () {
                var $editorCt = $('#editor-pane .editor-ct');
                var availableWidth = Math.floor($editorCt.width() / this.dimX);
                var availableHeight = Math.floor($editorCt.height() / this.dimY);
                var scale = Math.min(availableHeight, availableWidth);

                if (scale > 0 && scale === this.scale) {
                    return false;
                }
                this.scale = scale;
                this.refresh();
                return true;
            },

            /**
             * Returns the coordinate of a sprite pixel by a given mouse event
             * @private
             */
            getPixelPos: function (e) {
                var ex = e.clientX - this.canvasPos.x;
                var ey = e.clientY - this.canvasPos.y;

                return {
                    x: Math.floor(ex / this.scale),
                    y: Math.floor(ey / this.scale),
                };
            },

            /**
             * Trigger an user activity event
             * @private
             */
            triggerActivity: (function () {
                var event = 'editor:activity';
                var data = {};

                return function (x, y) {
                    // set event data
                    data.x = x;
                    data.y = y;
                    data.button = this.button;
                    data.context = this.context;

                    /**
                     * Fired if there is any user activity at the editor canvas (mouse)
                     *
                     * @event
                     * @name editor:activity
                     * @param {Number} x The x-coordinate
                     * @param {Number} y The y-coordinate
                     * @param {Number} button The mouse button (0 - none, 1 - left, 3 - right)
                     * @param {Object} context The 2d-render context of the editor canvas
                     */
                    this.trigger(event, data);

                    // clear event data
                    data.x = null;
                    data.y = null;
                    data.button = null;
                    data.context = null;
                };
            }()),

            //
            //
            // private event handler
            //
            //

            /** @private */
            onWindowResize: function () {
                this.updateOrientation();
                this.updateScale();
                this.refresh();
            },

            /** @private */
            onRendered: function () {
                if (this.updateScale()) {
                    // the scale changed after rendering (i.e the initial rendering)
                    // and triggered a re-draw
                    return;
                }

                var canvas = document.getElementById('editor-canvas');
                var offset = $(canvas).offset();

                this.canvasPos = {
                    x: Math.floor(offset.left),
                    y: Math.floor(offset.top),
                };

                this.context = canvas.getContext('2d');
                this.context.webkitImageSmoothingEnabled = false;
                this.context.mozImageSmoothingEnabled = false;
                this.context.msImageSmoothingEnabled = false;
                this.context.imageSmoothingEnabled = false;
                this.context.scale(this.scale, this.scale);

                this.showSprite();

                this.$ghost = $('#editor-ghost');
                this.$infoX = $('#editor-info-x span');
                this.$infoY = $('#editor-info-y span');
            },

            /** @private */
            onMousemove: function (e) {
                var pixelPos = this.getPixelPos(e);
                var col = pixelPos.x;
                var row = pixelPos.y;

                if (col !== this.col || row !== this.row) {
                    var pos = $(e.target).position();
                    /* jshint bitwise: false */
                    var xPos = (col * this.scale + pos.left) | 1;
                    var yPos = (row * this.scale + pos.top) | 1;
                    /* jshint bitwise: true */
                    var css = 'translate(' + xPos + 'px, ' + yPos + 'px)';
                    var ghostStyle = this.$ghost[0].style;

                    this.col = col;
                    this.row = row;

                    if (ghostStyle.setProperty) {
                        ghostStyle.setProperty('-webkit-transform', css);
                        ghostStyle.setProperty('transform', css);
                    }

                    this.$infoX.text(col);
                    this.$infoY.text(row);

                    this.triggerActivity(col, row);
                }
            },

            /** @private */
            onMousedown: function (e) {
                var pixelPos = this.getPixelPos(e);
                var x = pixelPos.x;
                var y = pixelPos.y;

                if (x >= 0 && y >= 0 && x < this.dimX && y < this.dimY) {
                    this.button = e.which;
                    this.startDrawing();
                    this.triggerActivity(x, y);
                }
            },

            /** @private */
            onMouseup: function () {
                this.button = 0;
                this.endDrawing();
            },

            /** @private */
            startDrawing: function () {
                if (!this.isDrawing) {
                    this.isDrawing = true;
                    this.trigger('editor:drawingStarted');
                }
            },

            /** @private */
            endDrawing: function () {
                if (this.isDrawing) {
                    this.isDrawing = false;
                    this.trigger('editor:drawingComplete');
                }
            },
        }
    });
}());
