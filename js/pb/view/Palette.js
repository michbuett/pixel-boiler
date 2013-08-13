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

            templateId: 'tpl-palette',

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
