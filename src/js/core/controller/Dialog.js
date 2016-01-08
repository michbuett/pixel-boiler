module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');

    /**
     * TODO: document me!
     *
     * @class
     * @name core.controller.Dialog
     */
    return coquoVenenum({
        /** @lends core.controller.Dialog.prototype */

        messages: {
            'dialog:opened': 'onDlgOpened',
            'dialog:closed': 'onDlgClosed',
        },

        onDlgOpened: function (state, data) {
            if (!data || !data.dialog) {
                return state;
            }

            return state.set('mode', data.dialog);
        },

        onDlgClosed: function (state) {
            return state.set('mode', 'main');
        },
    });
}());
