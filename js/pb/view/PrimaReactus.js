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
            componentClass: undefined,

            getComponent: function () {
                if (!this.component) {
                    var cmpClass = this.getComponentClass();
                    this.component = cmpClass(null);
                }
                return this.component;
            },

            getComponentClass: function () {
                if (!this.componentClass) {
                    //this.component = React.createClass(this);
                    this.componentClass = React.createClass({
                        displayName: 'CommentBox',
                        render: function() {
                            return (React.DOM.div({
                                className: 'commentBox'
                            }, 'Hello, world! I am a CommentBox.'));
                        }
                    });
                }
                return this.componentClass;
            },
        },
    });
}());

