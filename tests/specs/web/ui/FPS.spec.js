/* global $ */
describe('web.UI (FPS)', function () {
    'use strict';

    var Observari = require('alchemy.js/lib/Observari');
    var State = require('../../../../src/js/core/State');
    var UI = require('../../../../src/js/web/UI');
    var uiHelper = window.uiHelper(Observari, State, UI);

    beforeEach(function () {
        uiHelper.setUp(this);
    });

    afterEach(function () {
        uiHelper.tearDown(this);
    });

    it('is there', function () {
        // prepare
        // execute
        this.ui.update(this.state);

        // verify
        expect($('div.fps')).toExist();
    });

    it('shows the current FPS', function () {
        // prepare
        this.state = this.state.set('fps', 42);

        // execute
        this.ui.update(this.state);

        // verify
        expect($('div.fps')).toContainText('FPS: 42');
    });
});
