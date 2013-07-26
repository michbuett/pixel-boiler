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
                '  for (var i = 0, l = data.colors.length; i < l; i++) {',
                '      var id = \'item-\' + i;',
                '      var c = data.colors[i];',
                '  $>',
                '<input id="<$= id$>" type="radio" name="color" value="<$= c$>" class="hidden-radio" />',
                '<label for="<$= id$>" data-color="<$= c$>" style="background-color: <$= c$>" class="visible-radio palette-item"></label>',
                '  <$',
                '  }',
                '$>',
                '</form>',
            ].join(''),

            getData: function () {
                return {
                    colors: [
                        '#B88A00', '#8AB800', '#2EB800', '#00B82E',
                        '#00B88A', '#008AB8', '#002EB8', '#2E00B8',
                        '#8A00B8', '#B8008A', '#B8002E', '#B82E00',
                        '#F5B800', '#FFCC33', '#003DF5', '#3366FF',
                        '#000000', '#202020', '#404040', '#707070',
                        '#A0A0A0', '#B7B7B7', '#D0D0D0', '#FFFFFF',
                    ]
                };
            },
        }
    });
}());
