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
                active: appState.val('mode') === 'new',
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
                    var state = context.state;
                    var h = context.h;

                    return h('form.new-dlg', [
                        h('label', ['Sprite Width', h('input', {
                            name: 'sprite-width',
                            value: state.val('spriteWidth'),
                        })]),

                        h('label', ['Sprite Height', h('input', {
                            name: 'spriteHeight',
                            value: state.val('spriteHeight'),
                        })]),

                        h('label', ['Columns', h('input', {
                            name: 'columns',
                            value: state.val('columns'),
                        })]),

                        h('label', ['Rows', h('input', {
                            name: 'rows',
                            value: state.val('rows'),
                        })]),
                    ]);
                },
            }
        }],
    });
}());
