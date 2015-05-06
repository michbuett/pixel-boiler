module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'core.entities.Button',
        requires: ['core.renderer.Button']
    }, {
        getComponents: function () {
            return {
                vdom: {
                    renderer: 'core.renderer.Button',
                }
            };
        },
    });
};
