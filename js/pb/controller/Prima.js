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

            viewEvents: undefined,

            /** @protected */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'app:start', this.initView, this);
                };
            }),

            initView: function () {
                this.view = this.entities.getComponent('view', this.id);

                alchemy.each(this.viewEvents, function (handlerName, eventDescription) {
                    var handler = this[handlerName];
                    if (handler) {
                        this.observe(this.view, eventDescription, handler, this);
                    }
                }, this);
            },


        }
    });
}());
