/* global $ */
describe('web.UI (Viewport)', function () {
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
        expect($('#viewport')).toExist();
        expect($('#viewport #fps')).toExist();
        // expect($('#viewport #intro')).toExist();
        // expect($('#viewport #mainMenu')).toExist();
        expect($('#viewport #spriteList')).toExist();
        expect($('#viewport #palette')).toExist();
        expect($('#viewport #editorPane')).toExist();
        expect($('#viewport #preview')).toExist();
    });
});
