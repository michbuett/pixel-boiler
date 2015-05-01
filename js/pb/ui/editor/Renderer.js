module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.ui.editor.Renderer
     */
    alchemy.formula.add({
        name: 'pb.ui.editor.Renderer',

    }, {
        /** @lends pb.ui.editor.Renderer.prototype */

        renderVdom: function (context) {
            var state = context.state;

            return context.h('canvas#editor-pane', {
                width: state.val('width'),
                height: state.val('height'),
            });
        },

        renderCss: function (state) {
        },
    });
};
