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

            selectedIndex: 0,

            viewEvents: {
                'click .sprite-item': 'handleSpriteClick',
                'click .buttons .add-sprite': 'handleAddSprite',
                'click .buttons .delete-sprite': 'handleDeleteSprite',
                'mousedown .sprite-item .settings': 'handleSettings',
            },

            /**
             * @function
             * @protected
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'sheet:changed', function (d) {
                        if (d && d.sheet) {
                            this.sheet = d.sheet;
                        }
                    }, this);
                };
            }),

            /**
             * Selects the sprite with the given index
             * @param {Number} index The index of the sprite to select
             * @param {Boolean} force Set to true to force selection even if
             *      the corresponding sprite is already selected
             * @private
             */
            selectSprite: function (index, force) {
                index = Math.max(0, Math.min(index, this.sheet.sprites.length - 1));

                if (index !== this.selectedIndex || force) {
                    this.messages.trigger('sprite:selected', {
                        sheet: this.sheet,
                        index: index,
                        force: force
                    });
                    this.selectedIndex = index;
                }
            },

            /**
             * Handler for clicking a sprite; Selects the clicked sprite
             * @private
             */
            handleSpriteClick: function (e) {
                var $sprite = e && $(e.target);
                var data = $sprite && $sprite.data();
                var index = data && data.index;

                if (index >= 0) {
                    this.selectSprite(index);
                }
            },

            /**
             * Handler for clicking the settings botton of a sprite list itemsA
             * @private
             */
            handleSettings: function (e) {
                var $sprite = e && $(e.target).parent('.sprite-item');
                var data = $sprite && $sprite.data();
                var index = data && data.index;

                if (index >= 0) {
                    this.messages.trigger('menu:show', {
                        x: e.clientX,
                        y: e.clientY,
                        args: {
                            index: index,
                        },
                        items: {
                            clone: {
                                icon: '⎘',
                                text: 'Clone',
                                pos: 'W',
                                handler: function (data) {
                                    console.log('CLONE', data);
                                }
                            },
                            dispose: {
                                icon: '☠',
                                text: 'Dispose',
                                pos: 'E',
                                handler: function (data) {
                                    console.log('DISPOSE', data);
                                }
                            },
                            moveUp: {
                                icon: '▲',
                                text: 'Move Up',
                                pos: 'N',
                                handler: function (data) {
                                    console.log('MOVE UP', data);
                                }
                            },
                            moveDown: {
                                icon: '▼',
                                text: 'Move Down',
                                pos: 'S',
                                handler: function (data) {
                                    console.log('MOVE DOWN', data);
                                }
                            },
                        }
                    });
                }
            },

            /**
             * Handler for clicking at the "+" button; Add a new sprite at the end
             * of the sheet
             * @private
             */
            handleAddSprite: function () {
                if (this.sheet) {
                    // create the new sprite canvas
                    var newSprite = document.createElement('canvas');
                    newSprite.width = this.sheet.spriteWidth;
                    newSprite.height = this.sheet.spriteHeight;

                    // ...than the new sprite to the sprite sheet
                    this.sheet.sprites.push(newSprite);

                    // ...and finally broadcast the changes
                    this.messages.trigger('sheet:changed', {
                        sheet: this.sheet
                    });
                }
            },

            /**
             * Handler for the "recycle" button; Removes the selected sprite
             * from the sheet
             * @private
             */
            handleDeleteSprite: function () {
                var index = this.selectedIndex;
                if (this.sheet && index >= 0) {
                    // remove the sprite from the sheet
                    this.sheet.sprites.splice(index, 1);

                    // broadcast...
                    this.messages.trigger('sheet:changed', {
                        sheet: this.sheet
                    });

                    // make new selection (select the previous sprite unless it
                    // is the first one)
                    this.selectSprite(index === this.sheet.sprites.length ? index - 1 : index, true);
                }
            },
        }
    });
}());
