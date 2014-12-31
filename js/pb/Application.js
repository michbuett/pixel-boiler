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
            'pb.controller.Palette',
            // views
            'pb.view.ViewPort',
        ],

        overrides: {
            /** @lends pb.Application.prototype */

            init: function () {
                this.state = alchemy('Immutatio').makeImmutable({
                    orientation: 'landscape',
                    colors: {
                        selected: '#000000',
                        palette: [
                            '#000000', '#404040', '#A0A0A0', '#FFFFFF',
                            '#FF0000', '#00FF00', '#0000FF',
                        ],
                    }
                });

                this.viewport = alchemy('pb.view.ViewPort').brew({
                    messages: this.messages,
                    root: document.getElementById('viewport'),
                });

                alchemy.each([
                    alchemy('pb.controller.Palette').brew()
                ], this.wireUp, this);
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

