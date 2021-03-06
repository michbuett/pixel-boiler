module.exports = (function () {
    'use strict';

    var immutable = require('immutabilis');
    var Utils = require('alchemy.js/lib/Utils');

    var defaultValues = {
        fps: 60,
        windowWidth: 800,
        windowHeight: 600,

        mode: 'main',

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

        sheet: {
            selected: 0,
            sprites: [],
            spriteWidth: 32,
            spriteHeight: 32,
            columns: 4,
            rows: 1,
        },
    };

    return {
        /** @lends core.State.prototype */

        /**
         * @return Immutable The initial application state
         */
        getInitialState: function () {
            var initialState = Utils.mix({}, defaultValues, {
                windowWidth: document.body.offsetWidth,
                windowHeight: document.body.offsetHeight,
            });

            return immutable.fromJS(initialState);
        },
    };
}());
