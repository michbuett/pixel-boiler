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
                var active = context.state.val('active') || false;

                return h('div', {
                    id: context.entityId,
                    className: 'dlg ' + (active ? 'opened' : 'closed'),
                }, [
                    h('div.dlg-content', [
                        h('button.dlg-close', 'X'),
                    ].concat(context.renderAllChildren()))
                ]);
            }
        },

        css: {
            typeRules: {
                '.dlg': {
                    '.dlg-close': {
                        'position': 'absolute',
                        'right': '-35px',
                        'top': '-35px',
                    },

                    '.dlg-content': {
                        'position': 'relative',
                        'padding': '10px',
                        'display': 'inline-block',
                        'margin': '100px'
                    },

                    'transition': 'width 0.3s ease',
                    'overflow': 'hidden',
                    'position': 'absolute',
                    'text-align': 'center',
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
