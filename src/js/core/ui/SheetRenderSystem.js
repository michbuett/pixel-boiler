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
            var scale = state.val('scale') || cfg.scale || 1;
            var canvas = document.querySelector(cfg.canvas);
            var dirty = state && state.val('dirty');

            if (dirty && dirty.imageData) {
                draw(canvas, dirty, scale);
                this.entities.setComponent(entityId, 'state', state.set('dirty', false));
            }

            var changes = state && state.val('changes');
            if (changes && changes.length > 0) {
                for (var i = 0, l = changes.length; i < l; i++) {
                    draw(canvas, changes[i], scale);
                }
                this.entities.setComponent(entityId, 'state', state.set('changes', false));
            }
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
