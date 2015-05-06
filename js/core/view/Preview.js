(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The view of the preview area
     *
     * @class
     * @name core.view.Preview
     * @extends core.view.PrimaAnimatis
     */
    alchemy.formula.add({
        name: 'core.view.Preview',
        extend: 'core.view.PrimaAnimatis',
        overrides: {
            /** @lends core.view.Preview.prototype */

            template: undefined,
            templateId: 'tpl-preview',
            defaultAnimation: 'all',

            /**
             * The index of the currently selected sprite
             *
             * @property selectedIndex
             * @type Number
             */
            selectedIndex: 0,

            /**
             * @function
             * @protected
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'sheet:changed', this.onSheetChanged, this);
                    this.observe(this.messages, 'sprite:selected', this.onSpriteChanged, this);
                };
            }),

            /**
             * Starts playing; Overrides super type to update button states
             * @function
             */
            play: alchemy.override(function (_super) {
                return function (anim) {
                    var $playButton = this.$el && this.$el.find('#preview-play');
                    if ($playButton) {
                        $playButton.removeClass('stop');
                        $playButton.addClass('play');
                    }

                    _super.call(this, anim);
                };
            }),

            /**
             * Stops playing; Overrides super type to update button states and
             * @function
             */
            stop: alchemy.override(function (_super) {
                return function () {
                    var $playButton = this.$el && this.$el.find('#preview-play');
                    if ($playButton) {
                        $playButton.removeClass('play');
                        $playButton.addClass('stop');
                    }

                    _super.call(this);
                };
            }),

            /**
             * Overrides super type to trigger an update of the selected
             * sprite when not playing an animation
             * @function
             */
            update: alchemy.override(function (_super) {
                return function (params) {
                    if (this.isPlaying()) {
                        _super.call(this, params);
                    } else {
                        if (params.frame % 20 === 0) {
                            this.previewSprite();
                        }
                    }
                };
            }),

            //
            //
            // private helper
            //
            //

            /**
             * Event handler for the "sheet:changed" event
             * Updates the animation if the sprite changed
             * @private
             */
            onSheetChanged: function (data) {
                var frames = [];
                var animations = {};

                // create the frame configuration
                for (var i = 0; i < data.sheet.sprites.length; i++) {
                    frames[i] = i;
                }

                // create the animation configuration
                animations[this.defaultAnimation] = {
                    frames: frames,
                    defaults: {
                        durration: 150
                    }
                };

                this.sheet = data.sheet;
                this.animations = animations;
                this.refresh();
            },

            /**
             * Event handler for the "sprite:selected" event
             * Sets the selected sprite index to the new value
             * @private
             */
            onSpriteChanged: function (data) {
                if (this.selectedIndex !== data.index) {
                    this.selectedIndex = data.index;

                    if (!this.isPlaying()) {
                        this.previewSprite(data.index);
                    }
                }
            },

            /**
             * Draws sprite with the given index to the preview canvas
             * @private
             */
            previewSprite: function (index) {
                index = index >= 0 ? index : this.selectedIndex;

                var sprite = this.sheet && this.sheet.getSprite(index);
                var canvas = this.$el && this.$el.find('canvas.anim-preview')[0];
                var ctxt = canvas && canvas.getContext('2d');

                if (!sprite || !ctxt) {
                    return;
                }

                ctxt.imageSmoothingEnabled = false;
                ctxt.msImageSmoothingEnabled = false;
                ctxt.webkitImageSmoothingEnabled = false;
                ctxt.mozImageSmoothingEnabled = false;
                ctxt.clearRect(0, 0, canvas.width, canvas.height);
                ctxt.drawImage(sprite, 0, 0, canvas.width, canvas.height);
            },
        }
    });
}());
