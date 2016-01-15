module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name core.ui.entities.FPS
     */
    return {
        /** @lends core.ui.entities.FPS.prototype */
        globalToLocal: {
            fps: 'fps',
        },

        vdom: {
            renderer: function (ctx) {
                return ctx.h('div', {
                    id: ctx.entityId,
                    className: 'fps',
                }, 'FPS: ' + ctx.state.val('fps'));
            },
        },

        css: {
            typeRules: {
                '.fps': {
                    'position': 'absolute',
                    'bottom': '5px',
                    'left': '5px',
                    'z-index': 100,
                }
            },
        },
    };
}());
