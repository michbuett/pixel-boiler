(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * Description
     *
     * @class
     * @name nw.overrides
     * @extends alchemy.core.MateriaPrima
     */
    alchemy.formula.add({
        name: 'nw.overrides',
        extend: 'alchemy.core.MateriaPrima',
        overrides: {
            /** @lends nw.Overrides.prototype */

            requires: ['pb.Sheeter'],

            apply: function () {
                alchemy.extend(alchemy('pb.Sheeter'), {
                    load: this.openSpriteSheet,
                    save: this.saveSpriteSheet,
                });
            },

            openSpriteSheet: function (cfg) {
                console.log('[nw.Overrides] openSpriteSheet', cfg);
            },

            saveSpriteSheet: function (cfg) {
                $('body').append('<input id="saveas" type="file" nwsaveas="' + cfg.filename + '">');
                var $saveAs = $('input#saveas');

                $saveAs.on('change', function () {
                    var file = $saveAs[0].files[0];
                    var imgData = cfg.canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
                    var buffer = new Buffer(imgData, 'base64');
                    window.fileSystem.writeFileSync(file.path, buffer);
                    $saveAs.remove();
                });

                $saveAs.on('abort', function () {
                    $saveAs.remove();
                });

                $saveAs.click();
            },

        }
    });
}());
