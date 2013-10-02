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

        ingredients: {
            menu: 'pb.Contextum'
        },

        overrides: {
            /** @lends pb.controller.SpriteList.prototype */

            selectedIndex: 0,

            viewEvents: {
                'click .sprite-item': 'handleSpriteClick',
                'click .buttons .add-sprite': 'handleAddSprite',
                'contextmenu .sprite-item': 'handleContextMenu',
                'click .sprite-item .settings': 'handleContextMenu',
            },

            /**
             * @function
             * @protected
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.initMenu({
                        entities: this.entities,
                        scope: this,
                        items: {
                            clone: {
                                icon: '⎘',
                                text: 'Clone',
                                pos: 'W',
                                handler: this.handleMenuAdd,
                            },
                            dispose: {
                                icon: '☠',
                                text: 'Dispose',
                                pos: 'E',
                                handler: this.handleMenuDelete,
                            },
                            moveUp: {
                                icon: '▲',
                                text: 'Move Up',
                                pos: 'N',
                                handler: this.handleMenuMoveUp,
                            },
                            moveDown: {
                                icon: '▼',
                                text: 'Move Down',
                                pos: 'S',
                                handler: this.handleMenuMoveDown,
                            },
                        }
                    });

                    this.observe(this.messages, 'sheet:changed', function (d) {
                        if (d && d.sheet) {
                            this.sheet = d.sheet;
                        }
                    }, this);
                };
            }),

            //
            //
            // Handler methods for user input
            //
            //

            /**
             * Handler for clicking a sprite; Selects the clicked sprite
             * @private
             */
            handleSpriteClick: function (e) {
                var data = this.getSpriteData(e);
                var index = data && data.index;

                if (index >= 0) {
                    this.selectSprite(index);
                }
            },

            /**
             * Handler for clicking the settings button of a sprite list item
             * or for right-click at the item itself
             * -> opens the context menu for the respective sprite
             * @private
             */
            handleContextMenu: function (e) {
                e.preventDefault();
                var data = this.getSpriteData(e);
                var index = data ? data.index : -1;

                if (index >= 0) {
                    this.showMenu({
                        args: {
                            index: index,
                        },
                        x: e.clientX,
                        y: e.clientY
                    });
                }
            },

            /**
             * Handler for clicking at the "+" button; Add a new sprite at the end
             * of the sheet
             * @private
             */
            handleAddSprite: function () {
                this.addSprite();
            },

            /**
             * Context menu handler to clone an existing sprite; It clones the
             * respective sprite and adds the new one after the source sprite
             * @private
             */
            handleMenuAdd: function (data) {
                this.addSprite(data.index, data.index + 1);
            },

            /**
             * Context menu handler for removing a single sprite from the sheet
             * @private
             */
            handleMenuDelete: function (data) {
                var index = data && data.index;
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

            /**
             * Context menu handler for moving one sprite upwards
             * @private
             */
            handleMenuMoveUp: function (data) {
                this.moveSprite(data.index, data.index - 1);
            },

            /**
             * Context menu handler for moving one sprite downwards
             * @private
             */
            handleMenuMoveDown: function (data) {
                this.moveSprite(data.index, data.index + 1);
            },


            //
            //
            // private helper
            //
            //

            /**
             * Moves a single sprite to a new position
             * @private
             *
             * @param {Number} oldIndex The original position
             * @param {Number} newIndex The target position
             */
            moveSprite: function (oldIndex, newIndex) {
                if (!this.sheet) {
                    return;
                }
                if (!((oldIndex >= 0) && (oldIndex < this.sheet.sprites.length) && (oldIndex !== newIndex))) {
                    return;
                }
                if (!((newIndex >= 0) && (newIndex < this.sheet.sprites.length))) {
                    return;
                }

                var sprites = this.sheet.sprites;
                var sprite = sprites.splice(oldIndex, 1)[0];
                sprites.splice(newIndex, 0, sprite);

                // broadcast the changes of the sprites ...
                this.messages.trigger('sheet:changed', {
                    sheet: this.sheet
                });

                if (this.selectedIndex > oldIndex && this.selectedIndex <= newIndex) {
                    this.selectSprite(this.selectedIndex - 1);
                } else if (this.selectedIndex < oldIndex && this.selectedIndex >= newIndex) {
                    this.selectSprite(this.selectedIndex + 1);
                } else if (this.selectedIndex === oldIndex) {
                    this.selectSprite(newIndex);
                }
            },

            /**
             * Selects the sprite with the given index
             * @private
             *
             * @param {Number} index The index of the sprite to select
             * @param {Boolean} force Set to true to force selection even if
             *      the corresponding sprite is already selected
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
             * Adds a new sprite to the sprite sheet
             * @private
             *
             * @param {Number} [sourceIndex] The index of a sprite to be cloned;
             *      If omitted an empty sprite will be added
             * @param {Number} [targetIndex] The index where to add the new sprite;
             *      If omitted then the new sprite will be added at the end
             */
            addSprite: function (sourceIndex, targetIndex) {
                if (!this.sheet) {
                    return;
                }
                var validTarget = targetIndex >= 0 && targetIndex <= this.sheet.sprites.length;
                if (!validTarget) {
                    // add the new sprite at the end if no other value is given
                    targetIndex = this.sheet.sprites.length;
                }

                // create the new sprite canvas
                var newSprite = document.createElement('canvas');
                newSprite.width = this.sheet.spriteWidth;
                newSprite.height = this.sheet.spriteHeight;

                if (sourceIndex >= 0 && sourceIndex < this.sheet.sprites.length) {
                    // clone an existing sprite
                    var ctxt = newSprite.getContext('2d');
                    ctxt.drawImage(this.sheet.sprites[sourceIndex], 0, 0);
                }

                // ...than add the new sprite to the sprite sheet
                if (targetIndex < this.sheet.sprites.length) {
                    this.sheet.sprites.splice(targetIndex, 0, newSprite);
                } else {
                    this.sheet.sprites.push(newSprite);
                }

                // ...and finally broadcast the changes
                this.messages.trigger('sheet:changed', {
                    sheet: this.sheet
                });

                if (targetIndex <= this.selectedIndex) {
                    // we have inserted a new sprite before the selected one
                    // -> we have the correct the selected index
                    this.selectSprite(this.selectedIndex + 1);
                }
            },

            /**
             * Gets data object of a sprite item dom element
             * @private
             *
             * @param {Object} eventObj The jquery event object
             * @return {Object} The data object or <code>undefined</code>
             */
            getSpriteData: function (eventObj) {
                if (!eventObj || !eventObj.target) {
                    return undefined;
                }

                var target = $(eventObj.target);
                if (!target.hasClass('sprite-item')) {
                    target = target.parent('.sprite-item');
                }
                return target.data();
            }
        }
    });
}());
