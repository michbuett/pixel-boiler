(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.Contextum
     * @extends alchemy.core.Oculus
     */
    alchemy.formula.add({
        name: 'pb.Contextum',
        extend: 'alchemy.core.Oculus',

        requires: [
            'pb.view.ContextMenu'
        ],

        overrides: {
            /** @lends pb.Contextum.prototype */

            init: function () {
                this.resources.define({
                    id: 'tpl-context-menu',
                    src: 'templates/contextMenu.tpl',
                });

                this.observe(this.messages, 'menu:show', this.onShowContextMenu, this);
            },

            prepare: alchemy.emptyFn,
            update: alchemy.emptyFn,
            draw: alchemy.emptyFn,
            finish: alchemy.emptyFn,

            //
            //
            // private helper
            //
            //

            /**
             * @function
             * @private
             */
            onShowContextMenu: (function () {
                var items, scope, args;

                // "select"-event handler
                var onSelect = function (data) {
                    var key = data && data.key;
                    var handler = items && items[key] && items[key].handler;

                    if (alchemy.isFunction(handler)) {
                        handler.call(scope, args);
                    }
                    this.closeActiveDialog();
                };

                return function (data) {
                    // close possible existing menu
                    this.closeActiveDialog();

                    // store values for callbacks
                    items = data.items;
                    scope = data.scope;
                    args = data.args;

                    // open menu
                    this.menuId = this.entities.createEntity('contextmenu', {
                        view: alchemy.mix({
                            potion: 'pb.view.ContextMenu',
                            templateId: 'tpl-context-menu',
                        }, data)
                    });

                    // add listener
                    var view = this.entities.getComponent('view', this.menuId);
                    this.observe(view, 'select', onSelect, this);
                    this.observe(view, 'cancel', this.closeActiveDialog, this);
                };
            }()),

            /**
             * Closes the dialog which is currently displayed
             * @private
             */
            closeActiveDialog: function () {
                var id = this.menuId;
                if (!id) {
                    return;
                }
                this.menuId = null;
                this.entities.removeEntity(id);
            },

        }
    });
}());
