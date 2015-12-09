module.exports = (function () {
    'use strict';

    var Utils = require('alchemy.js/lib/Utils');
    var Dialog = require('./Dialog');

    /**
     * @class
     * @name core.ui.entities.NewDialog
     */
    return Utils.mix({}, Dialog, {
        /** @lends core.ui.entities.NewDialog.prototype */

        globalToLocal: function (appState) {
            return {
                active: appState.val('route') === 'new',
            };
        },
    });
}());
