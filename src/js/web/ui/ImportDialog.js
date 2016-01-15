module.exports = (function () {
    'use strict';

    var Utils = require('alchemy.js/lib/Utils');
    var sheetLib = require('../../core/lib/Sheet');
    var Dialog = require('../../core/ui/Dialog');

    /**
     * @class
     * @name web.ui.entities.ImportDialog
     */
    return Utils.mix({}, Dialog, {
        /** @lends web.ui.entities.ImportDialog.prototype */

        globalToLocal: function (appState) {
            return {
                active: appState.val('mode') === 'import',
            };
        },

        children: [{
            globalToLocal: function (appState) {
                var sheet = appState.sub('sheet');

                return {
                    spriteWidth: sheet.val('spriteWidth'),
                    spriteHeight: sheet.val('spriteHeight'),
                };
            },

            vdom: {
                renderer: function (context) {
                    var state = context.state;
                    var h = context.h;
                    var importUrl = state.val('importUrl');

                    return h('div', [
                        h('h1', 'Import New Sprite Sheet'),

                        h('form.import-dlg', [
                            h('fieldset', [
                                h('legend', 'File'),
                                h('input.import-file', {
                                    accept: 'image/*',
                                    type: 'file',
                                    name: 'importImg',
                                }),
                            ]),

                            h('fieldset', [
                                h('legend', 'Preview'),
                                h('div.preview-wrap', h('img.preview', {
                                    src: importUrl || '',
                                })),
                            ]),

                            h('fieldset', [
                                h('legend', 'Sprites Dimensions'),

                                h('label', ['Sprite Width', h('input', {
                                    type: 'number',
                                    name: 'spriteWidth',
                                    value: state.val('spriteWidth'),
                                })]),

                                h('label', ['Sprite Height', h('input', {
                                    type: 'number',
                                    name: 'spriteHeight',
                                    value: state.val('spriteHeight'),
                                })]),
                            ]),

                            h('div.button-bar', [
                                h('button.cancel', { type: 'button' }, 'Cancel'),
                                h('button.import', { type: 'button' }, 'Import'),
                            ])
                        ]),
                    ]);
                },
            },

            css: {
                typeRules: {
                    'form.import-dlg': {
                        '.preview-wrap': {
                            'text-align': 'center',
                        },

                        'img.preview': {
                            'min-width': '32px',
                            'max-width': '248px',
                        },

                        'width': '270px',
                    },
                },
            },

            events: {
                'change input.import-file': function (event, state) {
                    var files = event.target.files;
                    var file = files && files[0];
                    var importUrl = window.URL.createObjectURL(file);

                    return state.set('importUrl', importUrl);
                },

                'click button.cancel': function (event, state, sendMsg) {
                    sendMsg('dialog:closed');

                    var importUrl = state.val('importUrl');
                    if (importUrl) {
                        window.URL.revokeObjectURL(importUrl);
                    }

                    return state.set('importUrl', null);
                },

                'click button.import': function (event, state, sendMsg) {
                    var form = event.target.form;
                    var data = serialize(form);
                    var importUrl = state.val('importUrl');

                    sheetLib.createSpriteSheet({
                        src: importUrl,
                        spriteWidth: parseInt(data.spriteWidth, 10),
                        spriteHeight: parseInt(data.spriteHeight, 10),

                        callback: function (result) {
                            window.URL.revokeObjectURL(importUrl);
                            sendMsg('sheet:updated', result);
                            sendMsg('dialog:closed');
                        }
                    });

                    return state.set('importUrl', null);
                },
            },
        }],
    });

    function serialize(form) {
        if (!form || !form.elements || !form.elements.length) {
            return {};
        }

        var result = {};

        for (var i = 0, l = form.elements.length; i < l; i++) {
            var el = form.elements[i];
            if (el.name) {
                result[el.name] = el.value;
            }
        }

        return result;
    }
}());
