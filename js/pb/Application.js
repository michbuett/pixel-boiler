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

            // Component processors
            'pb.Entities',
            'pb.State',
            'pb.Children',
            'pb.EventDelegator',
            'pb.Renderer',

            // Entities
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
                this.stateUpdater = alchemy('pb.State').brew({ entities: this.entities });
                this.children = alchemy('pb.Children').brew({ entities: this.entities });

                var viewportId = this.entities.createEntity('pb.entities.Viewport');
                this.children.createChildrenOfEntity(viewportId);

                this.eventDelegator = alchemy('pb.EventDelegator').brew({
                    entities: this.entities,
                    messages: this.messages,
                });
                this.renderer = alchemy('pb.Renderer').brew({
                    rootEntity: viewportId,
                    entities: this.entities,
                    delegator: this.eventDelegator,
                });

                alchemy.each([
                    alchemy('pb.controller.Palette').brew({
                        entities: this.entities,
                    }),
                ], this.wireUp, this);
            },

            finish: function () {
                alchemy.each([
                    'entities',
                    'children',
                    'stateUpdater',
                    'eventDelegator',
                    'renderer'
                ], function (prop) {
                    this[prop].dispose();
                    this[prop] = null;
                }, this);
            },

            update: function (params) {
                var newState = this.stateUpdater.update(params.state);

                this.children.update();
                this.renderer.update();

                return newState;
            },

            draw: function () {
                this.renderer.draw();
            },
        }
    });
}());

