module.exports = (function () {
    'use strict';

    return {
        vdom: {
            renderer: function (ctx) {
                var h = ctx.h;

                return h('div.dlg-mask', null, [
                    h('div.dlg-import'),
                ]);
            },
        },
    };
}());
