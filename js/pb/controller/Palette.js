(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The controller for the color palette
     *
     * @class
     * @name pb.controller.Palette
     * @extends pb.controller.Prima
     */
    alchemy.formula.add({
        name: 'pb.controller.Palette',
        extend: 'pb.controller.Prima',
        overrides: {
            /** @lends pb.controller.Palette.prototype */

            viewEvents: {
                'click .palette-item': 'pickColor',
                'dblclick .palette-item': 'changePalette',
                'rendered': 'onRender',
            },

            index: 0,

            color: undefined,

            /**
             * Init color selection after rendering the palette
             * @private
             */
            onRender: function () {
                var $colorEl = this.getColorElement(this.index);

                $colorEl.click(); // select element
                this.selectColor($colorEl.data()); // select color internally
            },

            /**
             * Finds the jquery element of a palette item based on a given index
             * @private
             */
            getColorElement: function (index) {
                return $('#palette .palette-item-wrap:nth-child(' + (index + 1) + ') .palette-item');
            },

            /**
             * Event handler for clicking at a color palette item
             * @private
             */
            pickColor: function (e) {
                this.selectColor($(e.target).data());
            },

            /**
             * Sets the selected color and broadcasts the selection
             * @private
             */
            selectColor: function (data) {
                if (!data) {
                    return;
                }

                var index = data.index;
                if (index >= 0) {
                    this.index = index;
                }

                var color = data.color;
                if (color && color !== this.color) {
                    $('#palette .palette-item.selected').removeClass('selected');
                    this.getColorElement(index).addClass('selected');

                    this.color = color;
                    this.messages.trigger('palette:selectcolor', {
                        color: color
                    });
                }
            },

            /**
             * Double-Click handler for a palette item to modify the palette by changing
             * or adding a single color
             * @function
             * @private
             */
            changePalette: (function () {
                var dlgId = null;

                // helper to remove the dialog entity when closing the window
                var onClose = function () {
                    this.entities.removeEntity(dlgId);
                    dlgId = null;
                };

                // helper to get the color (e.g. "rgba(1, 3, 4, 0.5)" from the input values
                var getColor = function () {
                    return this.getColor($('#r').val(), $('#g').val(), $('#b').val(), $('#a').val());
                };

                // helper to update the preview when changing the color input fields
                var onChange = function () {
                    $('.preview #new').css('background-color', getColor.call(this));
                };

                // helper to add the new color to the existing palette
                var onAdd = function () {
                    var pal, ctxt, imgData, l, color = getColor.call(this);
                    if (color) {
                        pal = this.view.getPalette();
                        ctxt = pal.getContext('2d');
                        imgData = ctxt.getImageData(0, 0, pal.width + 1, 1);
                        l = imgData.data.length;
                        imgData.data[l - 4] = parseInt($('#r').val(), 10);
                        imgData.data[l - 3] = parseInt($('#g').val(), 10);
                        imgData.data[l - 2] = parseInt($('#b').val(), 10);
                        imgData.data[l - 1] = parseInt($('#a').val(), 10) * 255;
                        pal.width++;
                        ctxt.putImageData(imgData, 0, 0);
                        this.selectColor({index: pal.width - 1});
                        this.view.refresh();
                    }
                    onClose.call(this);
                };

                // helper to update the palette after modifying a color
                var onCommit = function () {
                    var color = getColor.call(this);
                    var index = parseInt($('#data-index').val(), 10);
                    var pal = this.view.getPalette();

                    if (color && index >= 0 && index < pal.width) {
                        var ctxt = pal.getContext('2d');
                        ctxt.clearRect(index, 0, 1, 1);
                        ctxt.fillStyle = color;
                        ctxt.fillRect(index, 0, 1, 1);
                        this.view.refresh();
                    }
                    onClose.call(this);
                };

                return function (e) {
                    var data = $(e.target).data();
                    var color = data && data.color;

                    if (!color) {
                        return;
                    }
                    if (dlgId) {
                        onClose.call(this);
                    }

                    dlgId = this.entities.createEntity('window', {
                        view: {
                            potion: 'pb.view.Dialog',
                            title: 'Change Color Palette',
                            cls: 'change-color-dlg',
                            data: alchemy.mix({
                                color: color,
                            }, data),
                            template: [
                                // a color preview area
                                '  <div><div class="preview">',
                                '    <div class="color-field-bg">',
                                '      <div id="old" class="color-field" style="background-color: <$= data.color $>;" ><span>old</span></div>',
                                '    </div>',
                                '    <div class="color-field-bg">',
                                '      <div id="new" class="color-field" style="background-color: <$= data.color $>;" ><span>new</span></div>',
                                '    </div>',
                                '  </div></div>',

                                // the input elements
                                '  <div class="colors">',
                                '    <span>R:</span><input class="color" id="r" value="<$= data.r $>">',
                                '    <span>G:</span><input class="color" id="g" value="<$= data.g $>">',
                                '    <span>B:</span><input class="color" id="b" value="<$= data.b $>">',
                                '    <span>A:</span><input class="color" id="a" value="<$= data.a $>">',
                                '    <input type="hidden" id="data-old-color" value="<$= data.color $>">',
                                '    <input type="hidden" id="data-index" value="<$= data.index $>">',
                                '  </div>',

                                // the buttons
                                '  <div class="buttons">',
                                '    <div class="button change">Change</div>',
                                '    <div class="button new">New</div>',
                                '    <div class="button cancel">Cancel</div>',
                                '  </div>',
                                '</form>',
                            ].join(''),
                        }
                    });

                    var dlgView = this.entities.getComponent('view', dlgId);
                    this.observe(dlgView, 'change input.color', onChange, this);
                    this.observe(dlgView, 'close', onClose, this);
                    this.observe(dlgView, 'click .buttons .change', onCommit, this);
                    this.observe(dlgView, 'click .buttons .new', onAdd, this);
                    this.observe(dlgView, 'click .buttons .cancel', onClose, this);
                };
            }()),

            /**
             * Thransforms the given RGBA values into a CSS color string
             * @private
             */
            getColor: function (r, g, b, a) {
                var lowerBound = (r >= 0 && b >= 0 && g >= 0 && a >= 0);
                var upperBound = (r <= 255 && b <= 255 && g <= 255 && a <= 1);
                var color;

                if (lowerBound && upperBound) {
                    color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                }
                return color;
            }
        }
    });
}());
