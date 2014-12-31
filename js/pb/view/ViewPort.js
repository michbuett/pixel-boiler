(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The main viewport
     *
     * @class
     * @name pb.view.ViewPort
     * @extends alchemy.web.Visio
     */
    alchemy.formula.add({
        name: 'pb.view.ViewPort',
        extend: 'alchemy.web.Visio',

        requires: [
            'pb.view.MainMenu',
            'pb.view.Palette',
        ],

        overrides: {
            /** @lends pb.view.ViewPort.prototype */

            /** @protected */
            init: function () {
                var cfg = {
                    messages: this.messages
                };

                this.subs = {
                    mainMenu: alchemy('pb.view.MainMenu').brew(cfg),
                    palette: alchemy('pb.view.Palette').brew(cfg),
                };
            },

            /** @protected */
            render: function () {
                var h = this.h;
                var orientation = this.state.val('orientation');
                var fps = h('div#fps');
                var intro = h('div#intro');
                var mainMenu = this.renderSub('mainMenu');
                var spriteList = h('div.sprite-list');
                var editorPane = h('div.editor-pane');
                var preview = h('div.preview-area');
                var palette = h('div.palette', null, [this.renderSub('palette')]);
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


