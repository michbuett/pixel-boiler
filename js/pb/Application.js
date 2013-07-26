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
            'pb.controller.Editor',
            'pb.controller.SpriteList',
            'pb.controller.Palette',
            // views
            'pb.view.Editor',
            'pb.view.SpriteList',
            'pb.view.Palette',
            // modules
            'pb.Renderer',
        ],

        overrides: {
            /** @lends pb.Application.prototype */

            defaultSpriteWidth: 32,
            defaultSpriteHeight: 32,
            defaultSpriteCols: 2,
            defaultSpriteRows: 2,

            config: {
                entities: {
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

            modules: ['pb.Renderer'],

            prepare: function () {
                console.log('Preparing...');
                this.entities.createEntity('palette');
                this.entities.createEntity('spriteList');
                this.entities.createEntity('editor');

                var img = document.createElement('img');
                img.width = this.defaultSpriteCols * this.defaultSpriteWidth;
                img.height = this.defaultSpriteRows * this.defaultSpriteHeight;
                img.onload = (function () {
                    var sheet = alchemy('SpriteSheet').brew({
                        spriteWidth: this.defaultSpriteWidth,
                        spriteHeight: this.defaultSpriteHeight,
                        image: img
                    });

                    this.messages.trigger('sheet:changed', {
                        sheet: sheet
                    });
                }).bind(this);
                img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            },

            finish: function () {
                console.log('Finishing...');
            }
        }
    });
}());

