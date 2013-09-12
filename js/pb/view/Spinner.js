(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * A spinner field to enter numeric values
     *
     * @class
     * @name pb.view.Spinner
     * @extends pb.view.Prima
     */
    alchemy.formula.add({
        name: 'pb.view.Spinner',
        extend: 'pb.view.Prima',
        overrides: {
            /** @lends pb.view.Spinner.prototype */

            templateId: 'tpl-spinner',

            /**
             * Overrides super type to bind spinner buttons
             * @function
             * @protected
             */
            init: alchemy.override(function (_super) {
                return function () {
                    _super.call(this);

                    this.on('click button', this.onSpinnerClick, this);
                    this.on('change input#' + this.id, this.onInputValueChange, this);

                    // update input field if value changes
                    this.data.on('change.value', function (data) {
                        if (this.$el) {
                            this.$el.find('input').val(data.newVal);
                        }
                    }, this);
                };
            }),

            /**
             * Description
             * @function
             * @protected
             */
            getData: alchemy.override(function (_super) {
                return function () {
                    var data = _super.call(this);
                    data.label = this.label;
                    return data;
                };
            }),

            //
            //
            // private helper
            //
            //

            /**
             * Click handler for the -/+ buttons
             * @private
             */
            onSpinnerClick: function (e) {
                var data = $(e.target).data();
                if (data) {
                    this.set('value', this.get('value') + data.delta);
                }
            },

            /**
             * Change handler for the input field; Write input field value back
             * to current spinner value
             * @private
             */
            onInputValueChange: function (e) {
                var value = parseInt($(e.target).val(), 10);
                if (alchemy.isNumber(value) && value !== this.get('value')) {
                    this.set('value', value);
                }
            },
        }
    });
}());
