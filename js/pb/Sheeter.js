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
            defaultSpriteCols: 1,
            defaultSpriteRows: 1,
            filename: 'Untitled.png',

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

            /**
             * Saves the current sprite sheet
             * This method should be overridden using native api support
             */
            save: function (cfg) {
                console.error('pb.Sheeter.save is not implemented', cfg);
                // var fs = window.fileSystem;
                // var blob = this.sheet.toBlob(this.columns, this.rows);
                // fs.writeFileSync(this.filename, blob, 'binary');
            },

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
                    view.close();
                }, this);
            },

            /**
             * Opens the dialog to import a local image as a spritesheet
             * @private
             */
            showImportDlg: (function () {
                var fileChooserSelector = 'form#import-form #file-chooser';

                // helper method to open the file picker
                var chooseImage = function () {
                    $(fileChooserSelector).click();
                };

                // var helper method tp load the image selected by the file picker
                var loadImage = function () {
                    var reader;
                    var file = $(fileChooserSelector)[0].files[0];

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

                            $img.attr('name', n);
                            $img.attr('title', n);
                            $('.display-data').html(n + ' (W: ' + w + 'px, H: ' + h + 'px, S: ' + s + 'byte)');
                        });
                        $img.attr('src', e.target.result);
                    };
                    reader.onerror = function (event) {
                        event.preventDefault();
                        return false;
                    };
                    reader.readAsDataURL(file);
                };


                return function () {
                    this.closeActiveDialog();
                    this.dialog = this.entities.createEntity('window', {
                        view: {
                            potion: 'pb.view.Dialog',
                            title: 'Import Sprite Sheet',
                            template: this.resources.get('tpl-importDlg'),
                            data: {
                                spriteWidth: this.spriteWidth,
                                spriteHeight: this.spriteHeight,
                            },
                            components: [{
                                potion: 'pb.view.Spinner',
                                target: '#import-form #sprite-width-ct',
                                id: 'spriteWidth',
                                label: 'Width',
                            }, {
                                potion: 'pb.view.Spinner',
                                target: '#import-form #sprite-height-ct',
                                id: 'spriteHeight',
                                label: 'Height',
                            }],
                        }
                    });

                    var view = this.entities.getComponent('view', this.dialog);
                    this.observe(view, 'click .selected-image-ct', chooseImage, this);
                    this.observe(view, 'change #file-chooser', loadImage, this);
                    this.observe(view, 'click .confirm', this.importSpriteSheet, this);
                    this.observe(view, 'click .cancel', view.close, view);
                    this.observe(view, 'close', this.closeActiveDialog, this);
                };
            }()),

            /**
             * Opens a dialog to export the current state and save the sprite sheet
             * @private
             */
            showExportDlg: (function () {
                var updatePreview = function () {
                    var img = this.sheet.compose(this.columns, this.rows);
                    var w = img.width;
                    var h = img.height;
                    var imgUrl = img.toDataURL();

                    $('.export-form #result-image').attr('src', imgUrl);
                    $('.export-form #display-data').html(this.filename + ' (' + w + '&times;' + h + ')');
                };

                return function () {
                    this.columns = this.columns || Math.ceil(this.sheet.width / this.sheet.spriteWidth);
                    this.rows = this.rows || Math.ceil(this.sheet.height / this.sheet.spriteHeight);
                    this.closeActiveDialog();
                    this.dialog = this.entities.createEntity('window', {
                        view: {
                            potion: 'pb.view.Dialog',
                            title: 'Export Sprite Sheet',
                            template: this.resources.get('tpl-exportDlg'),
                            data: {
                                filename: this.filename,
                                columns: this.columns,
                                rows: this.rows,
                            },
                            components: [{
                                potion: 'pb.view.Spinner',
                                target: '.export-form #columns-ct',
                                id: 'columns',
                                label: 'Columns',
                            }, {
                                potion: 'pb.view.Spinner',
                                target: '.export-form #rows-ct',
                                id: 'rows',
                                label: 'Rows',
                            }],
                            target: '#window-ct .window-content',
                        }
                    });

                    var view = this.entities.getComponent('view', this.dialog);
                    this.observe(view, 'close', this.closeActiveDialog, this);

                    this.observe(view, 'rendered', function () {
                        updatePreview.call(this);
                    }, this);

                    this.observe(view.data, 'change.columns', function (data) {
                        var newVal = data.newVal;
                        if (newVal > 0 && newVal !== this.columns) {
                            this.columns = newVal;
                            updatePreview.call(this);
                        }
                    }, this);

                    this.observe(view.data, 'change.rows', function (data) {
                        var newVal = data.newVal;
                        if (newVal > 0 && newVal !== this.rows) {
                            this.rows = newVal;
                            updatePreview.call(this);
                        }
                    }, this);

                    this.observe(view, 'click .buttons #save', function () {
                        this.save({
                            path: this.path,
                            filename: this.filename,
                            canvas: this.sheet.compose(this.columns, this.rows)
                        });
                    }, this);


                    this.observe(view, 'click .buttons #save-as', function () {
                        this.save({
                            canvas: this.sheet.compose(this.columns, this.rows)
                        });
                    }, this);

                    this.observe(view, 'click .buttons #cancel', this.closeActiveDialog, this);
                };
            }()),

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

            /**
             * Importes a local image as a new sprite sheet with parameter given in the
             * import dialog
             * @private
             */
            importSpriteSheet: function () {
                var importDlg = this.entities.getComponent('view', this.dialog);
                var img = $('#selected-image')[0];
                var src = img.src;
                var sw = importDlg.get('spriteWidth');
                var sh = importDlg.get('spriteHeight');
                var sc = Math.floor(img.naturalWidth / sw);
                var sr = Math.floor(img.naturalHeight / sh);

                this.filename = img.name;
                this.createSpriteSheet(src, sw, sh, sc, sr);
                importDlg.close();
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
