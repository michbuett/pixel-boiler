module.exports = function (alchemy) {
    'use strict';

    var defaultValues = {
        fps: 60,
        orientation: 'landscape',
        colors: {
            selected: '#000000',
            palette: [
                '#000000', '#222034', '#45283c', '#663931',
                '#8f563b', '#df7126', '#d9a066', '#eec39a',
                '#fbf236', '#99e550', '#6abe30', '#37946e',
                '#4b692f', '#524b24', '#323c39', '#3f3f74',
                '#306082', '#5b6ee1', '#639bff', '#5fcde4',
                '#cbdbfc', '#ffffff', '#9badb7', '#847e87',
                '#696a6a', '#595652', '#76428a', '#ac3232',
                '#d95763', '#d77bba', '#8f974a', '#8a6f30',
            ],
        },
    };

    alchemy.formula.add({
        name: 'pb.State',
        requires: [
            'alchemy.core.Immutatio',
        ],

    }, {
        /** @lends pb.State.prototype */

        getInitialState: function () {
            return alchemy('Immutatio').makeImmutable(defaultValues);
        },
    });
};
