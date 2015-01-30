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

        RenderContext.prototype.renderChild = function render(childEntityId) {
            var cfg = this._entityChildren[childEntityId];
            return this._renderer.renderEntity(childEntityId, cfg);
        };

        return {
            /** @lends pb.Renderer.prototype */

            entities: undefined,
            rootEntity: undefined,
            delegator: undefined,

            update: function () {
                this.renderEntity(this.rootEntity);
            },

            renderEntity: function (entityId, cfg) {
                if (!this.entities.exists(entityId)) {
                    cfg.id = entityId;
                    this.entities.createEntity(cfg.type, cfg);
                }

                var components = this.entities.getAllComponentsOfEntity(entityId);
                var view = components.view;
                var state = components.state || {};

                if (!view.current || state.current !== state.last) {
                    var context = new RenderContext(
                        this,
                        this.delegator,
                        entityId,
                        components.children
                    );

                    view.current = view.render(context, state.current);
                }

                return view.current;
            },

            draw: function () {
                var view = this.entities.getComponent(this.rootEntity, 'view');
                var oldTree = view.last || view.root;
                var newTree = view.current;
                var patches = diff(oldTree, newTree);

                view.root = patch(view.root, patches);
                view.last = view.current;
            },
        };
    });
};
