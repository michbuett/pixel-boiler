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
                '  var i, j, x, y, s = data.size - 1, c;',
                '  for (var j = 0; j < data.dimY; j++) {',
                '    y = j * data.size;',
                '    for (var i = 0; i < data.dimX; i++) {',
                '      x = i * data.size;',
                '      c = (i + j) % 2 === 0 ? \'white\' : \'gray\';',
                '$>',
                '<div class="pixel <$= c $>" data-x="<$= i $>" data-y="<$= j $>"',
                '  style="left: <$= x $>px; top: <$= y $>px; width: <$= s $>px; height: <$= s $>px;">',
                '</div>',
                '<$',
                '    }',
                '  }',
                '$>',
                '</div></div>',
            ].join(''),

            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe($(window), 'resize', this.resizeHandler.bind(this));
                    this.observe(this.messages, 'sheet:new', this.onSheetChanged, this);
                };
            }),

            onSheetChanged: function (data) {
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

                return {
                    size: size,
                    dimX: this.dimX,
                    dimY: this.dimY
                };
            },
        }
    });
}());
