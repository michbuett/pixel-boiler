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
                '<div class="pb-editor"><div class="pixel-ct">',
                '<$',
                '  if (data.spriteSheet) {',
                '    var i, j, x, y, s = data.size - 1;',
                '    for (var j = 0; j < data.dimY; j++) {',
                '      y = j * data.size;',
                '      for (var i = 0; i < data.dimX; i++) {',
                '        x = i * data.size;',
                '$>',
                '<div class="pixel" data-x="<$= i $>" data-y="<$= j $>"',
                '  style="left: <$= x $>px; top: <$= y $>px; width: <$= s $>px; height: <$= s $>px;">',
                '</div>',
                '<$',
                '      }',
                '    }',
                '  } else { ',
                '$> ',
                '<input id="file-selector" type="file" />',
                '<$ ',
                '  } ',
                '$>',
                '</div></div>',
            ].join(''),

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
