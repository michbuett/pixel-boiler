module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.renderer.Container
     */
    alchemy.formula.add({
        name: 'pb.renderer.Container',
    }, {
        /** @lends pb.renderer.Container.prototype */

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
