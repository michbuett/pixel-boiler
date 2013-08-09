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
                '  var index = 0;',
                '  for (var i = 0, l = pd.length; i < l; i += 4) {',
                '    var r = pd[i];',
                '    var g = pd[i + 1];',
                '    var b = pd[i + 2];',
                '    var a = pd[i + 3] / 255;',
                '    var id = \'item-\' + i;',
                '    var c = \'rgba(\' + r + \',\' + g + \',\' + b + \',\' + a + \')\';',
                '$>',

                // a hidden radio button to take advantage of the browsers handling of radio groups
                '<input',
                '  id="<$= id $>"',
                '  type="radio"',
                '  name="color"',
                '  value="<$= c $>"',
                '  class="hidden-radio"',
                '>',
                // the visible palette elements (a label can delegate their clicks to a input element)
                '<div class="visible-radio">',
                '<label',
                '  for="<$= id $>"',
                '  data-color="<$= c $>"',
                '  data-r="<$= r $>"',
                '  data-g="<$= g $>"',
                '  data-b="<$= b $>"',
                '  data-a="<$= a $>"',
                '  data-index="<$= index $>"',
                '  style="background-color: <$= c $>"',
                '  class="visible-radio palette-item"',
                '></label></div>',

                '<$',
                '    index++;',
                '  } $>',
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
                    this.palette = this.resources.get('palette');
                }
                return this.palette;
            }
        }
    });
}());
