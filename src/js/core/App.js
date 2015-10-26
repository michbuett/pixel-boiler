module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');
    var State = require('./State');
    var Applicatus = require('alchemy.js/lib/Applicatus');

    var PaletteController = require('./controller/Palette');
    var SheetController = require('./controller/Sheet');
    var EditorController = require('./controller/Editor');
    var UI = require('./UI');

    /**
     * @class
     * @name todo.app
     * @extends alchemy.web.Applicatus
     */
    return Applicatus.extend({
        /** @lends todo.app.prototype */

        /** @override */
        onLaunch: function () {
            this.ui.init(this.state);
        },

        /** @override */
        update: function (p) {
            var state = p.state;
            this.ui.update(state);
            return state;
        },

    }).whenBrewed(function () {
        this.state = State.getInitialState();

        this.ui = UI.brew({
            messages: this.messages,
        });

        each([
            PaletteController.brew(),
            SheetController.brew(),
            EditorController.brew(),
        ], this.wireUp, this);
    });
}());
