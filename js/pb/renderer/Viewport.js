(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.renderer.ViewPort
     */
    alchemy.formula.add({
        name: 'pb.renderer.Viewport',

        overrides: {
            /** @lends pb.renderer.Viewport.prototype */

            renderVdom: function (context) {
                var h = context.h;
                var state = context.state;
                var height = state.val('height');
                var width = state.val('width');
                var isLandscape = (width > height);
                var orientation = isLandscape ? 'landscape' : 'portrait';

                var fps = context.placeholder('fps');
                var intro = context.placeholder('intro');
                var mainMenu = context.placeholder('mainMenu');
                var spriteList = h('div.sprite-list-wrap', null, [context.placeholder('spriteList')]);
                var palette = h('div.palette-wrap', null, [context.placeholder('palette')]);
                var editorPane = h('div.editor-wrap', null, [context.placeholder('editorPane')]);
                var preview = h('div.preview-area.todo', null, 'TODO: Insert preview here!');
                var content = h('div#content', null, [mainMenu, spriteList, editorPane, preview, palette ]);

                return h('div#viewport', {
                    className: orientation
                }, [fps, intro, content]);
            },

            renderCss: function (state) {
                var height = state.val('height');
                var width = state.val('width');
                var isLandscape = (width > height);

                if (isLandscape) {
                    return {
                        '#viewport #mainMenu': {
                            'top': 0,
                            'left': 0,
                            'height': '50px',
                            'width': (width - 200) + 'px',
                        },

                        '#viewport .editor-wrap': {
                            'top': '50px',
                            'left': '200px',
                            'width': (width - 400) + 'px',
                            'height': (height - 50) + 'px',
                        },

                        '#viewport .sprite-list-wrap': {
                            'top': '50px',
                            'left': 0,
                            'width': '200px',
                            'height': (height - 50) + 'px',
                        },

                        '#viewport .palette-wrap': {
                            'top': '200px',
                            'right': '0',
                            'width': '200px',
                            'height': (height - 200) + 'px',
                        },

                        '#viewport .preview-area': {
                            'top': 0,
                            'right': 0,
                            'width': '200px',
                            'height': '200px',
                        },
                    };
                }

                return { // portrait
                    '#viewport #mainMenu': {
                        'top': 0,
                        'left': 0,
                        'height': '50px',
                        'width': (width - 200) + 'px',
                    },

                    '#viewport .editor-wrap': {
                        'top': '200px',
                        'left': 0,
                        'width': width + 'px',
                        'height': (height - 400) + 'px',
                    },

                    '#viewport .sprite-list-wrap': {
                        'bottom': 0,
                        'left': 0,
                        'width': width + 'px',
                        'height': '200px',
                    },

                    '#viewport .palette-wrap': {
                        'top': '50px',
                        'left': 0,
                        'width': (width - 200) + 'px',
                        'height': '150px',
                    },

                    '#viewport .preview-area': {
                        'top': 0,
                        'right': 0,
                        // 'left': (width - 200) + 'px',
                        'width': '200px',
                        'height': '200px',
                    },
                };
            },
        }
    });
}());
