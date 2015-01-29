(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

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
            'alchemy.web.Delegatus',
        ],

        overrides: function (_super) {
            var virtualDom = alchemy('virtualDom');
            var h = virtualDom.h;
            var diff = virtualDom.diff;
            var patch = virtualDom.patch;

            /** @private */
            function delegateEvent(handlerName, eventName, node, delegator, components, messages) {
                var events = components.events;
                var handler = event && events[handlerName];
                var eventContext = {
                    sendMessage: function (msg, data) {
                        messages.trigger(msg, data);
                    },
                };

                delegator.delegate(node, eventName, function (eventObj) {
                    console.log('delegating ' + eventName + ' ...');
                    handler(eventObj, eventContext);
                });
            }

            /**
             * @class RenderContext
             * @private
             */
            function RenderContext(renderer, messages) {
                this.delegator = alchemy('alchemy.web.Delegatus').brew();
                this.renderer = renderer;
                this.messages = messages;
                this.entityId = null;
                this.entityComponents = null;
            }

            RenderContext.prototype.h = function hWrap(selector, cfg, children) {
                var node = h(selector, cfg, children);

                alchemy.each(node.properties.events, delegateEvent, this, [
                    node.properties,
                    this.delegator,
                    this.entityComponents,
                    this.messages,
                ]);

                node.properties.events = null;

                return node;
            };

            RenderContext.prototype.renderChild = function render(childEntityId) {
                var cfg = this.entityComponents.children[childEntityId];
                return this.renderer.renderEntity(childEntityId, cfg);
            };

            return {
                entities: undefined,
                rootEntity: undefined,
                delegator: undefined,
                messages: undefined,

                init: function () {
                    this.context = new RenderContext(this, this.messages);
                },

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
                        this.context.entityId = entityId;
                        this.context.entityComponents = components;
                        view.current = view.render(this.context, state.current);
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
        }
    });
}());
