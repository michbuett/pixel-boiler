(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The basic context menu view
     *
     * @class
     * @name pb.view.ContextMenu
     * @extends pb.view.Prima
     */
    alchemy.formula.add({
        name: 'pb.view.ContextMenu',
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.ContextMenu.prototype */

            width: 200,
            height: 200,
            templateId: 'tpl-context-menu',

            /**
             * Description
             * @function
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);


                    var ctSel = 'body > #menu-ct';
                    if ($(ctSel).length === 0) {
                        $('body').append('<div id="menu-ct"></div>');

                    }
                    this.target = ctSel;

                    var $ct = $(this.target);
                    this.observe($ct, 'click', this.onClick.bind(this));

                };
            }),

            onClick: function (e) {
                var $item = e.target.className.indexOf('item') >= 0 ? $(e.target) : $(e.target).parent('.item');
                var data = $item.data();
                var key = data && data.key;

                if (key) {
                    this.trigger('select', {
                        key: key
                    });
                } else {
                    this.trigger('cancel');
                }
            },

            getData: function () {
                var x = Math.max(10, this.x - this.width / 2);
                var y = Math.max(10, this.y - this.height / 2);

                return {
                    items: this.items,
                    x: x,
                    y: y,
                    w: this.width,
                    h: this.height,
                };
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

        }
    });
}());
