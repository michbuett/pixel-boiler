(function () {
    'use strict';

    var alchemy = require('./alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.Application
     * @extends alchemy.web.Applicatus
     */
    alchemy.formula.add({
        name: 'pb.Application',
        extend: 'alchemy.web.Applicatus',

        requires: [
            // controller
            // views
            'pb.view.ViewPort',
        ],

        overrides: {
            /** @lends pb.Application.prototype */

            init: function () {
                this.state = alchemy('Immutatio').makeImmutable({
                    orientation: 'landscape'
                });

                this.viewport = alchemy('pb.view.ViewPort').brew({
                    messages: this.messages,
                    root: document.getElementById('viewport'),
                });
            },

            finish: function () {
                this.viewport.dispose();
                this.viewport = null;
            },

            update: function (params) {
                var newState = params.state;
                return newState;
            },

            draw: function () {
                this.viewport.draw(this.state);
            },
        }
    });
}());

