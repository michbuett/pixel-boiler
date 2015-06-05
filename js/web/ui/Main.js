module.exports = function (alchemy) {
    'use strict';

    var webEntities = [
        'web.ui.ImportButton',
    ];

    alchemy.formula.add({
        name: 'web.ui.Main',
        extend: 'core.ui.Main',
        requires: webEntities,

    }, function (_super) {
        return {
            /** @lends core.UI.prototype */

            getEntityTypes: function () {
                return _super.getEntityTypes.call(this).concat(webEntities);
            },

            getEntities: function () {
                var entities = _super.getEntities.call(this);

                entities[0].children.mainMenu.children = [{
                    type: 'core.entities.Button',
                    vdom: {
                        props: {
                            key: 'btn-new',
                            text: 'New',
                        }
                    },
                }, {
                    type: 'web.ui.ImportButton',
                }, {
                    type: 'core.entities.Button',
                    vdom: {
                        props: {
                            key: 'btn-export',
                            text: 'Export',
                        }
                    },
                }, {
                    type: 'core.entities.Button',
                    vdom: {
                        props: {
                            key: 'btn-settings',
                            text: 'Settings',
                        }
                    },
                }];

                return entities;
            },
        };
    });
};
