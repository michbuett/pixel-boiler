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

                var content;
                var fps = h('div#fps');
                var intro = h('div#intro');
                var mainMenu = context.placeholder('mainMenu');
                var spriteList = h('div.sprite-list-wrap', null, [context.placeholder('spriteList')]);
                var palette = h('div.palette-wrap', null, [context.placeholder('palette')]);
                var editorPane = h('div.editor-pane.todo', null, 'TODO: Insert editor here!');
                var preview = h('div.preview-area.todo', null, 'TODO: Insert preview here!');

                if (isLandscape) {
                    content = [
                        h('div.toolbar', null, [mainMenu, spriteList]),
                        editorPane,
                        h('div.toolbar', null, [preview, palette]),
                    ];
                } else { // portrait
                    content = [
                        h('div.toolbar', null, [mainMenu, palette, preview]),
                        editorPane,
                        h('div.toolbar', null, [spriteList]),
                    ];
                }

                return h('div#viewport', {
                    className: orientation
                }, [fps, intro, h('div#content', null, content)]);
            },

            renderCss: function (state) {
                var height = state.val('height');
                var width = state.val('width');
                var isLandscape = (width > height);

                return {
                    '#viewport .editor-pane': {
                        'width': isLandscape ? (width - 400) + 'px': width + 'px',
                        'height': isLandscape ? height + 'px' : (height - 400) + 'px',
                    },

                    '#viewport .sprite-list-wrap': {
                        'width': isLandscape ? '200px' : (width - 200) + 'px',
                        'height': isLandscape ? (height - 200) + 'px' : '200px',
                    },

                    '#viewport .palette-wrap': {
                        'width': isLandscape ? '200px' : (width - 400) + 'px',
                        'height': isLandscape ? (height - 200) + 'px' : '200px',
                    },

                    '#viewport .preview-area': {
                        'width': '200px',
                        'height': '200px',
                    },
                };
            },
        }
    });
}());
