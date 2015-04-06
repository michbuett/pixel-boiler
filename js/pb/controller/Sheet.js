module.exports = function (alchemy) {
    'use strict';

    /**
     * TODO: document me!
     *
     * @class
     * @name pb.controller.Sheet
     */
    alchemy.formula.add({
        name: 'pb.controller.Sheet',
    }, {
        /** @lends pb.controller.Sheet.prototype */

        messages: {
            'sheet:updated': 'onSheetUpdated'
        },

        onSheetUpdated: function (state, data) {
            // console.log('[pn.controller.Sheet#onSheetUpdated]', data);
            var newSheetState = state.sub('sheet').set(data);
            return state.set('sheet', newSheetState);
        },
    });
};
