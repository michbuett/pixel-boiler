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
            'pb.UI',
            'pb.State',

            'alchemy.web.Delegatus',

            // systems
            'alchemy.ecs.Apothecarius',
            'alchemy.ecs.ChildrenSystem',
            'alchemy.ecs.StateSystem',
            'alchemy.ecs.EventSystem',
            'alchemy.ecs.VDomRenderSystem',

            // controller
            'pb.controller.Palette',
        ],
    }, function (_super) {
        return {
            /** @lends pb.Application.prototype */

            constructor: function (cfg) {
                this.entities = alchemy('alchemy.ecs.Apothecarius').brew();
                this.delegator = alchemy('alchemy.web.Delegatus').brew();
                this.state = alchemy('pb.State').getInitialState();

                _super.constructor.call(this, cfg);

                this.initComponentSystems();
                this.initController();
                this.initUI();
            },

            /** @private */
            initComponentSystems: function () {
                alchemy.each([
                    'alchemy.ecs.StateSystem',
                    'alchemy.ecs.ChildrenSystem',
                    'alchemy.ecs.EventSystem',
                    'alchemy.ecs.VDomRenderSystem',
                ], function (name) {
                    this.addSystem(alchemy(name).brew({
                        entities: this.entities,
                        delegator: this.delegator,
                        messages: this.messages,
                    }));
                }, this);
            },

            /** @private */
            initController: function () {
                this.wireUp(alchemy('pb.controller.Palette').brew());
            },


            /** @private */
            initUI: function () {
                alchemy.each(alchemy('pb.UI').getEntityTypes(), function (name) {
                    this.defineEntityType(name, alchemy(name));
                }, this);

                this.entities.createEntity(alchemy('pb.UI').getRootEntity());
            },

            update: function (p) {
                _super.update.call(this, p);

                return p.state.set('fps', p.fps);
            },
        };
    });
};

