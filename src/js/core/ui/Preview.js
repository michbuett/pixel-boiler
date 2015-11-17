module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name core.ui.entities.Preview
     */
    return {
        /** @lends core.ui.entities.Preview.prototype */

        globalToLocal: function (appState, current) {
            var sheet = appState.sub('sheet');
            var selected = sheet.val('selected');

            return {
                imageData: sheet.sub('sprites').val(selected),
                width: sheet.val('spriteWidth'),
                height: sheet.val('spriteHeight'),
                scale: 3,
            };
        },

        state: {
            width: 32,
            height: 32,
            scale: 3,
        },

        vdom: {
            renderer: function renderPreviewVdom(context) {
                var state = context.state;
                return context.h('canvas', {
                    id: 'preview-cvs',
                    width: state.val('scale') * state.val('width'),
                    height: state.val('scale') * state.val('height'),
                });
            },
        },

        sheet: {
            canvas: '#preview-cvs'
        },
    };
}());
