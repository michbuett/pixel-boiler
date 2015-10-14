module.exports = function (alchemy) {
    'use strict';

    var mainMenuButtons = {
        'new': 'New',
        'import': 'Import',
        'save': 'Save',
        'saveas': 'Save As',
        'settings': 'Settings',
    };

    var usedEntityTypes = [
        'core.ui.entities.Button',
        'core.ui.entities.MainMenu',
        'core.ui.entities.Palette',
        'core.ui.entities.PaletteItem',
        'core.ui.entities.SpriteList',
        'core.ui.entities.SpriteListItem',
        'core.ui.entities.Editor',
        'core.ui.entities.Preview',
        'core.ui.entities.CenterContainer',
        'core.ui.entities.Viewport',
    ];

    var entities = [{

        id: 'viewport',

        type: 'core.ui.entities.Viewport',

        children: {
            fps: {
                id: 'fps',

                globalToLocal: {
                    fps: 'fps',
                },

                state: {
                    fps: 60,
                },

                vdom: {
                    renderer: function (ctx) {
                        return ctx.h('div#' + ctx.entityId, 'FPS: ' + ctx.state.val('fps'));
                    },
                },
            },

            mainMenu: {
                id: 'mainMenu',
                type: 'core.ui.entities.MainMenu',
                children: alchemy.each(mainMenuButtons, function (text, key) {
                    return {
                        type: 'core.ui.entities.Button',
                        vdom: {
                            renderer: function (context) {
                                return context.h('a.button', {
                                    id: key,
                                    href: '#' + key,
                                }, text);
                            },
                        },
                        events: {
                            click: {
                                message: 'user:' + key
                            },
                        },
                    };
                }),
            },

            editor: {
                id: 'editorPane',
                type: 'core.ui.entities.CenterContainer',
                children: [{
                    type: 'core.ui.entities.Editor',
                }]
            },

            palette: {
                id: 'palette',
                type: 'core.ui.entities.Palette',
            },

            spriteList: {
                id: 'spriteList',
                type: 'core.ui.entities.SpriteList',
            },

            preview: {
                id: 'preview',
                type: 'core.ui.entities.CenterContainer',
                children: [{
                    type: 'core.ui.entities.Preview',
                }]
            }
        }
    }];

    alchemy.formula.add({
        name: 'core.ui.Main',
        requires: usedEntityTypes,

    }, function (_super) {
        return {
            /** @lends core.UI.prototype */

            getEntityTypes: function () {
                return usedEntityTypes;
            },

            getEntities: function () {
                return entities.concat([createSpriteListItems, createPaletteItems]);
            },
        };
    });

    function createSpriteListItems(state) {
        var sprites = state.sub('sheet').val('sprites');
        var result = {};

        alchemy.each(sprites, function (sprite, index) {
            var id = 'sprite-' + index;
            result[id] = {
                id: id,

                type: 'core.ui.entities.SpriteListItem',

                globalToLocal: {
                    'sheet.selected': 'selected',
                    'sheet.spriteWidth': 'width',
                    'sheet.spriteHeight': 'height',
                },

                state: {
                    index: index,
                    sprite: sprite,
                },
            };
        });

        return result;
    }

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
};
