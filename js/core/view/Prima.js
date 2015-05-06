/*global $*/
(function () {
    'use strict';

    var alchemy = require('./alchemy.js');
    var DOM_EVENTS = [
        'blur',
        'change',
        'click',
        'contextmenu',
        'dblclick',
        'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart',
        'drop',
        'focus',
        'keydown', 'keypress', 'keyup',
        'mousedown', 'mousein', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
    ];

    /**
     * The mother of all views which visualize data using HTML and the DOM;
     * It provides methods for rendering and delegating DOM events;
     * NOTICE: This potion heavily depends on jQuery;
     *
     * @class
     * @name core.view.Prima
     * @extends alchemy.core.MateriaPrima
     */
    alchemy.formula.add({
        name: 'core.view.Prima',
        ingredients: {
            'observable': 'alchemy.core.Observari',
            'observer': 'alchemy.core.Oculus',
        },
        overrides: {
            /** @lends core.view.Prima.prototype */

            /**
             * The template to render the view; See {@link alchemy.render}
             * for details
             *
             * @property template
             * @type String
             */
            template: undefined,

            /**
             * The id of resource item that can act as the view template; If the template
             * is not set then this id can be used to get the template from the resource
             * manager
             *
             * @property templateId
             * @type String
             */
            templateId: undefined,

            /**
             * A list of child view configurations
             *
             * @property components
             * @type Object[]
             */
            components: undefined,

            /**
             * A flag that indicates if the view is dirty and should be
             * re-rendered; Read-only; Use the methods <code>isDirty</code> and
             * <code>refesh</code> to access/modify this flag
             *
             * @property dirty
             * @type Boolean
             * @private
             * @readonly
             */
            dirty: true,

            /**
             * The data store of the view;
             * Read-only. Use the method <code>get</code and <code>set</code>
             * to access/modify its content
             *
             * @property data
             * @type alchemy.core.Modelum
             */
            data: alchemy.defineProperty({
                /** @lends core.view.Prima.prototype.data */

                get: function () {
                    if (!this._data) {
                        this._data = alchemy('Modelum').brew();
                    }
                    return this._data;
                },

                set: function (newData) {
                    if (this._data) {
                        this._data.dispose();
                        this._data = null;
                    }
                    if (alchemy.isObject(newData)) {
                        this._data = alchemy('Modelum').brew();
                        this._data.set(newData);
                    }
                },
            }),

            /**
             * A reference to the HTML element containing the view
             *
             * @property el
             * @type Object
             * @protected
             */
            el: undefined,

            /**
             * Override super type to initialize components
             * @function
             * @protected
             */
            init: alchemy.override(function (_super) {
                return function () {
                    if (this.components) {
                        alchemy.each(this.components, this.addComponent, this);
                        this.components = null;
                    }

                    this.domEventHandlers = [];

                    _super.call(this);
                };
            }),

            /**
             * Returns the data to fill the {@link template}
             * @protected
             *
             * @return {Object} The data object
             */
            getData: function () {
                var data = this.data.toData();
                data.id = this.id;
                return data;
            },

            /**
             * Marks the view as "dirty" so it will be rendered in the next update cycle
             */
            refresh: function () {
                this.dirty = true;
            },

            /**
             * Checks if the view needs to be rendered
             */
            isDirty: function () {
                return this.dirty;
            },

            /**
             * Renders the view to the given html element
             *
             * @param {Object} target The parent html element
             * @return {Object} The current view instance for chaining
             */
            render: function (target) {
                if (!this.template && this.templateId) {
                    // there is no template but there may be a resource which can act as a template
                    this.template = this.resources.get(this.templateId);
                }

                this.cleanDomEventHandler();

                // render the view content to the target HTML element
                var html = alchemy.render(this.template, this.getData());
                if (alchemy.isFunction(window.toStaticHTML)) {
                    html = window.toStaticHTML(html);
                }
                target.innerHTML = html;

                this.dirty = false;
                this.el = target;
                this.$el = $(target);
                this.delegateAllDomEvents();

                /**
                 * Triggered each time the view is rendered to the DOM
                 * @event
                 *
                 * @name rendered
                 * @param {Object} view The current view instance
                 * @param {Object} target The target HTML element
                 */
                this.trigger('rendered', {
                    view: this,
                    target: target,
                });
                return this;
            },

            update: alchemy.emptyFn,

            /**
             * Adds a listener for to an event
             * Overrides the superclass to allow adding dom events
             * @function
             *
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
             * @function
             *
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
                        this.cleanDomEventHandler();
                        // re-attach remaining listeners
                        this.delegateAllDomEvents();
                    }
                    return this;
                };
            }),

            /**
             * Returns a data value of the view or of a component
             *
             * @param {String} key The key of the value to get
             * @return {Mixed} The value
             */
            get: function (key) {
                var cmp = this.cmps && this.cmps.get(key);
                if (cmp) {
                    return cmp.get('value');
                } else {
                    return this.data.get(key);
                }
            },

            /**
             * Sets a data value or of its components
             *
             * @param {String} key The key of the value to change
             * @param {Mixed} value The new value
             * @return {Object} The view instance for chaining
             */
            set: function (key, value) {
                var cmp = this.cmps && this.cmps.get(key);
                if (cmp) {
                    cmp.set('value', value);
                } else {
                    this.data.set(key, value);
                }
                return this;
            },

            /**
             * Overrides super type to:
             *  - remove references to dom nodes
             *  - detach dom event handler
             *  - dispose components
             * @function
             */
            finish: alchemy.override(function (_super) {
                return function () {
                    if (this.cmps) {
                        this.cmps.each(function (view) {
                            this.entities.removeEntity(view.id);
                        }, this);
                        this.cmps.dispose();
                        this.cmps = null;
                    }

                    this.cleanDomEventHandler();
                    this.domEventHandlers = null;
                    this.data = null;
                    this.el = null;
                    this.$el = null;

                    _super.call(this);
                };
            }),

            //
            //
            // private helper
            //
            //

            /**
             * Adds a child component
             * @private
             */
            addComponent: function (cfg) {
                var potion = alchemy(cfg.potion);
                if (potion) {
                    if (!this.cmps) {
                        // lazy initializing of the component collection
                        this.cmps = alchemy('Collectum').brew();
                    }

                    var cmpKey = cfg.id;
                    var cmpValue = this.data.get(cmpKey);
                    if (cmpValue) {
                        // delegate the value to the component
                        cfg.data = cfg.data || {};
                        cfg.data.value = cmpValue;
                    }

                    // create a view entity for the child component
                    var entityId = this.entities.createEntity(cfg.type, {
                        id: cmpKey,
                        view: cfg
                    });
                    var view = this.entities.getComponent('view', entityId);

                    // relay change events
                    this.observe(view.data, 'change.value', function (data) {
                        this.data.trigger('change.' + cmpKey, data);
                    }, this);

                    // store the view
                    this.cmps.add(view);
                }
            },

            /**
             * Adds a single listener to a dom object
             * @function
             * @private
             */
            delegateDomEvent: (function () {
                var splitter = /\s+/;
                return function (event, handler, scope) {
                    var split = event.split(splitter);
                    var eventName = split.shift().toLowerCase();

                    if (DOM_EVENTS.indexOf(eventName) >= 0) {
                        var selector = split.join(' ');
                        var eventTargets = selector ? Array.prototype.slice.call(this.el.querySelectorAll(selector)) : [this.el];
                        var boundHandler = function (e) {
                            handler.call(scope, e);
                        };

                        alchemy.each(eventTargets, function (targetEl) {
                            targetEl.addEventListener(eventName, boundHandler);

                            this.domEventHandlers.push({
                                eventName: eventName,
                                target: targetEl,
                                handler: boundHandler
                            });
                        }, this);
                    }
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

            /**
             * Removes all registered dom event listener
             * @private
             */
            cleanDomEventHandler: function () {
                while (this.domEventHandlers.length > 0) {
                    var cfg = this.domEventHandlers.pop();
                    cfg.target.removeEventListener(cfg.eventName, cfg.handler);
                }
            }
        },
    });
}());

