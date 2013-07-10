(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.controller.SpriteList
     * @extends alchemy.core.Oculus
     */
    alchemy.formula.add({
        name: 'pb.controller.SpriteList',
        extend: 'alchemy.core.Oculus',
        overrides: {
            /** @lends pb.controller.SpriteList.prototype */
            init: function () {
                this.observe(this.messages, 'app:start', function () {
                    var view = this.entities.getComponent('view', this.id);
                }, this);
            },

            openSprite: function () {
                // Verify that we are currently not snapped, or that we can unsnap to open the picker
                var currentState = Windows.UI.ViewManagement.ApplicationView.value;
                if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
                    !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                    // Fail silently if we can't unsnap
                    return;
                }

                // Create the picker object and set options
                var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
                openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
                openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                // Users expect to have a filtered view of their folders depending on the scenario.
                // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
                openPicker.fileTypeFilter.replaceAll(['.png', '.jpg', '.jpeg']);

                // Open the picker for the user to pick a file
                openPicker.pickSingleFileAsync().then(function (file) {
                    if (file) {
                        // Application now has read/write access to the picked file
                        WinJS.log && WinJS.log('Picked photo: ' + file.name, 'sample', 'status');
                    } else {
                        // The picker was dismissed with no selected file
                        WinJS.log && WinJS.log('Operation cancelled.', 'sample', 'status');
                    }
                });
            }
        }
    });
}());
