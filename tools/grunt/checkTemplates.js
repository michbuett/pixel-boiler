/* global module, require */

module.exports = function (grunt) {
    'use strict';

    var name = 'tpllint';
    var description = 'Validates the template files';

    var alchemy = require('../../js/alchemy');
    var checkTemplate = function (fileName, data) {
        grunt.verbose.write('Check ' + fileName + '...');
        var tpl = grunt.file.read(fileName);
        try {
            alchemy.render(tpl, data);
            return true;
        } catch (e) {
            grunt.verbose.writeln(e.stack);
            grunt.fail.warn(e);
            return false;
        }
    };

    grunt.registerMultiTask(name, description, function () {
        var i, j;
        var mockData = this.options().data;
        var numChecked = 0;
        var errors = 0;

        // check the source code files
        for (i = 0; i < this.files.length; i++) {
            var sources = this.files[i].src;

            for (j = 0; j < sources.length; j++) {
                if (!checkTemplate(sources[j], mockData)) {
                    errors++;
                }
            }
            numChecked += sources.length;
        }

        if (errors > 0) {
            grunt.log.ok(numChecked + ' file(s) checked, ' + errors + ' errors');
        } else {
            grunt.log.ok(numChecked + ' file(s) checked without errors');
        }
    });
};
