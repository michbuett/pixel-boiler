module.exports = function (alchemy) {
    'use strict';

    var systems = [
        'alchemy.ecs.StateSystem',
        'alchemy.ecs.EventSystem',
        'alchemy.ecs.VDomRenderSystem',
        'alchemy.ecs.CssRenderSystem',
        'core.SheetRenderSystem',
    ];

    var controller = [
        'core.controller.Palette',
        'core.controller.Sheet',
        'core.controller.Editor',
    ];

    /**
     * Description
     *
     * @class
     * @name core.Application
     * @extends alchemy.web.Applicatus
     */
    alchemy.formula.add({
        name: 'core.Application',
        extend: 'alchemy.web.Applicatus',

        requires: [
            'core.State',
            'core.Router',
            'core.lib.Sheet',
            'alchemy.ecs.Administrator',
            'alchemy.ecs.Apothecarius',
            'alchemy.web.Delegatus',
        ].concat(systems, controller),

    }, function (_super) {
        return {
            /** @lends core.Application.prototype */

            constructor: function (cfg) {

                /**
                 * The UI configuration
                 *
                 * @property ui
                 * @type Object
                 */
                this.ui = undefined;

                this.entityAdmin = alchemy('alchemy.ecs.Administrator').brew({
                    repo: alchemy('alchemy.ecs.Apothecarius').brew(),
                });

                this.delegator = alchemy('alchemy.web.Delegatus').brew();

                this.state = alchemy('core.State').getInitialState();

                this.router = alchemy('core.Router').brew();

                _super.constructor.call(this, cfg);

                this.initComponentSystems();
                this.initController();
                this.initUI(this.ui);
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
            initUI: function (ui) {
                alchemy.each(ui.getEntityTypes(), function (name) {
                    this.entityAdmin.setEntityDefaults(name, alchemy(name));
                }, this);

                this.entityAdmin.initEntities(ui.getEntities(), this.state);
            },

            /** @private */
            initSheet: function () {
                var sheeData = this.state.sub('sheet');
                var messages = this.messages;

                alchemy('core.lib.Sheet').createSpriteSheet({
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
                var state = this.router.update(p.state);

                this.entityAdmin.update(state);

                return state.set('fps', p.fps)
                    .set('windowWidth', document.body.offsetWidth)
                    .set('windowHeight', document.body.offsetHeight);
            },
        };
    });
};

