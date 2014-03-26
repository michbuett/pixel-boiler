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

            prepare: function () {
                this.$fpsEl = $('#fps');
            },

            update: alchemy.emptyFn,

            draw: function (params) {
                var views = this.entities.getComponent('view');
                if (views) {
                    views.each(this.drawView, this, [params]);
                }

                this.$fpsEl.html('FPS: ' + params.fps);

                // for more detailed FPS debugging
                // this.$fpsEl.html([
                //     'FPS: ' + params.fps,
                //     'Delay: ' + params.delay,
                //     'Frame: ' + params.frame,
                // ].join('<br>'));
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
            }
        }
    });
}());
