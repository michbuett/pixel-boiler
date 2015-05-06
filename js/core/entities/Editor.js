(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name core.entities.Editor
     */
    alchemy.formula.add({
        name: 'core.entities.Editor',

        requires: [
            'core.ui.editor.Renderer',
            'core.ui.editor.State',
            'core.ui.editor.Events',
        ],

        overrides: {
            /** @lends core.entities.Editor.prototype */

            getComponents: function () {
                return {
                    state: {
                        globalToLocal: alchemy('core.ui.editor.State').globalToLocal,
                    },

                    vdom: {
                        renderer: alchemy('core.ui.editor.Renderer').renderVdom,
                    },

                    css: {
                        renderer: alchemy('core.ui.editor.Renderer').renderCss,
                    },

                    events: alchemy('core.ui.editor.Events').events,

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
                return alchemy('core.ui.editor.Events').getEventHandler();
            },
        }
    });
}());
