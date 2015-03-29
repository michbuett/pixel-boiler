(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.renderer.Button
     */
    alchemy.formula.add({
        name: 'pb.renderer.Button',
        overrides: {
            /** @lends pb.renderer.Button.prototype */

            render: function (context) {
                var props = context.props;

                return context.h('button', {
                    id: props.key,
                }, props.text);
            },
        }
    });
}());

