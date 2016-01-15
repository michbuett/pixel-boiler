module.exports = (function () {
    'use strict';

    var Utils = require('alchemy.js/lib/Utils');
    var sheetLib = require('../lib/Sheet');
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

                    return h('div', [
                        h('h1', 'Create New Sprite Sheet'),

                        h('form.new-dlg', [

                            h('fieldset', [
                                h('legend', 'Sprites'),

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

                            h('fieldset', [
                                h('legend', 'Sheet'),

                                h('label', ['Columns', h('input', {
                                    type: 'number',
                                    name: 'columns',
                                    value: state.val('columns'),
                                })]),

                                h('label', ['Rows', h('input', {
                                    type: 'number',
                                    name: 'rows',
                                    value: state.val('rows'),
                                })]),
                            ]),

                            h('div.button-bar', [
                                h('button.cancel', { type: 'button' }, 'Cancel'),
                                h('button.create', { type: 'button' }, 'Create'),
                            ])
                        ])
                    ]);
                },
            },

            css: {
                typeRules: {
                    'form.new-dlg': {
                        'width': '200px',
                    },
                },
            },

            events: {
                'click button.cancel': function (event, state, sendMsg) {
                    sendMsg('dialog:closed');
                },

                'click button.create': function (event, state, sendMsg) {
                    var form = event.target.form;
                    var data = serialize(form);

                    sheetLib.createSpriteSheet({
                        spriteWidth: parseInt(data.spriteWidth, 10),
                        spriteHeight: parseInt(data.spriteHeight, 10),
                        columns: parseInt(data.columns, 10),
                        rows: parseInt(data.rows, 10),

                        callback: function (result) {
                            sendMsg('sheet:updated', result);
                            sendMsg('dialog:closed');
                        }
                    });
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
