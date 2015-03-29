module.exports = function (alchemy) {
    'use strict';

    var uiCfg = {
        type: 'pb.entities.Viewport',
        staticChildren: {
            mainMenu: {
                id: 'mainMenu',
                type: 'pb.entities.MainMenu',
                staticChildren: alchemy.each({
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

            palette: {
                id: 'palette',
                type: 'pb.entities.Palette'
            },
        },
    };

    var usedEntityTypes = alchemy.unique(findEntityTypes(uiCfg));

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

    function findEntityTypes(cfg) {
        var result = [];
        if (cfg.type) {
            result.push(cfg.type);
        }

        if (cfg.staticChildren) {
            alchemy.each(cfg.staticChildren, function (childCfg) {
                result = result.concat(findEntityTypes(childCfg));
            });
        }

        return result;
    }
};
