module.exports = function (alchemy) {
    'use strict';

    /**
     * An application module to render all view components
     * to the screen
     *
     * @class
     * @name pb.Renderer
     */
    alchemy.formula.add({
        name: 'pb.Renderer',
        requires: [
            'alchemy.vendor.virtualDom',
            'pb.EventDelegator',
        ],

    }, function (_super) {
        var virtualDom = alchemy('virtualDom');
        var h = virtualDom.h;
        var diff = virtualDom.diff;
        var patch = virtualDom.patch;

        /**
         * @class
         * @name RenderContext
         */
        function RenderContext(renderer, eventDelegator, id, children) {
            this._renderer = renderer;
            this._eventDelegator = eventDelegator;
            this._entityId = id;
            this._entityChildren = children;
        }

        RenderContext.prototype.h = function hWrap(selector, cfg, children) {
            var node = h(selector, cfg, children);

            node.properties = this._eventDelegator.delegateNodeEvents(
                node.properties,
                node.properties.events,
                this._entityId
            );
            node.properties.events = null;

            return node;
        };

        RenderContext.prototype.renderChild = function (entityId) {
            return this._renderer.renderEntity(entityId);
        };

        RenderContext.prototype.renderAllChildren = function () {
            var result = [];
            alchemy.each(this._entityChildren, function (cfg, entityId) {
                if (cfg && cfg.type) {
                    result.push(this._renderer.renderEntity(entityId));
                }
            }, this);
            return result;
        };

        return {
            /** @lends pb.Renderer.prototype */

            entities: undefined,
            rootEntity: undefined,
            delegator: undefined,

            update: function () {
                this.renderEntity(this.rootEntity);
            },

            draw: function () {
                var view = this.entities.getComponent(this.rootEntity, 'view');
                var oldTree = view.last || view.root;
                var newTree = view.current;
                var patches = diff(oldTree, newTree);

                view.root = patch(view.root, patches);
                view.last = view.current;
            },

            renderEntity: function (entityId) {
                var view = this.entities.getComponent(entityId, 'view');

                if (!view.current || stateHasChanded(entityId, this.entities)) {
                    var state = this.entities.getComponent(entityId, 'state') || {};
                    var children = this.entities.getComponent(entityId, 'children');
                    var context = new RenderContext(
                        this,
                        this.delegator,
                        entityId,
                        children
                    );

                    view.current = view.render(context, state.current);
                }

                return view.current;
            },
        };
    });

    function stateHasChanded(entityId, entities) {
        var state = entities.getComponent(entityId, 'state');
        if (state && state.last !== state.current) {
            return true;
        }

        var children = entities.getComponent(entityId, 'children');
        if (children) {
            for (var childId in children) {
                if (!children.hasOwnProperty(childId)) {
                    continue;
                }

                var cfg = children[childId];
                if (cfg && cfg.type && stateHasChanded(childId, entities)) {
                    return true;
                }
            }
        }

        return false;
    }
};
