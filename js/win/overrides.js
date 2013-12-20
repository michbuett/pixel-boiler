(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    var overrides = [{
        name: 'pb.Sheeter',
        extend: 'pb.Sheeter',
        overrides: function () {

            var writeBlobToFile = function (blob, file) {
                var input;
                var output;
                var self = this;

                // Open the returned file in order to copy the data
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (_output) {
                    input = blob.msDetachStream().getInputStreamAt(0);
                    output = _output;
                    return Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output);
                }).then(function () {
                    return output.flushAsync();
                }).done(function () {
                    input.close();
                    output.close();
                    self.messages.trigger('sheet:saved', self.file.path, self.sheet, self.file);
                });
            };

            return {
                /** @lends nw.Sheeter.prototype */

                load: function () {
                    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
                    var self = this;

                    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
                    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                    openPicker.fileTypeFilter.replaceAll(['.png', '.jpg', '.jpeg']);
                    openPicker.pickSingleFileAsync().then(function (file) {
                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                self.showImportDlg(e.target.result, file);
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                },

                /**
                 * Overrides {@link pb.Sheeter#save} to allow usage of the windows file api
                 * @protected
                 */
                save: function () {
                    if (this.file) {
                        var canvas = this.sheet.compose();
                        writeBlobToFile.call(this, canvas.msToBlob(), this.file);
                        return;
                    } else {
                        this.saveAs();
                    }
                },

                /**
                 * Overrides {@link pb.Sheeter#saveAs} to allow usage of the windows file api
                 * @protected
                 */
                saveAs: function () {
                    var picker = new Windows.Storage.Pickers.FileSavePicker();
                    var self = this;

                    picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                    picker.fileTypeChoices.insert('PNG file', ['.png']);
                    picker.pickSaveFileAsync().then(function (file) {
                        if (file) {
                            self.setFile(file);
                            self.save();
                        }
                    });
                },
            };
        }
    }];

    /**
     * Description
     *
     * @class
     * @name win.overrides
     * @extends alchemy.core.MateriaPrima
     */
    alchemy.formula.add({
        name: 'win.overrides',
        overrides: {
            /** @lends win.overrides.prototype */

            /**
             * Applies the node-webkit specific overrides
             */
            apply: function () {
                alchemy.each(overrides, alchemy.brew);
            },
        }
    });
}());
