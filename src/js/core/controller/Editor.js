module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');

    /**
     * Description
     *
     * @class
     * @name core.controller.Editor
     * @extends core.controller.Prima
     */
    return coquoVenenum({
        /** @lends core.controller.Editor.prototype */

        messages: {
            'sheet:draw': 'onDraw',
        },

        onDraw: function onDraw(state, data) {
            // console.log('onDraw', state, data);
            var sheet = state.sub('sheet').set('sprites', data.sprites);
            return state.set('sheet', sheet);
        },
    });
}());
