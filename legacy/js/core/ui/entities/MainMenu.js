module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name core.ui.entities.MainMenu
     */
    alchemy.formula.define('core.ui.entities.MainMenu', [], function () {

        return {
            /** @lends core.ui.entities.MainMenu.prototype */

            vdom: {
                renderer: function renderMainMenuVdom(context) {
                    var brand = context.h('div.brand', null, [
                        context.h('div.title', 'PIXELBoiler'),
                        context.h('div.file-info', 'Untitled.png')
                    ]);

                    return context.h('div#mainMenu', {
                        className: 'main-menu',
                    }, [brand].concat(context.renderAllChildren()));
                },
            },
        };
    });
};
