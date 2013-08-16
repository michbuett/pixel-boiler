(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The controller of the preview area
     *
     * @class
     * @name pb.controller.Preview
     * @extends pb.controller.Prima
     */
    alchemy.formula.add({
        name: 'pb.controller.Preview',
        extend: 'pb.controller.Prima',
        overrides: {
            /** @lends pb.controller.Preview.prototype */


        }
    });
}());
