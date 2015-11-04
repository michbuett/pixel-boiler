module.exports = (function () {
    'use strict';

    var Utils = require('alchemy.js/lib/Utils');

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

                return h('div', {
                    id: context.entityId,
                    className: 'viewport ' + orientation
                }, context.renderAllChildren());
            },
        },

        css: {
            entityRules: function (state) {
                var height = state.val('height');
                var width = state.val('width');
                var isLandscape = (width > height);
                var result = {
                    '> div': {
                        'outline': '1px solid red', // for debugging
                        'position': 'absolute',
                    },

                    '#mainMenu': {
                        'top': 0,
                        'left': 0,
                        'height': '50px',
                        'width': (width - 200) + 'px',
                    },
                };

                if (isLandscape) {
                    result = Utils.mix(result, {
                        '#editorPane': {
                            'top': '50px',
                            'left': '200px',
                            'width': (width - 400) + 'px',
                            'height': (height - 50) + 'px',
                        },

                        '#spriteList': {
                            'top': '50px',
                            'left': 0,
                            'width': '200px',
                            'height': (height - 50) + 'px',
                        },

                        '#palette': {
                            'top': '200px',
                            'right': '0',
                            'width': '200px',
                            'height': (height - 200) + 'px',
                        },

                        '#preview': {
                            'top': 0,
                            'right': 0,
                            'width': '200px',
                            'height': '200px',
                        },
                    });

                } else { // portrait
                    result = Utils.mix(result, {
                        '#editorPane': {
                            'top': '200px',
                            'left': 0,
                            'width': width + 'px',
                            'height': (height - 400) + 'px',
                        },

                        '#spriteList': {
                            'bottom': 0,
                            'left': 0,
                            'width': width + 'px',
                            'height': '200px',
                        },

                        '#palette': {
                            'top': '50px',
                            'left': 0,
                            'width': (width - 200) + 'px',
                            'height': '150px',
                        },

                        '#preview': {
                            'top': 0,
                            'right': 0,
                            'width': '200px',
                            'height': '200px',
                        },
                    });
                }

                return result;
            },
        },

        children: {
            fps: {
                id: 'fps',

                globalToLocal: {
                    fps: 'fps',
                },

                vdom: {
                    renderer: function (ctx) {
                        return ctx.h('div#' + ctx.entityId, 'FPS: ' + ctx.state.val('fps'));
                    },
                },
            },

            editor: {
                id: 'editorPane',
                type: 'core.ui.entities.CenterContainer',
                children: [{
                    type: 'core.ui.entities.Editor',
                }]
            },

            palette: {
                id: 'palette',
                type: 'core.ui.entities.Palette',
            },

            spriteList: {
                id: 'spriteList',
                type: 'core.ui.entities.SpriteList',
            },

            preview: {
                id: 'preview',
                type: 'core.ui.entities.CenterContainer',
                children: [{
                    type: 'core.ui.entities.Preview',
                }]
            }
        },
    };
}());
