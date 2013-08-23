(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The basic potion for application controller
     *
     * @class
     * @name pb.controller.Prima
     * @extends alchemy.core.Oculus
     */
    alchemy.formula.add({
        name: 'pb.controller.Prima',
        extend: 'alchemy.core.Oculus',
        overrides: {
            /** @lends pb.controller.Prima.prototype */

            /**
             * The events of the controller's view which will be automatically observed;
             * The configuration should have the following form:
             * <pre><code>
             * viewEvents: {
             *     '<eventname>[ <filter>]': '<handler>',
             *     ...
             * }
             *
             * with
             *      <eventname> := The name of the browser event
             *      <filter>    := Optional. A CSS selector to filter for a specific HTML
             *                     element (for browser events only)
             *      <handler>   := The name of the event handler; The handler is called with
             *                     same parameter as a jQuery event listener if it is a dom
             *                     event or with the standard data and event objects (see
             *                     {@link alchemy.core.Oculus#on})
             * </code></pre>
             * @example
             * <pre><code>
             * viewEvents: {
             *     'click .my-view .buttons .save': 'onSave',
             *     'rendered': 'onRender'
             * }
             * </code></pre>
             *
             * @property viewEvents
             * @type Object
             */
            viewEvents: undefined,

            /** @protected */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'app:start', this.initView, this);
                };
            }),

            /**
             * Connects the controller with its view and registers listeners to
             * the view events
             * @private
             */
            initView: function () {
                this.view = this.entities.getComponent('view', this.id);

                alchemy.each(this.viewEvents, function (handlerName, eventDescription) {
                    var handler = this[handlerName];
                    if (handler) {
                        this.observe(this.view, eventDescription, handler, this);
                    }
                }, this);
            },

            /**
             * Override superclass to detatch view
             * @function
             * @protected
             */
            dispose: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.view = null;
                };
            }),
        }
    });
}());
