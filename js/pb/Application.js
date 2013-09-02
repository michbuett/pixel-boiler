(function () {
    'use strict';

    var alchemy = require('./alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.Application
     * @extends alchemy.browser.Application
     */
    alchemy.formula.add({
        name: 'pb.Application',
        extend: 'alchemy.browser.Application',

        requires: [
            // controller
            'pb.controller.Preview',
            'pb.controller.Editor',
            'pb.controller.SpriteList',
            'pb.controller.Palette',
            // views
            'pb.view.Preview',
            'pb.view.Editor',
            'pb.view.SpriteList',
            'pb.view.Palette',
            // modules
            'pb.Sheeter',
            'pb.Renderer',
        ],

        overrides: {
            /** @lends pb.Application.prototype */

            config: {
                resources: [{
                    id: 'palette',
                    src: 'images/palette.png',
                }, {
                    id: 'tpl-preview',
                    src: 'templates/preview.tpl',
                }, {
                    id: 'tpl-editor',
                    src: 'templates/editor.tpl',
                }, {
                    id: 'tpl-palette',
                    src: 'templates/palette.tpl',
                }, {
                    id: 'tpl-spriteList',
                    src: 'templates/spriteList.tpl',
                }, {
                    id: 'tpl-context-menu',
                    src: 'templates/contextMenu.tpl',
                }, {
                    id: 'tpl-newDlg',
                    src: 'templates/newDlg.tpl',
                }, {
                    id: 'tpl-importDlg',
                    src: 'templates/importDlg.tpl',
                }, {
                    id: 'tpl-exportDlg',
                    src: 'templates/exportDlg.tpl',
                }],

                entities: {
                    preview: {
                        controller: {
                            potion: 'pb.controller.Preview',
                        },
                        view: {
                            potion: 'pb.view.Preview',
                            target: '#preview-area'
                        }
                    },

                    palette: {
                        controller: {
                            potion: 'pb.controller.Palette',
                        },
                        view: {
                            potion: 'pb.view.Palette',
                            target: '#palette'
                        }
                    },

                    spriteList: {
                        controller: {
                            potion: 'pb.controller.SpriteList',
                        },
                        view: {
                            potion: 'pb.view.SpriteList',
                            target: '#sprite-list'
                        }
                    },

                    editor: {
                        controller: {
                            potion: 'pb.controller.Editor',
                        },
                        view: {
                            potion: 'pb.view.Editor',
                            target: '#editor-pane'
                        }
                    }
                }
            },

            modules: [
                'pb.Sheeter',
                'pb.Renderer'
            ],

            prepare: function () {
                this.entities.createEntity('preview');
                this.entities.createEntity('palette');
                this.entities.createEntity('spriteList');
                this.entities.createEntity('editor');
            },

            finish: function () {
                console.log('Finishing...');
            }
        }
    });
}());

