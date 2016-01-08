module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name core.ui.entities.Dialog
     */
    return {
        /** @lends core.ui.entities.NewDialog.prototype */

        vdom: {
            renderer: function (context) {
                var h = context.h;

                return h('div', {
                    id: context.entityId,
                    className: 'dlg'
                }, [
                    h('button.dlg-close', '↩'),
                    h('div.dlg-content', context.renderAllChildren())
                ]);
            }
        },

        css: {
            typeRules: {
                '.dlg': {
                    '.dlg-close': {
                        'position': 'absolute',
                        'font-size': '20px',
                    },

                    '.dlg-content': {
                        'padding': '10px',
                        'max-width': '85%',
                        'margin': '100px auto'
                    },

                    'transition': 'width 0.3s ease',
                    'overflow': 'hidden',
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'height': '100%',
                    'z-index': '10',
                },
            },

            entityRules: function (state) {
                return {
                    'width': state.val('active') ? '100%' : '0',
                };
            },
        },

        events: {
            'click .dlg-close': function (event, state, sendMsg) {
                sendMsg('dialog:closed');
            },
        },
    };
}());
