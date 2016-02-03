/* global $ */
describe('web.UI (FPS)', function () {
    'use strict';

    var uiHelper = require('../../../helper/ui.helper.js');

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
