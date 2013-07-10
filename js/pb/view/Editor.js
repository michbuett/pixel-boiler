(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.view.Editor
     * @extends alchemy.browser.View
     */
    alchemy.formula.add({
        name: 'pb.view.Editor',
        extend: 'alchemy.browser.View',
        overrides: {
            /** @lends pb.view.Editor.prototype */

            template: '<div class="pb-editor">TODO: implement editor</div>',
        }
    });
}());
