describe('core.App', function () {
    'use strict';

    var App = require('../../../src/js/core/App');
    var immutable = require('immutabilis');

    it('initializes the user interface', function () {
        // prepare
        var ui = jasmine.createSpyObj(['init', 'update']);
        var state = immutable.fromJS({ sheet: {}});
        var app = App.brew({
            ui: ui,
            state: state,
            requestAnimationFrame: function () {}
        });

        // execute
        app.launch();

        // verify
        expect(ui.init).toHaveBeenCalledWith(state);
    });

    it('updates the user interface', function () {
        // prepare
        var ui = jasmine.createSpyObj(['update']);
        var state = immutable.fromJS({});
        var app = App.brew({
            ui: ui
        });

        // execute
        app.update({
            state: state
        });

        // verify
        expect(ui.update).toHaveBeenCalled();
    });
});
