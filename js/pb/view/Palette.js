(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The view for the color palette
     *
     * @class
     * @name pb.view.Palette
     * @extends pb.view.Prima
     */
    alchemy.formula.add({
        name: 'pb.view.Palette',
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.Palette.prototype */

            template: [
                '<form class="color-ct">',
                '<$',
                '  var pd = data.paletteData;',
                '  for (var i = 0, l = pd.length; i < l; i += 4) {',
                '    var r = pd[i];',
                '    var g = pd[i + 1];',
                '    var b = pd[i + 2];',
                '    var a = pd[i + 3];',
                '    var id = \'item-\' + i;',
                '    var c = \'rgba(\' + r + \',\' + g + \',\' + b + \',\' + a + \')\';',
                '  $>',
                '<input id="<$= id$>" type="radio" name="color" value="<$= c$>" class="hidden-radio" />',
                '<label for="<$= id$>" data-color="<$= c$>" style="background-color: <$= c$>" class="visible-radio palette-item"></label>',
                '  <$',
                '  }',
                '$>',
                '</form>',
            ].join(''),

            getData: function () {
                var pCvs = this.getPalette();
                var pCxt = pCvs.getContext('2d');
                var pImd = pCxt.getImageData(0, 0, pCvs.width, pCvs.height);

                return {
                    paletteData: pImd.data
                };
            },

            getPalette: function () {
                if (!this.palette) {
                    var img = this.resources.get('palette');
                    var pal = document.createElement('canvas');
                    var cxt;


                    pal.width = img.width;
                    pal.height = img.height;
                    cxt = pal.getContext('2d');
                    cxt.drawImage(img, 0, 0);

                    this.palette = pal;
                }
                return this.palette;
            }
        }
    });
}());
