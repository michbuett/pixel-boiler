(function () {
    'use strict';

    var App = require('../core/App');
    var UI = require('./UI');
    var Observari = require('alchemy.js/lib/Observari');
    var messages, ui, app;

    window.onload = function onLoad() {
        messages = Observari.brew();

        ui = UI.brew({
            messages: messages,
        });

        app = App.brew({
            ui: ui,
            messages: messages,
        });
        app.launch();

        window.app = app; // global reference for debugging
    };

    window.onunload = function onUnload() {
        [app, ui, messages].forEach(function (obj) {
            obj.dispose();
        });

        window.app = null;
    };
}());
