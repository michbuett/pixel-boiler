/*global $*/
(function () {
    'use strict';

    var alchemy = require('./alchemy.js');

    /**
     * Description
     *
     * @class alchemy.browser.View
     * @extends Oculus
     */
    alchemy.formula.add({
        name: 'pb.view.Prima',
        extend: 'alchemy.core.Oculus',
        overrides: {
            /** @lends pb.view.Prima.prototype */

            dirty: true,

            el: undefined,

            template: '<div id="<$=data.id$>"></div>',

            /**
             * Returns the data to fill the {@link template}
             * @return {Object} The data object
             * @protected
             */
            getData: function () {
                return {
                    id: this.id,
                };
            },

            refresh: function () {
                this.dirty = true;
            },

            isDirty: function () {
                return this.dirty;
            },

            /**
             * Renders the view to the given html element
             *
             * @param {Object} html The parent html element
             * @return {Object} The current view instance for chaining
             */
            render: function (html) {
                html.innerHTML = alchemy.render(this.template, this.getData());
                this.dirty = false;
                this.trigger('rendered', {
                    view: this,
                    target: html,
                });
                return this;
            },

            /**
             * Sets the views target element; A view cannot delegate the dom
             * events without a valid target element
             *
             * @param {Object} el The parent html element; use <code>null</code> or
             *      <code>undefined</code> to decouple the view from the dom
             * @return {Object} The current view instance for chaining
             */
            setEl: (function () {
                return function (el) {
                    if (el !== this.el) {
                        // the target element has changed
                        // -> remove old references...
                        if (this.$el) {
                            this.$el.off('.' + this.id); // clean old event handler
                            this.$el.html(''); // clean DOM
                            this.$el = null;
                        }
                        // ...and attach new ones
                        if (el) {
                            // cache the jquery object
                            this.$el = $(el);
                            // delegate listeners to dom events
                            this.delegateAllDomEvents();
                        }
                        this.el = el;
                    }
                    return this;
                };
            }()),

            update: alchemy.emptyFn,

            /**
             * Adds a listener for to an event
             * Overrides the superclass to allow adding dom events
             *
             * @function
             * @param {String} event The event name; Dom events can contain a filter
             *      wich is separated with a space (e.g. <code>"click div.my-class"</code>)
             * @param {Function} handler The event handler method
             * @param {Object} scope The execution scope for the event handler
             * @return {Object} The currente view instance for chaining
             *
             * @example
             * view.on('mouseover', this.onHover, this);
             * view.on('click button.my-save-button', this.saveButtonHandler, this);
             */
            on: alchemy.override(function (_super) {
                return function (event, handler, scope) {
                    _super.call(this, event, handler, scope);

                    if (this.$el) {
                        this.delegateDomEvent(event, handler, scope);
                    }
                    return this;
                };
            }),

            /**
             * Removes a listener for from an event
             * Overrides superclass to remove listeners from dom elements
             *
             * @function
             * @param {String} event The event name
             * @param {Function} handler The event handler method
             * @param {Object} scope The execution scope for the event handler
             * @return {Object} The currente view instance for chaining
             */
            off: alchemy.override(function (_super) {
                return function (event, handler, scope) {
                    _super.call(this, event, handler, scope);

                    if (this.$el) {
                        // remove all old listeners because we cannot know which
                        // listener will remain
                        this.$el.off('.' + this.id);
                        // re-attach remaining listeners
                        this.delegateAllDomEvents();
                    }
                    return this;
                };
            }),

            /**
             * Adds a single listener to a dom object
             * @function
             * @private
             */
            delegateDomEvent: (function () {
                var splitter = /\s+/;
                return function (event, handler, scope) {
                    var split = event.split(splitter);
                    var eventName = split.shift() + '.' + this.id;
                    var selector = split.join(' ');
                    var boundHandler = handler.bind(scope);

                    this.$el.on(eventName, selector, boundHandler);
                };
            }()),

            /**
             * Adds all registered listeners to the current dom object
             * @function
             * @private
             */
            delegateAllDomEvents: (function () {
                // helper to process all listeners for a single event
                var delegateListenersForEvent = function (listeners, eventName) {
                    alchemy.each(listeners, delegateSingleListner, this, [eventName]);
                };
                // helper to process a single listener of a single event
                var delegateSingleListner = function (cfg, index, eventName) {
                    this.delegateDomEvent(eventName, cfg.fn, cfg.scope);
                };

                return function () {
                    if (!this.$el) {
                        return;
                    }
                    alchemy.each(this.events, delegateListenersForEvent, this);
                };
            }()),

            /** @protected */
            dispose: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.setEl(null);
                };
            }),
        }
    });
}());

