/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Brian Maxwell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function ($) {
    'use strict';

    var th = null; // toast host (ul container element)

    var toast = function (m, o) {
        // fix option type
        var duration = (o && typeof o.duration === 'number' && o.duration >= 0) ? o.duration : 3000;
        var sticky = (o && typeof o.sticky === 'boolean') ? o.sticky : false;
        var type = (o && typeof o.type === 'string') ? o.type : '';

        // create host on first call
        if (!th) {
            th = $('<ul></ul>').addClass('toast').appendTo(document.body).hide();
        }

        // create toast
        var ti = $('<li></li>').hide().html(m).appendTo(th);
        var cb = $('<button>&times;</button>').addClass('close').prependTo(ti);
        var to = null;

        // setup close button
        cb.click(function () {
            clearTimeout(to);
            ti.animate({
                height: 0,
                opacity: 0
            }, 'fast', function () {
                ti.remove();

                if (!th.children().length) {
                    th.removeClass('active').hide();
                }
            });
        });

        if (sticky) {
            cb.hide();
        }

        // add type class
        if (type) {
            ti.addClass(type);
        }

        // show host if necessary
        if (!th.hasClass('active')) {
            th.addClass('active').show();
        }

        // setup timeout unless sticky
        if (!sticky) {
            to = setTimeout(function () {
                cb.click();
            }, duration);
        }

        // show toast
        ti.fadeIn('normal');
    };

    $.extend({
        toast: toast
    });
})(jQuery);
