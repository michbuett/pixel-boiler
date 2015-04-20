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
                var fps = h('div#fps');
                var intro = h('div#intro');
                var mainMenu = context.placeholder('mainMenu');
                var height = state.val('height');
                var width = state.val('width');
                var isLandscape = (width > height);
                var orientation = isLandscape ? 'landscape' : 'portrait';
                var props = {
                    h: h,
                    isLandscape: isLandscape,
                    width: width,
                    height: height,
                };
                var content;
                var spriteList = renderSprites(props, context.placeholder('spriteList'));
                var palette = renderPalette(props, context.placeholder('palette'));
                var editorPane = renderEditor(props, context.placeholder('editor-pane'));
                var preview = renderPreview(props, context.placeholder('preview-area'));

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
        }
    });

    /** @private */
    function renderSprites(p, spriteList) {
        var style = {};

        if (p.isLandscape) {
            style.height = (p.height - 200) + 'px';
        } else {
            style.width = p.width + 'px';
        }

        return p.h('div.sprite-list-wrap', {
            style: style,
        }, [spriteList]);
    }

    /** @private */
    function renderPalette(p, palette) {
        var style = {};

        if (p.isLandscape) {
            style.width = '200px';
            style.height = (p.height - 200) + 'px';
        } else {
            style.height = '200px';
            style.width = (p.width - 400) + 'px';
        }

        return p.h('div.palette-wrap', {
            style: style,
        }, [palette]);
    }

    /** @private */
    function renderEditor(p, editor) {
        var style = {};

        if (p.isLandscape) {
            style.width = (p.width - 400) + 'px';
            style.height = p.height + 'px';
        } else {
            style.width = p.width + 'px';
            style.height = (p.height - 400) + 'px';
        }

        return p.h('div.editor-pane', {
            className: 'todo',
            style: style,
        }, 'TODO: Insert editor canvas here!');
    }

    /** @private */
    function renderPreview(p, editor) {
        return p.h('div.preview-area', {
            className: 'todo',
            style: {
                height: '200px',
            },
        }, 'TODO: insert preview area here!');
    }
}());
