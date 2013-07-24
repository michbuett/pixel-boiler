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

            template: [
                '<div class="pb-spritelist">',
                '  <div class="pb-sprites"></div>',
                '  <button class="pb-new-sprite">+</button>',
                '</div>'
            ].join(''),

            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);
                    this.observe(this.messages, 'sheet:changed', this.onSheetChanged, this);
                };
            }),

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
                var $sprites = this.$el.find('.pb-sprites');
                for (var i = 0; i < sprites.length; i++) {
                    var cvs = sprites[i];
                    $(cvs).data('index', i);
                    $sprites.append(cvs);
                }

                this.selectSprite(0, true);
            },

            selectSprite: function (index, force) {
                if (index === this.selectedIndex && !force) {
                    return;
                }
                if (this.$el) {
                    var sprites = this.$el.find('canvas');
                    if (this.selectedIndex >= 0) {
                        $(sprites[this.selectedIndex]).removeClass('selected');
                    }
                    if (index >= 0) {
                        $(sprites[index]).addClass('selected');
                    }
                }
                this.selectedIndex = index;
            },

            onSheetChanged: function (data) {
                this.spriteSheet = data.sheet;
                this.refresh();
            },

        }
    });
}());
