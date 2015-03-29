module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.entities.Button',
        requires: ['pb.renderer.Button']
    }, {
        getComponents: function () {
            return {
                vdom: {
                    renderer: 'pb.renderer.Button',
                }
            };
        },
    });
};
