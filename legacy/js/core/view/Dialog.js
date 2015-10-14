(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The window view for importing sprite sheets
     *
     * @class
     * @name core.view.Dialog
     * @extends core.view.Prima
     */
    alchemy.formula.add({
        name: 'core.view.Dialog',
        extend: 'core.view.Prima',
        overrides: {
            /** @lends core.view.Dialog.prototype */

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

                    this.on('click .button.window-x', this.close, this);
                    this.on('rendered', this.onRendered, this);

                    _super.call(this);
                };
            }),

            /**
             * Description
             * @function
             */
            getData: alchemy.override(function (_super) {
                return function () {
                    var data = _super.call(this);
                    data.title = this.title;
                    data.cls = this.cls;
                    return data;
                };
            }),

            onRendered: function () {
                setTimeout(function () {
                    $('.window-mask').css('opacity', 1);
                }, 0);
            },

            close: function () {
                var self = this;

                $('.window-mask').css('opacity', 0);
                setTimeout(function () {
                    self.trigger('close');
                }, 500);
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
