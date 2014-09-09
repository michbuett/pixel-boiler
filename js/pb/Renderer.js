(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * An appliction module to render all view components
     * to the screen
     *
     * @class
     * @name pb.Renderer
     * @extends alchemy.core.MateriaPrima
     */
    alchemy.formula.add({
        name: 'pb.Renderer',
        extend: 'alchemy.core.MateriaPrima',
        overrides: {
            /** @lends arena.modules.Renderer.prototype */

            components: undefined,

            prepare: function () {
                this.component = alchemy('Collectum').brew();
                this.fpsEl = document.getElementById('fps');
            },

            update: alchemy.emptyFn,

            draw: function (params) {
                var args = [params];
                var views = this.entities.getComponent('view');
                var reactViews = this.entities.getComponent('reactview');

                if (views) {
                    views.each(this.drawView, this, args);
                }

                if (reactViews) {
                    reactViews.each(this.renderReactView, this, args);
                }

                this.fpsEl.innerHTML = 'FPS: ' + params.fps;
            },

            finish: alchemy.emptyFn,


            //
            //
            // private helper
            //
            //

            /** @private */
            drawView: function (view, index, params) {
                this.renderView(view);

                // // TODO: handle animations
                view.update(params);
            },

            /** @private */
            renderView: function (view) {
                if (view.el && !view.isDirty()) {
                    // no further rendering required
                    return;
                }

                // get the target (parent) dom element
                var target = view.target;
                if (alchemy.isString(target)) {
                    target = document.querySelector(target);
                }

                if (alchemy.isObject(target)) {
                    view.render(target);
                }
            },

            /** @private */
            renderReactView: function (view) {
                var component = this.components.get(view.id);
                if (component) {
                    return;
                }

                    var el = document.querySelector(view.target);
                    if (el) {
                        var cmpClass = React.createClass({
                            id: view.id,
                            displayName: 'CommentBox',
                            render: function() {
                                return (React.DOM.div({
                                    className: 'commentBox'
                                }, 'Hello, world! My name is: ' + this.props.name));
                            }
                        });

                        component = React.renderComponent(component({
                            name: 'FOO'
                        }), el);
                        cmp
                        view.target = null;
                    }

            }
        }
    });
}());
