module.exports = (function () {
    'use strict';

    var Utils = require('alchemy.js/lib/Utils');

    var CoreUI = require('../core/UI');
    var PaletteItem = require('../core/ui/PaletteItem');
    var SpriteListItem = require('../core/ui/SpriteListItem');
    var Viewport = require('./ui/Viewport');

    return CoreUI.extend({

        /** @private */
        initEntities: function (state) {
            this.admin.initEntities([Utils.melt(Viewport, {
                id: 'viewport',
            }), PaletteItem.fromState, SpriteListItem.fromState], state);
        },
    });
}());
