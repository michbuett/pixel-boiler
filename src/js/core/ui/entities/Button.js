module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.ui.entities.Button
     */
    alchemy.formula.define('core.ui.entities.Button', [], function () {
        return {
            /** @lends core.ui.entities.Button.prototype */

            vdom: {
                renderer: function (context) {
                    var props = context.props;

                    return context.h('button', {
                        id: props.key,
                    }, props.text);
                }
            }
        };
    });
};
