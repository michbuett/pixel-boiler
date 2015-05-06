module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.ui.components.CenterContainer
     */
    alchemy.formula.add({
        name: 'core.ui.components.CenterContainer',

    }, {
        /** @lends core.ui.components.CenterContainer.prototype */
        getComponents: function () {
            return {
                vdom: {
                    renderer: renderVdom
                }
            };
        },

        getStaticCss: function () {
            return renderStaticCss();
        },
    });

    /** @private */
    function renderVdom(context) {
        var h = context.h;

        return h('div', {
            id: context.entityId,
            className: 'ct-center',
        }, [
            h('div.ct-center-outer', null, [
                h('div.ct-center-inner', null, context.renderAllChildren()),
            ]),
        ]);
    }

    /** @private */
    function renderStaticCss() {
        return {
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
        };
    }
};
