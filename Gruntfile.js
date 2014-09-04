/* global module */
module.exports = function (grunt) {
    'use strict';

    // the --files= command line parameter
    var testFiles = grunt.option('files');
    if (testFiles) {
        var pattern = /\.js$/;
        testFiles =  grunt.file.expand(testFiles.replace(/"/g, '').split(' ')).filter(function (f) {
            return pattern.test(f);
        });
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // ////////////////////////////////////////////////////////////////////
        // configure JSHint (documented at http://www.jshint.com/docs/)

        jsonlint: {
            all: {
                files: [{
                    src: 'package.json'
                }]
            }
        },

        jshint: {
            files: testFiles || ['Gruntfile.js', 'js/default.js', 'js/pb/**/*.js', 'js/alchemy/lib/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        tpllint: {
            options: {
                data: { // the data for the templates
                    items: {},
                    paletteData: [],
                }
            },
            all: {
                files: [{
                    src: 'templates/*.tpl'
                }]
            }
        },

        // ////////////////////////////////////////////////////////////////////
        // configure Sass
        sass: {
            production: { // options of the production version
                options: {
                    style: 'compact',
                    sourcemap: 'none',
                },
                files: {
                    'css/default.css': 'scss/default.scss',
                    'css/web.css': 'scss/web.scss',
                }
            },
            dev: { // options for the dev version
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    lineNumbers: true,
                    sourcemap: 'file',
                },
                files: {
                    'css/default.css': 'scss/default.scss',
                    'css/web.css': 'scss/web.scss',
                }

            }
        },

        // ////////////////////////////////////////////////////////////////////
        // configure image minifier
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    src: '**/*.png',
                    cwd: 'images/',
                    dest: 'images/'
                }]
            }
        },

        // ////////////////////////////////////////////////////////////////////
        // configure image minifier
        watch: {
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['sass:dev']
            },

            imagemin: {
                files: ['images/**/*.png'],
                tasks: ['imagemin']
            },

            tpllint: {
                files: ['templates/*.tpl'],
                tasks: ['tpllint']
            },

            // livereload: {
            //     // Send HTML, CSS and JavaScript files to the liveReload-server
            //     // if they are changed
            //     files: ['**/*.html', 'css/*.css', 'js/**/*.js'],
            //     options: {
            //         livereload: true
            //     }
            // }
        },

        nodewebkit: {
            options: {
                appName: 'PixelBoiler',
                platforms: ['win', 'linux32', 'linux64'],
                buildDir: 'builds/nw',
            },
            src: [
                'package.json',
                'nw-app.html',
                'css/*.css',
                'js/**/*.js',
                'images/**/*',
                'templates/**/*.tpl'
            ]
        },
    });


    // load grunt plugins
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadTasks('tools/grunt');


    grunt.registerTask('test', ['jsonlint', 'jshint']);

    grunt.registerTask('dev', ['sass:dev']);

    grunt.registerTask('build', ['sass:production']);
    grunt.registerTask('buildnw', ['sass:production', 'nodewebkit']);
};
