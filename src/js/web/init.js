(function () {
    'use strict';

    var App = require('../core/App');

    window.onload = function onLoad() {
        window.app = App.brew();
        window.app.launch();
    };

    window.onunload = function onUnload() {
        window.app.dispose();
        window.app = null;
    };
}());
