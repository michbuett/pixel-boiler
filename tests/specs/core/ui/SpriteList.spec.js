/* global $ */
describe('core.UI (SpriteList)', function () {
    'use strict';

    var Observari = require('alchemy.js/lib/Observari');
    var State = require('../../../../src/js/core/State');
    var UI = require('../../../../src/js/core/UI');
    var uiHelper = window.uiHelper(Observari, State, UI);

    beforeEach(function () {
        uiHelper.setUp(this);

        var context = document.createElement('canvas').getContext('2d');
        var sheet = this.state.sub('sheet').set({
            sprites: [
                context.getImageData(0, 0, 1, 1),
                context.getImageData(0, 1, 1, 1),
                context.getImageData(1, 0, 1, 1),
                context.getImageData(1, 1, 1, 1),
            ],
            columns: 2,
            rows: 2,
            spriteWidth: 1,
            spriteHeight: 1,
        });

        this.state = this.state.set({
            sheet: sheet,
            windowWidth: 100,
            windowHeight: 100,
        });
    });

    afterEach(function () {
        uiHelper.tearDown(this);
    });

    it('is there', function () {
        // prepare
        // execute
        this.ui.update(this.state);

        // verify
        expect($('#spriteList ul')).toExist();
    });

    it('contains all sprites', function () {
        // prepare
        var sprites = this.state.sub('sheet').val('sprites');

        // execute
        this.ui.update(this.state);

        // verify
        for (var i = 0, l = sprites.length; i < l; i++) {
            expect($('#spriteList .item[data-index="' + i + '"]')).toExist();
        }
    });

    it('triggers the "sheet:spriteSelected" event', function () {
        // prepare
        var selectedIndex;
        var spy = jasmine.createSpy().and.callFake(function (data) {
            selectedIndex = data.index;
        });
        this.messages.on('sheet:spriteSelected', spy);
        this.ui.update(this.state);

        // execute
        $('#spriteList li.item[data-index="2"]').click();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(selectedIndex).toBe(2);
    });
});
