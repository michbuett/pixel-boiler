(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The controller of the preview area
     *
     * @class
     * @name pb.controller.Preview
     * @extends pb.controller.Prima
     */
    alchemy.formula.add({
        name: 'pb.controller.Preview',
        extend: 'pb.controller.Prima',
        overrides: {
            /** @lends pb.controller.Preview.prototype */

            viewEvents: {
                'click button#play-preview-animation': 'onPlay',
                'click button#pause-preview-animation': 'onPause',
            },

            /**
             * @function
             * @protected
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'sheet:changed', this.onPause, this);
                };
            }),


            /**
             * Event handler for clicking the play button
             * @private
             */
            onPlay: function () {
                this.view.play();
            },

            /**
             * Event handler for clicking the pause button
             * @private
             */
            onPause: function () {
                this.view.stop();
            },
        }
    });
}());
