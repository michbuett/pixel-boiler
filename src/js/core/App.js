module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');
    var State = require('./State');
    var Applicatus = require('alchemy.js/lib/Applicatus');

    var PaletteController = require('./controller/Palette');
    var SheetController = require('./controller/Sheet');
    var EditorController = require('./controller/Editor');
    var SpriteListController = require('./controller/SpriteList');
    var DialogController = require('./controller/Dialog');

    var sheetLib = require('./lib/Sheet');

    /**
     * @class
     * @name todo.app
     * @extends alchemy.web.Applicatus
     */
    return Applicatus.extend({
        /** @lends todo.app.prototype */

        /** @override */
        onLaunch: function () {
            var sheeData = this.state.sub('sheet');
            var messages = this.messages;

            sheetLib.createSpriteSheet({
                spriteWidth: sheeData.val('spriteWidth'),
                spriteHeight: sheeData.val('spriteHeight'),
                columns: sheeData.val('columns'),
                rows: sheeData.val('rows'),
                callback: function (result) {
                    messages.trigger('sheet:updated', result);
                }
            });

            each([
                PaletteController.brew(),
                SheetController.brew(),
                EditorController.brew(),
                SpriteListController.brew(),
                DialogController.brew(),
            ], this.wireUp, this);

            this.ui.init(this.state);
        },

        /** @override */
        update: function (p) {
            var state = p.state
                .set('fps', p.fps)
                .set('windowWidth', document.body.offsetWidth)
                .set('windowHeight', document.body.offsetHeight);

            this.ui.update(state);
            return state;
        },

    }).whenBrewed(function () {
        this.state = State.getInitialState();
    });
}());
