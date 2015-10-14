(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The view for the color palette
     *
     * @class
     * @name core.view.Palette
     * @extends alchemy.web.Visio
     */
    alchemy.formula.add({
        name: 'core.view.Palette',
        extend: 'alchemy.web.Visio',
        overrides: {
            /** @lends core.view.Palette.prototype */

            updateState: function (appState) {
                return appState.sub('colors');
            },

            /** @protected */
            render: function () {
                var h = this.h;
                var colors = this.state.val('palette');
                var selected = this.state.val('selected');
                var renderedColors = alchemy.each(colors, this.renderItem, this, [selected]);
                var trigger = (function (event, data) {
                    this.messages.trigger(event, data);
                }).bind(this);

                return h('ul', {
                    id: 'palette',
                    onclick: function (e) {
                        var color = e.target && e.target.dataset && e.target.dataset.color;
                        if (color) {
                            trigger('color:selected', {
                                color: color
                            });
                        }
                    },
                }, renderedColors);
            },

            renderItem: function (color, index, selected) {
                return this.h('li', {
                    className: 'item' + (color === selected ? ' selected' : ''),
                    dataset: {
                        color: color,
                        index: index,
                    },
                    style: {
                        backgroundColor: color
                    }
                });
            },
        }
    });
}());
