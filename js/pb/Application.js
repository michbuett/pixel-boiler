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

            // Entities
            'pb.Renderer',
            'pb.State',
            'pb.Entities',
            'pb.entities.Viewport',
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

                this.entities = alchemy('pb.Entities').brew();

                this.stateUpdater = alchemy('pb.State').brew({
                    entities: this.entities
                });

                this.renderer = alchemy('pb.Renderer').brew({
                    rootEntity: this.entities.createEntity('pb.entities.Viewport'),
                    entities: this.entities,
                    messages: this.messages,
                    delegator: alchemy('alchemy.web.Delegatus').brew(),
                });

                // alchemy.each([
                //     alchemy('pb.controller.Palette').brew()
                // ], this.wireUp, this);
            },

            finish: function () {
                alchemy.each(['entities', 'stateUpdater', 'renderer'], function (prop) {
                    this[prop].dispose();
                    this[prop] = null;
                }, this);
            },

            update: function (params) {
                var newState = params.state;

                newState = this.stateUpdater.update(newState);
                this.renderer.update(newState);

                return newState;
            },

            draw: function () {
                this.renderer.draw();
            },
        }
    });
}());

