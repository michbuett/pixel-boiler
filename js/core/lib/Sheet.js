module.exports = function (alchemy) {
    'use strict';

    var emptyImgDataUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    /**
     * TODO: document me!
     *
     * @class
     * @name core.lib.Sheet
     */
    alchemy.formula.add({
        name: 'core.lib.Sheet',
    }, {
        /** @lends core.lib.Sheet.prototype */

        createSpriteSheet: function (cfg) {
            var src = cfg.src || emptyImgDataUrl;
            var self = this;
            var minWidth = cfg.columns * cfg.spriteWidth;
            var minHeight = cfg.rows * cfg.spriteWidth;

            // create the image for the sprite sheet
            var img = document.createElement('img');
            img.onload = function () {
                // expand image to minimal size
                if (img.width < minWidth) {
                    img.width = minWidth;
                }
                if (img.height < minHeight) {
                    img.height = minHeight;
                }

                // create the sprite sheet from the image
                var sheet = self.createSpriteSheetFromImage(img, cfg.spriteWidth, cfg.spriteHeight);

                // return result
                cfg.callback.call(cfg.scope, sheet);
            };

            try  {
                img.src = src;
            } catch (e) {
                console.error(e);
            }
        },


        /**
         * Splits the initial sheet image and extracts the sprites
         * @private
         */
        createSpriteSheetFromImage: function (image, sw, sh) {
            var x = 0;
            var y = 0;
            var spriteCvs;
            var spriteCtx;
            var columns = Math.max(1, Math.floor(image.width / sw));
            var rows = Math.max(1, Math.floor(image.height / sh));
            var width = columns * sw;
            var height = rows * sh;
            var sprites = [];

            while (y + sh <= height) {
                x = 0;
                while (x + sw <= width) {
                    var w = Math.min(sw, image.naturalWidth - x);
                    var h = Math.min(sh, image.naturalHeight - y);

                    spriteCvs = document.createElement('canvas');
                    spriteCvs.width = sw;
                    spriteCvs.height = sh;

                    if (w > 0 && h > 0) {
                        spriteCtx = spriteCvs.getContext('2d');
                        spriteCtx.imageSmoothingEnabled = false;
                        spriteCtx.msImageSmoothingEnabled = false;
                        spriteCtx.webkitImageSmoothingEnabled = false;
                        spriteCtx.mozImageSmoothingEnabled = false;
                        spriteCtx.scale(1, 1);
                        spriteCtx.drawImage(image, x, y, w, h, 0, 0, w, h);
                    }
                    sprites.push(spriteCtx.getImageData(0, 0, sw, sh));
                    x += sw;
                }
                y += sh;
            }

            return {
                sprites: sprites,
                spriteWidth: sw,
                spriteHeight: sh,
                columns: columns,
                rows: rows,
            };
        },
    });
};
