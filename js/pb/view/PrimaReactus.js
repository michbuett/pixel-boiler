(function () {
    'use strict';

    var alchemy = require('./alchemy.js');

    /**
     * The mother of all views which visualize data using HTML and the DOM;
     * It provides methods for rendering and delegating DOM events;
     * NOTICE: This potion heavily depends on jQuery;
     *
     * @class
     * @name pb.view.PrimaReactus
     * @extends alchemy.core.MateriaPrima
     */
    alchemy.formula.add({
        name: 'pb.view.PrimaReactus',
        ingredients: {
            'observable': 'alchemy.core.Observari',
            'observer': 'alchemy.core.Oculus',
        },
        overrides: {
            /** @lends pb.view.PrimaReactus.prototype */

            /**
             * @private
             */
            component: undefined,

            /**
             * @private
             */
            componentDescriptor: undefined,

            /**
             * Creates the render function for the ReactComponent
             * NOTICE: the create method is executed in the context of the
             *         potion but the created render method will be bound
             *         to the ReactComponent
             *
             * @return function
             *      The render function of the ReactComponent
             */
            createReactRenderer: alchemy.emptyFn,

            /**
             * @return function
             *      The factory method (descriptor) to create the ReactComponent
             */
            getComponentDescriptor: function () {
                if (!this.componentDescriptor) {
                    var state = alchemy.mix({}, this.state);

                    this.componentDescriptor = React.createClass({
                        id: this.id,
                        render: this.createReactRenderer(),
                        getInitialState: function getInitialState() {
                            return state;
                        },
                    });
                }
                return this.componentDescriptor;
            },

            /**
             * @return object
             *      The current potion for chaining
             */
            render: function (target) {
                if (!target) {
                    // no valid target dom node
                    // -> exit
                    return;
                }

                if (this.component) {
                    // already rendered
                    // -> exit
                    return;
                }

                var descriptor = this.getComponentDescriptor();
                this.component = React.renderComponent(descriptor(null), target);
                return this;
            },

            setState: function (newState) {
                this.state = newState;

                if (this.component) {
                    this.component.setState(newState);
                }
                return this;

            },

            isRendered: function () {
                if (this.component) {
                    return this.component.isMounted();
                }
                return false;
            }
        },
    });
}());

