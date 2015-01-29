(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * @class
     * @name pb.view.ViewPort
     */
    alchemy.formula.add({
        name: 'pb.view.Viewport',

        overrides: {
            /** @lends pb.entities.Viewport.prototype */

            render: function (context, state) {
                var orientation = state.val();
                var fps = context.h('div#fps');
                var intro = context.h('div#intro');
                var mainMenu = context.renderChild('mainMenu');
                var spriteList = context.h('div.sprite-list');
                var editorPane = context.h('div.editor-pane');
                var preview = context.h('div.preview-area');
                var palette = context.h('div.palette');
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
