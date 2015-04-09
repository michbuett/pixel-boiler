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

            render: function (context) {
                var h = context.h;
                var state = context.state;
                var orientation = state.val('orientation');
                var fps = h('div#fps');
                var intro = h('div#intro');
                var mainMenu = context.renderChild('mainMenu');
                var height = state.val('height');
                var width = state.val('width');

                var spriteList = h('div.sprite-list-wrap', {
                    style: {
                        height: (height - 200) + 'px',
                    },
                }, [context.renderChild('spriteList')]);

                var editorPane = h('div.editor-pane', {
                    className: 'todo',
                    style: {
                        width: (width - 400) + 'px',
                        height: height + 'px',
                    },
                }, 'TODO: Insert editor canvas here!');

                var preview = h('div.preview-area', {
                    className: 'todo',
                    style: {
                        height: '200px',
                    },
                }, 'TODO: insert preview area here!');

                var palette = h('div.palette-wrap', {
                    style: {
                        height: (height - 200) + 'px'
                    },
                }, [context.renderChild('palette')]);

                var content;

                if (orientation === 'landscape') {
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
        }
    });
}());
