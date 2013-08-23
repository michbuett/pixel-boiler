(function () {
    'use strict';

    var alchemy = require('./alchemy.js');

    /**
     * A basic view which is able to show various animations
     *
     * @class
     * @name pb.view.PrimaAnimatis
     * @extends pb.view.Prima
     */
    alchemy.formula.add({
        name: 'pb.view.PrimaAnimatis',
        extend: 'pb.view.Prima',
        requires: ['alchemy.core.Collectum', 'alchemy.browser.Animatus'],

        overrides: {
            /** @lends pb.view.PrimaAnimatis.prototype */

            template: [
                '<canvas',
                '    id="<$= data.id $>"',
                '    class="<$= data.cls $>"',
                '    width="<$=data.width $>"',
                '    height="<$=data.height $>"',
                '></canvas>'
            ].join('').replace(/\s\s+/g, ' '),


            /**
             * The name of default animation
             *
             * @property defaultAnimation
             * @type String
             */
            defaultAnimation: undefined,

            /**
             * The set of available animations (read-only)
             *
             * @property animations
             * @type alchemy.core.Collectum
             */
            animations: (function () {
                var _anim;
                return alchemy.defineProperty({
                    get: function () {
                        if (!_anim) {
                            _anim = alchemy('Collectum').brew();
                        }
                        return _anim;
                    },

                    set: function (newAnimations) {
                        // cleanup old data
                        if (_anim) {
                            _anim.dispose();
                        }
                        if (this.currAnim) {
                            this.currAnim.dispose();
                            this.currAnim = null;
                        }

                        // create a new collection
                        _anim = alchemy('Collectum').brew();
                        alchemy.each(newAnimations, function (animCfg, animKey) {
                            if (alchemy.isArray(animCfg)) {
                                animCfg = {
                                    frames: animCfg
                                };
                            }
                            this.addAnimation(animKey, animCfg);
                        }, this);
                    }
                });
            }()),

            /**
             * The reference to the animation which is playing or was the last
             * one played
             *
             * @property currAnim
             * @type alchemy.browser.Animatus
             * @private
             */
            currAnim: undefined,

            /**
             * Override super type to init canvas context after rendering the view
             * @function
             * @protected
             */
            init: function hocuspocus(_super) {
                return function () {
                    this.on('rendered', this.initRenderContext, this);

                    _super.call(this);
                };
            },

            /**
             * Overrider super type to return sprite width and height too
             * @function
             */
            getData: alchemy.override(function (_super) {
                return function () {
                    var data = _super.call(this);
                    var s = this.sheet;

                    data.width = s ? s.spriteWidth : 0;
                    data.height = s ? s.spriteHeight : 0;

                    return data;
                };
            }),

            /**
             * Adds a new animation
             * @param {String} key The animation identifier
             * @param {Object} cfg The animation configuration
             * @return {pb.view.PrimaAnimatis} The current instance for chaining
             */
            addAnimation: function (key, cfg) {
                var anim = alchemy('Animatus').brew(alchemy.mix({
                    id: key,
                    x: 0,
                    y: 0,
                    sheet: this.sheet
                }, this.defaults, cfg));

                this.observe(anim, 'framechanged', this.redraw, this);

                this.animations.add(anim);
                return this;
            },

            /**
             * Starts an animation
             * @param {String} [anim] The id of the animation to play (see
             *      addAnimation); If omitted the {@link #defaultAnimation}
             *      is played
             */
            play: function (anim) {
                anim = anim || this.defaultAnimation;
                if (this.animations.contains(anim)) {
                    this.currAnim = this.animations.get(anim);
                    this.currAnim.start();
                }
            },

            /**
             * Stops playing the current animation (the latest frame will still
             * be rendered in the canvas
             */
            stop: function () {
                var anim = this.getCurrentAnimation();
                if (anim) {
                    anim.stop();
                }
            },

            /**
             * Checks if the view is currently playing an animation
             * @return {Boolean} <code>true</code> if and only if there is
             *      a current animation an this one is playing
             */
            isPlaying: function () {
                var anim = this.getCurrentAnimation();
                return anim && anim.isPlaying();
            },

            /**
             * Triggers an update of the current animation
             */
            update: function (params) {
                var anim = this.getCurrentAnimation();
                if (anim) {
                    anim.update(params);
                }
            },

            //
            //
            // private helper
            //
            //

            /**
             * Initializes the canvas render context after rendering the view
             * @param {Object} data The data object of the view's render event
             * @private
             */
            initRenderContext: function (data) {
                var targetHtml = data.target;
                var canvasHtml;

                if (targetHtml) {
                    if (targetHtml.tagName.toLowerCase() === 'canvas') {
                        canvasHtml = targetHtml;
                    } else {
                        canvasHtml = targetHtml.querySelector('canvas');
                    }
                }
                if (canvasHtml) {
                    this.context = canvasHtml.getContext('2d');
                }
            },

            /**
             * Draws the current frame of the current animation to the canvas
             * @private
             */
            redraw: function () {
                var anim = this.getCurrentAnimation();
                var ctxt = this.context;
                var sheet = this.sheet;

                if (anim && ctxt && sheet) {
                    ctxt.clearRect(0, 0, sheet.spriteWidth, sheet.spriteHeight);
                    anim.draw(ctxt);
                }
            },

            /**
             * Returns the current animation
             * @return {alchemy.browser.Animatus}
             * @private
             */
            getCurrentAnimation: function () {
                return this.currAnim;
            },
        }
    });
}());
