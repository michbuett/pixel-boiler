module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.define('core.ui.entities.ImportDialog', [], function () {

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
    });
};
