/* global $ */
describe('web.UI (Editor)', function () {
    'use strict';

    var uiHelper = require('../../../helper/ui.helper.js');

    beforeEach(function () {
        uiHelper.setUp(this);

        var context = document.createElement('canvas').getContext('2d');
        var sheet = this.state.sub('sheet').set({
            sprites: [context.getImageData(0, 0, 2, 2)],
            spriteWidth: 2,
            spriteHeight: 2,
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
        expect($('canvas#editor-pane')).toExist();
    });

    it('triggers the "sheet:draw" event', function () {
        // prepare
        var spy = jasmine.createSpy();
        this.messages.on('sheet:draw', spy);
        this.ui.update(this.state);

        var eMouseDown = $.Event('mousedown');
        var eMouseMove = $.Event('mousemove');
        var eMouseUp = $.Event('mouseup');

        // execute
        $('canvas#editor-pane').trigger(eMouseDown);
        $('canvas#editor-pane').trigger(eMouseMove);
        $('canvas#editor-pane').trigger(eMouseUp);

        // verify
        expect(spy).toHaveBeenCalled();
    });

    it('allows to draw a line', function () {
        // prepare
        var actualImgData;
        var onDraw = function (data) {
            actualImgData = data.sprites[0];
        };

        this.state = this.state.set(
            'colors',
            this.state.sub('colors').set('selected', '#656667')
        );
        this.messages.on('sheet:draw', onDraw);
        this.ui.update(this.state);

        // execute
        draw([[0, 0], [1, 0], [1, 1]]);

        // verify
        expectImg(actualImgData, [
            [[101, 102, 103, 255], [101, 102, 103, 255]],
            [[  0,   0,   0,   0], [101, 102, 103, 255]],
        ]);
    });

    it('has no side effect on the application state when drawing', function () {
        // prepare
        var actualImgData;
        var onDraw = function (data) {
            actualImgData = data.sprites[0];
        };

        this.state = this.state.set(
            'colors',
            this.state.sub('colors').set('selected', '#656667')
        );
        this.messages.on('sheet:draw', onDraw);
        this.ui.update(this.state);

        // execute
        draw([[0, 0], [1, 1]]);

        // verify
        expectImg(actualImgData, [
            [[101, 102, 103, 255], [  0,   0,   0,   0]],
            [[  0,   0,   0,   0], [101, 102, 103, 255]],
        ]);
        expectImg(this.state.sub('sheet').sub('sprites').val('0'), [
            [[0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0]],
        ]);
    });

    /** @private */
    function draw(points) {
        var e = $.Event('mousedown');
        e.offsetX = points[0][0];
        e.offsetY = points[0][1];

        $('canvas#editor-pane').trigger(e);

        for (var i = 0, l = points.length; i < l; i++) {
            e = $.Event('mousemove');
            e.offsetX = points[i][0];
            e.offsetY = points[i][1];

            $('canvas#editor-pane').trigger(e);
        }

        e = $.Event('mouseup');
        e.offsetX = points[points.length - 1][0];
        e.offsetY = points[points.length - 1][1];

        $('canvas#editor-pane').trigger(e);
    }

    /** @private */
    function expectImg(actual, expected) {
        for (var y = 0; y < expected.length; y++) {
            for (var x = 0; x < expected[y].length; x++) {
                var i = expected[y].length * y + x;
                expect(actual.data[4 * i + 0]).toBe(expected[y][x][0]);
                expect(actual.data[4 * i + 1]).toBe(expected[y][x][1]);
                expect(actual.data[4 * i + 2]).toBe(expected[y][x][2]);
                expect(actual.data[4 * i + 3]).toBe(expected[y][x][3]);
            }
        }
    }
});
