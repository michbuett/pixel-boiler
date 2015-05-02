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
        // var sprites = state.sub('sprites');
        // var selected = state.val('selected');
        // var sprite = sprites.val(selected);
        // var newSprite = null; // cloneImage(sprite);

        // var newState = state.set({
        //     drawing: true,
        //     sprites: sprites.set(selected, newSprite),
        // });

        // drawPixel(event, newState);
        // return newState;
    }

    /** @private */
    function continueDrawing(event, state) {
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

        changedData.data[0] = color.r;
        changedData.data[1] = color.g;
        changedData.data[2] = color.b;
        changedData.data[3] = 255;

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
};
