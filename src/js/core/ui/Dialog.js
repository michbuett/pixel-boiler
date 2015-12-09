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
                return context.h('div', {
                    id: context.entityId,
                    className: 'dlg'
                }, context.renderAllChildren());
            }
        },

        css: {
            typeRules: {
                '.dlg': {
                    'transition': 'width 0.3s ease',
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
    };
}());
