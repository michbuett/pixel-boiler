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
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.Editor.prototype */

            dimX: 32,

            dimY: 32,

            drawing: false,

            templateId: 'tpl-editor',

            /** @protected */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe($(window), 'resize', this.resizeHandler.bind(this));
                    this.observe(this.messages, 'sheet:changed', function (data) {
                        this.setSheet(data.sheet);
                    }, this);
                    this.observe(this.messages, 'sprite:selected', function (data) {
                        this.setSprite(data.index);
                    }, this);
                };
            }),

            getCanvasContext: function () {
                return this.currentCvsCtxt;
            },

            /** @private */
            setSheet: function (sheet) {
                if (this.sheet !== sheet) {
                    this.sheet = sheet;
                    this.setResolution(sheet.spriteWidth, sheet.spriteHeight);
                    this.setSprite(0);
                    this.dirty = true;
                }
            },

            /** @private */
            setSprite: function (newIndex) {
                if (this.selectedIndex !== newIndex) {
                    var cvs = this.sheet.getSprite(newIndex);
                    var ctxt = cvs.getContext('2d');

                    this.currentCvsCtxt = ctxt;
                    this.selectedIndex = newIndex;
                    this.dirty = true;
                }
            },

            /** @private */
            resizeHandler: function () {
                this.dirty = true;
            },

            /** @private */
            setResolution: function (dimX, dimY) {
                this.dimX = dimX;
                this.dimY = dimY;
                this.dirty = true;
            },

            /** @protected */
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

            /** @protected */
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
