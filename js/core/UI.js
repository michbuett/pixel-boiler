module.exports = function (alchemy) {
    'use strict';

    var mainMenuButtons = {
        'new': 'New',
        'open': 'Open',
        'save': 'Save',
        'saveas': 'Save As',
        'settings': 'Settings',
    };

    var usedEntityTypes = [
        'core.entities.Button',
        'core.entities.MainMenu',
        'core.entities.Palette',
        'core.entities.PaletteItem',
        'core.entities.SpriteList',
        'core.entities.SpriteListItem',
        'core.entities.Editor',
        'core.ui.preview.Entity',
        'core.ui.components.CenterContainer',
        'core.entities.Viewport',
    ];

    var entities = [{
        id: 'viewport',
        type: 'core.entities.Viewport',
        children: {
            fps: {
                id: 'fps',
                state: {
                    globalToLocal: {
                        fps: 'fps',
                    },
                },
                vdom: {
                    renderer: 'core.renderer.Text',
                    props: {
                        text: 'FPS: {fps}',
                    },
                },
            },

            mainMenu: {
                id: 'mainMenu',
                type: 'core.entities.MainMenu',
                children: alchemy.each(mainMenuButtons, function (text, key) {
                    return {
                        type: 'core.entities.Button',
                        vdom: {
                            props: {
                                key: 'btn-' + key,
                                text: text,
                            }
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
                type: 'core.ui.components.CenterContainer',
                children: [{
                    type: 'core.entities.Editor',
                }]
            },

            palette: {
                id: 'palette',
                type: 'core.entities.Palette',
            },

            spriteList: {
                id: 'spriteList',
                type: 'core.entities.SpriteList',
            },

            preview: {
                id: 'preview',
                type: 'core.ui.components.CenterContainer',
                children: [{
                    type: 'core.ui.preview.Entity',
                }]
            }
        }
    }];

    alchemy.formula.add({
        name: 'core.UI',
        requires: [
            'core.renderer.Button',
            'core.renderer.Container',
            'core.renderer.Text',
        ].concat(usedEntityTypes),

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
                type: 'core.entities.SpriteListItem',

                state: {
                    initial: {
                        index: index,
                        sprite: sprite,
                    },

                    globalToLocal: {
                        'sheet.selected': 'selected',
                        'sheet.spriteWidth': 'width',
                        'sheet.spriteHeight': 'height',
                    }
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
                type: 'core.entities.PaletteItem',
                state: {
                    initial: {
                        index: i,
                        color: palette[i],
                        selected: selected,
                    },

                    globalToLocal: globalToLocal,
                },
            };
        }

        return result;
    }
};
