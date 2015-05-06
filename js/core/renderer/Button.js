(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name core.renderer.Button
     */
    alchemy.formula.add({
        name: 'core.renderer.Button',
        overrides: {
            /** @lends core.renderer.Button.prototype */

            render: function (context) {
                var props = context.props;

                return context.h('button', {
                    id: props.key,
                }, props.text);
            },
        }
    });
}());

