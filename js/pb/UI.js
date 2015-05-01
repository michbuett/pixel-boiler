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
        'pb.entities.Button',
        'pb.entities.MainMenu',
        'pb.entities.Palette',
        'pb.entities.PaletteItem',
        'pb.entities.SpriteList',
        'pb.entities.SpriteListItem',
        'pb.entities.Editor',
        'pb.entities.Viewport',
    ];

    var entities = [{
        id: 'viewport',
        type: 'pb.entities.Viewport',
        children: {
            fps: {
                id: 'fps',
                state: {
                    globalToLocal: {
                        fps: 'fps',
                    },
                },
                vdom: {
                    renderer: 'pb.renderer.Text',
                    props: {
                        text: 'FPS: {fps}',
                    },
                },
            },

            mainMenu: {
                id: 'mainMenu',
                type: 'pb.entities.MainMenu',
                children: alchemy.each(mainMenuButtons, function (text, key) {
                    return {
                        type: 'pb.entities.Button',
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

            editorPane: {
                id: 'editorPane',
                type: 'pb.entities.Editor',
            },

            palette: {
                id: 'palette',
                type: 'pb.entities.Palette',
            },

            spriteList: {
                id: 'spriteList',
                type: 'pb.entities.SpriteList',
            },
        }
    }];

    alchemy.formula.add({
        name: 'pb.UI',
        requires: [
            'pb.renderer.Button',
            'pb.renderer.Container',
            'pb.renderer.Text',
        ].concat(usedEntityTypes),

    }, function (_super) {
        return {
            /** @lends pb.UI.prototype */

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
                type: 'pb.entities.SpriteListItem',

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
                type: 'pb.entities.PaletteItem',
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
