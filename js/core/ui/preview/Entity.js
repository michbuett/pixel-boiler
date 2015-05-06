(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name core.ui.preview.Entity
     */
    alchemy.formula.add({
        name: 'core.ui.preview.Entity',
        requires: [
        ],

        overrides: {
            /** @lends core.ui.preview.Entity.prototype */

            getComponents: function () {
                return {
                    state: {
                        globalToLocal: function (appState, current) {
                            var sheet = appState.sub('sheet');
                            var selected = sheet.val('selected');
                            var imageData = sheet.sub('sprites').val(selected);


                            return current.set({
                                imageData: imageData,
                                dirty: imageData === current.val('imageData') ? false : {
                                    offsetX: 0,
                                    offsetY: 0,
                                    imageData: imageData,
                                },
                                width: sheet.val('spriteWidth'),
                                height: sheet.val('spriteHeight'),
                                scale: 3,
                            });
                        },
                    },

                    vdom: {
                        renderer: function (context) {
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
            },
        }
    });
}());
