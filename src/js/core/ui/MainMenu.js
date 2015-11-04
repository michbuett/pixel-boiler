module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name core.ui.MainMenu
     */
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
}());
