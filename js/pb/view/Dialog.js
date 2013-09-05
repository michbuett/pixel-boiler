(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The window view for importing sprite sheets
     *
     * @class
     * @name pb.view.Dialog
     * @extends pb.view.Prima
     */
    alchemy.formula.add({
        name: 'pb.view.Dialog',
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.Dialog.prototype */

            hidden: true,
            template: '',

            /**
             * Override superclass to wrap the content template into the
             * window markup
             * @function
             */
            init: alchemy.override(function (_super) {
                return function () {
                    this.template = [
                        '<div class="window-mask">',
                        '  <div class="window-content <$= data.cls $>">',
                        '    <div class="window-x button"><span>❌</span></div>',
                        '    <div class="head"><$= data.title $></div>',
                        '    <div class="body">', this.template, '<div>',
                        '  </div>',
                        '</div>',
                    ].join('');

                    var ctSel = 'body > #window-ct';
                    if ($(ctSel).length === 0) {
                        $('body').append('<div id="window-ct"></div>');
                    }

                    this.target = 'body > #window-ct';
                    this.on('click .button.window-x', function () {
                        $('.window-content').css('top', -1000);
                        $('.window-mask').css('opacity', 0);

                        var self = this;
                        setTimeout(function () {
                            self.trigger('close');
                        }, 500);
                    }, this);


                    this.on('rendered', function () {
                        $('.window-mask').css('opacity', 1);
                        $('.window-content').css('top', '20%');
                    }, this);

                    _super.call(this);
                };
            }),

            getData: function () {
                return alchemy.mix({
                    title: this.title,
                    cls: this.cls,
                }, this.data);
            },

            /**
             * Override super type to hide window on dispose
             * @function
             */
            dispose: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    $(this.target).off();
                    $(this.target).remove();
                };
            }),
        },
    });
}());
