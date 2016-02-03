/* global $ */
describe('web.UI (ExportDialog)', function () {
    'use strict';

    var uiHelper = require('../../../helper/ui.helper.js');
    var testImg = [
        'rgb(0, 0, 0)',     'rgb(32, 32, 52)',  'rgb(69, 40, 60)',
        'rgb(102, 57, 49)', 'rgb(143, 86, 59)', 'rgb(223, 113, 38)',
    ];

    beforeEach(function () {
        uiHelper.setUp(this);
    });

    afterEach(function () {
        uiHelper.tearDown(this);
    });

    it('is there and disabled by default', function () {
        // prepare
        // execute
        this.ui.update(this.state);

        // verify
        expect($('#export-dlg.dlg')).toExist();
        expect($('#export-dlg.dlg')).toHaveClass('closed');
    });

    it('is opened in the "export" mode', function () {
        // prepare
        var state = this.state.set('mode', 'export');

        // execute
        this.ui.update(state);

        // verify
        expect($('#export-dlg.dlg')).toHaveClass('opened');
    });

    it('shows an image of all sprites', function () {
        // prepare
        var state = createTestImage(this.state.set('mode', 'export'));

        // execute
        this.ui.update(state);

        // verify
        var imgSrc = $('#export-dlg.dlg img').prop('src');
        expect(imgSrc).toBe(getUrlOfTestImage());
    });

    /** @private */
    function createTestImage(state) {
        var context = document.createElement('canvas').getContext('2d');
        var sprites = [];

        testImg.forEach(function (color) {
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            sprites.push(context.getImageData(0, 0, 1, 1));
        });

        var sheet = state.sub('sheet').set({
            sprites: sprites,
            spriteWidth: 1,
            spriteHeight: 1,
            columns: 2,
            rows: 3,
        });

        return state.set({
            sheet: sheet,
        });
    }

    /** @private */
    function getUrlOfTestImage() {
        var cvs = document.createElement('canvas');
        var ctx = cvs.getContext('2d');

        cvs.width = 2;
        cvs.height = 3;

        for (var i = 0, l = testImg.length; i < l; i++) {
            ctx.fillStyle = testImg[i];
            ctx.fillRect(i % 2, Math.floor(i / 2), 1, 1);
        }

        return cvs.toDataURL();
    }
});
