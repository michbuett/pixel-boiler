module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');
    var each = require('pro-singulis');

    var Administrator = require('alchemy.js/lib/Administrator');
    var Apothecarius = require('alchemy.js/lib/Apothecarius');
    var Delegatus = require('alchemy.js/lib/Delegatus');
    var Stylus = require('alchemy.js/lib/Stylus');
    var StateSystem = require('alchemy.js/lib/StateSystem');
    var EventSystem = require('alchemy.js/lib/EventSystem');
    var CssRenderSystem = require('alchemy.js/lib/CssRenderSystem');
    var VDomRenderSystem = require('alchemy.js/lib/VDomRenderSystem');

    var Viewport = require('./ui/Viewport');

    return coquoVenenum({

        messages: undefined,

        admin: undefined,

        delegator: undefined,

        init: function (state) {
            this.initSystems();
            this.initEntityTypes();
            this.initEntities(state);
        },

        update: function (state) {
            return this.admin.update(state);
        },

        //
        // private
        //

        /** @private */
        initSystems: function () {
            // register UI relevant systems
            this.admin.addSystem(StateSystem.brew());
            this.admin.addSystem(EventSystem.brew({
                delegator: this.delegator,
                messages: this.messages,
            }));
            this.admin.addSystem(CssRenderSystem.brew({
                stylus: this.stylus,
            }));
            this.admin.addSystem(VDomRenderSystem.brew({
                delegator: this.delegator,
                messages: this.messages,
            }));
        },

        /** @private */
        initEntityTypes: function () {
            each({
                'pb.ui.Viewport': Viewport,
            }, function (defaultValues, entity) {
                this.admin.setEntityDefaults(entity, defaultValues);
            }, this);
        },

        /** @private */
        initEntities: function (state) {
            this.admin.initEntities([{
                type: 'pb.ui.Viewport',
                id: 'viewport',
                vdom: {
                    root: document.getElementById('viewport'),
                },

            }], state);
        },

    }).whenBrewed(function () {
        this.delegator = Delegatus.brew();
        this.stylus = Stylus.brew();
        this.admin = Administrator.brew({
            repo: Apothecarius.brew()
        });
    });
}());
