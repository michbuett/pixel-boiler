(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The view for the color palette
     *
     * @class
     * @name pb.view.MainMenu
     * @extends pb.view.PrimaReactus
     */
    alchemy.formula.add({
        name: 'pb.view.MainMenu',
        extend: 'pb.view.PrimaReactus',
        overrides: {
            /** @lends pb.view.Palette.prototype */

            render: function () {
                return React.DOM.h1(null, 'Hello, world!');
            },
        }
    });
}());

