module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.SheetRenderSystem
     */
    alchemy.formula.add({
        name: 'core.SheetRenderSystem',
        requires: [
            'core.lib.Color'
        ],

    }, function (_super) {
        return {
            /** @lends core.SheetRenderSystem.prototype */

            /** @override */
            constructor: function (cfg) {

                /**
                 * The entity storage
                 *
                 * @property entities
                 * @type alchemy.ecs.Apothecarius
                 * @private
                 */
                this.entities = undefined;

                _super.constructor.call(this, cfg);
            },

            /** @override */
            dispose: function () {
                this.entities = null;

                _super.dispose.call(this);
            },

            /**
             * Updates the component system with the current application state
             */
            update: function () {
                var sheetConfigs = this.entities.getAllComponentsOfType('sheet');
                alchemy.each(sheetConfigs, this.updateEntity, this);
            },

            /** @private */
            updateEntity: function (cfg, entityId) {
                var state = this.entities.getComponent(entityId, 'state');
                var dirty = state && state.val('dirty');
                if (!dirty || !dirty.imageData) {
                    return;
                }

                var canvas = document.querySelector(cfg.canvas);
                if (!canvas) {
                    return;
                }

                this.entities.setComponent(entityId, 'state', state.set('dirty', false));

                var context = canvas.getContext('2d');
                var scale = state.val('scale') || cfg.scale || 1;
                var offsetX = dirty.offsetX * scale;
                var offsetY = dirty.offsetY * scale;
                var x = offsetX;
                var y = offsetY;
                var lib = alchemy('core.lib.Color').brew();

                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;

                for (var i = 0, l = dirty.imageData.data.length; i < l; i += 4) {
                    var color = lib.fromRGBA(
                        dirty.imageData.data[i + 0],
                        dirty.imageData.data[i + 1],
                        dirty.imageData.data[i + 2],
                        dirty.imageData.data[i + 3]
                    );

                    context.fillStyle = color;
                    context.fillRect(x, y, scale, scale);

                    x += scale;

                    if (x >= canvas.width) {
                        x = offsetX;
                        y += scale;
                    }
                }
            },
        };
    });
};

