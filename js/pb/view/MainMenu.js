(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The view for the color palette
     *
     * @class
     * @name pb.view.MainMenu
     * @extends alchemy.web.Visio
     */
    alchemy.formula.add({
        name: 'pb.view.MainMenu',
        extend: 'alchemy.web.Visio',
        overrides: {
            /** @lends pb.view.Palette.prototype */

            /** @protected */
            render: function () {
                var h = this.h;
                var brand = h('div.brand', null, [
                    h('div.title', 'PIXELBoiler'),
                    h('div.file-info', 'Untitled.png')
                ]);

                return h('div', {
                    className: 'main-menu'
                }, [brand].concat(this.renderButtons()));
            },

            /** @private */
            renderButtons: function () {
                return alchemy.each([
                    ['new', 'New'],
                    ['open', 'Open'],
                    ['save', 'Save'],
                    ['saveas', 'Save As'],
                    ['preview', 'Preview'],
                ], this.renderButton, this);
            },

            /** @private */
            renderButton: function (cfg) {
                var messages = this.messages;
                var key = cfg[0];
                var text = cfg[1];

                return this.h('button', {
                    id: 'btn-' + key,
                    onclick: function () {
                        messages.trigger('user:' + key);
                    }
                }, text);
            },
        }
    });
}());

