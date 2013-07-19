(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name pb.view.Editor
     * @extends alchemy.browser.View
     */
    alchemy.formula.add({
        name: 'pb.view.Editor',
        extend: 'alchemy.browser.View',
        overrides: {
            /** @lends pb.view.Editor.prototype */

            dimX: 32,

            dimY: 32,

            template: [
                '<div class="pb-editor">',
                '<div class="pixel-ct" style="width: <$= (data.dimX * data.size) $>px; height: <$= (data.dimY * data.size) $>px;">',
                '<$',
                '  var i, j, x, y, s = data.size - 1;',
                '  var c, r, g, b, a;',
                '  for (var j = 0; j < data.dimY; j++) {',
                '    y = j * data.size;',
                '    for (var i = 0; i < data.dimX; i++) {',
                '      x = i * data.size;',
                '      c = data.colors[i][j];',
                '      r = c[0];',
                '      g = c[1];',
                '      b = c[2];',
                '      a = c[3];',
                '$>',
                '<div class="pixel-bg" style="left: <$= x $>px; top: <$= y $>px; width: <$= s $>px; height: <$= s $>px;">',
                '  <div class="pixel"',
                '    style="background-color: rgba(<$=r$>, <$=g$>, <$=b$>, <$=a$>);"',
                // location data
                '    data-x="<$= i $>" data-y="<$= j $>"',
                // color data
                '    data-r="<$= r $>" data-g="<$= g $>" data-b="<$= b $>" data-a="<$= a $>"',
                '></div></div>',
                '<$',
                '    }',
                '  }',
                '$>',
                '</div></div>',
            ].join(''),

            /** @protected */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe($(window), 'resize', this.resizeHandler.bind(this));
                    this.observe(this.messages, 'sheet:new', function (data) {
                        this.setSheet(data.sheet);
                    }, this);
                    this.observe(this.messages, 'sprite:selected', function (data) {
                        this.setSprite(data.index);
                    }, this);

                    // Observe dom events for drawing:
                    // - start drawing when mouse down on pixel element
                    // - draw as long as the mouse is pressed
                    // - stop drawing on mouse up anywhere
                    this.observeDom('#editor-pane', '.pixel', 'mousedown', this.handleMouseDown);
                    this.observeDom('#editor-pane', '.pixel', 'mouseenter', this.handleMouseEnter);
                    this.observeDom('body', null, 'mouseup', this.handleMouseUp);
                };
            }),

            /** @private */
            handleMouseDown: function () {
                this.drawing = true;
            },

            /** @private */
            handleMouseUp: function () {
                this.drawing = false;
            },

            /** @private */
            handleMouseEnter: function (e) {
                if (!this.drawing) {
                    return;
                }

                var $pixel = $(e.target);
                var data = $pixel.data();

                if (data) {
                    var color = 'rgba(100, 20, 75, 0.5)';

                    this.currentCvsCtxt.fillStyle = color;
                    this.currentCvsCtxt.fillRect(data.x, data.y, 1, 1);
                    $pixel.css({'background-color': color});
                }

            },

            setSheet: function (sheet) {
                if (this.sheet !== sheet) {
                    this.sheet = sheet;
                    this.setResolution(sheet.spriteWidth, sheet.spriteHeight);
                    this.setSprite(0);
                    this.dirty = true;
                }
            },

            setSprite: function (newIndex) {
                if (this.selectedIndex !== newIndex) {
                    var cvs = this.sheet.getSprite(newIndex);
                    var ctxt = cvs.getContext('2d');

                    this.currentCvsCtxt = ctxt;
                    this.selectedIndex = newIndex;
                    this.dirty = true;
                }
            },

            resizeHandler: function () {
                this.dirty = true;
            },

            setResolution: function (dimX, dimY) {
                this.dimX = dimX;
                this.dimY = dimY;
                this.dirty = true;
            },

            getData: function () {
                var editorCt = $('#editor-pane');
                var availableWidth = Math.floor(editorCt.width() / this.dimX);
                var availableHeight = Math.floor(editorCt.height() / this.dimY);
                var size = Math.min(availableHeight, availableWidth);
                var colors;

                if (this.sheet) {
                    var cvs = this.sheet.getSprite(this.selectedIndex);
                    var ctxt = cvs.getContext('2d');

                    colors = [];
                    for (var x = 0; x < this.dimX; x++) {
                        colors.push([]);

                        for (var y = 0; y < this.dimY; y++) {
                            var pixel = ctxt.getImageData(x, y, 1, 1).data;
                            colors[x].push(pixel);
                        }
                    }
                }

                return {
                    size: size,
                    dimX: this.dimX,
                    dimY: this.dimY,
                    colors: colors
                };
            },

            dispose: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    delete this.sheet;
                    delete this.selectedIndex;
                    delete this.currentCvsCtxt;
                };
            }),
        }
    });
}());
