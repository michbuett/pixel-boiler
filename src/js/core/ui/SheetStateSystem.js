module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');
    var each = require('pro-singulis');

    /**
     * @class
     * @name core.SheetStateSystem
     */
    return coquoVenenum({
        /** @lends core.SheetStateSystem.prototype */

        /**
         * Updates the component system with the current application state
         */
        update: function () {
            var sheetConfigs = this.entities.getAllComponentsOfType('sheet');
            each(sheetConfigs, this.updateEntity, this);
        },

        /** @private */
        updateEntity: function (cfg, index) {
            var state = this.entities.getComponent(cfg.id, 'state');
            if (!state || !state.current /* || state.current === state.last*/) {
                return;
            }

            each(cfg.fromState, this.updateFromState, null, [state.current, cfg]);
        },

        /** @private */
        updateFromState: function (stateKey, sheetKey, state, sheet) {
            sheet[sheetKey] = state.val(stateKey);
        },
    });
}());
