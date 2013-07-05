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

            prepare: alchemy.emptyFn,

            update: alchemy.emptyFn,

            draw: function (params) {
                var views = this.entities.getComponent('view');
                if (views) {
                    views.each(this.updateView, this, [params]);
                }
            },

            finish: alchemy.emptyFn,

            updateView: function (view, index, params) {
                this.renderView(view);

                var entityPos = this.entities.getComponent('position', view.id);
                if (entityPos) {
                    view.lastPos = view.lastPos || {};
                    this.updateViewPos(view, entityPos, view.lastPos);
                }

                view.update(params);
            },

            updateViewPos: function (view, currentPos, lastPos) {
                var currX = currentPos.x;
                var currY = currentPos.y;
                var lastX = lastPos.x;
                var lastY = lastPos.y;
                var currDir = currentPos.direction;
                var lastDir = lastPos.direction;

                if (currDir >= 0 && currDir !== lastDir) {
                    var cssRotate = 270 - currDir;
                    view.$el.css('transform', 'rotate(' + cssRotate + 'deg) translate3d(0, 0, 0)');
                    lastPos.direction = currDir;
                }

                if (currX !== lastX || currY !== lastY) {
                    view.moveTo(currX, currY);
                    lastPos.x = currX;
                    lastPos.y = currY;
                }
            },

            renderView: function (view) {
                if (view.rendered && view.dirty !== true) {
                    // no further rendering required
                    return;
                }

                // get the target (parent) dom element
                var target = view.parent;
                if (alchemy.isString(target)) {
                    target = $(target)[0];
                    view.parent = target;
                }

                if (alchemy.isObject(target)) {
                    target.insertAdjacentHTML('beforeend', view.render([]).join(''));
                    view.setEl(target.children[target.children.length - 1]);
                    view.dirty = false;
                    view.rendered = true;
                    view.trigger('rendered');
                }
            }
        }
    });
}());
