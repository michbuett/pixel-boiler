module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.ui.editor.Events
     */
    alchemy.formula.add({
        name: 'pb.ui.editor.Events',

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
        var sprites = state.sub('sprites');
        var selected = state.val('selected');
        var sprite = sprites.val(selected);
        var newSprite = cloneImage(sprite);

        var newState = state.set({
            drawing: true,
            sprites: sprites.set(selected, newSprite),
        });

        drawPixel(event, newState);
        return newState;
    }

    /** @private */
    function continueDrawing(event, state) {
        if (state.val('drawing')) {
            drawPixel(event, state);
        }
        return state;
    }

    /** @private */
    function stopDrawing(event, state) {
        if (state.val('drawing')) {
            drawPixel(event, state);
        }
        return state.set('drawing', false);
    }

    /** @private */
    function drawPixel(event, state) {
        var sprites = state.val('sprites');
        var sprite = sprites && sprites[state.val('selected')];
        var scale = state.val('scale') || 1;
        var x = Math.floor(event.offsetX / scale);
        var y = Math.floor(event.offsetY / scale);
        var context = sprite.getContext('2d');

        context.fillStyle = state.val('color');
        context.fillRect(x, y, 1, 1);
    }

    /** @private */
    function cloneImage(source) {
        var newSprite = document.createElement('canvas');
        var newCtx;

        newSprite.width = source.width;
        newSprite.height = source.height;
        newCtx = newSprite.getContext('2d');
        newCtx.drawImage(source, 0, 0);

        return newSprite;
    }
};
