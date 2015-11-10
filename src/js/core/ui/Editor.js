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

            var cvsWidth = Math.max(spriteWidth, isLandscape ? width - 400 : width);
            var cvsHeight = Math.max(spriteHeight, isLandscape ? height - 50 : height - 400);
            var scale = Math.min(
                Math.floor(cvsWidth / spriteWidth),
                Math.floor(cvsHeight / spriteHeight)
            );

            return {
                sprites: sheet.sub('sprites'),
                selected: sheet.sub('selected'),
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
            fromState: {
                sprites: 'sprites',
                current: 'selected',
                dirty: 'dirty',
                scale: 'scale',
            },

            canvas: '#editor-pane'
        },
    };

    /** @private */
    function startDrawing(event, state) {
        // console.log('startDrawing', state.val('drawing'));

        var sprites = state.sub('sprites');
        var selected = state.val('selected');
        var sprite = cloneImageDate(sprites.val(selected));
        var newSprites = sprites.set(selected, sprite);
        var newState = state
            .set('sprites', newSprites)
            .set('editorSprite', sprite)
            .set('drawing', true);

        window.debugState = drawPixel(event, newState);

        return window.debugState;
    }

    /** @private */
    function continueDrawing(event, state) {
        if (state.val('drawing')) {
            // console.log('continueDrawing');
            return drawPixel(event, state);
        }
    }

    /** @private */
    function stopDrawing(event, state, sendMsg) {
        if (state.val('drawing')) {
            // console.log('stopDrawing');
            var newState = drawPixel(event, state);
            var sprites = state.sub('sprites');
            var selected = state.val('selected');
            var newSprites = sprites.set(selected, newState.sub('editorSprite'));

            newState = newState
                .set('sprites', newSprites)
                .set('editorSprite', null)
                .set('drawing', false);

            sendMsg('sheet:draw', newState.val());

            return newState;
        }
    }

    /** @private */
    function drawPixel(event, state) {
        var scale = state.val('scale') || 1;
        var x = Math.floor(event.offsetX / scale);
        var y = Math.floor(event.offsetY / scale);
        var color = colorLib.hexToRgb(state.val('color'));
        var changedData = createImageData(1, 1);
        var sprite = state.val('editorSprite');

        drawToImageData(changedData, 0, 0, color);
        drawToImageData(sprite, x, y, color);

        // console.log('DRAW', event.type, x, y, color, sprite);

        return state.set('dirty', {
            offsetX: x,
            offsetY: y,
            imageData: changedData,
        });
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
}());
