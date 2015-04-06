module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.renderer.Text
     */
    alchemy.formula.add({
        name: 'pb.renderer.Text',
    }, {
        /** @lends pb.renderer.Text.prototype */

        /**
         * @param {RenderContext} context
         * @return {VDomTree}
         */
        render: function (context) {
            var text = context.props.text;
            var state = context.state.val();

            return context.h('div', alchemy.mix({
                id: context.entityId,
            }, context.props), replaceText(text, state));
        },
    });


    function replaceText(text, replacements) {
        for (var key in replacements) {
            if (!replacements.hasOwnProperty(key)) {
                continue;
            }
            text = text.replace('{' + key + '}', replacements[key]);
        }

        return text;
    }
};
