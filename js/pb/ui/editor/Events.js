module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.ui.editor.Events
     */
    alchemy.formula.add({
        name: 'pb.ui.editor.Events',
        requires: [
            'pb.lib.Color',
            'pb.lib.Draw',
        ],

    }, {
        /** @lends pb.ui.editor.Events.prototype */

        events: {
            'mousedown': {
                handler: 'startDrawing',
            },
            'mousemove': {
                handler: 'continueDrawing',
            },
            'mouseup': {
                handler: 'stopDrawing',
                message: 'sheet:draw',
            },
            'mouseout': {
                handler: 'stopDrawing',
                message: 'sheet:draw',
            },
        },

        getEventHandler: function () {
            return {
                startDrawing: startDrawing,
                continueDrawing: continueDrawing,
                stopDrawing: stopDrawing,
            };
        },

    });

    /** @private */
    function startDrawing(event, state) {
        return drawPixel(event, state).set('drawing', true);
    }

    /** @private */
    function continueDrawing(event, state) {
        // console.log('continueDrawing', state.val('drawing'));
        if (state.val('drawing')) {
            return drawPixel(event, state);
        }
        return state;
    }

    /** @private */
    function stopDrawing(event, state) {
        if (state.val('drawing')) {
            return drawPixel(event, state).set('drawing', false);
        }
        return state;
    }

    /** @private */
    function drawPixel(event, state) {
        var scale = state.val('scale') || 1;
        var x = Math.floor(event.offsetX / scale);
        var y = Math.floor(event.offsetY / scale);
        var color = alchemy('pb.lib.Color').hexToRgb(state.val('color'));
        var changedData = createImageData(1, 1);
        var sprites = state.sub('sprites');
        var selected = state.val('selected');
        var sprite = cloneImageDate(sprites.val(selected));

        drawToImageData(changedData, 0, 0, color);
        drawToImageData(sprite, x, y, color);

        sprites = sprites.set(selected, sprite);

        return state.set('sprites', sprites).set('dirty', {
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
        var clone = createImageData(source.width, source.height);
        clone.data.set(source.data);
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
};
