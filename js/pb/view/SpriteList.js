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
        extend: 'alchemy.browser.View',
        overrides: {
            /** @lends pb.view.SpriteList.prototype */

            template: [
                '<div class="pb-spritelist">',
                '  <div class="pb-sprites"></div>',
                '  <button class="pb-new-sprite">+</button>',
                '</div>'
            ].join(''),

            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);
                    this.on('rendered', function () {
                        if (this.spriteSheet) {
                            var sprites = this.spriteSheet.sprites;
                            var $sprites = $('.pb-spritelist .pb-sprites');
                            for (var i = 0; i < sprites.length; i++) {
                                $sprites.append(sprites[i]);
                            }
                        }
                    }, this);

                    this.observe(this.messages, 'sheet:new', this.onSheetChanged, this);
                };
            }),

            onSheetChanged: function (data) {
                this.spriteSheet = data.sheet;
                this.dirty = true;
            },

            getData: alchemy.override(function (_super) {
                return function () {
                    var data = _super.call(this);
                    data.spriteSheet = this.spriteSheet;
                    return data;
                };
            }),
        }
    });
}());
