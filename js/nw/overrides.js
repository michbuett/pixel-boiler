(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    var overrides = [{
        name: 'pb.Sheeter',
        extend: 'pb.Sheeter',
        overrides: {
            /** @lends nw.Sheeter.prototype */

            load: function (cfg) {
                console.log('[nw.Sheeter] load', cfg);
            },

            save: function (cfg) {
                console.log('[nw.Sheeter] save', cfg);
                if (!cfg || !cfg.canvas) {
                    return;
                }

                if (cfg.filePath) {
                    this.saveSpriteSheet(cfg.filePath, cfg.canvas);

                    if (alchemy.isFunction(cfg.success)) {
                        cfg.success.call(cfg.scope);
                    }
                } else {
                    this.selectSaveAsFile(function (file) {
                        this.save(alchemy.mix(cfg, {
                            filePath: file.path
                        }));
                    }, this);
                }
            },

            saveSpriteSheet: function (filePath, canvas) {
                var imgData = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
                var buffer = new Buffer(imgData, 'base64');
                window.fileSystem.writeFileSync(filePath, buffer);
            },

            selectSaveAsFile: function (cb, scope) {
                $('body').append('<input id="saveas" type="file" nwsaveas="Untitled.png">');
                var $saveAs = $('input#saveas');

                $saveAs.on('change', function () {
                    var file = $saveAs[0].files[0];
                    $saveAs.remove();
                    cb.call(scope, file);
                });

                $saveAs.on('abort', function () {
                    $saveAs.remove();
                });

                $saveAs.click();
            },
        }
    }];

    /**
     * Description
     *
     * @class
     * @name nw.overrides
     * @extends alchemy.core.MateriaPrima
     */
    alchemy.formula.add({
        name: 'nw.overrides',
        overrides: {
            /** @lends nw.Overrides.prototype */

            /**
             * Applies the node-webkit specific overrides
             */
            apply: function () {
                alchemy.each(overrides, alchemy.brew);
            },
        }
    });
}());
