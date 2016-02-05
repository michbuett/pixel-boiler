module.exports = (function () {
    'use strict';

    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = (a >= 0) ? a : 1;
    }

    Color.prototype.toString = function () {
        return 'rgba(' +
            this.r + ',' +
            this.g + ',' +
            this.b + ',' +
            this.a + ')';
    };

    return {
        /** @lends core.lib.Color.prototype */

        fromRGBA: function (r, g, b, a) {
            return new Color(r, g, b, a);
        },

        hexToRgb: (function () {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            var replaceFn = function (m, r, g, b) {
                return r + r + g + g + b + b;
            };

            return function hexToRgb(hex) {
                hex = hex.replace(shorthandRegex, replaceFn).substr(1, 6);
                var bigint = parseInt(hex, 16);
                return new Color(
                    /* jshint bitwise: false */
                    (bigint >> 16) & 255,
                    (bigint >> 8) & 255,
                    bigint & 255
                    /* jshint bitwise: true */
                );
            };
        }()),

        rgbToHex: function rgbToHex(r, g, b) {
            /* jshint bitwise: false */
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            /* jshint bitwise: true */
        },

        textColor: function (bgColor) {
            var rgb = this.hexToRgb(bgColor);
            var sum = rgb.r + rgb.g + rgb.b;
            return sum > 450 ? '#212123' : '#FAFAFC';
        },
    };
}());
