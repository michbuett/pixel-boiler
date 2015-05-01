module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.SheetRenderSystem
     */
    alchemy.formula.add({
        name: 'pb.SheetRenderSystem',

    }, function (_super) {
        return {
            /** @lends pb.SheetRenderSystem.prototype */

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
            updateEntity: function (cfg, index) {
                var sprite = cfg.sprites && cfg.sprites[cfg.current];
                if (!sprite) {
                    return;
                }

                var canvas = document.querySelector(cfg.canvas);
                if (!canvas) {
                    return;
                }

                var context = canvas.getContext('2d');
                var scale = cfg.scale > 1 ? cfg.scale : 1;

                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
                context.drawImage(sprite, 0, 0, sprite.width * scale, sprite.height * scale);
            },
        };
    });
};

