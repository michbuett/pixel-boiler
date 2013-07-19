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
                                var cvs = sprites[i];
                                $(cvs).data('index', i);
                                $sprites.append(cvs);

                                if (i === 0) {
                                    $(cvs).addClass('selected');
                                }
                            }
                        }
                    }, this);

                    this.observe(this.messages, 'sheet:changed', this.onSheetChanged, this);

                    this.observeDom('#sidebar', 'canvas', 'click', this.handleSpriteClick);
                };
            }),

            onSheetChanged: function (data) {
                this.spriteSheet = data.sheet;
                this.dirty = true;
            },

            handleSpriteClick: function (e) {
                var $sprite = e && $(e.target);
                var data = $sprite && $sprite.data();
                var index = data && data.index;

                if (index >= 0) {
                    $('#sidebar .pb-sprites canvas.selected').removeClass('selected');
                    $sprite.addClass('selected');

                    this.messages.trigger('sprite:selected', {
                        sheet: this.spriteSheet,
                        index: index
                    });
                }
            }
        }
    });
}());
