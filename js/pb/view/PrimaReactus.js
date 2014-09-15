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

            component: undefined,
            componentDescriptor: undefined,

            getComponentDescriptor: function () {
                if (!this.componentDescriptor) {
                    this.componentDescriptor = React.createClass({
                        id: this.id,
                        render: this.renderComponent.bind(this)
                    });
                }
                return this.componentDescriptor;
            },

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
        },
    });
}());

