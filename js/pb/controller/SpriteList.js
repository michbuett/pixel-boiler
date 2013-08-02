(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.controller.SpriteList
     * @extends pb.controller.Prima
     */
    alchemy.formula.add({
        name: 'pb.controller.SpriteList',
        extend: 'pb.controller.Prima',
        overrides: {
            /** @lends pb.controller.SpriteList.prototype */
            init: function () {
                this.observe(this.messages, 'app:start', function () {
                    var view = this.entities.getComponent('view', this.id);
                    this.observe(view, 'click .sprite-item', this.handleSpriteClick, this);
                }, this);
            },

            handleSpriteClick: function (e) {
                var $sprite = e && $(e.target);
                var data = $sprite && $sprite.data();
                var index = data && data.index;

                if (index >= 0) {
                    $('.pb-sprites .sprite-item.selected').removeClass('selected');
                    $sprite.addClass('selected');

                    this.messages.trigger('sprite:selected', {
                        sheet: this.spriteSheet,
                        index: index
                    });
                }
            },
        }
    });
}());
