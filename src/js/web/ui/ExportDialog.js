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
                    sprites: sheet.val('sprites'),
                    spriteWidth: sheet.val('spriteWidth'),
                    spriteHeight: sheet.val('spriteHeight'),
                    columns: sheet.val('columns'),
                    rows: sheet.val('rows'),
                };
            },

            vdom: {
                renderer: function (context) {
                    var h = context.h;

                    return h('div', [
                        h('h1', 'Export Current Sprite Sheet'),

                        h('form.export-dlg', [
                            h('div.export-wrap', [
                                h('img', {
                                    src: getImageURL(context.state),
                                }),
                                h('div', 'Right-click and download'),
                            ]),
                            h('div.button-bar', [
                                h('button.close', { type: 'button' }, 'Close'),
                            ]),
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

    /** @private */
    function getImageURL(state) {
        var sprites = state.val('sprites');
        if (!sprites) {
            return '';
        }

        var sw = state.val('spriteWidth');
        var sh = state.val('spriteHeight');
        var c = state.val('columns');
        var r = state.val('rows');
        var cvs = document.createElement('canvas');
        var ctx = cvs.getContext('2d');

        cvs.width = sw * c;
        cvs.height = sh * r;

        for (var i = 0, l = sprites.length; i < l; i++) {
            ctx.putImageData(sprites[i], sw * (i % c), sh * Math.floor(i / c));
        }

        return cvs.toDataURL();
    }
}());
