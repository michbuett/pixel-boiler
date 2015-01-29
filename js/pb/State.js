(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.State
     */
    alchemy.formula.add({
        name: 'pb.State',

        overrides: function (_super) {
            return {
                entities: undefined,

                update: function (appState) {
                    var states = this.entities.getAllComponentsOfType('state');
                    states.each(function (entityState) {
                        if (entityState.update) {
                            entityState.last = entityState.current;
                            entityState.current = entityState.update(appState);
                        }
                    });

                    return appState;
                },
            };
        }
    });
}());

