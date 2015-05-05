(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.entities.Editor
     */
    alchemy.formula.add({
        name: 'pb.entities.Editor',

        requires: [
            'pb.ui.editor.Renderer',
            'pb.ui.editor.State',
            'pb.ui.editor.Events',
        ],

        overrides: {
            /** @lends pb.entities.Editor.prototype */

            getComponents: function () {
                return {
                    state: {
                        globalToLocal: alchemy('pb.ui.editor.State').globalToLocal,
                    },

                    vdom: {
                        renderer: alchemy('pb.ui.editor.Renderer').renderVdom,
                    },

                    css: {
                        renderer: alchemy('pb.ui.editor.Renderer').renderCss,
                    },

                    events: alchemy('pb.ui.editor.Events').events,

                    sheet: {
                        fromState: {
                            sprites: 'sprites',
                            current: 'selected',
                            dirty: 'dirty',
                            scale: 'scale',
                        },

                        canvas: '#editor-pane'
                    },
                };
            },

            getEventHandler: function () {
                return alchemy('pb.ui.editor.Events').getEventHandler();
            },
        }
    });
}());
