(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.view.SpriteList
     * @extends alchemy.browser.View
     */
    alchemy.formula.add({
        name: 'pb.view.SpriteList',
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.SpriteList.prototype */

            selectedIndex: 0,

            templateId: 'tpl-spriteList',

            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'sheet:changed', function (data) {
                        this.spriteSheet = data.sheet;
                        this.refresh();
                    }, this);

                    this.observe(this.messages, 'sprite:selected', function (data) {
                        this.selectSprite(data.index, data.force);
                    }, this);
                };
            }),

            getData: function () {
                return {
                    numOfSprites: this.spriteSheet ? this.spriteSheet.sprites.length : 0
                };
            },

            render: alchemy.override(function (_super) {
                return function (el) {
                    _super.call(this, el);

                    this.addSprites();
                    return this;
                };
            }),

            /**
             * Renders the sprite canvases into the sprite list
             * @private
             */
            addSprites: function () {
                if (!this.$el || !this.spriteSheet) {
                    // either target or sprites are missing
                    // -> try again in next cycle
                    this.refresh();
                    return;
                }

                var sprites = this.spriteSheet.sprites;
                var $spriteItems = this.$el.find('.sprite-item');
                for (var i = 0; i < sprites.length; i++) {
                    $spriteItems[i].appendChild(sprites[i]);
                }

                this.selectSprite(this.selectedIndex, true);

                $('#sprite-list .buttons .delete-sprite').prop('disabled', this.spriteSheet.sprites.length === 1);
            },

            selectSprite: function (index, force) {
                if (index === this.selectedIndex && !force) {
                    return;
                }
                if (this.$el) {
                    var sprites = this.$el.find('.sprite-item');
                    if (this.selectedIndex >= 0) {
                        $(sprites[this.selectedIndex]).removeClass('selected');
                    }
                    if (index >= 0) {
                        var $sel = $(sprites[index]);
                        $sel.addClass('selected');
                        this.scrollIntoView($sel);
                    }
                }
                this.selectedIndex = index;
            },

            scrollIntoView: function ($sprite) {
                var $ct = $sprite.parent('.pb-sprites');
                var offsetTop = $sprite.position().top;
                var scrollTop = $ct.scrollTop();
                var ctHeight = $ct.height();
                var spriteHeight = $sprite.height();

                if (offsetTop < 0) {
                    $ct.scrollTop(scrollTop + offsetTop);
                } else if (offsetTop + spriteHeight > ctHeight) {
                    $ct.scrollTop(scrollTop + offsetTop + spriteHeight - ctHeight);
                }
            },
        }
    });
}());
