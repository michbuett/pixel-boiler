/* global $ */
describe('web.UI (Palette)', function () {
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
        expect($('#palette #palette-items')).toExist();
    });

    it('contains all colors', function () {
        // prepare
        var colors = this.state.sub('colors').val('palette');

        // execute
        this.ui.update(this.state);

        // verify
        for (var i = 0, l = colors.length; i < l; i++) {
            expect($('.palette-item[data-color="' + colors[i] + '"]')).toExist();
        }
    });

    it('triggers the "color:selected" event', function () {
        // prepare
        var selectedColor;
        var spy = jasmine.createSpy().and.callFake(function (data) {
            selectedColor = data.color;
        });
        this.messages.on('color:selected', spy);
        this.ui.update(this.state);

        // execute
        $('.palette-item[data-color="#222034"]').click();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(selectedColor).toBe('#222034');
    });
});
