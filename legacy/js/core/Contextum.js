(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name core.Contextum
     * @extends alchemy.core.Ingredient
     */
    alchemy.formula.add({
        name: 'core.Contextum',

        requires: [
            'core.view.ContextMenu'
        ],

        overrides: function () {
            /** @lends core.Contextum */

            /**
             * Closes the dialog which is currently displayed
             * @private
             */
            function closeActiveDialog(instance) {
                var id = instance.menuId;
                if (!id) {
                    return;
                }
                instance.menuId = null;
                instance.entities.removeEntity(id);
            }

            return {
                /** @lends core.Contextum.prototype */

                publics: ['initMenu', 'showMenu'],

                /**
                 * The entity manager which can be used to create the menu entities
                 * @property entities
                 * @type alchemy.browser.entities
                 */
                entities: undefined,

                /**
                 * Initializes the menu; All given configurations are applied to the
                 * context menu ingredient
                 *
                 * @param {Object} cfg The menu configuration; all values are applied
                 *      but some are especially important
                 * @param {Object} cfg.entities The entity manger to create the actual
                 *      menu entities (views ...)
                 * @param {Object} cfg.items The menu items; Each item can have the
                 *      following properties: key, text, icon, handler
                 * @param {Object} cfg.scope The execution context for the item click
                 *      handle methods
                 */
                initMenu: function (cfg) {
                    alchemy.extend(this, cfg);
                },

                /**
                 * Opens a menu with the given configuration
                 * @function
                 *
                 * @param {Object} cfg The menu configuration; all values are applied
                 *      but some are especially important
                 * @param {Object} cfg.items The menu items; Each item can have the
                 *      following properties: key, text, icon, handler (Defaults to
                 *      the value set during "initMenu")
                 * @param {Object} cfg.scope The execution context for the item click
                 *      handle methods (Defaults to the value set during "initMenu")
                 * @param {Mixed} args Various arguments which will be passed to the
                 *      handler methods
                 * @param {Number} x The X-position at where the menu should be centered
                 * @param {Number} y The Y-position at where the menu should be centered
                 */
                showMenu: (function () {
                    var items, scope, args;

                    // "select"-event handler
                    var onSelect = function (data) {
                        var key = data && data.key;
                        var handler = items && items[key] && items[key].handler;

                        if (alchemy.isFunction(handler)) {
                            handler.call(scope, args);
                        }
                        closeActiveDialog(this);
                    };


                    return function (cfg) {
                        // close possible existing menu
                        closeActiveDialog(this);

                        // store values for callbacks
                        items = cfg.items || this.items;
                        scope = cfg.scope || this.scope || this;
                        args = cfg.args || this.args;

                        delete cfg.items;
                        delete cfg.scope;
                        delete cfg.args;

                        // open menu
                        this.menuId = this.entities.createEntity('contextmenu', {
                            view: alchemy.mix({
                                potion: 'core.view.ContextMenu',
                                items: items
                            }, cfg)
                        });

                        // add listener
                        var view = this.entities.getComponent('view', this.menuId);
                        view.on('select', onSelect, this);
                        view.on('cancel', function () {
                            closeActiveDialog(this);
                        }, this);
                    };
                }()),
            };
        }
    });
}());
