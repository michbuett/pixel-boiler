module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');

    /**
     * TODO: document me!
     *
     * @class
     * @name core.controller.SpriteList
     */
    return coquoVenenum({
        /** @lends core.controller.SpriteList.prototype */

        messages: {
            'sheet:spriteSelected': 'onSpriteSelected'
        },

        onSpriteSelected: function (state, data) {
            // console.log('[pn.controller.SpriteList#onSpriteSelected]', data);
            var newSheetState = state.sub('sheet').set('selected', data.index);
            return state.set('sheet', newSheetState);
        },
    });
}());
