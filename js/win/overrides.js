(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    var overrides = [{
        name: 'pb.Sheeter',
        extend: 'pb.Sheeter',
        overrides: function (_super) {
            function writeBlobToFile(blob, file) {
                var input;
                var output;
                // Open the returned file in order to copy the data
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (_output) {
                    input = blob.msDetachStream().getInputStreamAt(0)
                    // input = blob.msDetachStream();
                    output = _output;
                    return Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output);
                }).then(function () {
                    return output.flushAsync();
                }).done(function () {
                    input.close();
                    output.close();
                });
            }

            return {
                /** @lends nw.Sheeter.prototype */

                load: function () {
                    var file, stream;
                    var Imaging = Windows.Graphics.Imaging;
                    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
                    var self = this;

                    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
                    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                    openPicker.fileTypeFilter.replaceAll(['.png', '.jpg', '.jpeg']);
                    openPicker.pickSingleFileAsync().then(function (file) {
                        if (file) {
                            //var objectUrl = URL.createObjectURL(file, { oneTimeOnly: true });
                            //self.showImportDlg(objectUrl, file);

                            var reader = new FileReader();
                            reader.onload = function (e) {
                                self.showImportDlg(e.target.result, file);
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                    // openPicker.pickSingleFileAsync().then(function (_file) {
                    //     if (file) {
                    //         file = _file;
                    //         return file.openAsync(Windows.Storage.FileAccessMode.read);
                    //     }
                    // }).then(function (_stream) {
                    //     var guid;
                    //     if (file.fileType === 'png') {
                    //         guid = Imaging.BitmapDecoder.pngDecoderId;
                    //     } else {
                    //         guid = Imaging.BitmapDecoder.jpegDecoderId;
                    //     }

                    //     stream = _stream;
                    //     return Imaging.BitmapDecoder.createAsync(guid, stream);
                    // });
                },

                save: function () {
                    var self = this;
                    var Imaging = Windows.Graphics.Imaging;
                    var canvas = this.sheet.compose();
                    var ctx = canvas.getContext('2d');
                    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    var fileStream = null;
                    var encoding = this.encodingData || {
                        pixelFormat: Imaging.BitmapPixelFormat.rgba8,
                        alphaMode: Imaging.BitmapAlphaMode.straight,
                        width: canvas.width,
                        height: canvas.height,
                        dpiX: 96,
                        dpiY: 96
                    };

                    if (this.file) {
                        writeBlobToFile(canvas.msToBlob(), this.file);
                        // writeBlobToFile(this.sheet.toBlob(), this.file);
                        return;

                        this.file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {
                            fileStream = stream;

                            return Imaging.BitmapEncoder.createAsync(Imaging.BitmapEncoder.pngEncoderId, stream);
                        }).then(function (encoder) {
                            encoder.setPixelData(
                                encoding.pixelFormat,
                                encoding.alphaMode,
                                encoding.width,
                                encoding.height,
                                encoding.dpiX,
                                encoding.dpiY,
                                new Uint8Array(imgData.data)
                            );
                            // do the encoding
                            return encoder.flushAsync();
                        }).done(function () {
                            // Make sure to do this at the end
                            fileStream.close();
                            self.messages.trigger('sheet:saved', self.file.path, self.sheet, self.file);
                        }, function () {
                            // TODO: error handling
                        });
                    } else {
                        this.saveAs();
                    }
                },

                saveAs: function () {
                    var picker = new Windows.Storage.Pickers.FileSavePicker();
                    var self = this;

                    picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                    picker.fileTypeChoices.insert('PNG file', ['.png']);
                    picker.pickSaveFileAsync().then(function (file) {
                        if (file) {
                            self.setFile(file);
                            self.save();
                        } else {
                            // TODO: error handling "no file selected"
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
