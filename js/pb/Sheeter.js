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

            file: undefined,

            /** @protected */
            prepare: function () {
                this.observe($('#btn-new'), 'click', this.showNewDlg.bind(this));
                this.observe($('#btn-open'), 'click', this.load.bind(this));
                this.observe($('#btn-save'), 'click', this.save.bind(this));
                this.observe($('#btn-save-as'), 'click', this.saveAs.bind(this));
                this.observe($('#btn-preview'), 'click', this.showExportDlg.bind(this));

                // update the number of columns so the sheet always contains all sprites
                this.observe(this.messages, 'sheet:changed', function (data) {
                    data.sheet.setColumns(data.sheet.columns);
                    this.setUsavedChanges(true);
                }, this);

                this.observe(this.messages, 'sheet:draw', function () {
                    this.setUsavedChanges(true);
                }, this);

                this.observe(this.messages, 'sheet:saved', function () {
                    this.setUsavedChanges(false);
                }, this);

                // initially create an empty sprite sheet with default values
                this.createSpriteSheet();
                this.setFile(null);
            },

            update: alchemy.emptyFn,
            draw: alchemy.emptyFn,
            finish: alchemy.emptyFn,

            setFile: function (file) {
                this.file = file;

                if (file) {
                    this.setUsavedChanges(false);
                    $('#btn-save').attr('disabled', null);
                    $('.brand .file-info').html(file.name);
                } else {
                    this.setUsavedChanges(true);
                    $('#btn-save').attr('disabled', true);
                    $('.brand .file-info').html('Untitled.png');
                }
            },

            setUsavedChanges: function (status) {
                status = !!status;

                var fileInfo = $('.brand .file-info').html().replace(/\*/g, '');
                if (status) {
                    $('body').addClass('unsaved');
                    $('.brand .file-info').html(fileInfo + '*');
                } else {
                    $('body').removeClass('unsaved');
                    $('.brand .file-info').html(fileInfo);
                }
                this.hasUnsavedChanges = status;
            },

            load: function () {
                var $fileChooser = $('body').append('<input id="img-chooser" type="file">').find('#img-chooser');
                var self = this;

                $fileChooser.on('change', function () {
                    var file = $fileChooser[0].files[0];
                    if (file && /image/.test(file.type)) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            self.showImportDlg(e.target.result, file);
                        };
                        reader.readAsDataURL(file);
                    }

                    $fileChooser.off();
                    $fileChooser.remove();
                });

                $fileChooser.on('abort', function () {
                    $fileChooser.off();
                    $fileChooser.remove();
                });

                $fileChooser.click();
            },

            /**
             * Saves the current sprite sheet to the current file; should behave
             * as "saveAs" if no file has been selected so far (e.g. after creating
             * a new sprite sheet)
             *
             * This method can be overridden using native filesystem api support
             * @protected
             */
            save: function () {
                console.error('pb.Sheeter.save is not implemented');
            },

            /**
             * Saves the current sprite sheet to a new file
             *
             * This method can be overridden using native filesystem api support
             * @protected
             */
            saveAs: function () {
                console.error('pb.Sheeter.saveAs is not implemented');
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

                    this.setFile(null);
                    this.createSpriteSheet(null, sw, sh, sc, sr);
                    view.close();
                }, this);
            },

            /**
             * Opens the dialog to import a local image as a spritesheet
             * @private
             */
            showImportDlg: function (dataUrl, file) {
                var sw = this.spriteWidth;
                var sh = this.spriteHeight;

                // try guessing the sprite dimensions by the file name
                // (e.g. for the file "mySpriteSheet_20x30.png" we assume
                // a width of 20px and a height of 30px for each sprite)
                var m = file.name.match(/.*[\-\_](\d+)[x\-\_](\d+).*/);
                if (m && m.length >= 3) {
                    sw = m[1];
                    sh = m[2];
                }

                this.closeActiveDialog();
                this.dialog = this.entities.createEntity('window', {
                    view: {
                        potion: 'pb.view.Dialog',
                        title: 'Import Sprite Sheet',
                        template: this.resources.get('tpl-importDlg'),
                        data: {
                            spriteWidth: sw,
                            spriteHeight: sh,
                            src: dataUrl,
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
                this.observe(view, 'click .cancel', view.close, view);
                this.observe(view, 'close', this.closeActiveDialog, this);

                this.observe(view, 'rendered', function () {
                    var img = $('#selected-image')[0].src = dataUrl;
                }, this);

                this.observe(view, 'click .confirm', function () {
                    var img = $('#selected-image')[0];
                    var src = img.src;
                    var sw = view.get('spriteWidth');
                    var sh = view.get('spriteHeight');
                    var sc = Math.floor(img.naturalWidth / sw);
                    var sr = Math.floor(img.naturalHeight / sh);

                    this.setFile(file);
                    this.createSpriteSheet(src, sw, sh, sc, sr);
                    view.close();
                }, this);
            },

            /**
             * Opens a dialog to export the current state and save the sprite sheet
             * @private
             */
            showExportDlg: (function () {
                var updatePreview = function () {
                    var img = this.sheet.compose();
                    var c = this.sheet.columns;
                    var r = this.sheet.rows;
                    var w = img.width;
                    var h = img.height;
                    var imgUrl = img.toDataURL();
                    var infoText = c + ' &times; ' + r + ' Sprites (' + w + '&times;' + h + ')';

                    $('.export-form #result-image').attr('src', imgUrl);
                    $('.export-form #display-data').html(infoText);
                };

                return function () {
                    this.closeActiveDialog();
                    this.dialog = this.entities.createEntity('window', {
                        view: {
                            potion: 'pb.view.Dialog',
                            title: 'Export Sprite Sheet',
                            template: this.resources.get('tpl-exportDlg'),
                            data: {
                                columns: this.sheet.columns,
                            },
                            components: [{
                                potion: 'pb.view.Spinner',
                                target: '.export-form #columns-ct',
                                id: 'columns',
                                label: 'Columns',
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
                        if (newVal !== this.sheet.columns) {
                            this.sheet.setColumns(newVal);
                            updatePreview.call(this);
                            view.set('columns', this.sheet.columns);
                        }
                    }, this);
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
