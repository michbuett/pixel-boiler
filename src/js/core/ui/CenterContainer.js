module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name core.ui.entities.CenterContainer
     */
    return {
        /** @lends core.ui.entities.CenterContainer.prototype */

        vdom: {
            renderer: function renderCenterContainerVdom(context) {
                var h = context.h;

                return h('div', {
                    id: context.entityId,
                    className: 'ct-center',
                }, [
                    h('div.ct-center-outer', null, [
                        h('div.ct-center-inner', null, context.renderAllChildren()),
                    ]),
                ]);
            },
        },

        css: {
            typeRules: {
                '.ct-center': {
                    'display': 'table',
                    'width': '100%',
                    'height': '100%',
                },

                '.ct-center-outer': {
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                    'text-align': 'center',
                },

                '.ct-center-inner': {
                    'display': 'inline-block',
                },
            },
        },
    };
}());
