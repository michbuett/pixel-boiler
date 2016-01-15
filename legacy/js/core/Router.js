module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.define('core.Router', [
        'alchemy.core.MateriaPrima',

    ], function (MateriaPrima) {

        return alchemy.extend(MateriaPrima, {

            routes: {
                '#import': 'import',
            },

            /**
             * @param Immutable appState The current application state
             * @return Immutable The new application state
             */
            update: function (appState) {
                return appState.set('route', this.getRoute());
            },

            /** @private */
            getRoute: function () {
                return this.routes[window.location.hash] || 'main';
            },
        });
    });
};
