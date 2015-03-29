module.exports = function (alchemy) {
    'use strict';

    /**
     * Description
     *
     * @class
     * @name pb.Application
     * @extends alchemy.ecs.Applicatus
     */
    alchemy.formula.add({
        name: 'pb.Application',
        extend: 'alchemy.ecs.Applicatus',

        requires: [
            // systems
            'alchemy.ecs.Apothecarius',
            'alchemy.ecs.StaticChildrenSystem',
            'alchemy.ecs.StateSystem',
            'alchemy.ecs.EventSystem',
            'alchemy.ecs.VDomRenderSystem',

            'alchemy.web.Delegatus',

            'pb.UI',
        ],
    }, function (_super) {
        return {
            /** @lends pb.Application.prototype */

            constructor: function (cfg) {
                this.entities = alchemy('alchemy.ecs.Apothecarius').brew();
                this.delegator = alchemy('alchemy.web.Delegatus').brew();
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

                _super.constructor.call(this, cfg);

                alchemy.each([
                    'alchemy.ecs.StaticChildrenSystem',
                    'alchemy.ecs.StateSystem',
                    'alchemy.ecs.EventSystem',
                    'alchemy.ecs.VDomRenderSystem',
                ], function (name) {
                    this.addSystem(alchemy(name).brew({
                        entities: this.entities,
                        delegator: this.delegator,
                        messages: this.messages,
                    }));
                }, this);

                alchemy.each(alchemy('pb.UI').getEntityTypes(), function (name) {
                    this.defineEntityType(name, alchemy(name));
                }, this);

                this.entities.createEntity(alchemy('pb.UI').getRootEntity());
            },
        };
    });
};

