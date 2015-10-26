module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');

    /**
     * TODO: document me!
     *
     * @class
     * @name core.controller.Sheet
     */
    return coquoVenenum({
        /** @lends core.controller.Sheet.prototype */

        messages: {
            'sheet:updated': 'onSheetUpdated'
        },

        onSheetUpdated: function (state, data) {
            // console.log('[pn.controller.Sheet#onSheetUpdated]', data);
            var newSheetState = state.sub('sheet').set(data);
            return state.set('sheet', newSheetState);
        },
    });
}());
