(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.view.ViewPort
     */
    alchemy.formula.add({
        name: 'pb.entities.Viewport',

        requires: [
            'pb.entities.MainMenu',
            'pb.entities.Palette',
            'pb.view.Viewport',
        ],

        overrides: {
            /** @lends pb.entities.Viewport.prototype */

            getEntityDescriptor: function () {
                return {
                    children: {
                        mainMenu: {
                            type: 'pb.entities.MainMenu'
                        },

                        palette: {
                            type: 'pb.entities.Palette'
                        },
                    },

                    state: {
                        updateEntityStateFromAppState: function (entityState, appState) {
                            return appState.sub('orientation');
                        }
                    },

                    view: {
                        // render: alchemy('pb.view.Viewport').render,
                        potion: 'pb.view.Viewport',
                        root: document.getElementById('viewport'),
                    },
                };
            },
        }
    });
}());
