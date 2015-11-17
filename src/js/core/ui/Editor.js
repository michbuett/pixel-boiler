module.exports = (function () {
    'use strict';

    var colorLib = require('../lib/Color');

    /**
     * @class
     * @name core.ui.entities.Editor
     */
    return {
        /** @lends core.ui.entities.Editor.prototype */

        globalToLocal: function (appState, currentState) {
            var height = appState.val('windowHeight');
            var width = appState.val('windowWidth');
            var isLandscape = (width > height);

            var sheet = appState.sub('sheet');
            var spriteWidth = sheet.val('spriteWidth');
            var spriteHeight = sheet.val('spriteHeight');
            var sprites = sheet.sub('sprites');
            var selectedIndex = sheet.sub('selected');
            var selectedSprite = sprites.sub(selectedIndex.val());

            var cvsWidth = Math.max(spriteWidth, isLandscape ? width - 400 : width);
            var cvsHeight = Math.max(spriteHeight, isLandscape ? height - 50 : height - 400);
            var scale = Math.min(
                Math.floor(cvsWidth / spriteWidth),
                Math.floor(cvsHeight / spriteHeight)
            );

            return {
                imageData: selectedSprite,
                sprites: sprites,
                selected: selectedIndex,
                scale: scale,
                width: scale * spriteWidth,
                height: scale * spriteHeight,
                color: appState.sub('colors').val('selected'),
            };
        },

        state: {
        },

        vdom: {
            renderer: function renderEditorVdom(context) {
                var state = context.state;

                return context.h('canvas#editor-pane', {
                    width: state.val('width'),
                    height: state.val('height'),
                });
            },
        },

        css: {
            entityRules: function renderEditorCss(state) {
                return {
                    'canvas#editor-pane': {
                        'cursor': 'crosshair',
                        'position': 'absolute',
                        'top': '50%',
                        'left': '50%',
                        'margin-top': '-' + state.val('height') / 2 + 'px',
                        'margin-left': '-' + state.val('width') / 2 + 'px'
                    }
                };
            },
        },

        events: {
            'mousedown': startDrawing,
            'mousemove': continueDrawing,
            'mouseup': stopDrawing,
            'mouseout': stopDrawing,
        },

        sheet: {
            canvas: '#editor-pane'
        },
    };

    /** @private */
    function startDrawing(event, state, sendMsg) {
        // console.log('startDrawing', state.val('drawing'));
        return drawPixel(event, state, sendMsg).set('drawing', true);
    }

    /** @private */
    function continueDrawing(event, state, sendMsg) {
        if (state.val('drawing')) {
            // console.log('continueDrawing');
            return drawPixel(event, state, sendMsg);
        }
    }

    /** @private */
    function stopDrawing(event, state, sendMsg) {
        if (state.val('drawing')) {
            // console.log('stopDrawing');
            return drawPixel(event, state, sendMsg).set('drawing', false);
        }
    }

    /** @private */
    function drawPixel(event, state, sendMsg) {
        var scale = state.val('scale') || 1;
        var x = Math.floor(getOffsetX(event) / scale);
        var y = Math.floor(getOffsetY(event) / scale);
        var color = colorLib.hexToRgb(state.val('color'));
        var sprite = cloneImageDate(state.val('imageData'));
        var selectedIndex = state.val('selected');
        var sprites = state.sub('sprites').set(selectedIndex, sprite);
        var newState = state.set('sprites', sprites).set('imageData', sprite);

        // console.log('DRAW', event.type, x, y, color, sprite);
        drawToImageData(sprite, x, y, color);

        sendMsg('sheet:draw', {
            sprites: sprites.val()
        });

        return newState;
    }

    /** @private */
    function createImageData(width, height) {
        return document.createElement('canvas').getContext('2d').createImageData(width, height);
    }

    /** @private */
    function cloneImageDate(source) {
        if (!source) {
            return null;
        }

        var clone = createImageData(source.width, source.height);
        var sourceData = source.data;
        var cloneData = clone.data;

        for (var i = 0, l = sourceData.length; i < l; i++) {
            cloneData[i] = sourceData[i];
        }

        return clone;
    }

    /** @private */
    function drawToImageData(imgData, x, y, color) {
        var row = 4 * imgData.width * y;
        var index = row + 4 * x;

        // console.log('drawToImageData', x, y, index);
        imgData.data[index + 0] = color.r;
        imgData.data[index + 1] = color.g;
        imgData.data[index + 2] = color.b;
        imgData.data[index + 3] = 255;
    }

    /** @private */
    function getOffsetX(event) {
        return typeof event.offsetX === 'undefined' ? event.layerX : event.offsetX;
    }

    /** @private */
    function getOffsetY(event) {
        return typeof event.offsetY === 'undefined' ? event.layerY : event.offsetY;
    }
}());
