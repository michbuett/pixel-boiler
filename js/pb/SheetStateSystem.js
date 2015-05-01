module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.SheetStateSystem
     */
    alchemy.formula.add({
        name: 'pb.SheetStateSystem',

    }, function (_super) {
        return {
            /** @lends pb.SheetStateSystem.prototype */

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
                var state = this.entities.getComponent(cfg.id, 'state');
                if (!state || !state.current) {
                    return;
                }

                alchemy.each(cfg.fromState, this.updateFromState, null, [state.current, cfg]);
            },

            /** @private */
            updateFromState: function (stateKey, sheetKey, state, sheet) {
                sheet[sheetKey] = state.val(stateKey);
            },
        };
    });
};
