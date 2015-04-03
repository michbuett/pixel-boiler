module.exports = function (alchemy) {
    'use strict';

    var uiCfg = {
        type: 'pb.entities.Viewport',
        children: {
            fix: {
                mainMenu: {
                    id: 'mainMenu',
                    type: 'pb.entities.MainMenu',
                    children: {
                        fix: alchemy.each({
                            'new': 'New',
                            'open': 'Open',
                            'save': 'Save',
                            'saveas': 'Save As',
                            'settings': 'Settings',
                        }, function (text, key) {
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
                },

                palette: {
                    id: 'palette',
                    type: 'pb.entities.Palette',
                },
            },
        },
    };

    var usedEntityTypes = [
        'pb.entities.Button',
        'pb.entities.MainMenu',
        'pb.entities.Palette',
        'pb.entities.PaletteItem',
        'pb.entities.Viewport',
    ];

    alchemy.formula.add({
        name: 'pb.UI',
        requires: usedEntityTypes,

    }, function (_super) {
        return {
            /** @lends pb.UI.prototype */

            getEntityTypes: function () {
                return usedEntityTypes;
            },

            getRootEntity: function () {
                return uiCfg;
            },
        };
    });
};
