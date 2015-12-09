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
    var SheetRenderSystem = require('./ui/SheetRenderSystem');

    return coquoVenenum({

        /** @protected */
        messages: undefined,

        /** @protected */
        admin: undefined,

        /** @protected */
        delegator: undefined,

        init: function (state) {
            this.initSystems();
            this.initEntities(state);
        },

        update: function (state) {
            return this.admin.update(state);
        },

        /** @protected */
        initEntities: function () {},

        //
        // private
        //

        /** @private */
        initSystems: function () {
            each([
                StateSystem,
                EventSystem,
                CssRenderSystem,
                VDomRenderSystem,
                SheetRenderSystem,

            ], function (System) {
                this.admin.addSystem(System.brew({
                    delegator: this.delegator,
                    messages: this.messages,
                    stylus: this.stylus,
                }));
            }, this);
        },

    }).whenBrewed(function () {
        this.delegator = Delegatus.brew();
        this.stylus = Stylus.brew();
        this.admin = Administrator.brew({
            repo: Apothecarius.brew()
        });
    });
}());
