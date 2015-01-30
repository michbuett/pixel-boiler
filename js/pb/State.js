(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.State
     */
    alchemy.formula.add({
        name: 'pb.State',

        requires: [
            'alchemy.core.Immutatio',
        ],

        overrides: function (_super) {
            return {
                entities: undefined,

                update: function (appState) {
                    var states = this.entities.getAllComponentsOfType('state');
                    states.each(function (stateComponent) {
                        var entityState = stateComponent.current || alchemy('Immutatio').makeImmutable(
                            stateComponent.initial
                        );

                        stateComponent.last = stateComponent.current;
                        stateComponent.current = entityState;

                        if (stateComponent.updateEntityStateFromAppState) {
                            stateComponent.current = stateComponent.updateEntityStateFromAppState(
                                entityState,
                                appState
                            );
                        }

                        if (stateComponent.updateAppStateFromEntityState) {
                            appState = stateComponent.updateAppStateFromEntityState(
                                entityState,
                                appState
                            );
                        }
                    });

                    return appState;
                },
            };
        }
    });
}());

