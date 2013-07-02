(function () {
    'use strict';

    var alchemy = require('./alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.Application
     * @extends alchemy.browser.Application
     */
    alchemy.formula.add({
        name: 'pb.Application',
        extend: 'alchemy.browser.Application',

        requires: [
        ],

        overrides: {
            /** @lends pb.Application.prototype */

            config: undefined,

            modules: undefined,

            prepare: function () {
                console.log('Preparing...');
            },

            finish: function () {
                console.log('Finishing...');
            }
        }
    });
}());

