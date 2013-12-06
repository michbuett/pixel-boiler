(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Observes the message bus an show toast messages on defined events, e.g. when
     * the sprite sheet has been saved or an error occured
     *
     * @class
     * @name pb.Toaster
     * @extends alchemy.core.Oculus
     */
    alchemy.formula.add({
        name: 'pb.Toaster',
        extend: 'alchemy.core.Oculus',
        overrides: {
            /** @lends pb.Toaster.prototype */

            toasts: {
                'sheet:saved': {
                    msg: 'The sprite sheet has been saved successfully.',
                    type: 'success'
                }
            },

            init: function () {
                alchemy.each(this.toasts, function (cfg, event) {
                    this.observe(this.messages, event, function () {
                        $.toast(cfg.msg, {
                            type: cfg.type
                        });
                    }, this);
                }, this);
            },
        }
    });
}());
