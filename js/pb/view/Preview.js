(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The view of the preview area
     *
     * @class
     * @name pb.view.Preview
     * @extends pb.view.Prima
     */
    alchemy.formula.add({
        name: 'pb.view.Preview',
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.Preview.prototype */

            templateId: 'tpl-preview'
        }
    });
}());
