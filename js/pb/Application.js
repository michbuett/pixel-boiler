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
            'pb.Renderer',
        ],

        overrides: {
            /** @lends pb.Application.prototype */

            config: {
                entities: {
                    spriteList: {
                        view: {
                            potion: 'alchemy.browser.View',
                            template: '<div class="pb-spritelist">TODO: list sprites</div>',
                            parent: '#sprite-list'
                        }
                    },
                    editor: {
                        view: {
                            potion: 'alchemy.browser.View',
                            template: '<div class="pb-editor">TODO: implement editor</div>',
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
            },

            finish: function () {
                console.log('Finishing...');
            }
        }
    });
}());

