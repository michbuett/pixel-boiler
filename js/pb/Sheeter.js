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
            'pb.view.Spinner'
        ],

        overrides: {
            /** @lends pb.Sheeter.prototype */

            spriteWidth: 32,
            spriteHeight: 32,
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
                this.closeActiveDialog();
                this.dialog = this.entities.createEntity('window', {
                    view: {
                        potion: 'pb.view.Dialog',
                        title: 'Create New Sprite Sheet',
                        template: this.resources.get('tpl-newDlg'),
                        data: {
                            spriteWidth: this.spriteWidth,
                            spriteHeight: this.spriteHeight,
                            columns: this.columns || this.defaultSpriteCols,
                            rows: this.rows || this.defaultSpriteRows,
                        },
                        components: [{
                            potion: 'pb.view.Spinner',
                            target: '#form-new-sheet #sprite-width-ct',
                            id: 'spriteWidth',
                            label: 'Width',
                        }, {
                            potion: 'pb.view.Spinner',
                            target: '#form-new-sheet #sprite-height-ct',
                            id: 'spriteHeight',
                            label: 'Height',
                        }, {
                            potion: 'pb.view.Spinner',
                            target: '#form-new-sheet #columns-ct',
                            id: 'columns',
                            label: 'Columns',
                        }, {
                            potion: 'pb.view.Spinner',
                            target: '#form-new-sheet #rows-ct',
                            id: 'rows',
                            label: 'Rows',
                        }],
                    }
                });

                var view = this.entities.getComponent('view', this.dialog);
                this.observe(view, 'close', this.closeActiveDialog, this);
                this.observe(view, 'click #btn-create', function () {
                    var sw = view.get('spriteWidth');
                    var sh = view.get('spriteHeight');
                    var sc = view.get('columns');
                    var sr = view.get('rows');

                    this.createSpriteSheet(null, sw, sh, sc, sr);
                    this.closeActiveDialog();
                }, this);
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
                            spriteWidth: this.spriteWidth,
                            spriteHeight: this.spriteHeight,
                        },
                        template: this.resources.get('tpl-importDlg'),
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
                        template: this.resources.get('tpl-exportDlg'),
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
             * @param {Number} [sw] The width of a single sprite (defaults to {@link spriteWidth})
             * @param {Number} [sh] The height of a single sprite (defaults to {@link spriteHeight})
             * @param {Number} [sc] The number of sprites per row (= the number of rows columns)
             *      (defaults to {@link defaultSpriteCols})
             * @param {Number} [sw] The number of sprites per column (= the number of rows)
             *      (defaults to {@link defaultSpriteRows})
             */
            createSpriteSheet: function (src, sw, sh, sc, sr) {
                // apply defaults
                src = src || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                sw = sw > 0 ? sw : this.spriteWidth;
                sh = sh > 0 ? sh : this.spriteHeight;
                sc = sc > 0 ? sc : this.defaultSpriteCols;
                sr = sr > 0 ? sr : this.defaultSpriteRows;

                var self = this;
                var minWidth = sc * sw;
                var minHeight = sr * sh;

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
                    self.sheet = alchemy('SpriteSheet').brew({
                        spriteWidth: sw,
                        spriteHeight: sh,
                        image: img
                    });

                    try  {
                        // broadcast new sprite sheet through application
                        self.messages.trigger('sheet:changed', {
                            sheet: self.sheet
                        });
                    } catch (e) {
                        console.log(e.message);
                        console.log(e.stack);
                    }
                };
                try  {
                    img.src = src;
                } catch (e) {
                    console.error(e);
                }
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
                var sw = parseInt($('#inp-sprite-width').val(), 10) || this.spriteWidth;
                var sh = parseInt($('#inp-sprite-height').val(), 10) || this.spriteHeight;
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
                var dlg = this.dialog;
                if (!dlg) {
                    return;
                }
                this.dialog = null;
                this.entities.removeEntity(dlg);
            },
        }
    });
}());
