module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');
    var immutable = require('immutabilis');
    var Applicatus = require('alchemy.js/lib/Applicatus');

    var PaletteController = { brew: brewDummyController };
    var SheetController = { brew: brewDummyController };
    var EditorController = { brew: brewDummyController };
    var UI = { brew: brewDummyUI };

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
        this.state = immutable.fromJS({
        });

        this.ui = UI.brew({
            messages: this.messages,
        });

        each([
            PaletteController.brew(),
            SheetController.brew(),
            EditorController.brew(),
        ], this.wireUp, this);
    });

    function brewDummyController() {
        return {
            messages: {},
        };
    }

    function brewDummyUI() {
        return {
            init: function () {},
            update: function () {},
        };
    }
}());
