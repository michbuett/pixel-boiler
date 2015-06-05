module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.renderer.Container
     */
    alchemy.formula.add({
        name: 'core.renderer.Container',
    }, {
        /** @lends core.renderer.Container.prototype */

        /**
         * @param {RenderContext} context
         * @return {VDomTree}
         */
        render: function (context) {
            return context.h('div', alchemy.mix({
                id: context.entityId,
            }, context.props), context.renderAllChildren());
        },
    });
};
