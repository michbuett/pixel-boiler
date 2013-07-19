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
            'alchemy.browser.View',
            'pb.controller.Editor',
            'pb.controller.SpriteList',
            'pb.view.Editor',
            'pb.view.SpriteList',
            'pb.Renderer',
        ],

        overrides: {
            /** @lends pb.Application.prototype */

            defaultSpriteWidth: 32,
            defaultSpriteHeight: 32,

            config: {
                entities: {
                    spriteList: {
                        controller: {
                            potion: 'pb.controller.SpriteList',
                        },
                        view: {
                            potion: 'pb.view.SpriteList',
                            parent: '#sprite-list'
                        }
                    },

                    editor: {
                        controller: {
                            potion: 'pb.controller.Editor',
                        },
                        view: {
                            potion: 'pb.view.Editor',
                            parent: '#editor-pane'
                        }
                    }
                }
            },

            modules: ['pb.Renderer'],

            prepare: function () {
                console.log('Preparing...');
                this.entities.createEntity('spriteList');
                this.entities.createEntity('editor');

                var img = document.createElement('img');
                img.width = this.defaultSpriteWidth;
                img.height = this.defaultSpriteHeight;
                img.onload = (function () {
                    var sheet = alchemy('SpriteSheet').brew({
                        spriteWidth: this.defaultSpriteWidth,
                        spriteHeight: this.defaultSpriteHeight,
                        image: img
                    });

                    this.messages.trigger('sheet:new', {
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

