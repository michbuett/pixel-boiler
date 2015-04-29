module.exports = function (alchemy) {
    'use strict';

    var systems = [
        'alchemy.ecs.StateSystem',
        'alchemy.ecs.EventSystem',
        'alchemy.ecs.VDomRenderSystem',
        'alchemy.ecs.CssRenderSystem',
    ];

    var controller = [
        'pb.controller.Palette',
        'pb.controller.Sheet',
    ];

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
            'pb.UI',
            'pb.State',
            'pb.lib.Sheet',
            'alchemy.ecs.Administrator',
            'alchemy.ecs.Apothecarius',
            'alchemy.web.Delegatus',
        ].concat(systems, controller),

    }, function (_super) {
        return {
            /** @lends pb.Application.prototype */

            constructor: function (cfg) {
                this.entityAdmin = alchemy('alchemy.ecs.Administrator').brew({
                    repo: alchemy('alchemy.ecs.Apothecarius').brew(),
                });

                this.delegator = alchemy('alchemy.web.Delegatus').brew();

                this.state = alchemy('pb.State').getInitialState();

                _super.constructor.call(this, cfg);

                this.initComponentSystems();
                this.initController();
                this.initUI();
                this.initSheet();
            },

            /** @private */
            initComponentSystems: function () {
                alchemy.each(systems, function (name) {
                    this.entityAdmin.addSystem(alchemy(name).brew({
                        delegator: this.delegator,
                        messages: this.messages,
                    }));
                }, this);
            },

            /** @private */
            initController: function () {
                alchemy.each(controller, function (name) {
                    this.wireUp(alchemy(name).brew());
                }, this);
            },

            /** @private */
            initUI: function () {
                var ui = alchemy('pb.UI').brew();
                alchemy.each(ui.getEntityTypes(), function (name) {
                    this.entityAdmin.defineEntityType(name, alchemy(name));
                }, this);

                this.entityAdmin.initEntities(ui.getEntities(), this.state);
            },

            /** @private */
            initSheet: function () {
                var sheeData = this.state.sub('sheet');
                var messages = this.messages;

                alchemy('pb.lib.Sheet').createSpriteSheet({
                    spriteWidth: sheeData.val('spriteWidth'),
                    spriteHeight: sheeData.val('spriteHeight'),
                    columns: sheeData.val('columns'),
                    rows: sheeData.val('rows'),
                    callback: function (result) {
                        messages.trigger('sheet:updated', result);
                    }
                });
            },

            /** @override */
            update: function (p) {
                this.entityAdmin.update(p.state);

                return p.state.set('fps', p.fps)
                    .set('windowWidth', document.body.offsetWidth)
                    .set('windowHeight', document.body.offsetHeight);
            },
        };
    });
};

