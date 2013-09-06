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
                };
            }),

            /** @protected */
            getData: function () {
                return {
                    id: this.id,
                    label: this.label,
                    value: this.value
                };
            },

            getValue: function () {
                return this.value;
            },

            setValue: function (newVal) {
                if (newVal !== this.value) {
                    this.value = newVal;
                    if (this.$el) {
                        this.$el.find('input').val(newVal);
                    }
                }
            },

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
                    this.setValue(this.getValue() + data.delta);
                }
            },

            /**
             * Change handler for the input field; Write input field value back
             * to current spinner value
             * @private
             */
            onInputValueChange: function (e) {
                var value = parseInt($(e.target).val(), 10);
                if (alchemy.isNumber(value)) {
                    this.setValue(value);
                }
            },
        }
    });
}());
