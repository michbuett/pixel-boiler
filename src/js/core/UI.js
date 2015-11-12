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

    var Button = require('./ui/Button');
    var CenterContainer = require('./ui/CenterContainer');
    var Editor = require('./ui/Editor');
    var ImportDialog = require('./ui/ImportDialog');
    var MainMenu = require('./ui/MainMenu');
    var Palette = require('./ui/Palette');
    var PaletteItem = require('./ui/PaletteItem');
    var Preview = require('./ui/Preview');
    var SpriteList = require('./ui/SpriteList');
    var SpriteListItem = require('./ui/SpriteListItem');
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

        /** @private */
        initEntityTypes: function () {
            each({
                'core.ui.entities.Button': Button,
                'core.ui.entities.CenterContainer': CenterContainer,
                'core.ui.entities.Editor': Editor,
                'core.ui.entities.MainMenu': MainMenu,
                'core.ui.entities.ImportDialog': ImportDialog,
                'core.ui.entities.Palette': Palette,
                'core.ui.entities.PaletteItem': PaletteItem,
                'core.ui.entities.Preview': Preview,
                'core.ui.entities.SpriteList': SpriteList,
                'core.ui.entities.SpriteListItem': SpriteListItem,
                'core.ui.entities.Viewport': Viewport,

            }, function (defaultValues, entity) {
                this.admin.setEntityDefaults(entity, defaultValues);
            }, this);
        },

        /** @private */
        initEntities: function (state) {
            this.admin.initEntities([{
                type: 'core.ui.entities.Viewport',
                id: 'viewport',
                vdom: {
                    root: document.getElementById('viewport'),
                },

            }, createPaletteItems], state);
        },

    }).whenBrewed(function () {
        this.delegator = Delegatus.brew();
        this.stylus = Stylus.brew();
        this.admin = Administrator.brew({
            repo: Apothecarius.brew()
        });
    });

    function createPaletteItems(state) {
        var colors = state.sub('colors');
        var palette = colors.val('palette');
        var selected = colors.val('selected');
        var result = {};

        for (var i = 0, l = palette.length; i < l; i++) {
            var id = 'color-' + i;
            var globalToLocal = {
                'colors.selected': 'selected'
            };

            globalToLocal['colors.palette.' + i] = 'color';

            result[id] = {
                id: id,

                type: 'core.ui.entities.PaletteItem',

                globalToLocal: globalToLocal,

                state: {
                    index: i,
                    color: palette[i],
                    selected: selected,
                },
            };
        }

        return result;
    }
}());
