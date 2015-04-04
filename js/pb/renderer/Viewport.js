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
                var state = context.state;
                var orientation = state.val('orientation');
                var fps = context.h('div#fps', null, 'FPS: ' + state.val('fps'));
                var intro = context.h('div#intro');
                var mainMenu = context.renderChild('mainMenu');
                var height = state.val('height');
                var width = state.val('width');

                var spriteList = context.h('div.sprite-list', {
                    className: 'todo',
                    style: {
                        height: (height - 200) + 'px',
                    },
                }, 'TODO: insert sprite list here!');

                var editorPane = context.h('div.editor-pane', {
                    className: 'todo',
                    style: {
                        width: (width - 400) + 'px',
                        height: height + 'px',
                    },
                }, 'TODO: Insert editor canvas here!');

                var preview = context.h('div.preview-area', {
                    className: 'todo',
                    style: {
                        height: '200px',
                    },
                }, 'TODO: insert preview area here!');

                var palette = context.renderChild('palette');

                var content;

                if (orientation === 'landscape') {
                    content = [
                        context.h('div.toolbar', null, [mainMenu, spriteList]),
                        editorPane,
                        context.h('div.toolbar', null, [preview, palette]),
                    ];
                } else { // portrait
                    content = [
                        context.h('div.toolbar', null, [mainMenu, palette, preview]),
                        editorPane,
                        context.h('div.toolbar', null, [spriteList]),
                    ];
                }

                return context.h('div#viewport', {
                    className: orientation
                }, [fps, intro, context.h('div#content', null, content)]);
            },
        }
    });
}());
