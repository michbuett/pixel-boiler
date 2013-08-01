(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The sprite sheet manager
     * - import/export sheets
     * - create new empty ones
     *
     * @class
     * @name pb.Sheeter
     * @extends alchemy.core.Oculus
     */
    alchemy.formula.add({
        name: 'pb.Sheeter',
        extend: 'alchemy.core.Oculus',

        requires: [
            'pb.view.Dialog',
        ],

        overrides: {
            /** @lends pb.Sheeter.prototype */

            defaultSpriteWidth: 32,
            defaultSpriteHeight: 32,
            defaultSpriteCols: 2,
            defaultSpriteRows: 2,

            /** @protected */
            prepare: function () {
                this.observe($('#btn-new'), 'click', this.showNewDlg.bind(this));
                this.observe($('#btn-import'), 'click', this.showImportDlg.bind(this));
                this.observe($('#btn-export'), 'click', this.showExportDlg.bind(this));
                //this.observe($('#window-ct .window-mask'), 'click', this.closeActiveDialog.bind(this));

                // initially create an empty sprite sheet with default values
                this.createSpriteSheet();
            },

            update: alchemy.emptyFn,
            draw: alchemy.emptyFn,
            finish: alchemy.emptyFn,

            showNewDlg: function () {
                // TODO
                console.warn('TODO: show "new" dialog');
            },

            /**
             * Opens the dialog to import a local image as a spritesheet
             * @private
             */
            showImportDlg: function () {
                this.closeActiveDialog();
                this.dialog = this.entities.createEntity('window', {
                    view: {
                        potion: 'pb.view.Dialog',
                        title: 'Import Sprite Sheet',
                        data: {
                            spriteWidth: this.defaultSpriteWidth,
                            spriteHeight: this.defaultSpriteHeight,
                        },
                        template: [
                            '<form class="import-form">',
                            // the file chooser and preview area
                            '  <input id="file-chooser" type="file" accept="png, gif, jpg, jpeg">',
                            '  <div class="selected-image-ct">',
                            '    <img id="selected-image">',
                            '    <span id="display-data"></span>',
                            '  </div>',
                            // input fields for sprite width and height
                            '  <fieldset>',
                            '    <label for="inp-sprite-width">Sprite Width:</label>',
                            '    <input id="inp-sprite-width" maxLength="3" value="<$= data.spriteWidth $>">',
                            '  </fieldset>',
                            '  <fieldset>',
                            '    <label for="inp-sprite-height">Sprite Height:</label>',
                            '    <input id="inp-sprite-height" maxLength="3" value="<$= data.spriteHeight $>">',
                            '  </fieldset>',
                            // the buttons
                            '  <div class="buttons">',
                            '    <div class="button confirm">Import</div>',
                            '    <div class="button cancel">Cancel</div>',
                            '  </div>',
                            '</form>',
                        ].join(''),
                    }
                });

                var view = this.entities.getComponent('view', this.dialog);
                this.observe(view, 'change #file-chooser', this.loadImage, this);
                this.observe(view, 'click .confirm', this.importSpriteSheet, this);
                this.observe(view, 'click .cancel', this.closeActiveDialog, this);
                this.observe(view, 'close', this.closeActiveDialog, this);
            },

            /**
             * Opens a dialog to export the current state and save the sprite sheet
             * @private
             */
            showExportDlg: function () {
                this.columns = this.columns || Math.ceil(this.sheet.width / this.sheet.spriteWidth);
                this.rows = this.rows || Math.ceil(this.sheet.height / this.sheet.spriteHeight);
                this.closeActiveDialog();
                this.dialog = this.entities.createEntity('window', {
                    view: {
                        potion: 'pb.view.Dialog',
                        title: 'Export Sprite Sheet',
                        data: {
                            columns: this.columns,
                            rows: this.rows
                        },
                        template: [
                            '<div class="export-form">',
                            '  <div class="result">',
                            '    <img id="result-image" src="">',
                            '    <span>Right-Click and select "Save As" to download it.</span>',
                            '  </div>',
                            // input fields for number sprites per row
                            '  <fieldset>',
                            '    <label for="inp-columns">Sprites per row (number of columns):</label><br>',
                            '    <input id="inp-columns" size="3" value="<$= data.columns $>">',
                            '  </fieldset>',
                            '  <fieldset>',
                            '    <label for="inp-rows">Sprites per column (number or rows):</label><br>',
                            '    <input id="inp-rows" size="3" value="<$= data.rows $>">',
                            '  </fieldset>',
                            '</div>',
                        ].join(''),
                        target: '#window-ct .window-content',
                    }
                });

                var view = this.entities.getComponent('view', this.dialog);
                this.observe(view, 'close', this.closeActiveDialog, this);

                this.observe(view, 'rendered', function () {
                    $('.export-form #result-image').attr('src', this.sheet.compose(this.columns).toDataURL());
                }, this);

                this.observe(view, 'change #inp-columns', function () {
                    var newVal = parseInt($('.export-form #inp-columns').val(), 10);
                    if (newVal > 0 && newVal !== this.columns) {
                        this.columns = newVal;
                        $('.export-form #result-image').attr('src', this.sheet.compose(this.columns, this.rows).toDataURL());
                    }
                }, this);

                this.observe(view, 'change #inp-rows', function () {
                    var newVal = parseInt($('.export-form #inp-rows').val(), 10);
                    if (newVal > 0 && newVal !== this.rows) {
                        this.rows = newVal;
                        $('.export-form #result-image').attr('src', this.sheet.compose(this.columns, this.rows).toDataURL());
                    }
                }, this);
            },

            /**
             * Creates a new sprite sheet with the given parameter
             *
             * @param {String|DataURL} [src] The image src (defaults to the data url of an empty image)
             * @param {Number} [sw] The width of a single sprite (defaults to {@link defaultSpriteWidth})
             * @param {Number} [sh] The height of a single sprite (defaults to {@link defaultSpriteHeight})
             * @param {Number} [sc] The number of sprites per row (= the number of rows columns)
             *      (defaults to {@link defaultSpriteCols})
             * @param {Number} [sw] The number of sprites per column (= the number of rows)
             *      (defaults to {@link defaultSpriteRows})
             */
            createSpriteSheet: function (src, sw, sh, sc, sr) {
                // apply defaults
                src = src || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                sw = sw > 0 ? sw : this.defaultSpriteWidth;
                sh = sh > 0 ? sh : this.defaultSpriteHeight;
                sc = sc > 0 ? sc : this.defaultSpriteCols;
                sr = sr > 0 ? sr : this.defaultSpriteRows;

                var minWidth = sc * sw;
                var minHeight = sr * sh;

                // create the image for the sprite sheet
                var img = document.createElement('img');
                img.onload = (function () {
                    // expand image to minimal size
                    if (img.width < minWidth) {
                        img.width = minWidth;
                    }
                    if (img.height < minHeight) {
                        img.height = minHeight;
                    }
                    // create the sprite sheet from the image
                    this.sheet = alchemy('SpriteSheet').brew({
                        spriteWidth: sw,
                        spriteHeight: sh,
                        image: img
                    });
                    // broadcast new sprite sheet through application
                    this.messages.trigger('sheet:changed', {
                        sheet: this.sheet
                    });
                }).bind(this);
                img.src = src;
            },

            loadImage: (function () {
                return function () {
                    var reader;
                    var file = $('form.import-form #file-chooser')[0].files[0];

                    if (!file || !/image/.test(file.type)) {
                        return;
                    }

                    reader = new FileReader();
                    reader.onload = function (e) {
                        var $img = $('#selected-image');
                        $img.on('load', function () {
                            var w = $img[0].naturalWidth;
                            var h = $img[0].naturalHeight;
                            var n = file.name;
                            var s = file.size;

                            $('#display-data').html(n + ' (W: ' + w + 'px, H: ' + h + 'px, S: ' + s + 'byte)');
                        });
                        $img.attr('src', e.target.result);
                    };
                    reader.onerror = function (event) {
                        event.preventDefault();
                        return false;
                    };
                    reader.readAsDataURL(file);
                };
            }()),

            /**
             * Importes a local image as a new sprite sheet with parameter given in the
             * import dialog
             * @private
             */
            importSpriteSheet: function () {
                var img = $('#selected-image')[0];
                var src = img.src;
                var sw = parseInt($('#inp-sprite-width').val(), 10) || this.defaultSpriteWidth;
                var sh = parseInt($('#inp-sprite-height').val(), 10) || this.defaultSpriteHeight;
                var sc = Math.floor(img.naturalWidth / sw);
                var sr = Math.floor(img.naturalHeight / sh);

                this.createSpriteSheet(src, sw, sh, sc, sr);
                this.closeActiveDialog();
            },

            /**
             * Closes the dialog which is currently displayed
             * @private
             */
            closeActiveDialog: function () {
                if (!this.dialog) {
                    return;
                }
                this.entities.removeEntity(this.dialog);
                this.dialog = null;
            },
        }
    });
}());
