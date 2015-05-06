module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.ui.editor.Renderer
     */
    alchemy.formula.add({
        name: 'core.ui.editor.Renderer',

    }, {
        /** @lends core.ui.editor.Renderer.prototype */

        renderVdom: function (context) {
            var state = context.state;

            return context.h('canvas#editor-pane', {
                width: state.val('width'),
                height: state.val('height'),
            });
        },

        renderCss: function (state) {
            return {
                'canvas#editor-pane': {
                    'position': 'absolute',
                    'top': '50%',
                    'left': '50%',
                    'margin-top': '-' + state.val('height') / 2 + 'px',
                    'margin-left': '-' + state.val('width') / 2 + 'px'
                }
            };
        },
    });
};
