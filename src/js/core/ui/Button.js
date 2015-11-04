module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name core.ui.entities.Button
     */
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
}());
