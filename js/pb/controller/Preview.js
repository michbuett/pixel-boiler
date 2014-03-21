(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The controller of the preview area
     *
     * @class
     * @name pb.controller.Preview
     * @extends pb.controller.Prima
     */
    alchemy.formula.add({
        name: 'pb.controller.Preview',
        extend: 'pb.controller.Prima',
        overrides: {
            /** @lends pb.controller.Preview.prototype */

            viewEvents: {
                'click #preview-play': 'onPlayButtonClick',
                'click #preview-background': 'changeBackground'
            },

            /**
             * @function
             * @protected
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.observe(this.messages, 'sheet:changed', function () {
                        this.view.stop();
                    }, this);
                };
            }),


            /**
             * Event handler for clicking the play button
             * @private
             */
            onPlayButtonClick: function () {
                if (this.view.isPlaying()) {
                    this.view.stop();
                } else {
                    this.view.play();
                }
            },

            /**
             * Double-Click handler for a palette item to modify the palette by changing
             * or adding a single color
             * @function
             * @private
             */
            changeBackground: (function () {
                var dlgId = null;

                // helper to remove the dialog entity when closing the window
                var onClose = function () {
                    this.entities.removeEntity(dlgId);
                    dlgId = null;
                };

                var onSelect = function (event) {
                    var $item = event && $(event.target);
                    var bgClass = $item && $item.data().background;
                    if (bgClass) {
                        $('.preview-wrap').attr('data-background', bgClass);
                    }
                    onClose.call(this);
                };

                var template = [
                    '<fieldset class="item-wrap">',
                    '<legend>Backgrounds</legend>',
                    '<div class="item" data-background="dark"></div>',
                    '<div class="item" data-background="light"></div>',
                    '<div class="item" data-background="stone"></div>',
                    '<div class="item" data-background="dirt"></div>',
                    '<div class="item" data-background="grass"></div>',
                    '<div class="item" data-background="water"></div>',
                    '<div class="item" data-background="stone-bricks"></div>',
                    '<div class="item" data-background="dirt-bricks"></div>',
                    '</fieldset>',

                    '<fieldset>',
                    '<legend>Scale</legend>',
                    '<div id="scale-spinner-ct"></div>',
                    '</fieldset>',
                ].join('');

                return function () {
                    dlgId = this.entities.createEntity('window', {
                        view: {
                            potion: 'pb.view.Dialog',
                            title: 'Change Preview Settings',
                            cls: 'change-preview-background-dlg',
                            template: template,
                            data: {
                                scale: this.view.scale
                            },
                            components: [{
                                potion: 'pb.view.Spinner',
                                target: '.change-preview-background-dlg #scale-spinner-ct',
                                id: 'scale',
                                minValue: 1
                            }]
                        }
                    });

                    var dlgView = this.entities.getComponent('view', dlgId);
                    this.observe(dlgView, 'close', onClose, this);
                    this.observe(dlgView, 'click .item', onSelect, this);
                    this.observe(dlgView.data, 'change.scale', function (data) {
                        this.view.setScale(data.newVal);
                    }, this);
                };
            }()),

        }
    });
}());
