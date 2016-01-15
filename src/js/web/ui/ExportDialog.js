module.exports = (function () {
    'use strict';

    var Utils = require('alchemy.js/lib/Utils');
    var Dialog = require('../../core/ui/Dialog');

    /**
     * @class
     * @name web.ui.entities.ExportDialog
     */
    return Utils.mix({}, Dialog, {
        /** @lends web.ui.entities.ExportDialog.prototype */

        globalToLocal: function (appState) {
            return {
                active: appState.val('mode') === 'export',
            };
        },

        children: [{
            globalToLocal: function (appState) {
                var sheet = appState.sub('sheet');

                return {
                    spriteWidth: sheet.val('spriteWidth'),
                    spriteHeight: sheet.val('spriteHeight'),
                    columns: sheet.val('columns'),
                    rows: sheet.val('rows'),
                };
            },

            vdom: {
                renderer: function (context) {
                    // var state = context.state;
                    var h = context.h;

                    return h('div', [
                        h('h1', 'Export Current Sprite Sheet'),

                        h('form.export-dlg', [
                            h('button.close', { type: 'button' }, 'Close'),
                        ])
                    ]);
                },
            },

            css: {
            },

            events: {
                'click button.close': function (event, state, sendMsg) {
                    sendMsg('dialog:closed');
                },
            },
        }],
    });
}());
