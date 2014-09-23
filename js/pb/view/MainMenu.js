(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The view for the color palette
     *
     * @class
     * @name pb.view.MainMenu
     * @extends pb.view.PrimaReactus
     */
    alchemy.formula.add({
        name: 'pb.view.MainMenu',
        extend: 'pb.view.PrimaReactus',
        overrides: {
            /** @lends pb.view.Palette.prototype */

            /** @protected */
            createReactRenderer: function () {
                var self = this;

                return function renderComponent() {
                    var dom = React.DOM;
                    var brand = dom.div({
                        className: 'brand'
                    }, dom.div({
                        className: 'title'
                    }, 'PIXELBoiler'), dom.div({
                        className: 'file-info'
                    }, 'Untitled.png'));
                    var newButton = self.createButtonEl('new', 'New');
                    var openButton = self.createButtonEl('open', 'Open');
                    var saveButton = self.createButtonEl('save', 'Save');
                    var saveAsButton = self.createButtonEl('saveas', 'Save As');
                    var prevButton = self.createButtonEl('preview', 'Preview');

                    return dom.div({
                        className: 'main-menu'
                    }, brand, newButton, openButton, saveButton, saveAsButton, prevButton);
                };
            },

            /** @private */
            createButtonEl: function (key, text) {
                var messages = this.messages;
                return React.DOM.button({
                    id: 'btn-' + key,
                    onClick: function () {
                        messages.trigger('user:' + key);
                    }
                }, text);
            },
        }
    });
}());

