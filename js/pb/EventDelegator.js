module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name pb.EventDelegator
     */
    alchemy.formula.add({
        name: 'pb.EventDelegator',
        requires: ['alchemy.web.Delegatus'],
    }, function (_super) {
        return {
            /** @lends pb.EventDelegator.prototype */

            /**
             * @property messages
             * @type alchemy.core.Observari
             */
            messages: undefined,

            /**
             * @property entities
             * @type pb.Entities
             */
            entities: undefined,

            /** @protected */
            init: function () {
                /**
                 * @property delegatus
                 * @type alchemy.web.Delegatus
                 */
                this.delegatus = alchemy('alchemy.web.Delegatus').brew();

                var messages = this.messages;

                /**
                 * @private
                 */
                this.sendMessage = function (msg, data) {
                    messages.trigger(msg, data);
                };
            },

            dispose: function () {
                this.delegatus.dispose();
                this.delegatus = null;
                this.sendMessage = null;
                this.messages = null;
                this.entities = null;

                _super.dispose.call(this);
            },

            /**
             * Delegates the events of a entity's dom node to the registered event
             * handlers
             *
             * @param {Object} node The dom node (or an equivalent representation)
             *      The node has to provide a property named <code>events</code>
             *      which contains a event-handler-map
             *      NOTICE: the will be modified by the dom delegator
             *
             * @param {Object} events The mapping event name to handler name
             *
             * @param {String} entityId The entity's id
             *
             * @return The modified dom node
             */
            delegateNodeEvents: function (node, events, entityId) {
                if (!events) {
                    return node;
                }

                var eventHandlers = this.entities.getComponent(entityId, 'events');
                var state = this.entities.getComponent(entityId, 'state') || {};

                alchemy.each(events, function (handlerName, eventName) {
                    var handler = eventHandlers[handlerName];
                    var delegateHandler = eventHandlers['_delegate_' + handlerName];
                    var sendMessage = this.sendMessage;

                    if (!delegateHandler) {
                        delegateHandler = function (e) {
                            // console.log('delegate event "' + eventName + '" to "' + handlerName + '"...');
                            handler.call(events, e, {
                                sendMessage: sendMessage,
                                state: state.current,
                            });
                        };

                        eventHandlers['_delegate_' + handlerName] = delegateHandler;
                    }

                    this.delegatus.delegate(node, eventName, delegateHandler);
                }, this);

                return node;
            },
        };
    });
};
