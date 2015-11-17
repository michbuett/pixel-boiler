module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');
    var each = require('pro-singulis');
    var colorLib = require('../lib/Color');

    /**
     * @class
     * @name core.ui.SheetRenderSystem
     */
    return coquoVenenum({
        /** @lends core.ui.SheetRenderSystem.prototype */

        /**
         * Updates the component system with the current application state
         */
        update: function () {
            var sheetConfigs = this.entities.getAllComponentsOfType('sheet');
            each(sheetConfigs, this.updateEntity, this);
        },

        /** @private */
        updateEntity: function (cfg, entityId) {
            var state = this.entities.getComponent(entityId, 'state');

            if (state === cfg.lastState) {
                return;
            }

            var canvas = document.querySelector(cfg.canvas);
            var imageData = state.val('imageData');
            if (!canvas || !imageData) {
                return;
            }

            var scale = state.val('scale') || cfg.scale || 1;
            draw(canvas, {
                imageData: imageData,
                offsetX: 0,
                offsetY: 0,
            }, scale);

            cfg.lastState = state;
            this.entities.setComponent(entityId, 'sheet', cfg);
        },
    });

    /** @private */
    function draw(targetCvs, dirty, scale) {
        var ctx = targetCvs.getContext('2d');
        var ddata = dirty && dirty.imageData && dirty.imageData.data;
        var offsetX = dirty.offsetX * scale;
        var offsetY = dirty.offsetY * scale;
        var x = offsetX;
        var y = offsetY;

        if (!ddata) {
            return;
        }

        ctx.clearRect(0, 0, targetCvs.width, targetCvs.height);
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        for (var i = 0, l = ddata.length; i < l; i += 4) {
            var color = colorLib.fromRGBA(
                ddata[i + 0],
                ddata[i + 1],
                ddata[i + 2],
                ddata[i + 3]
            );

            ctx.fillStyle = color;
            ctx.fillRect(x, y, scale, scale);

            x += scale;

            if (x >= targetCvs.width) {
                x = offsetX;
                y += scale;
            }
        }
    }
}());
