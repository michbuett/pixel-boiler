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
                '  <$ if (data.spriteSheet) { $>',
                '  <$ } else { $>',
                '    <input type="button">',
                '  <$ } $>',
                '</div>'
            ].join(''),

            setSpriteSheet: function (spriteSheet) {
                this.spriteSheet = spriteSheet;
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
