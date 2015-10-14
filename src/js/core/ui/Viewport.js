module.exports = (function () {
    'use strict';

    return {
        /** @lends core.entities.Viewport.prototype */

        globalToLocal: {
            windowWidth: 'width',
            windowHeight: 'height',
        },

        state: {
            width: 800,
            height: 600,
        },

        vdom: {
            root: document.getElementById('viewport'),

            renderer: function renderViewportVdom(context) {
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
                var preview = h('div.preview-area', null, [context.placeholder('preview')]);
                var content = h('div#content', null, [mainMenu, spriteList, editorPane, preview, palette ]);

                return h('div', {
                    id: context.entityId,
                    className: orientation
                }, [fps, intro, content]);
            },
        },

        css: {
            entityRules: function (state) {
                var height = state.val('height');
                var width = state.val('width');
                var isLandscape = (width > height);

                if (isLandscape) {
                    return {
                        '#mainMenu': {
                            'top': 0,
                            'left': 0,
                            'height': '50px',
                            'width': (width - 200) + 'px',
                        },

                        '.editor-wrap': {
                            'top': '50px',
                            'left': '200px',
                            'width': (width - 400) + 'px',
                            'height': (height - 50) + 'px',
                        },

                        '.sprite-list-wrap': {
                            'top': '50px',
                            'left': 0,
                            'width': '200px',
                            'height': (height - 50) + 'px',
                        },

                        '.palette-wrap': {
                            'top': '200px',
                            'right': '0',
                            'width': '200px',
                            'height': (height - 200) + 'px',
                        },

                        '.preview-area': {
                            'top': 0,
                            'right': 0,
                            'width': '200px',
                            'height': '200px',
                        },
                    };
                }

                return { // portrait
                    '#mainMenu': {
                        'top': 0,
                        'left': 0,
                        'height': '50px',
                        'width': (width - 200) + 'px',
                    },

                    '.editor-wrap': {
                        'top': '200px',
                        'left': 0,
                        'width': width + 'px',
                        'height': (height - 400) + 'px',
                    },

                    '.sprite-list-wrap': {
                        'bottom': 0,
                        'left': 0,
                        'width': width + 'px',
                        'height': '200px',
                    },

                    '.palette-wrap': {
                        'top': '50px',
                        'left': 0,
                        'width': (width - 200) + 'px',
                        'height': '150px',
                    },

                    '.preview-area': {
                        'top': 0,
                        'right': 0,
                        'width': '200px',
                        'height': '200px',
                    },
                };
            },
        },
    };
}());
