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
                    this.observe($ct, 'mouseup', this.onMouseup.bind(this));
                    this.observe($ct, 'mousemove .context-menu .item', this.onMousemove.bind(this));

                };
            }),

            onMouseup: function () {
                if (this.selectedKey) {
                    this.trigger('select', {
                        key: this.selectedKey
                    });
                } else {
                    this.trigger('cancel');
                }
            },

            onMousemove: function (e) {
                var $item = e.target.className.indexOf('item') >= 0 ? $(e.target) : $(e.target).parent('.item');
                var data = $item.data();
                var key = data && data.key;

                if (key) {
                    if (key !== this.selectedKey) {
                        $('.context-menu .item.over').removeClass('over');
                        $item.addClass('over');
                        this.selectedKey = key;
                    }
                } else {
                    $('.context-menu .item.over').removeClass('over');
                    this.selectedKey = undefined;
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
